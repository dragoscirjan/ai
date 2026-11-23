---
title: "Create a skeleton and stop"
---

# Create a skeleton and stop

This is a focused procedure. For its place in a larger workflow, see [Implement a planned task](/workflows/implement-a-task).

A feature's source structure needs review before behavioral implementation.

**Finish with:** A checked skeleton with explicit fail-fast placeholders.

## Read the diagram

![Create a skeleton and stop: suggested skill handoffs with approval stops where applicable.](/diagrams/scaffold-without-implementation.svg)

[Open interactive diagram](/diagrams/scaffold-without-implementation.html){class="vp-raw"} · [Download SVG](/diagrams/scaffold-without-implementation.svg) · [Editable candidate](/diagram-sources/scaffold-without-implementation.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. This selection includes the catalogued instruction requirements [`coding`](/skills/coding). Resolve them before use.

## Steps

1. **Create task branch.** [`isolated-workspace`](/skills/isolated-workspace) provides the guidance for this step.
2. **Select language references.** [`coding-with-rules`](/skills/coding-with-rules) provides the guidance for this step.
3. **Write source skeletons.** [`scaffold`](/skills/scaffold) provides the guidance for this step.
4. **Check structure and stop.** [`scaffold`](/skills/scaffold) provides the guidance for this step.

## Where to stop

Do not implement the placeholders. Any later coding or TDD phase needs its own agreed scope and authority.

## Optional branches

- Choose [`plan-tasks`](/skills/plan-tasks) when the scope or specification is clear enough to divide into bounded pieces of work.
- Choose [`tdd`](/skills/tdd) when you explicitly want test-first feature or bug work, or integration-test slices through public behavior.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
