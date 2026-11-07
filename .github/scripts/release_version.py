"""Calculate the next stable release tag without modifying the repository.

Uses Python 3.10+ and Git only. With no stable vX.Y.Z tags, start from 0.0.0.
"""

import argparse
from collections.abc import Iterable
import re
import subprocess
import sys


STABLE_TAG = re.compile(r"v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)")


def next_tag(tags: Iterable[str], bump: str = "patch") -> str:
    """Increment the highest stable SemVer tag, ignoring other tag formats."""
    if bump not in ("patch", "minor", "major"):
        raise ValueError("bump must be patch, minor, or major")

    versions = (
        tuple(int(part) for part in match.groups())
        for tag in tags
        if (match := STABLE_TAG.fullmatch(tag))
    )
    major, minor, patch = max(versions, default=(0, 0, 0))
    if bump == "major":
        major, minor, patch = major + 1, 0, 0
    elif bump == "minor":
        minor, patch = minor + 1, 0
    else:
        patch += 1
    return f"v{major}.{minor}.{patch}"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bump", choices=("patch", "minor", "major"), default="patch")
    args = parser.parse_args()
    try:
        result = subprocess.run(
            ["git", "tag", "--list"],
            check=True,
            capture_output=True,
            text=True,
        )
    except (OSError, subprocess.CalledProcessError):
        print(
            "Cannot read Git tags; run inside a Git repository with Git installed.",
            file=sys.stderr,
        )
        return 1
    print(next_tag(result.stdout.splitlines(), args.bump))
    return 0


if __name__ == "__main__":
    sys.exit(main())
