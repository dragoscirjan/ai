---
title: "Divide agreed scope into verifiable tasks"
---

# Divide agreed scope into verifiable tasks

This is a focused procedure. For its place in a larger workflow, see [Plan a project or feature](/workflows/plan-a-project).

The work is understood but too large to execute as one unbounded change.

**Finish with:** Tasks with completion evidence, genuine dependencies, and an explicit execution boundary.

## Read the diagram

![Divide agreed scope into verifiable tasks: suggested skill handoffs with approval stops where applicable.](/diagrams/plan-bounded-tasks.svg)

[Open interactive diagram](/diagrams/plan-bounded-tasks.html){class="vp-raw"} · [Download SVG](/diagrams/plan-bounded-tasks.svg) · [Editable candidate](/diagram-sources/plan-bounded-tasks.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Read agreed scope.** [`plan-tasks`](/skills/plan-tasks) provides the guidance for this step.
2. **Define bounded outcomes.** [`plan-tasks`](/skills/plan-tasks) provides the guidance for this step.
3. **Check dependencies.** [`plan-tasks`](/skills/plan-tasks) provides the guidance for this step.
4. **Hand off the task plan.** [`plan-tasks`](/skills/plan-tasks) provides the guidance for this step.

## Where to stop

Planning stops before execution. Delegation is optional and needs separate authorization; a dependency diagram must not manufacture a fixed order.

## Optional branches

- Choose [`specify`](/skills/specify) when the direction is agreed but observable behavior, acceptance criteria, constraints, or test boundaries remain unclear.
- Choose [`subagent-orchestration`](/skills/subagent-orchestration) when the operator has authorized bounded specialist, independent-review, or parallel work.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
