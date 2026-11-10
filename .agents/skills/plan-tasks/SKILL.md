---
name: plan-tasks
description: Divide a specification or clear scope into bounded, verifiable tasks. Use when work needs sequencing, dependencies, or execution across multiple sessions or workers.
---

# Plan tasks

Define executable work, not another requirements document.

Before generating tasks, resolve their destination and format from the target project's `AGENTS.md` and `CONTRIBUTING.md`. If absent or ambiguous, ask the user where to write them. Do not assume chat, files, or tracker issues.

1. Read the specification or agreed direct scope. A separate specification document is not required when the scope is already sufficient.
2. For each task, record its objective, boundaries, requirement references, completion evidence, genuine dependencies, and blockers.
3. Prefer independently verifiable end-to-end slices where useful. Allow investigation, documentation, migration, and mechanical refactor tasks; use expand–contract sequencing when compatibility requires it.
4. Distinguish blockers from preferred order. Leave unresolved work blocked rather than inventing decisions, and identify the next executable task.

Stop when the next work can proceed without guessing requirements, or report what prevents that.

Reference existing artifacts instead of copying them. Small changes may need only one task. Follow project gates; do not launch workers, implement tasks, or create tracker issues beyond the agreed destination and authorization.
