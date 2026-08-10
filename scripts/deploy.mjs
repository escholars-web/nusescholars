#!/usr/bin/env node
/**
 * One-command deploy, through a pull request.
 *
 *   npm run deploy -- "what you changed"
 *   npm run deploy                                   (auto-generated message)
 *   npm run deploy -- --branch my-feature "message"  (create the branch first)
 *   npm run deploy -- --skip-build "message"         (skip the local build gate)
 *   npm run deploy -- --skip-personal "message"      (shared repo only)
 *
 * It publishes to two places, which behave differently:
 *
 *   origin    escholars-web/nusescholars, the shared committee repo. Its main
 *             is protected, so this pushes a branch and opens a pull request.
 *             Nothing goes live there until someone merges it.
 *   personal  doux124/nusdescholars, an unprotected mirror. This pushes
 *             straight to its main, so it redeploys immediately.
 *
 * What it does, in order:
 *   1. Refuses to run on main, which is protected on the shared repo.
 *   2. Formats with Prettier (matches what CI checks).
 *   3. Builds locally, so a broken build fails here instead of in CI.
 *   4. Commits everything and pushes the current branch to origin.
 *   5. Mirrors the same commits to personal/main, best effort. If a squash
 *      merge on the shared repo has left the mirror diverged, it is re-pointed
 *      at this branch with a lease rather than left permanently stuck.
 *   6. Opens a pull request against origin/main, or prints a link to open one.
 *
 * .github/workflows/nextjs.yml builds and publishes to GitHub Pages on main,
 * and Vercel redeploys the same commit through its Git integration. This
 * script uploads nothing itself.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";

const BASE = "main";
const IS_WINDOWS = process.platform === "win32";

// The shared committee repo is `origin` and is protected, so changes there go
// through a pull request. This personal mirror is unprotected, so its main is
// updated directly and deploys immediately.
const PERSONAL_REMOTE = "personal";
const PERSONAL_URL = "https://github.com/doux124/nusdescholars.git";

const argv = process.argv.slice(2);
const skipBuild = argv.includes("--skip-build");
const skipPersonal = argv.includes("--skip-personal");

function step(text) {
  console.log(`\n→ ${text}`);
}

function fail(text, hint) {
  console.error(`\n✖ ${text}`);
  if (hint) console.error(`  ${hint}`);
  process.exit(1);
}

/** Run a command for its trimmed stdout. */
function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

/** Run a command for its exit code only, swallowing all output. */
function quiet(command, args) {
  return spawnSync(command, args, { stdio: "ignore", shell: IS_WINDOWS })
    .status;
}

/** Run a command, streaming its output. Exits the script if it fails. */
function run(command, args, hint) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: IS_WINDOWS,
  });
  if (result.status !== 0) {
    fail(`\`${command} ${args.join(" ")}\` failed. Nothing was pushed.`, hint);
  }
}

// --branch <name> creates and switches to a branch before doing anything else.
const branchFlag = argv.indexOf("--branch");
const requestedBranch = branchFlag === -1 ? null : argv[branchFlag + 1];
if (
  branchFlag !== -1 &&
  (!requestedBranch || requestedBranch.startsWith("-"))
) {
  fail(
    "--branch needs a name.",
    'For example: npm run deploy -- --branch fix-navbar "Fix the navbar"',
  );
}

