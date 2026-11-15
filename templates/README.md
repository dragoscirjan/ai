# Project instruction templates

Reusable Markdown starting points for project-specific instruction bundles. These are templates, not active instructions for this repository.

## Bundle

| Source | Target | Purpose |
|---|---|---|
| [AGENTS.template.md](AGENTS.template.md) | `AGENTS.md` | Project context, explicit phase routing, settings, safety, and owner authority. |
| [CONTRIBUTING.template.md](CONTRIBUTING.template.md) | `CONTRIBUTING.md` | Project-specific setup, development, configuration, and release procedures. |
| [DOCUMENTATION.template.md](DOCUMENTATION.template.md) | `DOCUMENTATION.md` | Documentation audience, engine selection, locations, ownership, commands, and maintenance rules. |
| [VALIDATION.template.md](VALIDATION.template.md) | `VALIDATION.md` | Actual checks, change-specific gates, evidence, and completion requirements. |
| [CLAUDE.template.md](CLAUDE.template.md) | `CLAUDE.md`, optional | Explicit Claude import of the shared `AGENTS.md`. |

The first four targets form one bundle. Keep them at the same target scope so their relative references resolve. The Claude adapter is optional; it is not a prerequisite for using the other files.

Source filenames end in `.template.md` instead of the normal active instruction filenames. Do not register unfinished sources as harness instructions. Target paths inside the templates refer to the populated bundle, not to files beside these inactive sources.

## Required policy skills

These obligations are fixed, not optional population fields:

| Phase | Required target-relative skill path |
|---|---|
| Before repository mutation | `.agents/skills/isolated-workspace/SKILL.md` |
| During implementation to assess documentation impact | `.agents/skills/document-project/SKILL.md` |
| Before drafting or revising documentation | `.agents/skills/asd-ste100-technical/SKILL.md` and `.agents/skills/unslop/SKILL.md` |

Check these paths relative to the populated bundle's scope. Their complete skills and prerequisites must be available before the affected phase can proceed. If not, stop and obtain an approved resolution; do not weaken the fixed route or fabricate replacement instructions. This prerequisite does not authorize installation or changes to a synchronization workflow.

## Population contract

Markers use double braces around an uppercase field name. They are semantic placeholders, not a promise of Jinja, Mustache, or another engine's syntax. There are no loops, conditionals, executable expressions, or engine dependencies.

- **Evidence** fields contain facts verified from the target's current files, configuration, interfaces, and documented commands. Inspecting a command does not prove it was executed successfully.
- **Policy** fields preserve existing target rules or record owner-approved decisions. Common practice elsewhere is not permission to choose a target's branch, tooling, thresholds, or publication authority.
- Required fields must be resolved before an output is ready. Unknown is not the same as absent. A verified absence may be stated with its consequence; never invent a command or capability to fill a section.
- Optional fields may be empty when they do not apply. Remove an empty standalone placeholder and its otherwise empty heading. For an inline optional field, remove only the placeholder, not the fixed routing row or its required instruction.
- Route cells must be single-line instructions. Additional routes are complete Markdown table rows. Keep commands and lengthy procedures out of routing cells, and escape table separators when needed.
- Other fields accept Markdown prose, lists, or fenced commands as appropriate. Use sentence-case headings and exact project terminology.
- Outputs must contain no unresolved markers, authoring notes, secret values, personal machine paths, guessed interfaces, or references to unavailable instructions.
- Preserve existing target content, scoped instructions, and approved automation unless a specific change is approved. Never apply these templates as a blind overwrite.

Record consequential policy choices, evidence limits, and uncertain facts in the consuming skill's review record. Do not clutter every generated user-facing paragraph with authoring provenance.

## Fields

