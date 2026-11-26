---
title: "archify"
---

# archify

Create validated diagrams, explainers, stories, and source-backed Code Analysis workbenches with Archify 3.3.2, including image/SVG/WebM exports.

**Group:** [Documentation](/groups/documentation) · **Availability:** Upstream-only; approved external setup · **Scope:** project

## When to choose it

A supported native diagram, structured explanation, local repository Code Analysis workbench, or story/video export is needed.

**Expected result:** A retained native candidate, explainer, or analysis workbench with the delivery and browser checks required by its mode.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/tt-a1i/archify/tree/a0199aab7bc1e87821c286f9b297afb8f98894ec/archify --skill archify
```

This command selects only `archify`.

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

- Node.js 18 or newer; Chrome/Chromium or Microsoft Edge for required browser verification and exports. The package is self-contained and includes vendored Node libraries.
- Optional analysis and media modes follow their upstream runtime requirements. Missing tools require separately approved setup; do not install them implicitly.

The external package and runtime/browser setup need approval. Upstream 3.3 may produce explainer pages for complex work by default; honor the user's selected mode and existing project rules. Do not change global agent rules during setup. A rendered HTML file alone is not proof that delivery and browser gates passed; visual inspection is a separate claim.

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://raw.githubusercontent.com/tt-a1i/archify/a0199aab7bc1e87821c286f9b297afb8f98894ec/archify/SKILL.md). This link uses the immutable upstream revision `a0199aab7bc1e87821c286f9b297afb8f98894ec`; there is no vendored copy here.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
