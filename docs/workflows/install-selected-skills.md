---
title: "Install a reviewed skill selection"
---

# Install a reviewed skill selection

This is a focused procedure. For its place in a larger workflow, see [Supporting tools and additional workflows](/workflows/supporting-tools).

An existing project needs useful skills, not an automatic copy of the entire collection.

**Finish with:** A verified installation of the approved skill selection, with project instructions unchanged.

## Read the diagram

![Install a reviewed skill selection: suggested skill handoffs with approval stops where applicable.](/diagrams/install-selected-skills.svg)

[Open interactive diagram](/diagrams/install-selected-skills.html){class="vp-raw"} · [Download SVG](/diagrams/install-selected-skills.svg) · [Editable candidate](/diagram-sources/install-selected-skills.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Choose categories and agents.** [`sync-skills` CLI](/guide/install) performs this deterministic installation step.
2. **Preview selected commands.** [`sync-skills` CLI](/guide/install) performs this deterministic installation step.
3. **Approve selected paths.** [`sync-skills` CLI](/guide/install) owns this approval boundary; continue only when the applicable approval or existing approved setup is established.
4. **Install selected skills.** [`sync-skills` CLI](/guide/install) performs this deterministic installation step.
5. **Verify files and notices.** [`sync-skills` CLI](/guide/install) performs this deterministic installation step.

## Where to stop

Use the Node.js CLI for installation. Existing destinations require explicit overwrite approval; unsupported semantic adaptations stop installation. Instruction review is a separate, explicitly requested sync-my-agents operation, not an installation step.

## Optional branches

- Choose [`isolated-workspace`](/skills/isolated-workspace) when a modifying task needs a dedicated branch or bookmark and a choice between the current checkout and a separate workspace.
- Choose [`sync-my-agents`](/skills/sync-my-agents) when you explicitly want to review AGENTS.md and its referenced instruction documents.
- Choose [`instruction-maintenance`](/skills/instruction-maintenance) when instruction routing, dependencies, metadata, or policy documents appear missing, stale, conflicting, or unsuitable.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
