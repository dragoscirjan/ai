---
title: "Remove complexity without removing requirements"
---

# Remove complexity without removing requirements

This is a focused procedure. For its place in a larger workflow, see [Debloat a project](/workflows/debloat-a-project).

Existing machinery or a proposed design is harder than the required behavior needs.

**Finish with:** A justified simplification that retains contracts, security, and operational needs.

## Read the diagram

![Remove complexity without removing requirements: suggested skill handoffs with approval stops where applicable.](/diagrams/simplify-a-design.svg)

[Open interactive diagram](/diagrams/simplify-a-design.html){class="vp-raw"} · [Download SVG](/diagrams/simplify-a-design.svg) · [Editable candidate](/diagram-sources/simplify-a-design.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. This selection includes the catalogued instruction requirements [`coding`](/skills/coding). Resolve them before use.

## Steps

1. **Find unnecessary parts.** [`debloat`](/skills/debloat) provides the guidance for this step.
2. **Approve the change scope.** [`debloat`](/skills/debloat) owns this approval boundary; continue only when the applicable approval or existing approved setup is established.
3. **Create task branch.** [`isolated-workspace`](/skills/isolated-workspace) provides the guidance for this step.
4. **Simplify and test behavior.** [`coding-with-rules`](/skills/coding-with-rules) provides the guidance for this step.

## Where to stop

A design-only debloat request can stop at the proposal. The implementation branch shown here is conditional on approval, not an automatic follow-up.

## Optional branches

- Choose [`code-review`](/skills/code-review) when you want changes since a fixed commit, branch, tag, or merge-base checked against both standards and the originating specification.
- Choose [`document-project`](/skills/document-project) when implementation changes how readers use the project, or existing documentation blocks a real developer task.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
