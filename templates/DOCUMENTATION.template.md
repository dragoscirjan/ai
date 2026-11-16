# Documentation

Assess documentation impact during implementation. Update affected documentation in the same change, or give a concrete reason no update is needed.

## Required guidance

- For implementation and documentation work, read and follow `.agents/skills/document-project/SKILL.md`.
- Before drafting or revising documentation, also read and follow `.agents/skills/asd-ste100-technical/SKILL.md` and `.agents/skills/unslop/SKILL.md`.
- If required guidance or prerequisites are missing, stop the affected phase and report the gap. Do not skip, recreate, or install them without approval.

## Audience and reader tasks

{{DOCUMENTATION_AUDIENCE_AND_TASKS}}

## Sources and ownership

{{DOCUMENTATION_LAYOUT}}

## Engine selection

{{DOCUMENTATION_ENGINE}}

- Keep an existing approved MkDocs or VitePress site, including its configuration, theme, plugins, and commands.
- Preserve any other existing documentation system unless an explicit migration is approved.
- If MkDocs and VitePress both exist, or the canonical source is unclear, ask the owner before choosing a source, creating a competing site, or changing engine configuration.
- If no site is approved, maintain existing Markdown. When a site is needed, propose VitePress by default. The owner may choose MkDocs. Obtain baseline approval before setup.
- For received built documentation, generate in the owning repository. Leave generated files unedited and do not initialize a source site here.
- Choose from approved configuration or an owner decision, never solely from programming language.
- Site setup, dependencies, theme changes, migrations, and deployment require their applicable approval.

## Writing and maintenance

- Document supported behavior. Label planned and deferred work.
- Explain project-specific prerequisites, actions, results, and limits. Assume the agreed audience's standard skills.
- Update affected guides, examples, reference pages, and navigation with user-visible changes.
- Refactor unclear affected material instead of appending repetition. Keep unrelated cleanup and site rewrites separately approved.

{{DOCUMENTATION_POLICY}}

## Canonical commands

{{DOCUMENTATION_COMMANDS}}

Keep the approved toolchain. Do not replace the package manager, Python environment, theme, or plugins merely to write documentation. Deployment is not local validation.

## Completion

Run documentation checks from `VALIDATION.md`. Report builds, executed examples, agent walkthroughs, and actual user testing separately. Rendering does not prove task usability.

Required documentation is part of completion. If required documentation or checks are blocked, report the gap and obtain an explicit owner decision before calling the work complete.
