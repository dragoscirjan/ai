# Contributing to ai

Contributions through focused issues and pull requests are welcome. This guide applies to human contributors and coding agents.

Read this document before planning or performing a repository architecture, design, implementation, documentation, configuration, policy, or publication change.

## Contribution workflow

1. Clarify ambiguous requirements and confirm shared understanding.
2. Create or link a GitHub issue before architecture, design, implementation, or policy changes. Typo and broken-link fixes do not require an issue.
3. Keep each change focused on one issue or task.
4. Follow the task-branch and working-location policy in `AGENTS.md` before changing repository files.
5. Assess documentation impact during implementation with `document-project`, `asd-ste100-technical`, and `unslop`. Update affected documentation in the same change before marking the work complete. Explain when no documentation change is needed.
6. Read and follow [`VALIDATION.md`](VALIDATION.md) before validating or publishing the change.
7. Commit with [Conventional Commits](https://www.conventionalcommits.org/).
8. Open a pull request linked to the issue when an issue is required.

Do not merge or release without explicit owner instruction. Approval, completed checks, or a mergeable pull request is not permission to merge or release.

## Documentation during development

For new features, behavior-changing fixes, configuration, and public interfaces, create or improve the affected reader instructions, examples, reference, and navigation. Write task-based instructions for developers who are new to the project. Assume standard development skills, but explain project-specific setup, terminology, commands, and expected results. Refactor unclear affected pages instead of appending repetitive sections. Keep unrelated cleanup separately approved.

Propose and obtain approval for a new documentation baseline or migration to VitePress before creating or replacing a site. Preserve correct existing content and address existing links. Documentation work does not authorize deployment.

Required documentation is part of completing the change. If documentation or required checks are blocked, report the gap and obtain an explicit owner decision rather than silently declaring the work complete.

## Repository identity for automated contributors

When another workflow needs hosted-repository identity, query project-scoped memory or context first. On a miss, read the Git origin once, sanitize the result, and store only an unambiguous `host/owner/repository` identity with its provenance. Never store credentials, token-bearing URLs, embedded user information, or personal filesystem paths.

## Architecture rules

- Follow the [Agent Skills specification](https://agentskills.io/specification) for core skill fields. The `requires` convention below is an explicit project extension, not a standard or native harness feature. Preserve documented harness-specific fields where applicable.
- Match each skill directory name to the `name` in its `SKILL.md` frontmatter.
- Keep reusable assets independent of absolute machine paths and individual harnesses unless the coupling is explicit.
- Keep detailed reusable workflows in skills. Keep only startup routing, project configuration, security boundaries, and owner authority in `AGENTS.md`.
- Preserve security boundaries and required workflow gates when simplifying imported instructions.
- Prefer direct, testable instructions over commentary about intent.
- Do not duplicate workspace commands outside the workspace skills.

## Independent skills and explicit composition

Keep each leaf skill useful on its own: state its scope, real prerequisites, and operation-specific safeguards. Project instructions or the user select additional skills; do not make leaves load them implicitly.

Declare instruction dependencies only for thin, intentional compositions or individually owner-approved exceptions. For example:

```yaml
requires: ["grilling"]
```

Omit the field when no skills are required. When present, use exactly one unquoted top-level `requires` key with a nonempty, single-line JSON-compatible array of unique skill names. Multiline lists, unquoted items, anchors, and trailing comments are unsupported for this property. Names must resolve to local or installed external skills identified by the YAML catalog; self-references and cycles are invalid. A catalogued but uninstalled requirement is a setup stop, not permission to fetch it. The former `require` spelling is rejected. Rename it to `requires` and do not declare both.

The declaration is the sole source of mandatory skill-to-skill instruction dependencies. Resolve requirements recursively in array order, loading each skill once before its caller. The composition body defines execution sequence, handoffs, and stops; do not repeat loading procedures or component instructions. A skill may conditionally load its own supporting documents, such as language reference files. Those documents are not separately discoverable skills or `requires` targets, and must not hide undeclared skill dependencies. An optional reference is not a requirement.

Keep catalog `prerequisites` (installation closure), `capabilities` (harness features), and `runtime` (tools/runtime requirements) distinct. Local frontmatter instruction requirements must be represented in the catalog's prerequisite closure; catalog validation checks this when a complete source checkout is supplied. Upstream skills may omit the project-specific frontmatter field. Do not interpret a harness capability as a skill name or duplicate source inventories.

Top-level `requires` is not part of the Agent Skills standard and fails its strict reference validator. It acquires model-driven semantics through project routing, not a custom harness loader. External Skills CLI commands do not automatically install these requirements. Outside a managed project, install the declared skills and supply this routing convention explicitly. Report tested harness behavior separately from source inspection or unverified compatibility.

## Skills, instructions, and source ownership

`.agents/skills/agentic-work/sync-my-skills/assets/skill-catalog.yaml` is the single authored inventory for locally authored skills, unchanged upstream sources, and maintained adaptations. Record source/version information, installation argument arrays, legal files, filtering, prerequisites, and adaptation intent there. Small patches may help, but semantic LLM adaptation is allowed when inputs change and requires a reviewed result. Do not force substantial maintained variants into brittle replacement recipes.

Every `npx` invocation must include `-y` immediately after `npx`. Catalog commands are acquisition instructions, not authority to execute. Keep unwanted OpenAI metadata such as `agents/openai.yaml` out of installed outputs while preserving required supporting and legal files. Missing runtime/parser dependencies require approved setup; read-only detection never installs them.

`sync-my-skills` is a personal, command-driven skill. The YAML defines the six documentation categories and every skill's membership; documentation derives its groups from that inventory. Offer native category checkboxes, include all project-scoped members and prerequisites, generate their catalogued commands, and obtain approval before executing them directly. Preserve skipped/custom content and legacy manager locks. Do not recreate a sync engine, installer script, per-skill wizard, or duplicate workflow in command stubs.

After successful skill installation, ask whether to review `AGENTS.md` and its dependencies. A decline or no necessary change leaves them untouched. Otherwise inspect evidence, resolve material unknowns, present necessary diffs, and obtain separate approval. Follow existing target policy without imposing a template bundle. The old manager's plan IDs, staging protocol, custom lock ownership, and mandatory worktree rule are retired; target workspace rules, security, approval, validation, and owner authority still apply. Source acquisition never authorizes executing installed code, initializers, trust changes, or publication.

## Human-approved instruction adaptation

When repository instructions no longer fit an observed workflow, follow the `instruction-maintenance` skill. An agent may inspect the instruction graph and present an exact proposal without prior approval. It must not mutate instructions until a human explicitly approves that proposal.

Approval is limited to the stated files and rule changes. Changed evidence, scope, dependencies, handoffs, or protected rules require a revised proposal and new approval. After approval, follow the normal issue, task-branch, working-location, validation, commit, and pull-request gates.

This adaptation workflow covers instruction routes, deferred policy documents, dependency or handoff statements, and skill routing metadata. It does not authorize changes to detailed skill behavior.

## Environment contract

This repository has no runtime environment variables or executable application configuration.

- Document any future environment input beside the asset that consumes it.
- Reject partial or unknown configuration when a future tool defines a complete, closed input contract.
- Do not introduce credentials merely to inspect, validate, or demonstrate an asset.

## Pull requests

A pull request should:

- contain one focused change
- explain what changed and why
- link the relevant issue when required
- report the checks that ran
- state any validation that could not run
- avoid claiming unsupported or unverified behavior

The repository owner decides when to merge or release.
