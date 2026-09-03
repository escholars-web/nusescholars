#!/usr/bin/env python3
"""
Import a D&E-Scholars census CSV into src/data/database.json.

    python import_census.py --csv "path/to/census.csv" --photos path/to/unzipped/photos

The census is a full snapshot, not just the new intake: one row per respondent
across every admission year. So this both creates the new batch and refreshes
people who are already on the site.

Rules, matching what the site already does:

  * A row with no write-up is skipped. That is the existing convention from
    convert_data.py, and a profile page with no prose is worse than no page.
  * A row that would leave the person with no photo is skipped too. The card
    grid renders a plain <img> with no fallback, so a profile with no file
    behind it shows a broken image. Someone who already has a photo on file
    from an earlier census keeps it and still publishes.
  * The admission year in the row decides the batch, not the census year.
  * A person already in the database is updated in place, in the batch they are
    already filed under.
  * If a row's admission year disagrees with the batch the person is already in,
    nothing is written and the clash is reported. That is a human decision, not
    something to guess at.

Photos are matched by the filename at the end of the SharePoint URL, which is
the same name the OneDrive export uses.
"""

import argparse
import csv
import io
import json
import re
import subprocess
import sys
import urllib.parse
from datetime import date
from pathlib import Path

# Longest prefix wins, so "Materials Science & Engineering" is not mistaken for
# a double degree and "Chemical Engineering & Business Administration" lands
# under CHE.
PROGRAMME_TO_MAJOR = {
    "Mechanical Engineering": "MPE",
    "Electrical Engineering": "EEE",
    "Biomedical Engineering": "BME",
    "Engineering Science": "ESP",
    "Industrial & Systems Engineering": "ISE",
    "Materials Science & Engineering": "MLE",
    "Computer Engineering": "CEG",
    "Chemical Engineering": "CHE",
    "Civil Engineering": "CVE",
    "Infrastructure & Project Management": "IPM",
    "Architecture": "DS",
    "Industrial Design": "DS",
    "Landscape Architecture": "DS",
}

DESIGN_MAJORS = {"Architecture", "Industrial Design", "Landscape Architecture"}

# The intake batch must also call itself Year 1. Someone picking the newest
# admission year while stating a later year of study has mis-filled the form,
# and they are almost always an existing student who belongs in an older batch.
LATEST_YEAR_LABEL = {"ay26-27": "Year 1"}

COL_EMAIL = "Email"
COL_NAME = "Full Name (as per NRIC)"
COL_YEAR = "Year of Admission"
COL_WRITEUP = "Please provide a short write-up of yourself."
COL_PHOTO = "Upload a picture of yourself."
COL_ACHIEVEMENTS = "Notable Achievements (max 3)"
COL_INTERESTS = "Any interests or hobbies (max 3)"
COL_LINKEDIN = "LinkedIn Profile URL"
COL_INSTAGRAM = "Instagram Profile URL"
COL_GITHUB = "Github Profile URL"
COL_PROGRAMME = "Programme"


def tidy_name(name: str) -> str:
    """Title-case a name that arrived entirely in capitals.

    Some people type their name in caps in the form. Left alone it shows as
    "LIM KIA IAG" beside everyone else's "Lim Kia Iag". Only all-caps names are
    touched, because title-casing a correctly cased name would wreck the
    particles that are meant to stay lowercase, such as "bin" and "d/o".
    """
    n = name.strip()
    if not n.isupper():
        return n
    out = []
    for word in n.split(" "):
        # Keep the comma or other punctuation attached to the word.
        out.append(word.capitalize() if word.strip(",.") else word)
    return " ".join(out)


def slugify(name: str) -> str:
    s = name.lower().strip().replace("’", "'").replace("'", "")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def batch_key(year_of_admission: str) -> str:
    """'AY26/27 (Year 1)' -> 'ay26-27'."""
    m = re.match(r"AY(\d{2})/(\d{2})", year_of_admission.strip())
    if not m:
        raise ValueError(f"unrecognised admission year: {year_of_admission!r}")
    return f"ay{m.group(1)}-{m.group(2)}"


def admit_year(year_of_admission: str) -> str:
    """'AY26/27 (Year 1)' -> 'AY26/27'."""
    return year_of_admission.strip().split(" ")[0]


def major_code(programme: str) -> str:
    p = programme.strip()
    best = ""
    for prefix in PROGRAMME_TO_MAJOR:
        if p.startswith(prefix) and len(prefix) > len(best):
            best = prefix
    if not best:
        raise ValueError(f"no major mapping for programme: {programme!r}")
    return PROGRAMME_TO_MAJOR[best]


def base_programme(programme: str) -> str:
    """The degree name, with any double-degree tail removed."""
    p = programme.strip()
    best = ""
    for prefix in PROGRAMME_TO_MAJOR:
        if p.startswith(prefix) and len(prefix) > len(best):
            best = prefix
    return best or p


def clean(value: str):
    v = (value or "").strip()
    return v if v else None


def url(value: str):
    v = clean(value)
    if v is None:
        return None
    return v if v.startswith("http") else "https://" + v


def load_rows(csv_path: Path):
    # Forms exports these as Windows-1252, so curly quotes arrive as 0x92 and
    # utf-8 decoding dies on the first apostrophe.
    for encoding in ("utf-8-sig", "cp1252", "latin-1"):
        try:
            with io.open(csv_path, encoding=encoding, newline="") as f:
                return list(csv.DictReader(f)), encoding
        except UnicodeDecodeError:
            continue
    raise SystemExit(f"could not decode {csv_path}")


