#!/usr/bin/env python3
"""
Generate Next.js profile routes from database.json.

Usage:
python generate_profiles.py \
    --json-path src/data/database.json \
    --out-dir src/app/humans-of-descholars
"""

import argparse
import json
from pathlib import Path
from typing import Any, Dict

LAYOUT_TSX = """export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>

      {children}
    </section>
  );
}
"""

PAGE_TSX = """import PageTemplate from "../../../../../../components/PageTemplate";
import ProfileBuilder from "../../../../../../components/HumansPage/ProfileBuilder";
import * as path from "path";

export default function ProfilePage() {
  const studentName: string = path.basename(__dirname);

  const majorNamePath = path.dirname(__dirname);
  const majorName = path.basename(majorNamePath);

  const batchNamePath = path.dirname(majorNamePath);
  const batchName = path.basename(batchNamePath);

  return (
    <PageTemplate>
      <ProfileBuilder name={studentName} batch={batchName} major={majorName} />
    </PageTemplate>
  );
}
"""


def is_profile_node(node: Any) -> bool:
    """Heuristically determine whether a JSON node represents a student profile."""
    return isinstance(node, dict) and "name" in node and "writeup" in node


def process_major(batch_dir: Path, major_name: str, major_payload: Dict[str, Any]) -> None:
    major_dir = batch_dir / major_name
    major_dir.mkdir(parents=True, exist_ok=True)

    for slug, payload in major_payload.items():
        if slug == "last_updated":
            continue

        if is_profile_node(payload):
            student_dir = major_dir / slug
            student_dir.mkdir(parents=True, exist_ok=True)

            (student_dir / "layout.tsx").write_text(LAYOUT_TSX, encoding="utf-8")
            (student_dir / "page.tsx").write_text(PAGE_TSX, encoding="utf-8")
        elif isinstance(payload, dict):
            # Nested grouping (e.g., sub-major). Recurse one level deeper.
            process_major(major_dir, slug, payload)


def main(json_path: Path, out_dir: Path) -> None:
    data = json.loads(json_path.read_text(encoding="utf-8"))

    for batch_name, batch_payload in data.items():
        if batch_name == "last_updated" or not isinstance(batch_payload, dict):
            continue

        batch_dir = out_dir / batch_name
        batch_dir.mkdir(parents=True, exist_ok=True)

        for major_name, major_payload in batch_payload.items():
            if major_name == "last_updated" or not isinstance(major_payload, dict):
                continue
            process_major(batch_dir, major_name, major_payload)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Humans-of-Descholars routes.")
    parser.add_argument("--json-path", type=Path, default=Path("data/database.json"),
                        help="Path to database.json")
    parser.add_argument("--out-dir", type=Path, default=Path("src/app/humans-of-descholars"),
                        help="Destination base directory for the routes")
    args = parser.parse_args()

    if not args.json_path.exists():
        raise FileNotFoundError(f"JSON file not found: {args.json_path}")

    main(args.json_path, args.out_dir)
    print("Profile routes generated successfully.")