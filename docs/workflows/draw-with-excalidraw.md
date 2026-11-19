---
title: "Deliver an editable image diagram"
---

# Deliver an editable image diagram

This is a focused procedure. For its place in a larger workflow, see [Supporting tools and additional workflows](/workflows/supporting-tools).

A reader needs a PNG or SVG, with an editable scene for later changes.

**Finish with:** An image-first delivery with retained scene JSON and the local workflow's checks.

## Read the diagram

![Deliver an editable image diagram: suggested skill handoffs with approval stops where applicable.](/diagrams/draw-with-excalidraw.svg)

[Open interactive diagram](/diagrams/draw-with-excalidraw.html){class="vp-raw"} · [Download SVG](/diagrams/draw-with-excalidraw.svg) · [Editable candidate](/diagram-sources/draw-with-excalidraw.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Trace scoped relationships.** [`excalidraw`](/skills/excalidraw) provides the guidance for this step.
2. **Approve missing renderer.** [`excalidraw`](/skills/excalidraw) owns this approval boundary; continue only when the applicable approval or existing approved setup is established.
3. **Author and render the scene.** [`excalidraw`](/skills/excalidraw) provides the guidance for this step.
4. **Inspect image; keep source.** [`excalidraw`](/skills/excalidraw) provides the guidance for this step.

## Where to stop

Skip setup when the approved renderer is already available. Do not replace local rendering with a remote service or deliver source alone when an image was requested.

## Optional branches

- Choose [`document-project`](/skills/document-project) when implementation changes how readers use the project, or existing documentation blocks a real developer task.
- Choose [`asd-ste100-technical`](/skills/asd-ste100-technical) when technical instructions or explanations need plain language without losing conditions, risks, or precise identifiers.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
