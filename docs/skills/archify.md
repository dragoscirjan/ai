---
title: "archify"
---

# archify

Generate validated interactive HTML diagrams or one-page explainers with Archify, including architecture, workflows, Mermaid input, and image/SVG/WebM exports.

**Group:** [Diagrams](/groups/diagrams) · **Availability:** Upstream-only; approved external setup · **Scope:** project

## When to choose it

You need an explorable standalone HTML diagram for relationships, workflows, states, schemas, or other supported structures.

**Expected result:** An editable native candidate and standalone HTML that passes its required validation, artifact, and real-browser gates.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use archify for a source-backed diagram of this workflow. Keep required dependencies separate from suggested handoffs, retain the candidate, and run the required finalize gates.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

- Node.js 18 or newer; Chrome/Chromium or Microsoft Edge for required browser verification. The package is self-contained; missing tools require separately approved setup.

The external package and runtime/browser setup need approval. A rendered HTML file alone is not proof that delivery and browser gates passed; visual inspection is a separate claim.

## Useful combinations

- [`document-project`](/skills/document-project) — Implementation changes how readers use the project, or existing documentation blocks a real developer task.
- [`asd-ste100-technical`](/skills/asd-ste100-technical) — Technical instructions or explanations need plain language without losing conditions, risks, or precise identifiers.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Keep a developer task usable](/workflows/maintain-task-based-docs)
- [Explain relationships with interactive HTML](/workflows/explain-with-archify)

## Install or inspect

Start with the [reviewed installation guide](/guide/install). The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://raw.githubusercontent.com/tt-a1i/archify/a7ed6fd6657da90414831d1d42cf95987188750c/archify/SKILL.md). This link uses the immutable upstream revision `a7ed6fd6657da90414831d1d42cf95987188750c`; there is no vendored copy here.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
