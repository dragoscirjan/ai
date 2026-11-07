"""Offline tests for version selection and the tracked-source ZIP contract."""

from pathlib import Path
import stat
import subprocess
import sys
import tempfile
import unittest
import zipfile

from release_version import next_tag


SCRIPT = Path(__file__).with_name("release_version.py").resolve()


class VersionTests(unittest.TestCase):
    def test_initial_patch(self):
        self.assertEqual(next_tag([]), "v0.0.1")

    def test_explicit_zero_baseline(self):
        self.assertEqual(next_tag(["v0.0.0"]), "v0.0.1")

    def test_bump_types_reset_lower_components(self):
        for bump, expected in (
            ("patch", "v2.4.10"),
            ("minor", "v2.5.0"),
            ("major", "v3.0.0"),
        ):
            with self.subTest(bump=bump):
                self.assertEqual(next_tag(["v2.4.9"], bump), expected)

    def test_numeric_order_not_lexical_order(self):
        self.assertEqual(next_tag(["v0.0.9", "v0.0.10", "v0.0.2"]), "v0.0.11")
        self.assertEqual(next_tag(["v9.99.99", "v10.0.0"]), "v10.0.1")

    def test_ignores_non_stable_or_non_canonical_tags(self):
        tags = [
            "v1.2.3",
            "v90.0.0-rc.1",
            "v90.0.0+build",
            "90.0.0",
            "package@90.0.0",
            "v01.2.3",
            "v1.02.3",
            "v1.2.03",
            "v1.2",
            "v1.2.3.4",
            "v1.2.3\n",
            "v1.2.3;touch injected",
        ]
        self.assertEqual(next_tag(tags), "v1.2.4")
        self.assertEqual(next_tag(["not-a-version", "v9.0.0-beta"]), "v0.0.1")

    def test_invalid_bump(self):
        with self.assertRaises(ValueError):
            next_tag(["v1.2.3"], "release")


class GitIntegrationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="ai-release-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / "repository"
        self.root.mkdir()
        self.git("init", "-q", "-b", "main")
        self.git("config", "core.hooksPath", "/dev/null")
        self.git(
            "-c",
            "user.name=Release Test",
            "-c",
            "user.email=release-test@example.invalid",
            "commit",
            "-q",
            "--allow-empty",
            "-m",
            "fixture",
        )

    def git(self, *args):
        return subprocess.run(
            ["git", *args],
            cwd=self.root,
            check=True,
            capture_output=True,
            text=True,
        ).stdout

    def cli(self, *args, cwd=None):
        return subprocess.run(
            [sys.executable, "-B", str(SCRIPT), *args],
            cwd=cwd or self.root,
            capture_output=True,
            text=True,
        )

    def test_cli_first_release(self):
        result = self.cli()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.strip(), "v0.0.1")

    def test_cli_uses_real_tags_without_writing(self):
        for tag in ("v1.2.9", "v1.2.10", "v9.0.0-beta"):
            self.git("tag", tag)
        before = self.git("tag", "--list")
        result = self.cli("--bump", "minor")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.strip(), "v1.3.0")
        self.assertEqual(self.git("tag", "--list"), before)
        self.assertEqual(self.git("status", "--porcelain"), "")

    def test_cli_rejects_invalid_bump(self):
        result = self.cli("--bump", "patch;touch injected")
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse((self.root / "injected").exists())

    def test_cli_reports_missing_repository(self):
        result = self.cli(cwd=Path(self.temp.name))
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Cannot read Git tags", result.stderr)
        self.assertEqual(result.stdout, "")

    def test_archive_preserves_skills_and_symlinks_but_not_untracked_files(self):
        skill = self.root / ".agents" / "skills" / "example" / "SKILL.md"
        skill.parent.mkdir(parents=True)
        skill.write_text("example skill\n", encoding="utf-8")
        projection = self.root / ".claude" / "skills" / "example"
        projection.parent.mkdir(parents=True)
        projection.symlink_to("../../.agents/skills/example")
        self.git("add", ".agents", ".claude")
        self.git(
            "-c",
            "user.name=Release Test",
            "-c",
            "user.email=release-test@example.invalid",
            "commit",
            "-qm",
            "add fixture skill",
        )
        (self.root / "untracked.txt").write_text("do not publish\n", encoding="utf-8")
        archive = Path(self.temp.name) / "ai-v0.0.1.zip"
        self.git(
            "archive",
            "--format=zip",
            "--prefix=ai-v0.0.1/",
            f"--output={archive}",
            "HEAD",
        )
        with zipfile.ZipFile(archive) as bundle:
            names = bundle.namelist()
            self.assertIn("ai-v0.0.1/.agents/skills/example/SKILL.md", names)
            link_name = "ai-v0.0.1/.claude/skills/example"
            self.assertTrue(stat.S_ISLNK(bundle.getinfo(link_name).external_attr >> 16))
            self.assertEqual(bundle.read(link_name), b"../../.agents/skills/example")
            self.assertFalse(
                any(".git/" in name or "untracked.txt" in name for name in names)
            )


if __name__ == "__main__":
    unittest.main()
