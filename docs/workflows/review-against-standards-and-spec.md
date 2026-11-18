---
title: "Review a fixed diff from two perspectives"
---

# Review a fixed diff from two perspectives

A branch or change needs standards and specification review against a clear baseline.

**Finish with:** An integrated report of two bounded read-only reviews.

## Read the diagram

![Review a fixed diff from two perspectives: suggested skill handoffs with approval stops where applicable.](/diagrams/review-against-standards-and-spec.svg)

[Open interactive diagram](/diagrams/review-against-standards-and-spec.html) · [Download SVG](/diagrams/review-against-standards-and-spec.svg) · [Editable candidate](/diagram-sources/review-against-standards-and-spec.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Freeze diff and spec.** [`code-review`](/skills/code-review) provides the guidance for this step.
2. **Run two read-only reviews.** [`code-review`](/skills/code-review) provides the guidance for this step.
3. **Integrate backed findings.** [`code-review`](/skills/code-review) provides the guidance for this step.
4. **Report without fixing.** [`code-review`](/skills/code-review) provides the guidance for this step.

## Where to stop

Confirm authorized subagent support before starting. Do not create writer lanes, edit findings away, merge, or release as part of review.

## Optional branches

- Choose [`subagent-orchestration`](/skills/subagent-orchestration) when the operator has authorized bounded specialist, independent-review, or parallel work.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
