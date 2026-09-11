#!/usr/bin/env python3
"""Install the project typography fonts from the user-supplied font bundle.

Usage:
  python scripts/install_typography_fonts.py /path/to/passaporte-serra-negra-fontes.zip
"""
from __future__ import annotations

import argparse
from pathlib import Path, PurePosixPath
import sys
import zipfile

FILES = {
    "ORIGIN-BLACKDISPLAY.OTF": "Origin-BlackDisplay.otf",
    "SCRATCHY.OTF": "Scratchy-Regular.otf",
    "Anodina-ExtraLight.otf": "Anodina-ExtraLight.otf",
    "Anodina-Light.otf": "Anodina-Light.otf",
    "Anodina-Regular.otf": "Anodina-Regular.otf",
    "Anodina-Bold.otf": "Anodina-Bold.otf",
    "Anodina-ExtraBold.otf": "Anodina-ExtraBold.otf",
}


def main() -> int:
    parser = argparse.ArgumentParser(description="Install Origin, Scratchy and Anodina into public/assets/fonts.")
    parser.add_argument("bundle", type=Path, help="ZIP containing the supplied project fonts")
    args = parser.parse_args()

    bundle = args.bundle.expanduser().resolve()
    if not bundle.is_file():
        print(f"Font bundle not found: {bundle}", file=sys.stderr)
        return 2

    repo_root = Path(__file__).resolve().parents[1]
    destination = repo_root / "public" / "assets" / "fonts"
    destination.mkdir(parents=True, exist_ok=True)

    found: dict[str, str] = {}
    with zipfile.ZipFile(bundle) as archive:
        for member in archive.namelist():
            base = PurePosixPath(member).name
            if base in FILES:
                found[base] = member

        missing = [name for name in FILES if name not in found]
        if missing:
            print("Missing required font files:", file=sys.stderr)
            for name in missing:
                print(f"  - {name}", file=sys.stderr)
            return 3

        for source_name, target_name in FILES.items():
            target = destination / target_name
            target.write_bytes(archive.read(found[source_name]))
            print(f"installed {target.relative_to(repo_root)}")

    print("Typography assets installed successfully.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
