---
title: "Install a reviewed skill selection"
---

# Install a reviewed skill selection

This is a focused procedure. For its place in a larger workflow, see [Supporting tools and additional workflows](/workflows/supporting-tools).

An existing project needs useful skills, not an automatic copy of the entire collection.

**Finish with:** A verified installation of only the approved skills and separately selected instructions.

## Read the diagram

![Install a reviewed skill selection: suggested skill handoffs with approval stops where applicable.](/diagrams/install-selected-skills.svg)

[Open interactive diagram](/diagrams/install-selected-skills.html){class="vp-raw"} · [Download SVG](/diagrams/install-selected-skills.svg) · [Editable candidate](/diagram-sources/install-selected-skills.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Inspect the project.** [`sync-my-skills`](/skills/sync-my-skills) provides the guidance for this step.
2. **Choose YAML categories.** [`sync-my-skills`](/skills/sync-my-skills) owns this approval boundary; continue only when the applicable approval or existing approved setup is established.
3. **Generate install commands.** [`sync-my-skills`](/skills/sync-my-skills) provides the guidance for this step.
4. **Approve commands.** [`sync-my-skills`](/skills/sync-my-skills) owns this approval boundary; continue only when the applicable approval or existing approved setup is established.
5. **Run, verify, offer review.** [`sync-my-skills`](/skills/sync-my-skills) provides the guidance for this step.

## Where to stop

Keep personal setup separate. Use approved catalog commands, preserve skipped/custom content, and review instructions only after successful installation.

## Optional branches

- Choose [`instruction-maintenance`](/skills/instruction-maintenance) when instruction routing, dependencies, metadata, or policy documents appear missing, stale, conflicting, or unsuitable.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
