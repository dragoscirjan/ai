---
title: "Write guidance for an agent reader"
---

# Write guidance for an agent reader

This is a focused procedure. For its place in a larger workflow, see [Supporting tools and additional workflows](/workflows/supporting-tools).

A skill, prompt, or agent-facing document needs clearer triggers and actions.

**Finish with:** A reviewed instruction draft with co-located rules and clear completion boundaries.

## Read the diagram

![Write guidance for an agent reader: suggested skill handoffs with approval stops where applicable.](/diagrams/write-agent-facing-guidance.svg)

[Open interactive diagram](/diagrams/write-agent-facing-guidance.html){class="vp-raw"} · [Download SVG](/diagrams/write-agent-facing-guidance.svg) · [Editable candidate](/diagram-sources/write-agent-facing-guidance.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Identify the agent's task.** [`writing-for-agents`](/skills/writing-for-agents) provides the guidance for this step.
2. **Draft actions + references.** [`writing-for-agents`](/skills/writing-for-agents) provides the guidance for this step.
3. **Check clarity + conditions.** [`asd-ste100-technical`](/skills/asd-ste100-technical) provides the guidance for this step.
4. **Deliver the reviewed draft.** [`writing-for-agents`](/skills/writing-for-agents) provides the guidance for this step.

## Where to stop

This route ends at a draft. Existing project-policy edits must go through instruction-maintenance and exact human approval before mutation.

## Optional branches

- Choose [`instruction-maintenance`](/skills/instruction-maintenance) when instruction routing, dependencies, metadata, or policy documents appear missing, stale, conflicting, or unsuitable.
- Choose [`unslop`](/skills/unslop) when a draft contains generic phrasing, repetitive structure, filler, or claims that do not help the reader act.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
