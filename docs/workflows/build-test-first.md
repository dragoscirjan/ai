---
title: "Build one behavior slice test-first"
---

# Build one behavior slice test-first

This is a focused procedure. For its place in a larger workflow, see [Implement a planned task](/workflows/implement-a-task).

The owner explicitly wants test-first development and the behavior is agreed.

**Finish with:** An observed red test and the smallest green implementation at a user-confirmed seam.

## Read the diagram

![Build one behavior slice test-first: suggested skill handoffs with approval stops where applicable.](/diagrams/build-test-first.svg)

[Open interactive diagram](/diagrams/build-test-first.html){class="vp-raw"} · [Download SVG](/diagrams/build-test-first.svg) · [Editable candidate](/diagram-sources/build-test-first.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. This selection includes the catalogued instruction requirements [`coding`](/skills/coding). Resolve them before use.

## Steps

1. **Create task branch in chosen location.** [`isolated-workspace`](/skills/isolated-workspace) provides the guidance for this step.
2. **Resolve language guidance.** [`coding-with-rules`](/skills/coding-with-rules) provides the guidance for this step.
3. **Run one failing behavior test.** [`tdd`](/skills/tdd) provides the guidance for this step.
4. **Make the slice pass.** [`tdd`](/skills/tdd) provides the guidance for this step.

## Where to stop

Confirm the test seams with the user before writing a test. Stop the red-to-green implementation loop at green; refactoring belongs to a separate authorized review-stage handoff, not this loop. Never claim an unobserved failure.

## Optional branches

- Choose [`document-project`](/skills/document-project) when implementation changes how readers use the project, or existing documentation blocks a real developer task.
- Choose [`code-review`](/skills/code-review) when you want changes since a fixed commit, branch, tag, or merge-base checked against both standards and the originating specification.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
