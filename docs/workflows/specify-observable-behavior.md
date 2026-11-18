---
title: "Agree on behavior before task execution"
---

# Agree on behavior before task execution

An agreed direction still leaves observable behavior or acceptance criteria open.

**Finish with:** A compact specification with testable criteria and explicit exclusions.

## Read the diagram

![Agree on behavior before task execution: suggested skill handoffs with approval stops where applicable.](/diagrams/specify-observable-behavior.svg)

[Open interactive diagram](/diagrams/specify-observable-behavior.html) · [Download SVG](/diagrams/specify-observable-behavior.svg) · [Editable candidate](/diagram-sources/specify-observable-behavior.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. This selection includes the catalogued instruction requirements [`grilling`](/skills/grilling). Resolve them before use.

## Steps

1. **Inspect agreed decisions.** [`specify`](/skills/specify) provides the guidance for this step.
2. **Resolve behavior questions.** [`grilling`](/skills/grilling) provides the guidance for this step.
3. **Define acceptance criteria.** [`specify`](/skills/specify) provides the guidance for this step.
4. **Record scope and test limits.** [`specify`](/skills/specify) provides the guidance for this step.

## Where to stop

Stop at the specification. Do not convert unresolved questions into invented requirements or treat the document as implementation authority.

## Optional branches

- Choose [`plan-tasks`](/skills/plan-tasks) when the scope or specification is clear enough to divide into bounded pieces of work.
- Choose [`tdd`](/skills/tdd) when you explicitly want test-first feature or bug work, or integration-test slices through public behavior.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