| Field | Required | Kind | Meaning |
|---|---|---|---|
| `{{PROJECT_NAME}}` | Yes | Evidence | The target project's actual name, consistent across files. |
| `{{PROJECT_PURPOSE}}` | Yes | Evidence | A short statement of the product, intended users, and stable supported scope. Do not present roadmap items as shipped behavior. |
| `{{READ_ONLY_ROUTE}}` | Yes | Policy | Instructions required for read-only research or inspection, including any distinct code-inspection gate. A no-deferred-document rule must also be explicit. |
| `{{CODING_ROUTE}}` | No | Policy | Additional selected coding instructions, only when applicable and available. Select languages and extensions from project evidence. |
| `{{ADDITIONAL_PHASE_ROUTES}}` | No | Policy | Target-specific routes such as review, editorial work, delegation, workspace cleanup, or approved instruction maintenance. A route does not authorize the operation. |
| `{{SKILL_REQUIREMENT_POLICY}}` | No | Policy | The target's actual skill-selection and requirement-loading convention, if needed. Do not advertise project extensions as native harness features. |
| `{{WORKFLOW_SETTINGS}}` | Yes | Policy | Explicit VCS and the settings accepted by the approved workflow, such as base and branch policy. Keep these compatible with the selected workspace procedure; do not restate a different path algorithm. |
| `{{PROJECT_BOUNDARIES}}` | No | Policy | Additional stable trust, ownership, compatibility, generated-output, or data boundaries specific to the target. |
| `{{PUBLICATION_POLICY}}` | Yes | Policy | What authorizes commits, pushes, PR creation, merges, releases, and deployment. Preserve existing approval boundaries and explicitly approved automation. |
| `{{TASK_POLICY}}` | Yes | Policy | Work records, source of truth, scope constraints, required approvals, and documented exceptions. |
| `{{SETUP_AND_DEVELOPMENT}}` | Yes | Evidence | Supported runtime and package/task tools, prerequisites, working directories, and actual setup and development commands. State installation effects and required permissions where relevant. |
| `{{REPOSITORY_MAP}}` | No | Evidence | Only the important first-party locations and their purposes. Mark generated, vendored, historical, and reserved areas accurately. |
| `{{IMPLEMENTATION_RULES}}` | Yes | Policy | Applicable coding or content conventions and project invariants. Refer to selected reusable guidance instead of copying whole procedures. |
| `{{TEST_CONVENTIONS}}` | Yes | Evidence | Existing test locations, naming, isolation, frameworks, and relevant boundaries. State verified absence rather than inventing a test system. |
| `{{CONFIGURATION_CONTRACT}}` | Yes | Evidence | Actual configuration sources, public variable names, defaults, required groups, precedence, and secret-handling expectations, or a link to their canonical documentation. State non-applicability only when verified; never include credentials. |
| `{{DOCUMENTATION_AUDIENCE_AND_TASKS}}` | Yes | Policy | Approved audience, assumed knowledge, and supported reader tasks grounded in project evidence. Do not assume a developer audience for editorial content. |
| `{{DOCUMENTATION_LAYOUT}}` | Yes | Evidence | Actual documentation entry points, source and configuration paths, generated-output locations, and ownership. State when the project only receives built documentation. |
| `{{DOCUMENTATION_ENGINE}}` | Yes | Policy | Existing approved engine or an explicitly approved new choice, with its configuration or decision reference. Record Markdown-only, no-site-approved, or built-output-only status explicitly where applicable. Follow the fixed selection rules; do not infer the engine from the programming language. |
| `{{DOCUMENTATION_COMMANDS}}` | Yes | Evidence | Actual documentation development, build, preview, and check commands with working directory, environment, and version requirements. State verified absence if no site is approved; do not invent commands. |
| `{{DOCUMENTATION_POLICY}}` | Yes | Policy | Project-specific documentation maintenance conventions, canonical references, content boundaries, and approval requirements, consistent with the fixed rules in `DOCUMENTATION.md`. |
| `{{VERSION_AND_RELEASE_POLICY}}` | Yes | Policy | Versioned units, version source, release mechanism, artifacts, and approval rules. Keep process separate from authority; do not invent a release pipeline. |
| `{{COMMIT_AND_PR_RULES}}` | Yes | Policy | Existing commit conventions, branch/PR expectations, issue linkage, and review requirements, consistent with publication authority in `AGENTS.md`. |
| `{{REVIEW_COMMANDS}}` | Yes | Evidence | Applicable VCS status/diff checks or an explicitly approved manual equivalent. Do not assume Git commands for another VCS. |
| `{{PROJECT_CHECKS}}` | Yes | Evidence | Actual checks by change type, with command context, prerequisites, and what each establishes. Avoid universal gate lists and invented coverage thresholds. |
| `{{DOCUMENTATION_CHECKS}}` | Yes | Evidence | Checks for the target's engine, links, examples, reader tasks, or published artifacts. Separate builds, executed examples, walkthroughs, and real-user testing. |
| `{{HARNESS_CHECKS}}` | No | Evidence | Discovery, imports, projections, and runtime checks for the harnesses actually supported. Do not assume one client's loading rules apply to every client. |
| `{{VALIDATION_LIMITATIONS}}` | Yes | Evidence | Known unsupported or unavailable checks, environment limits, and what a passing gate does not prove. Distinguish missing tools from unimplemented gates. |
| `{{COMPLETION_RULES}}` | Yes | Policy | Task completion evidence, required documentation, owner decisions for blocked checks, and any project-specific handoff obligations. |

