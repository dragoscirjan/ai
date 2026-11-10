---
name: retrospective
description: Examine a bounded work period and propose evidence-backed process improvements. Use to learn from clarification, research, planning, implementation, checks, review, tools, or handoffs.
---

# Retrospective

Improve how the work happens, not just the resulting diff.

Before generating the retrospective, resolve its destination and format from the target project's `AGENTS.md` and `CONTRIBUTING.md`. If absent or ambiguous, ask the user where to write it. Do not assume chat, a file, or an issue tracker.

1. Establish the work period and available evidence. Use the current session unless the user specifies another scope.
2. Look for repeated confusion, rediscovery, poor task boundaries, missing checks, ineffective tool use, handoff failures, and avoidable process friction.
3. For each useful recommendation, record: evidence → likely cause → smallest useful improvement → verification method. Separate observations from hypotheses and prioritize by impact.
4. Prefer existing mechanisms and deterministic checks over new rules or skills. Say when the evidence supports no change.

Stop at recommendations. Do not modify code, instructions, tools, or workflows automatically.

Follow project privacy and approval gates. Route instruction-graph changes through the project's human-approved instruction-maintenance process; other improvements follow normal contribution rules. A retrospective is useful during work as well as after it.
