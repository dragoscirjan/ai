# Debloat

An original engineering workflow for preventing unnecessary mechanisms and simplifying existing ones. It compares maintenance burden against real requirements, not deletion counts. It does not compress prose.

## Usage

- Prevent: "Use debloat to compare this proposed registry with direct construction before implementation."
- Simplify: "Use debloat to simplify this module while preserving its public behavior."
- Review only: "Use debloat to audit these dependencies without changing files. Report keep, simplify, or defer with evidence."

[`SKILL.md`](SKILL.md) contains the workflow. [Decision examples](references/decision-examples.md) cover justified complexity and unsafe shortcuts.

Code design and implementation hand off to [`coding`](../coding/SKILL.md) and applicable language skills. Workspace and validation gates remain project-owned. Missing required instructions stop their phase; nothing is installed automatically. The skill works independently of scaffold and does not require a particular harness or new tooling.

The canonical skill directory is `.agents/skills/debloat/`, with matching `name: debloat` frontmatter for Pi and OpenCode discovery. Claude Code uses the repository's relative skill projection convention.
