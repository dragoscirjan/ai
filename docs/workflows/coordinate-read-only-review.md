---
title: "Coordinate independent review without writers"
---

# Coordinate independent review without writers

This is a focused procedure. For its place in a larger workflow, see [Supporting tools and additional workflows](/workflows/supporting-tools).

You want independent assessment but all changes must stay with the parent.

**Finish with:** Fresh-context read-only findings with evidence and an owner-controlled fix decision.

## Read the diagram

![Coordinate independent review without writers: suggested skill handoffs with approval stops where applicable.](/diagrams/coordinate-read-only-review.svg)

[Open interactive diagram](/diagrams/coordinate-read-only-review.html){class="vp-raw"} · [Download SVG](/diagrams/coordinate-read-only-review.svg) · [Editable candidate](/diagram-sources/coordinate-read-only-review.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Assign read-only questions.** [`background-agents`](/skills/background-agents) provides the guidance for this step.
2. **Review standards + spec.** [`code-review`](/skills/code-review) provides the guidance for this step.
3. **Verify + integrate findings.** [`background-agents`](/skills/background-agents) provides the guidance for this step.
4. **Owner decides next step.** [`background-agents`](/skills/background-agents) provides the guidance for this step.

## Where to stop

Do not silently promote reviewers to writers or substitute another launcher after a delegation failure. Fixing findings is separate from the review.

## Optional branches

- Choose [`coding-with-rules`](/skills/coding-with-rules) when code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
