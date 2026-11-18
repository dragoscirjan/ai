---
title: "Move a change out of the primary checkout"
---

# Move a change out of the primary checkout

The requested work will mutate a repository.

**Finish with:** A named, owned change workspace at a reviewed base revision.

## Read the diagram

![Move a change out of the primary checkout: suggested skill handoffs with approval stops where applicable.](/diagrams/protect-a-change.svg)

[Open interactive diagram](/diagrams/protect-a-change.html) · [Download SVG](/diagrams/protect-a-change.svg) · [Editable candidate](/diagram-sources/protect-a-change.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Inspect existing workspaces.** [`isolated-workspace`](/skills/isolated-workspace) provides the guidance for this step.
2. **Plan VCS, base, and path.** [`isolated-workspace`](/skills/isolated-workspace) provides the guidance for this step.
3. **Approve the exact plan.** [`isolated-workspace`](/skills/isolated-workspace) owns this approval boundary; continue only when the applicable approval or existing approved setup is established.
4. **Create or verify reuse.** [`isolated-workspace`](/skills/isolated-workspace) provides the guidance for this step.

## Where to stop

Stop when isolation is established. This recipe does not approve source changes, cleanup, resets, stashes, or another owner's lane.

## Optional branches

- Choose [`coding-with-rules`](/skills/coding-with-rules) when code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.
- Choose [`document-project`](/skills/document-project) when implementation changes how readers use the project, or existing documentation blocks a real developer task.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
