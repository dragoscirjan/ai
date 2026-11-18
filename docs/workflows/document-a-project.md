---
title: Document a project
---

# Document a project

Create or improve a documentation website that helps a developer complete useful project tasks without the author's help.

Start with a project, its intended readers, and permission for a bounded documentation effort. Finish with checked guides, examples, reference material, and navigation. This workflow covers both an existing site and an approved new site.

## Workflow

![Reader-oriented documentation with existing-site and approved new-site routes.](/diagrams/document-a-project.svg)

[Open interactive diagram](/diagrams/document-a-project.html){class="vp-raw"} · [Download SVG](/diagrams/document-a-project.svg) · [Editable source](/diagram-sources/document-a-project.json)

The diagram shows suggested handoffs, not automatic execution or new instruction dependencies. Select a node in the interactive diagram for its source references.

<details>
<summary>Read the flow as text</summary>

```text
Inspect project and reader tasks
    ↓
Agree coverage and site scope
    ↓
Organize the reader's route
    ↓
Write guides and reference
    ↓
Walk through → build → link checks
    └─ gaps → revise and recheck
```

</details>

Writing style applies throughout the work. It is not a separate sequence of skill invocations after every paragraph.

## Before you start

Read the project instructions, existing documentation, supported interfaces, configuration, tests, and working examples. Confirm the reader, supported platforms, intended coverage, and [execution safeguards](/workflows/supporting-tools#before-you-start).

Use [`document-project`](/skills/document-project) to organize the work. Apply [`asd-ste100-technical`](/skills/asd-ste100-technical) for clear technical instructions and [`unslop`](/skills/unslop) to remove filler while preserving meaning.

Improving documentation does not authorize a platform migration, dependency installation, unfamiliar-code execution, or publication.

## Steps

### 1. Establish what the reader needs to do

Choose real tasks such as first installation, configuration, exporting a report, or diagnosing a known failure. Identify each task's starting state and first observable result.

Inspect project evidence before deciding what to document. Separate supported behavior, observed defects, and intended future behavior. Resolve contradictions or disclose the missing evidence.

Do not use the source directory tree as the reading order. Explain project-specific terms, commands, permissions, and results while assuming standard development skills.

### 2. Choose the existing-site or new-site branch

For an existing site, keep its approved platform and build process. Read affected pages, preserve correct content, and agree how moved pages and links will be handled.

If no site exists, propose the minimum useful baseline and obtain approval before creating it or installing tools. The `document-project` skill defaults to VitePress for an approved new site. An existing MkDocs site stays on MkDocs unless a migration is separately approved.

A documentation request is not permission for broad legacy cleanup. Keep unrelated reorganization out of a bounded guide update.

### 3. Build a reader-oriented structure

Give each page a clear purpose. A tutorial teaches one coherent example, a how-to completes a task, reference supports lookup, and explanation describes why the system works that way.

Lead the first-use route toward a working result. Link deeper architecture, maintenance, and release information when needed rather than putting it before every user's first task.

Choose one recommended route and introduce alternatives only where the reader must decide.

### 4. Write a procedure the reader can follow

State prerequisites before actions. Supply exact supported commands or UI labels, starting files or inputs, relevant versions, working locations, expected results, and recovery for likely failures.

Use one small, coherent example. Mark proposed or illustrative output so it cannot be mistaken for an executed result. Do not guess project commands or require credentials merely to inspect the project.

Use a [diagram](/workflows/supporting-tools#diagrams-and-writing-aids) when it answers a relationship question. A screenshot or diagram does not replace the written procedure.

### 5. Verify both the site and the instructions

Walk the procedure from its stated starting point without relying on unwritten project knowledge. Check prerequisites, terms, placeholders, actions, outputs, failure recovery, and the next useful page.

Run the project's approved site build and available link checks. Check navigation, assets, downloads, moved links, and the configured URL base. A passing build does not prove that an example works.

Execute examples only with the required authority and safe input. Report executed examples, agent walkthroughs, and actual user testing separately. If a required check cannot run, report the blocker and obtain the owner's decision before treating the work as complete.

## Example: document report export

This example continues the illustrative reporting project. The paths below are proposed pages, not files supplied by this collection.

Suppose export already exists but users cannot discover how filters affect it. A bounded request could be:

```text
Document the existing CSV export in the current documentation website.
Inspect the implemented filters, columns, limits, permissions, encoding,
and failure behavior. Write a task guide with one safe example and link
format details from reference. Preserve the current site platform and URLs.
Run its approved build and link checks. Do not deploy.
```

A useful result might include:

| Proposed page             | Reader result                                             |
| ------------------------- | --------------------------------------------------------- |
| `guide/export-reports.md` | Export a filtered report and recognize the resulting file |
| `reference/csv-format.md` | Look up supported columns, quoting, encoding, and limits  |
| The existing navigation   | Find the guide from the reporting section                 |

Use the target site's actual paths and supported commands. If export behavior conflicts with a requirement, report that conflict instead of documenting an imagined correction.

## Keep documentation with behavior changes

This workflow can be a standalone project. Its affected-guide update also belongs inside implementation, debugging, and debloating when they change a reader task, public behavior, configuration, or interface.

For an internal-only change, explain concretely why no reader documentation needs to change. Do not add cosmetic edits merely to show documentation activity.

## Hand off the website

Report changed paths, covered reader tasks, navigation and link checks, build results, executed examples, walkthrough findings, and unresolved gaps. Stop before deployment unless it is separately authorized.

For work on this collection's own website, use [site maintenance](/maintenance/) for its actual setup and build commands. For a narrower maintenance procedure, see [Keep a developer task usable](/workflows/maintain-task-based-docs).