def index_photos(photo_dir: Path) -> dict:
    found = {}
    if photo_dir and photo_dir.exists():
        for p in photo_dir.rglob("*"):
            if p.is_file():
                found[p.name] = p
    return found


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", required=True, type=Path)
    ap.add_argument("--photos", type=Path, default=None,
                    help="directory of the unzipped OneDrive photo export")
    ap.add_argument("--db", type=Path, default=Path("src/data/database.json"))
    ap.add_argument("--images", type=Path, default=Path("public/images"))
    ap.add_argument("--apply", action="store_true",
                    help="write changes; without this it only reports")
    args = ap.parse_args()

    rows, encoding = load_rows(args.csv)
    db = json.loads(args.db.read_text(encoding="utf-8"))
    photos = index_photos(args.photos)

    # Where every existing person currently lives.
    located = {}
    for b, majors in db.items():
        if b == "last_updated" or not isinstance(majors, dict):
            continue
        for m, people in majors.items():
            if not isinstance(people, dict):
                continue
            for k in people:
                located[k] = (b, m)

    today = date.today().isoformat()
    created, updated, skipped_no_writeup, conflicts, photo_jobs = [], [], [], [], []
    skipped_no_photo = []

    for row in rows:
        name = tidy_name(row.get(COL_NAME) or "")
        if not name:
            continue
        if not (row.get(COL_WRITEUP) or "").strip():
            skipped_no_writeup.append(name)
            continue

        slug = slugify(name)
        try:
            batch = batch_key(row[COL_YEAR])
            code = major_code(row[COL_PROGRAMME])
        except ValueError as e:
            conflicts.append(f"{name}: {e}")
            continue

        # The label and the year must agree. A row claiming the newest batch
        # while calling itself Year 3 is a form mistake, not a Year 1.
        label = row[COL_YEAR].strip()
        expected_year = LATEST_YEAR_LABEL.get(batch)
        if expected_year and expected_year not in label:
            conflicts.append(
                f"{name}: says {batch} but labelled {label!r}, not "
                f"{expected_year!r}. Left out."
            )
            continue

        if slug in located and located[slug][0] != batch:
            old_b, old_m = located[slug]
            conflicts.append(
                f"{name} ({slug}): census says {batch}, database has them in "
                f"{old_b}/{old_m}. Left untouched."
            )
            continue

        # Resolve the photo before deciding to publish. Someone with no new
        # upload but an existing file on disk keeps that file.
        pic = clean(row.get(COL_PHOTO, ""))
        dest_batch = located[slug][0] if slug in located else batch
        dest = args.images / dest_batch / f"{slug}.jpg"
        src = None
        if pic:
            src = photos.get(urllib.parse.unquote(pic.split("/")[-1]))
        if src is None and not dest.exists():
            skipped_no_photo.append(f"{name} ({batch})")
            continue
        if src is not None:
            photo_jobs.append((src, dest))

        programme = row[COL_PROGRAMME].strip()
        record = {
            "name": name,
            "admit_year": admit_year(row[COL_YEAR]),
            "academic_career": "D-Scholars" if code == "DS" else "E-Scholars Undergraduate",
            "bachelors": base_programme(programme) if code == "DS" else programme,
            "masters": None,
            "writeup": row[COL_WRITEUP].strip(),
            "picture_url": clean(row.get(COL_PHOTO, "")),
            "notable_achievements": clean(row.get(COL_ACHIEVEMENTS, "")),
            "interests_hobbies": clean(row.get(COL_INTERESTS, "")),
            "linkedin_url": url(row.get(COL_LINKEDIN, "")),
            "instagram_url": url(row.get(COL_INSTAGRAM, "")),
            "github_url": url(row.get(COL_GITHUB, "")),
            "last_updated": today,
        }

        if slug in located:
            b, m = located[slug]
            db[b][m][slug] = record
            updated.append(f"{batch}/{m}/{slug}")
        else:
            db.setdefault(batch, {}).setdefault(code, {})[slug] = record
            created.append(f"{batch}/{code}/{slug}")

    print(f"csv encoding      : {encoding}")
    print(f"rows              : {len(rows)}")
    print(f"skipped, no writeup: {len(skipped_no_writeup)}")
    print(f"skipped, no photo : {len(skipped_no_photo)}")
    print(f"new profiles      : {len(created)}")
    print(f"updated profiles  : {len(updated)}")
    print(f"photos to convert : {len(photo_jobs)}")
    if skipped_no_photo:
        print("\nskipped for having no photo:")
        for n in skipped_no_photo:
            print(f"  - {n}")

    if conflicts:
        print(f"\nCONFLICTS ({len(conflicts)}), nothing written for these:")
        for c in conflicts:
            print(f"  - {c}")

    by_batch = {}
    for entry in created:
        by_batch.setdefault(entry.split("/")[0], []).append(entry)
    print("\nnew profiles by batch:")
    for b in sorted(by_batch):
        print(f"  {b}: {len(by_batch[b])}")

    if not args.apply:
        print("\n(dry run, nothing written. re-run with --apply)")
        return 0

    db["last_updated"] = today
    args.db.write_text(
        json.dumps(db, indent=4, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(f"\nwrote {args.db}")

    converted = 0
    for src, dest in photo_jobs:
        dest.parent.mkdir(parents=True, exist_ok=True)
        r = subprocess.run(
            ["sips", "-Z", "1000", "--setProperty", "format", "jpeg",
             "--setProperty", "formatOptions", "80", str(src), "--out", str(dest)],
            capture_output=True,
        )
        if r.returncode == 0:
            converted += 1
        else:
            print(f"  photo failed: {dest.name}: {r.stderr.decode()[:120]}")
    print(f"wrote {converted} photos")
    return 0


if __name__ == "__main__":
    sys.exit(main())
