---
title: "Repair instruction drift through exact approval"
---

# Repair instruction drift through exact approval

This is a focused procedure. For its place in a larger workflow, see [Supporting tools and additional workflows](/workflows/supporting-tools).

Routes, requirements, or policy instructions are missing, duplicated, stale, or conflicting.

**Finish with:** An approved targeted repair with preserved security and authority boundaries.

## Read the diagram

![Repair instruction drift through exact approval: suggested skill handoffs with approval stops where applicable.](/diagrams/repair-instruction-routes.svg)

[Open interactive diagram](/diagrams/repair-instruction-routes.html){class="vp-raw"} · [Download SVG](/diagrams/repair-instruction-routes.svg) · [Editable candidate](/diagram-sources/repair-instruction-routes.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Audit without mutation.** [`instruction-maintenance`](/skills/instruction-maintenance) provides the guidance for this step.
2. **Prepare the exact proposal.** [`writing-for-agents`](/skills/writing-for-agents) provides the guidance for this step.
3. **Approve the proposed policy.** [`instruction-maintenance`](/skills/instruction-maintenance) owns this approval boundary; continue only when the applicable approval or existing approved setup is established.
4. **Use approved isolation.** [`isolated-workspace`](/skills/isolated-workspace) provides the guidance for this step.
5. **Apply + check the repair.** [`instruction-maintenance`](/skills/instruction-maintenance) provides the guidance for this step.

## Where to stop

Changed protected rules or scope require renewed approval. An instruction draft cannot grant itself permission to be installed.

## Optional branches

- Choose [`asd-ste100-technical`](/skills/asd-ste100-technical) when technical instructions or explanations need plain language without losing conditions, risks, or precise identifiers.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
