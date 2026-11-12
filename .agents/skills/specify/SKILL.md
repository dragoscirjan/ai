---
name: specify
description: Record agreed behavior as a compact specification for implementation and review. Use when requirements need durable acceptance criteria, constraints, and test boundaries.
---

# Specify

Write down the behavior and decisions that implementation and review must agree on. Do not use the writing step to make new decisions.

First, check the target project's `AGENTS.md` and `CONTRIBUTING.md` for the specification's destination and format. If they leave either unclear, ask the user before drafting. Do not choose chat, a file, or an issue tracker for them.

1. Read the source requirements, including relevant issue comments and confirmed answers. Inspect the affected code, contracts, and existing tests. Use the project's vocabulary and respect recorded architectural decisions. A separate initiative document is not required.
2. Describe the intended behavior, scope, exclusions, and constraints. Give acceptance criteria stable identifiers. Cover success, relevant failures, and boundary cases with observable results.
3. Record agreed module, interface, API, or schema decisions where they matter. Preserve exact agreed values. Prefer stable contracts over guessed file paths or unnecessary code snippets.
4. Identify where tests can observe each required behavior. Prefer existing test interfaces and examples. Confirm any new test boundaries with the user; leave unresolved choices visible.
5. Check that a fresh reader can tell what counts as correct without guessing requirements. List blocking questions, record draft or agreed status with its evidence, and identify the next authorized action.

Stop at the specification or blocking questions. Do not create tasks, implement the work, or publish beyond the agreed destination automatically. Follow project gates. Agreement on the specification does not authorize execution.

See [source notes](references/sources.md) for the upstream review and local choices.
