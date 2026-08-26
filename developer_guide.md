# Developer Guide — Frontend (`nusescholars`)

For the backend (`nusescholars-backend`), see [../developer_guide.md](../developer_guide.md).

This is the Next.js frontend (public website), plus the root-level Python scripts that build the student profile data used at runtime. It maintains its own copy of "the database" (`src/data/database.json`), separate from and not synced with the backend's Supabase-based pipeline.

## Data pipeline scripts

This is an older/parallel pipeline that operates directly on `src/data/*.json`, separate from the backend's Supabase-based pipeline. No `.env` is required — these scripts are purely file-based.

Run each from the `nusescholars` repo root.

1. **`convert_data.py`** — Converts a raw Excel export (`data_add.xlsx`) into `src/data/database_add.json`: drops rows with empty `writeup`, replaces blanks/NaN with `null`, and keys the result by student `name`.

   ```bash
   python convert_data.py
   ```

   Requires `pandas` + `openpyxl`; `data_add.xlsx` must exist in the repo root with a `writeup` column.

2. **`clean_database_interests_hobbies.py`** — Cleans `src/data/database_add.json` in place, stripping leading numbering/bullets/dashes from every line of every string field.

   ```bash
   python clean_database_interests_hobbies.py
   ```

3. **`merge_json.py`** (frontend version, distinct from the backend script of the same name) — Merges `src/data/database_add.json` into `src/data/database.json`: normalizes admit-year into a dict key, derives a 3-letter major-prefix key, strips major description prefixes, and inserts each new student into the matching (or newly created) admit-year/major bucket. Overwrites `src/data/database.json` in place.

   ```bash
   python merge_json.py
   ```

   Requires both JSON files to exist, and each new record to have `admit_year` and `major` fields.

4. **`generate_profiles.py`** — Generates the Next.js App Router scaffolding (`layout.tsx` + `page.tsx`) for each student's public profile page under `src/app/humans-of-descholars/`, walking the batch → major → student hierarchy in `database.json`. Typically run once per new cohort added.
   ```bash
   python generate_profiles.py --json-path src/data/database.json --out-dir src/app/humans-of-descholars
   ```
   Defaults match the above, so `python generate_profiles.py` alone also works.

### Typical pipeline order

```
convert_data.py → clean_database_interests_hobbies.py → merge_json.py → generate_profiles.py
```

### How the generated data actually renders (runtime)

`generate_profiles.py` only scaffolds route folders — it doesn't embed any data in them. The generated `page.tsx` derives `name`/`major`/`batch` from **its own directory path** (via `path.basename`/`dirname`), then renders:

**[components/HumansPage/ProfileBuilder.tsx](components/HumansPage/ProfileBuilder.tsx)**

