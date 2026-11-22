---
title: "Start a change on its own task branch"
---

# Start a change on its own task branch

This is a focused procedure. For its place in a larger workflow, see [Supporting tools and additional workflows](/workflows/supporting-tools).

A new task will change repository files, or an existing task needs verified continuation.

**Finish with:** A dedicated task ref and verified working directory, with or without a separate workspace.

## Read the diagram

![Start a change on its own task branch: suggested skill handoffs with approval stops where applicable.](/diagrams/protect-a-change.svg)

[Open interactive diagram](/diagrams/protect-a-change.html){class="vp-raw"} · [Download SVG](/diagrams/protect-a-change.svg) · [Editable candidate](/diagram-sources/protect-a-change.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Inspect task and checkout.** [`isolated-workspace`](/skills/isolated-workspace) provides the guidance for this step.
2. **Choose ref, base, location.** [`isolated-workspace`](/skills/isolated-workspace) provides the guidance for this step.
3. **Check setup permissions.** [`isolated-workspace`](/skills/isolated-workspace) provides the guidance for this step.
4. **Create ref; verify directory.** [`isolated-workspace`](/skills/isolated-workspace) provides the guidance for this step.

## Where to stop

Ask when the location is unclear. Isolation needs the owner's exact plan approval; current-checkout setup follows the project's normal permissions. Stop after task-ref setup or verified same-task continuation. Setup does not approve source changes, cleanup, resets, stashes, or another owner's work.

## Optional branches

- Choose [`coding-with-rules`](/skills/coding-with-rules) when code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.
- Choose [`document-project`](/skills/document-project) when implementation changes how readers use the project, or existing documentation blocks a real developer task.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
