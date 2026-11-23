---
title: "archify"
---

# archify

Generate validated interactive HTML diagrams or one-page explainers with Archify, including architecture, workflows, Mermaid input, and image/SVG/WebM exports.

**Group:** [Documentation](/groups/documentation) · **Availability:** Upstream-only; approved external setup · **Scope:** project

## When to choose it

You need an explorable standalone HTML diagram for relationships, workflows, states, schemas, or other supported structures.

**Expected result:** An editable native candidate and standalone HTML that passes its required validation, artifact, and real-browser gates.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/tt-a1i/archify/tree/a7ed6fd6657da90414831d1d42cf95987188750c/archify --skill archify
```

This command selects only `archify`. It does not install the rest of the collection or the optional companions listed on this page.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

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

- [Document a project](/workflows/document-a-project)

For focused procedures and utilities, see [supporting tools](/workflows/supporting-tools).

## Source and harness support

Install this skill only through an approved category selection or an explicit single-skill request.

[Read the authoritative skill instructions](https://raw.githubusercontent.com/tt-a1i/archify/a7ed6fd6657da90414831d1d42cf95987188750c/archify/SKILL.md). This link uses the immutable upstream revision `a7ed6fd6657da90414831d1d42cf95987188750c`; there is no vendored copy here.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
