---
title: "Initialize only the foundation you need"
---

# Initialize only the foundation you need

This is a focused procedure. For its place in a larger workflow, see [Supporting tools and additional workflows](/workflows/supporting-tools).

You explicitly want a supported project foundation or tooling adoption.

**Finish with:** A checked baseline with setup instructions, without unrelated application machinery.

## Read the diagram

![Initialize only the foundation you need: suggested skill handoffs with approval stops where applicable.](/diagrams/initialize-a-project.svg)

[Open interactive diagram](/diagrams/initialize-a-project.html){class="vp-raw"} · [Download SVG](/diagrams/initialize-a-project.svg) · [Editable candidate](/diagram-sources/initialize-a-project.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Inspect the starting point.** [`init-project`](/skills/init-project) provides the guidance for this step.
2. **Approve the baseline.** [`init-project`](/skills/init-project) owns this approval boundary; continue only when the applicable approval or existing approved setup is established.
3. **Create task branch.** [`isolated-workspace`](/skills/isolated-workspace) provides the guidance for this step.
4. **Install approved foundation.** [`init-project`](/skills/init-project) provides the guidance for this step.
5. **Explain first use.** [`document-project`](/skills/document-project) provides the guidance for this step.

## Where to stop

Stop if the baseline or installations are not approved. Do not infer initializer permission from a general coding or documentation request.

## Optional branches

- Choose [`coding-with-rules`](/skills/coding-with-rules) when code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