const message =
  argv
    .filter(
      (arg, i) =>
        !arg.startsWith("--") && !(branchFlag !== -1 && i === branchFlag + 1),
    )
    .join(" ")
    .trim() ||
  `Update ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;

// 1. Work out which branch we are on, creating one if asked.
let branch;
try {
  branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
} catch {
  fail("Not a git repository.", "Run this from the nusescholars project root.");
}

if (requestedBranch && requestedBranch !== branch) {
  step(`Creating branch ${requestedBranch}...`);
  run("git", ["switch", "-c", requestedBranch]);
  branch = requestedBranch;
}

if (branch === BASE) {
  fail(
    `${BASE} is protected and rejects direct pushes, so deploys start from a branch.`,
    `Create one with: npm run deploy -- --branch my-change "what you changed"`,
  );
}

// 2. Format, then build. Both run before anything is committed.
step("Formatting with Prettier...");
run("npx", ["prettier", "--write", "."]);

if (skipBuild) {
  console.log(
    "\n⚠ Skipping the local build (--skip-build). CI will still build it.",
  );
} else {
  // A running `next dev` holds a lock here and keeps writing into .next while
  // the build tries to clear it, which surfaces as a confusing ENOTEMPTY.
  if (existsSync(".next/dev/lock")) {
    console.log(
      "\n⚠ A dev server looks like it is running (.next/dev/lock exists).",
    );
    console.log(
      "  Stop it before deploying, otherwise the build can fail with ENOTEMPTY.",
    );
  }

  // Always build from a clean .next. Deploys are occasional and this site
  // builds in seconds, so determinism is worth more than the incremental cache.
  step("Clearing .next for a clean build...");
  rmSync(".next", { recursive: true, force: true });

  step("Building (this is the gate, a failed build stops the deploy)...");
  run(
    "npx",
    ["next", "build"],
    "Fix the build errors above, then run npm run deploy again.\n" +
      "  If it failed with ENOTEMPTY, stop `next dev` first, it fights the build over .next.",
  );
}

// 3. Commit whatever changed.
step("Staging changes...");
run("git", ["add", "-A"]);

const hasStagedChanges = quiet("git", ["diff", "--cached", "--quiet"]) !== 0;

if (hasStagedChanges) {
  step(`Committing: ${message}`);
  run("git", ["commit", "-m", message]);
} else {
  console.log("\nNo file changes to commit, pushing any existing commits.");
}

if (quiet("git", ["diff", "--quiet", `${BASE}...HEAD`]) === 0) {
  fail(
    `${branch} has no changes against ${BASE}, so there is nothing to deploy.`,
    "Make some edits first, then run npm run deploy again.",
  );
}

// 4. Push the branch. Report what git actually said rather than guessing.
step(`Pushing ${branch} to origin...`);
const push = spawnSync("git", ["push", "-u", "origin", branch], {
  encoding: "utf8",
  shell: IS_WINDOWS,
});
const pushOutput = `${push.stdout ?? ""}${push.stderr ?? ""}`;
process.stdout.write(pushOutput);

if (push.status !== 0) {
  let hint = "Read git's output above for the reason.";
  if (/rule violations|protected branch|GH0\d\d/i.test(pushOutput)) {
    hint = `A repository rule blocked this. Pushing to ${BASE} directly is not allowed, so make sure you are on a branch.`;
  } else if (/non-fast-forward|fetch first|behind/i.test(pushOutput)) {
    hint = `origin/${branch} has commits you do not have. Run: git pull --rebase origin ${branch}`;
  } else if (
    /Authentication|could not read Username|denied/i.test(pushOutput)
  ) {
    hint = "Authentication failed. Run: gh auth login";
  }
  fail("Push rejected.", hint);
}

// 5. Mirror to the personal repo, which has no branch protection, so its main
// updates straight away. This is best effort: the shared repo is the one that
// matters, and its branch is already safely pushed by this point.
let personalResult = "skipped";
if (skipPersonal) {
  console.log("\n⚠ Skipping the personal mirror (--skip-personal).");
} else {
  step(`Mirroring to ${PERSONAL_REMOTE}/${BASE} (${PERSONAL_URL})...`);

  // Self-heal on a fresh clone that has never had the remote configured.
  if (quiet("git", ["remote", "get-url", PERSONAL_REMOTE]) !== 0) {
    run("git", ["remote", "add", PERSONAL_REMOTE, PERSONAL_URL]);
  }

  /** Push HEAD onto the mirror's main, optionally with a lease. */
  function pushMirror(extraArgs = []) {
    const result = spawnSync(
      "git",
      ["push", ...extraArgs, PERSONAL_REMOTE, `HEAD:${BASE}`],
      { encoding: "utf8", shell: IS_WINDOWS },
    );
    const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
    process.stdout.write(output);
    return { ok: result.status === 0, output };
  }

  let mirror = pushMirror();

  // Squash-merging the pull request rewrites origin/main into a brand new
  // commit, so the mirror, which holds the original branch commits, diverges
  // for good and every later mirror push is rejected as non-fast-forward. The
  // mirror is only ever a copy of what we deploy and holds nothing of its own,
  // so re-point it. The lease is taken against the sha we just fetched, so this
  // still refuses to clobber a commit that arrived from somewhere unexpected.
  if (
    !mirror.ok &&
    /non-fast-forward|fetch first|behind|rejected/i.test(mirror.output)
  ) {
    console.log(
      `\n  ${PERSONAL_REMOTE}/${BASE} has diverged, which is what a squash merge on the`,
    );
    console.log("  shared repo does. Re-pointing it at this branch...");

    if (quiet("git", ["fetch", PERSONAL_REMOTE, BASE]) !== 0) {
      console.error(`  Could not fetch ${PERSONAL_REMOTE}/${BASE}.`);
    } else {
      const remoteSha = git(["rev-parse", "FETCH_HEAD"]);
      mirror = pushMirror([`--force-with-lease=${BASE}:${remoteSha}`]);
    }
  }

  if (mirror.ok) {
    personalResult = "pushed";
  } else {
    personalResult = "failed";
    console.error(`\n⚠ Could not update ${PERSONAL_REMOTE}/${BASE}.`);
    if (
      /stale info|non-fast-forward|fetch first|behind|rejected/i.test(
        mirror.output,
      )
    ) {
      console.error(
        `  Its ${BASE} moved while this ran. Re-run npm run deploy, or inspect it with:\n` +
          `  git fetch ${PERSONAL_REMOTE} && git log ${PERSONAL_REMOTE}/${BASE}`,
      );
    } else if (
      /Authentication|could not read Username|denied|not found/i.test(
        mirror.output,
      )
    ) {
      console.error(
        `  Check you can push to ${PERSONAL_URL} with your current credentials.`,
      );
    }
    console.error("  The shared repo push above still succeeded.");
  }
}

// 6. Open a pull request, or hand over a link to open one by hand.
const remote = git(["remote", "get-url", "origin"]);
const slug = remote.replace(/^.*github\.com[/:]/, "").replace(/\.git$/, "");
const compareUrl = `https://github.com/${slug}/compare/${BASE}...${branch}?expand=1`;
const personalWeb = PERSONAL_URL.replace(/\.git$/, "");

