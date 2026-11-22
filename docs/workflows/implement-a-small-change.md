---
title: "Implement a small approved change"
---

# Implement a small approved change

This is a focused procedure. For its place in a larger workflow, see [Implement a planned task](/workflows/implement-a-task).

The requested behavior and authority to change it are already clear.

**Finish with:** A scoped implementation with behavior checks and affected documentation updated.

## Read the diagram

![Implement a small approved change: suggested skill handoffs with approval stops where applicable.](/diagrams/implement-a-small-change.svg)

[Open interactive diagram](/diagrams/implement-a-small-change.html){class="vp-raw"} · [Download SVG](/diagrams/implement-a-small-change.svg) · [Editable candidate](/diagram-sources/implement-a-small-change.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. This selection includes the catalogued instruction requirements [`coding`](/skills/coding). Resolve them before use.

## Steps

1. **Create task branch in chosen location.** [`isolated-workspace`](/skills/isolated-workspace) provides the guidance for this step.
2. **Load applicable rules.** [`coding-with-rules`](/skills/coding-with-rules) provides the guidance for this step.
3. **Implement and test behavior.** [`coding`](/skills/coding) provides the guidance for this step.
4. **Update affected guidance.** [`document-project`](/skills/document-project) provides the guidance for this step.
5. **Account for quality gates.** [`coding`](/skills/coding) provides the guidance for this step.

## Where to stop

Do not run initiative, research, and specification merely to fill a pipeline. Follow target policy for approval and documentation requirements.

## Optional branches

- Choose [`tdd`](/skills/tdd) when you explicitly want test-first feature or bug work, or integration-test slices through public behavior.
- Choose [`code-review`](/skills/code-review) when you want changes since a fixed commit, branch, tag, or merge-base checked against both standards and the originating specification.
- Choose [`debloat`](/skills/debloat) when a design risks unnecessary machinery or existing code and configuration have complexity that no longer earns its cost.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
