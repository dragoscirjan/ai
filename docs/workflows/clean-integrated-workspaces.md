---
title: "Clean only proven, approved workspaces"
---

# Clean only proven, approved workspaces

This is a focused procedure. For its place in a larger workflow, see [Supporting tools and additional workflows](/workflows/supporting-tools).

Completed work may have left integrated workspaces or stale registrations.

**Finish with:** Exact approved removals, protected uncertain lanes, and a post-cleanup audit.

## Read the diagram

![Clean only proven, approved workspaces: suggested skill handoffs with approval stops where applicable.](/diagrams/clean-integrated-workspaces.svg)

[Open interactive diagram](/diagrams/clean-integrated-workspaces.html){class="vp-raw"} · [Download SVG](/diagrams/clean-integrated-workspaces.svg) · [Editable candidate](/diagram-sources/clean-integrated-workspaces.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. This selection includes the catalogued instruction requirements [`isolated-workspace`](/skills/isolated-workspace). Resolve them before use.

## Steps

1. **Resolve workspace guidance.** [`cleanup-workspaces`](/skills/cleanup-workspaces) provides the guidance for this step.
2. **Audit tips/state/ownership.** [`cleanup-workspaces`](/skills/cleanup-workspaces) provides the guidance for this step.
3. **Approve exact removal plan.** [`cleanup-workspaces`](/skills/cleanup-workspaces) owns this approval boundary; continue only when the applicable approval or existing approved setup is established.
4. **Apply and audit again.** [`cleanup-workspaces`](/skills/cleanup-workspaces) provides the guidance for this step.

## Where to stop

Do not infer integration from a similar diff. Dirty, unknown, or unproven work stays; no force removal, branch deletion, or broad cache cleanup is implied.

## Optional branches

- Choose [`retro`](/skills/retro) when a bounded completed work period has enough evidence to review what helped, failed, or should change.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
