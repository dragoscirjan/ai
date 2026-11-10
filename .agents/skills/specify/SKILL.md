---
name: specify
description: Record agreed behavior as a compact specification for implementation and review. Use when requirements need durable acceptance criteria, constraints, and test boundaries.
---

# Specify

Define correctness. Record decisions already made; do not make new ones while writing.

Before generating the specification, resolve its destination and format from the target project's `AGENTS.md` and `CONTRIBUTING.md`. If absent or ambiguous, ask the user where to write it. Do not assume chat, a file, or an issue tracker.

1. Start from an initiative, existing requirements, or clear direct scope. A separate initiative document is not required.
2. Record intended behavior, scope and exclusions, identifiable acceptance criteria, relevant contracts, constraints, agreed test boundaries, and open questions.
3. Make criteria observable. Reference supporting decisions and evidence; do not duplicate the initiative or prescribe coding steps unnecessarily.
4. Surface material gaps for discussion or research. Mark draft or agreed status with its evidence, and identify the next authorized action.

Stop at the specification or blocking questions. Do not split work into tickets, implement it, or publish beyond the agreed destination automatically.

Follow project safety and approval gates. Agreement on the specification is not authority to execute it. Implementation and review should use this same contract.