## Consistency requirements

- Every enabled route must have an available target. A skill name alone does not establish compatibility with its installed version, prerequisites, or helper interface.
- Keep one authoritative publication policy in `AGENTS.md`. Contribution mechanics and validation evidence must agree with it, not grant competing authority.
- Keep general setup commands and project conventions in `CONTRIBUTING.md`, and canonical documentation commands in `DOCUMENTATION.md`. Describe required checks by change type in `VALIDATION.md`, referring to canonical commands rather than maintaining competing lists.
- Preserve established documentation platforms. The bundle must not silently migrate MkDocs to VitePress or treat a publishing repository's generated output as its source site.
- Do not copy this skills repository's catalog tests, bootstrap selection, namespace, release tooling, or lack of application configuration into a different kind of project.
- Preserve existing Claude-specific rules if an adapter is selected. An import is not permission to replace local policy or modify harness settings.
- Static field and reference checks do not prove live harness discovery, model compliance, command success, or developer usability. No populated examples or end-to-end renderer are included here.

## Research basis

The sibling-project audit found routed policy bundles, monolithic project instructions, compact contributor routers, generated tool-only blocks, and minimal operational notes. Their useful commonality is separation of responsibilities, not identical commands or procedures. It also found stale duplicated facts and incompatible workspace descriptions; those are reasons to verify target details rather than copy them.

The following sources support the design. Their documented loading behavior is client-specific and may change with versions or settings.

- [AGENTS.md](https://agents.md/): standard Markdown with no required field schema; a predictable place for project guidance.
- [Codex custom instructions](https://developers.openai.com/codex/guides/agents-md): directory-scoped discovery and client-specific override rules. This bundle does not redefine that precedence.
- [Claude Code project memory](https://code.claude.com/docs/en/memory#import-additional-files): explicit `@path` imports support the optional adapter. Current clients may also read AGENTS files directly depending on their version and settings; the adapter is not universally mandatory.
- [Claude Code instruction guidance](https://code.claude.com/docs/en/memory#write-effective-instructions): concrete, consistent instructions are preferable to vague or contradictory guidance. These files are context, not enforced configuration.
- [OpenCode rules](https://opencode.ai/docs/rules/): links in `AGENTS.md` are not automatically imported. The template therefore uses explicit read-and-follow phase routes, which remain agent-mediated rather than enforced loader behavior.

The phase split and placeholder contract are this repository's design choices, not an AGENTS.md standard. No comparative performance or usability claim has been established.