const personalNote =
  personalResult === "pushed"
    ? `Personal mirror: ${personalWeb} (${BASE} updated, redeploying now)`
    : personalResult === "failed"
      ? `Personal mirror: NOT updated, see the warning above.`
      : `Personal mirror: skipped.`;

// With two remotes configured, gh can be ambiguous about which repo it means
// and may stop to ask. Pin it to the shared repo so this never blocks.
const ghEnv = { ...process.env, GH_REPO: slug };

const hasGh = quiet("gh", ["--version"]) === 0;
const ghReady = hasGh && quiet("gh", ["auth", "status"]) === 0;

if (!ghReady) {
  console.log(`
✓ Pushed ${branch} to origin.

  ${personalNote}

  ${hasGh ? "gh is installed but not logged in (run: gh auth login)." : "gh is not installed (brew install gh)."}
  Open the pull request here:

  ${compareUrl}
`);
  process.exit(0);
}

const existing = spawnSync(
  "gh",
  ["pr", "view", "--json", "url", "-q", ".url"],
  {
    encoding: "utf8",
    shell: IS_WINDOWS,
    env: ghEnv,
  },
);

let prUrl = existing.status === 0 ? existing.stdout.trim() : "";

if (prUrl) {
  step("Pull request already open, updated it with the new commits.");
} else {
  step("Opening a pull request...");
  const create = spawnSync(
    "gh",
    [
      "pr",
      "create",
      "--base",
      BASE,
      "--head",
      branch,
      "--title",
      message,
      "--body",
      "",
    ],
    { encoding: "utf8", shell: IS_WINDOWS, env: ghEnv },
  );
  process.stdout.write(`${create.stdout ?? ""}${create.stderr ?? ""}`);
  if (create.status !== 0) {
    console.log(
      `\n  ${personalNote}\n` +
        `\n  Could not create the pull request automatically. Open it here:\n  ${compareUrl}\n`,
    );
    process.exit(0);
  }
  prUrl = (create.stdout ?? "").trim().split("\n").pop() ?? compareUrl;
}

console.log(`
✓ Deployed.

  ${personalNote}

  Shared repo: ${prUrl}
  That one is NOT live until the pull request is merged into ${BASE}.
  Merge it in the browser, or run: gh pr merge --squash --delete-branch
`);
