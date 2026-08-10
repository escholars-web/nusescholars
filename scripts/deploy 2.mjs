#!/usr/bin/env node
/**
 * One-command deploy.
 *
 *   npm run deploy -- "your commit message"
 *   npm run deploy                            (auto-generated commit message)
 *   npm run deploy -- --skip-build "message"  (skip the local build gate)
 *
 * What it does, in order:
 *   1. Refuses to run from any branch other than main.
 *   2. Formats with Prettier (matches what CI checks).
 *   3. Builds locally, so a broken build fails here instead of in CI.
 *   4. Commits everything and pushes to origin/main.
 *
 * Pushing to main is what actually deploys: .github/workflows/nextjs.yml
 * builds and publishes to GitHub Pages, and Vercel auto-deploys the same
 * commit through its Git integration. This script does not upload anything
 * itself.
 */
import { execFileSync, spawnSync } from "node:child_process";

const BRANCH = "main";
const IS_WINDOWS = process.platform === "win32";

const argv = process.argv.slice(2);
const skipBuild = argv.includes("--skip-build");
const message =
  argv
    .filter((a) => !a.startsWith("--"))
    .join(" ")
    .trim() ||
  `Deploy ${new Date().toISOString().slice(0, 16).replace("T", " ")}`;

function step(text) {
  console.log(`\n→ ${text}`);
}

function fail(text, hint) {
  console.error(`\n✖ ${text}`);
  if (hint) console.error(`  ${hint}`);
  process.exit(1);
}

/** Run a command for its output. */
function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

/** Run a command, streaming its output; exit if it fails. */
function run(command, args, hint) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: IS_WINDOWS,
  });
  if (result.status !== 0) {
    fail(`\`${command} ${args.join(" ")}\` failed — nothing was pushed.`, hint);
  }
}

// 1. Only ever deploy from main.
let branch;
try {
  branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
} catch {
  fail("Not a git repository.", "Run this from the nusescholars project root.");
}
if (branch !== BRANCH) {
  fail(
    `You are on "${branch}", but deploys go out from "${BRANCH}".`,
    `Switch with: git switch ${BRANCH}   (or open a PR against ${BRANCH} instead)`,
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
  step("Building (this is the gate — a failed build stops the deploy)...");
  run(
    "npx",
    ["next", "build"],
    "Fix the build errors above, then run npm run deploy again.",
  );
}

// 3. Commit and push. The push is the deploy trigger.
step("Staging changes...");
run("git", ["add", "-A"]);

// Index vs HEAD — exit code 1 means there is something staged to commit.
const hasStagedChanges =
  spawnSync("git", ["diff", "--cached", "--quiet"], { stdio: "ignore" })
    .status !== 0;

if (hasStagedChanges) {
  step(`Committing: ${message}`);
  run("git", ["commit", "-m", message]);
} else {
  console.log("\nNo file changes to commit — pushing any existing commits.");
}

step(`Pushing to origin/${BRANCH}...`);
const push = spawnSync("git", ["push", "origin", BRANCH], { stdio: "inherit" });
if (push.status !== 0) {
  fail(
    "Push rejected — origin/main has commits you do not have locally.",
    `Run: git pull --rebase origin ${BRANCH}   then: npm run deploy`,
  );
}

console.log(`
✓ Pushed to ${BRANCH}. Deployment is now running.

  Live site:   https://nusescholars.vercel.app/
  Build logs:  https://github.com/escholars-web/nusescholars/actions
`);
