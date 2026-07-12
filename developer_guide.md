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

## App structure

**Tech stack** ([package.json](package.json)): Next.js 16 (App Router), React 19, MUI + Emotion *and* Tailwind CSS (both present — mixed styling approach), `@vercel/analytics` / `@vercel/speed-insights` (implies Vercel hosting), `swiper` for carousels, `next-sitemap`.

**Routes** (`src/app/`): `page.tsx` (landing page), `about-us/`, `resources/`, and `humans-of-descholars/` (generated batch/major/student routes, see pipeline above).

**Components** (`components/` — note: lives at repo root, not under `src/`): `Navbar.tsx`, `Footer.tsx`, `HeroSection.tsx`, `LandingPage.tsx`, `PageTemplate.tsx`, `FullPageImage.tsx`, `ConsentPopup.tsx`, plus `LandingPage/`, `AboutUsPage/`, and `HumansPage/` (`ProfileBuilder.tsx`, `Profile.tsx` — legacy, check if still used — `Profile_v2.tsx` — current, `PersonCards.tsx`, `LinkItems.tsx`, `Header.tsx`, `InformationBox.tsx`).

**Setup**: [requirements.sh](requirements.sh) is the setup script (misleadingly named like a Python requirements file, but is a shell script) — installs npm deps (MUI/Emotion, Vercel packages), runs `npm audit fix`, installs `pandas`/`openpyxl` via pip (needed for `convert_data.py`), and does a clean reinstall of `node_modules`.

## CI/CD — needs cleanup

`.github/workflows/` has three overlapping workflows:
- `main.yml` — CI only (lint/format/typecheck/build), matrix across OSes, triggers on `main`.
- `nextjs.yml` — deploys to GitHub Pages via static export, triggers on `main`.
- `publish.yml` — also deploys to GitHub Pages, but triggers on `master` (a different branch than the other two).

Despite the Vercel analytics packages being present, there's no Vercel-specific workflow — production deployment is likely handled via Vercel's own Git integration (dashboard-configured auto-deploy on push), making the GitHub Pages workflows possibly legacy/unused. **Confirm with the team which path is actually live** before relying on or modifying any of these. Also note `package.json`'s `deploy` script points at `pages/out`, which doesn't match the `./out` path the GitHub Pages workflows use — likely stale.

## Known issues / cleanup candidates

- `src/data/database_old.json` is unreferenced anywhere in the codebase (confirmed via repo-wide grep) — looks like dead data from a previous merge.
- Two redundant GitHub Pages deploy workflows targeting different branches (see CI/CD above).
- `generate_profiles.py` route folder names must exactly match `database.json` keys, with no validation — a mismatch breaks `ProfileBuilder.tsx`'s runtime lookup silently (see "How the generated data actually renders" above).
- `merge_json.py` has no dedup/overwrite guard — a colliding `student_id` silently overwrites the existing entry.
