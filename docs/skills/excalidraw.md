---
title: "excalidraw"
---

# excalidraw

Generate PNG or SVG diagrams with local Excalidraw rendering. Use for project structure, component relationships, workflows, or revisions to an existing diagram. Retain scene JSON as editable source and deliver images first.

**Group:** [Documentation](/groups/documentation) · **Availability:** Authored here · **Scope:** project

## When to choose it

You want an editable Excalidraw scene with a PNG or SVG for a project structure, workflow, or component explanation.

**Expected result:** A rendered image, retained scene JSON, and the checks required by the local rendering workflow.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add dragoscirjan/ai --skill excalidraw
```

This command selects only `excalidraw`. It does not install the rest of the collection or the optional companions listed on this page.

See [installation choices](/guide/install) for prerequisites and the optional reviewed manager.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use excalidraw to explain these components. Deliver the image first, retain the editable scene, and propose any missing local renderer or browser setup before installing it.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

- Requires Node.js 22 or newer, the official @excalidraw/cli 0.3.0 package, and an installed Chrome, Chromium, Edge, or Firefox.

The local rendering toolchain is a separate setup requirement. Do not deliver only diagram source when the requested artifact is an image, or silently substitute a remote renderer.

## Useful combinations

- [`document-project`](/skills/document-project) — Implementation changes how readers use the project, or existing documentation blocks a real developer task.
- [`asd-ste100-technical`](/skills/asd-ste100-technical) — Technical instructions or explanations need plain language without losing conditions, risks, or precise identifiers.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Keep a developer task usable](/workflows/maintain-task-based-docs)
- [Deliver an editable image diagram](/workflows/draw-with-excalidraw)

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/documentation/excalidraw/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
