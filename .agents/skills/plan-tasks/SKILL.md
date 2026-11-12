---
name: plan-tasks
description: Divide a specification or clear scope into bounded, verifiable tasks. Use when work needs sequencing, dependencies, or execution across multiple sessions or workers.
---

# Plan tasks

Split agreed work into tasks that someone can implement and verify without repeating the design discussion.

First, check the target project's `AGENTS.md` and `CONTRIBUTING.md` for the tasks' destination and format. If they leave either unclear, ask the user before drafting. Do not choose chat, files, or tracker issues for them.

1. Read the full specification or agreed scope, relevant comments, and affected code and tests. A separate specification document is not required when direct scope is sufficient.
2. Size each task around a deliverable worth reviewing on its own. Prefer a working end-to-end slice when it fits. Keep setup, tests, and documentation with the deliverable that needs them. Small work may need one task.
3. For each task, state what it delivers, its boundaries, the requirements it covers, and how to verify completion. Include file paths or interfaces you inspected when they help. Record the result later tasks need, genuine blockers, and unresolved decisions. Do not invent commands or interfaces.
4. For wide refactors, use expand-contract sequencing when compatibility requires it. If several steps can only be verified together, identify their shared integration check instead of claiming each step passes alone.
5. Check that every in-scope requirement has a task, dependencies have no cycles, and each completion check tests the promised result. Distinguish blockers from a preferred order. Present the breakdown for review of task size and dependencies.

Stop at the plan or blocking questions. Name the next ready task, but do not start it or launch workers. Follow project gates before execution or tracker publication beyond the agreed destination.

See [source notes](references/sources.md) for the upstream review and local choices.
