---
name: retro
description: Examine a bounded work period and propose evidence-backed process improvements. Use to learn from clarification, research, planning, implementation, checks, review, tools, or handoffs.
---

# Retro

Find changes to the working process or agent environment that would prevent problems seen in the work.

First, check the target project's `AGENTS.md` and `CONTRIBUTING.md` for the retrospective's destination and format. If they leave either unclear, ask the user before drafting. Do not choose chat, a file, or an issue tracker for them.

## Read the evidence

Use the current session unless the user names another period. Read its transcript or available session record, relevant diffs, review comments, and check results. Cite the evidence. If a record is unavailable, say what you could not verify. Stay within the requested project and period; do not search unrelated private conversations.

## Look for specific problems

- Inspect the project's lint, type-check, and test commands, plus CI and hooks. Distinguish a missing check from one that exists but never runs or silently fails. A project with no automated enforcement is a finding even if this session caught no violation.
- Check whether the agent struggled to find code, decisions, logs, or other needed information. Look for a missing or stale reference before proposing another document.
- Identify instructions that repeat, conflict, or have no effect. Keep implementation guidance in force; do not move standards exclusively to reviewers.
- Look for repeated searches, costly tool output, poor task boundaries, unnecessary clarification, and handoffs that lost decisions or verification state.
- Separate lasting lessons from one-off friction. Use explicit user corrections and repeated failures as evidence, not the agent's preference for a different workflow.

## Propose the smallest fix

For each candidate, cite the observation, explain the likely cause, name the smallest change and its destination, and say how to verify it. Separate facts from hypotheses and order candidates by impact.

Recommend a deterministic check for a mechanical rule. Use an existing standard or skill for a judgment call. Do not add prose where a check would enforce the requirement, or copy guidance that already has a suitable home.

Stop at recommendations and let the user choose. Do not edit instructions, install tools, or file backlog items automatically. Route instruction-graph changes through the project's human-approved maintenance process; other improvements follow normal contribution rules. Report when the evidence supports no change.

See [source notes](references/sources.md) for the upstream review and local choices.
