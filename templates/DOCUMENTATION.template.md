# Documentation

Read this document during implementation and before creating or revising documentation. Keep affected documentation current in the same change; assess the impact even when no documentation edit is needed.

## Required guidance

During implementation, read and follow `.agents/skills/document-project/SKILL.md` to assess documentation impact. Before drafting or revising documentation, also read and follow `.agents/skills/asd-ste100-technical/SKILL.md` and `.agents/skills/unslop/SKILL.md`.

If required guidance or its prerequisites are unavailable, stop the affected phase and report the gap. Do not silently skip it, recreate missing instructions, or install dependencies without approval. Keep the general authoring procedure in the skills rather than duplicating it here.

## Audience and reader tasks

{{DOCUMENTATION_AUDIENCE_AND_TASKS}}

## Locations and ownership

{{DOCUMENTATION_LAYOUT}}

## Engine selection

{{DOCUMENTATION_ENGINE}}

Use these rules to establish or preserve the project's documentation engine:

| Project state | Required decision |
|---|---|
| An approved MkDocs or VitePress site exists | Keep that engine and its established configuration, theme, plugins, and commands. Improving prose is not a reason to migrate. |
| Both engines exist or the canonical source is unclear | Obtain an owner decision before choosing a source, creating a competing site, or changing engine configuration. |
| No site is approved | Maintain existing Markdown documentation. If a site is needed, propose VitePress as the default; the owner may choose MkDocs. Obtain approval for the baseline before setup. |
| Another documentation system already exists | Preserve it unless an explicit migration is approved. Do not treat this template as permission to replace it. |
| This repository only receives built documentation | Keep source generation in the owning repository. Do not initialize a source site or hand-edit generated output here. |

Do not select an engine solely from the project's programming language. An existing approved choice takes precedence over a new-site default. Site initialization, dependencies, theme changes, migration, and deployment need their applicable approval; the engine field does not grant it.

## Writing and maintenance

Document supported behavior and distinguish planned or deferred behavior. Explain project-specific prerequisites, actions, results, and limitations without re-teaching the agreed audience's standard skills.

Update affected guides, examples, reference pages, and navigation while implementing user-visible changes. Refactor unclear affected material instead of appending repeated explanations. Keep unrelated cleanup separately scoped, and do not turn a feature task into an unapproved site rewrite.

{{DOCUMENTATION_POLICY}}

## Canonical commands

{{DOCUMENTATION_COMMANDS}}

Use the existing approved toolchain and the selected engine's applicable guidance. Do not replace the package manager, Python environment, theme, or plugins merely to write documentation. Do not run deployment commands as local validation.

## Checks and completion

Run the applicable documentation checks in `VALIDATION.md`. Report builds, executed examples, agent walkthroughs, and actual user testing separately; rendering alone does not prove that a reader can complete the task.

Required documentation is part of completing the change. Explain a concrete no-change assessment when applicable. If required documentation or checks are blocked, report the gap and obtain an explicit owner decision before treating the work as complete.
