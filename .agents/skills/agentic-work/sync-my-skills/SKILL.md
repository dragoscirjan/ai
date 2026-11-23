---
name: sync-my-skills
description: Install selected skill categories with catalogued commands, then optionally update project instructions.
disable-model-invocation: true
license: MIT
compatibility: Requires Node.js 22.20+, npm/npx, Git, and native checkbox controls.
---

# Sync my skills

1. Read [the catalog](assets/skill-catalog.yaml) and the target project's instructions; inspect existing installations. Show the catalog's categories as native checkboxes. Select every project-scoped member of the chosen categories and its prerequisites. Reuse the approved or current harness. Leave skipped categories, custom content, and legacy manager locks alone.

2. Generate commands from each selected entry's `install.argv`. Honor its source, scope, exclusions, legal files, runtime limits, and adaptation instructions. Add documented harness and non-interactive options where needed; keep `npx -y`. Show the exact commands, destinations, conflicts, and consequential edits. Obtain approval, then run the commands directly in the target's approved working directory. Use safe argument quoting. Do not invoke sync helpers or create an installer script. Stop on unsupported requirements or failed commands rather than silently omitting skills.

3. After verifying skill installation, ask whether to review `AGENTS.md` and its dependencies for necessary updates. If declined or nothing needs changing, leave them untouched. Otherwise inspect existing evidence, ask only unresolved material questions, show the necessary diffs, and obtain separate approval before editing. Preserve existing policy; do not impose a template bundle.

Report actual results and verification limits. Installation does not authorize initializers, trust changes, tool setup, commits, or publication. Respect the target's safeguards throughout.