This imports `src/data/database.json` directly and looks up `database[batch][major][name]` to pull `writeup`, `bachelors`, `masters`, `interests_hobbies`, `notable_achievements`, social URLs, and `last_updated`, then passes them into `Profile_v2.tsx` for rendering. The profile image path is hardcoded as `/images/<batch>/<name>.jpg` — **not** driven by the JSON at all, so the image must be placed at that exact path manually (nothing currently automates copying a cropped photo into `public/images/<batch>/` — see the backend's auto-cropper tool in the root [developer_guide.md](../developer_guide.md) for producing the cropped image itself).

⚠️ Because the route folder name is what `ProfileBuilder.tsx` uses as the lookup key, **the folder name generated in step 4 must exactly match the batch/major/student keys in `database.json`** — there's no validation step, so a mismatch fails silently (page renders with `undefined` data) rather than erroring at build time.

### Write-ups drop the year of study

`ProfileBuilder.tsx` runs every write-up through `stripYearMentions` in
[functions/writeups.ts](functions/writeups.ts) before rendering, so "I am a Y1
Computer Engineering student" reaches the page as "I am a Computer Engineering
student". **This is why a `Y1` you can see in `database.json` does not appear on
the profile.**

The census is collected once and then sits untouched, so a hardcoded year of
study is wrong by the following August. The profile already shows `Batch AY25/26`
directly above the write-up and a batch never goes stale, so the year of study
was only ever a second, more fragile way of saying the same thing. `database.json`
still stores exactly what the person wrote, we just do not render the part that
expires.

The transform fixes the article it leaves behind, so "a Year 3 Electrical
Engineering student" becomes "an Electrical Engineering student" and not "a
Electrical". That article logic is shared with `Profile_v2.tsx`, which uses it
for the generated "I'm an Industrial Design student from Batch AY25/26" line.
It judges by sound rather than spelling, which is why BME takes "a" and MSE
takes "an".

It deliberately leaves a mention alone when it reads as a past event ("I took
SUSEP in year 2 sem 2"), because removing that one would put a hole in the
sentence.

## App structure

**Tech stack** ([package.json](package.json)): Next.js 16 (App Router), React 19, MUI + Emotion _and_ Tailwind CSS (both present — mixed styling approach), `@vercel/analytics` / `@vercel/speed-insights` (implies Vercel hosting), `swiper` for carousels, `next-sitemap`.

**Routes** (`src/app/`): `page.tsx` (landing page), `about-us/`, `events/`, `study-hub/`, `resources/`, and `humans-of-descholars/` (generated batch/major/student routes, see pipeline above).

**Components** (`components/` — note: lives at repo root, not under `src/`): `Navbar.tsx`, `Footer.tsx`, `HeroSection.tsx`, `LandingPage.tsx`, `PageTemplate.tsx`, `FullPageImage.tsx`, `ConsentPopup.tsx`, plus `LandingPage/`, `AboutUsPage/`, `EventsPage/`, `StudyHubPage/`, and `HumansPage/` (`ProfileBuilder.tsx`, `Profile.tsx` — legacy, check if still used — `Profile_v2.tsx` — current, `PersonCards.tsx`, `LinkItems.tsx`, `Header.tsx`, `InformationBox.tsx`).

**Setup**: [requirements.sh](requirements.sh) is the setup script (misleadingly named like a Python requirements file, but is a shell script) — installs npm deps (MUI/Emotion, Vercel packages), runs `npm audit fix`, installs `pandas`/`openpyxl` via pip (needed for `convert_data.py`), and does a clean reinstall of `node_modules`.

## Study Hub

The Study Hub is live at `/study-hub`, built out of `components/StudyHubPage/`
and backed by two committed JSON files rather than a database, for the same
reason as everything else here: the site is a static export with no server.

**Getting in is two steps, in this order.**

1. `SignUpPanel.tsx` links to a Microsoft Form. That is where the committee
   finds out who is using the hub. The URL is `STUDY_HUB_SIGNUP_URL` in
   [src/lib/siteLinks.ts](src/lib/siteLinks.ts).
2. `SignInPanel.tsx` signs the person in with their NUS Microsoft account. Only
   signed in people see the review form.

**Sign in is Microsoft Entra ID**, not Google, because NUS accounts are
Microsoft 365 accounts. [src/lib/nusAuth.tsx](src/lib/nusAuth.tsx) implements
the OAuth 2.0 authorization code flow with PKCE by hand, in about two hundred
lines and with no dependency, because a static site cannot hold a client secret
and MSAL would be a large library for what is ultimately a UI gate. The file's
header comment is the full explanation, including the security caveat: this
gates a form, it does not protect anything, and the moment reviews go to a real
backend that backend must verify the token itself.

To switch sign in on:

1. In the Azure portal, register an application. Under **Authentication**, add
   the platform **Single-page application**.
2. Add a redirect URI for every origin the site runs on, path included, because
   the match is exact. Today that means `https://nusdescholars.com/study-hub`,
   the Vercel preview URL, the GitHub Pages URL, and
   `http://localhost:3000/study-hub`. Add the trailing slash variants too.
3. Set `NEXT_PUBLIC_ENTRA_CLIENT_ID` to the Application (client) ID, in
   `.env.local` for development and in the Vercel project settings for
   production. `NEXT_PUBLIC_ENTRA_TENANT` defaults to `nus.edu.sg` and only
   needs setting if the app registration lives somewhere else.

With no client ID set, the panel says so and everything else on the page still
works, so a missing variable never breaks a deploy.

**The content is still placeholder.** Both
[src/data/module-reviews.json](src/data/module-reviews.json) and
[src/data/senior-mentors.json](src/data/senior-mentors.json) carry a top level
`"sample": true`, which makes the page say out loud that the entries are
examples. Notes with an empty `url` render as "nobody has shared this one yet"
rather than as a dead link, and Senior Teach Junior sign up buttons whose URL
still contains `REPLACE-WITH` render as disabled. Delete the `sample` flag from
a file once its content is real, and those notices disappear on their own.

**Submitted reviews do not go anywhere yet.** `submitReview` in
[src/lib/moduleReviews.ts](src/lib/moduleReviews.ts) saves to the author's own
browser and hands them JSON to send the committee, which is the only thing a
static export can do. Setting `NEXT_PUBLIC_REVIEW_ENDPOINT` switches it to POST
the review instead, and that is the one place to hook up a backend later.

## Events

`/events` is two things stacked: a fixed description of the kinds of events the
committee runs, and a calendar of what is actually scheduled next.

**The kinds are hardcoded** in `EVENT_KINDS` in
[components/EventsPage/index.tsx](components/EventsPage/index.tsx), next to
their icons, the same way the Study Hub's three pillars are. They change once a
year at most.

**The schedule is data.** [src/data/events.json](src/data/events.json) holds one
array, `upcoming`, and it ships empty. Add an event by adding an object:

```json
{
  "id": "orientation-2026",
  "title": "Orientation 2026",
  "date": "2026-08-06",
  "endDate": "2026-08-07",
  "time": "9am to 6pm",
  "location": "Meets at E1 foyer",
  "description": "Two days of games, dinner and far too much sun.",
  "url": "https://forms.cloud.microsoft/r/..."
}
```

Only `id`, `title` and `date` are required. `date` and `endDate` are ISO
`YYYY-MM-DD` and are read in UTC, so a build running in another timezone does
not shift a day. Anything with an unparseable date is dropped rather than
rendered, and an event stays listed through its final day, so a two day
orientation is still "upcoming" on the morning of day two.

**Everything is computed at build time**, in
[src/lib/events.ts](src/lib/events.ts), the same as the write-up cleanup on the
profile pages. "Upcoming" therefore means upcoming as of the last deploy: a
finished event drops off the next time the site is built, not the morning after.
Deleting the entry when you add the next one is the reliable way to keep the
list honest.

**Where it shows up.** The full calendar is on `/events`. The home page renders
the next three events above the gallery links, and renders _nothing at all_ when
the calendar is empty, because a section that says "no events" is worse than no
section. The Past Events carousel and the footer both link through to `/events`
either way. The top nav deliberately still carries only About Us, Humans and
Study Hub.

## Deploying

```bash
npm run deploy -- "what you changed"
```

[scripts/deploy.mjs](scripts/deploy.mjs) is the whole flow: it refuses to run off `main`, runs Prettier, runs `next build` as a gate (a failed build means nothing is committed or pushed), then commits everything and pushes to `origin/main`. Flags: `--skip-build`. The commit message is optional.

**The push is the deploy** — the script uploads nothing itself. Pushing to `main` triggers `nextjs.yml` (GitHub Pages) and, via Vercel's Git integration, a Vercel redeploy of the same commit.

## CI/CD

`.github/workflows/`:

- `main.yml` — CI only (format/lint/typecheck/build), matrix across OSes, triggers on `main` and PRs.
- `nextjs.yml` — deploys to GitHub Pages via static export, triggers on `main`.

`publish.yml` (a duplicate Pages deploy triggered on a `master` branch that does not exist in this repo) was deleted; `setup-node/action.yml` was its composite action and is now unreferenced.

Despite the Vercel analytics packages being present, there's no Vercel-specific workflow — production deployment is handled via Vercel's own Git integration (dashboard-configured auto-deploy on push), so the GitHub Pages workflow may be legacy. **Confirm with the team which path is actually live** before relying on or modifying it. Note also that `main.yml`'s `npm run format --check` does not do what it looks like: npm swallows `--check` as its own flag, so CI runs a plain `prettier --write .` that always passes. The old `deploy` script (`gh-pages -d pages/out`, a path that never existed) has been replaced by the script above.

## Known issues / cleanup candidates

- `src/data/database_old.json` is unreferenced anywhere in the codebase (confirmed via repo-wide grep) — looks like dead data from a previous merge.
- `package.json`'s `lint` script is `next lint`, a command removed in Next 16 — CI works around it by calling `npx eslint` directly.
- `generate_profiles.py` route folder names must exactly match `database.json` keys, with no validation — a mismatch breaks `ProfileBuilder.tsx`'s runtime lookup silently (see "How the generated data actually renders" above).
- `merge_json.py` has no dedup/overwrite guard — a colliding `student_id` silently overwrites the existing entry.
