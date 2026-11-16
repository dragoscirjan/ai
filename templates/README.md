# Project instruction templates

Populate the templates with verified target details. Keep unfinished sources inactive.

## Outputs

- [AGENTS.template.md](AGENTS.template.md) produces `AGENTS.md`: context, phase rules, isolation, safety, and authority.
- [CONTRIBUTING.template.md](CONTRIBUTING.template.md) produces `CONTRIBUTING.md`: setup, development, configuration, and release procedures.
- [DOCUMENTATION.template.md](DOCUMENTATION.template.md) produces `DOCUMENTATION.md`: audience, engine, ownership, commands, and maintenance.
- [VALIDATION.template.md](VALIDATION.template.md) produces `VALIDATION.md`: required checks, evidence, and completion.
- [CLAUDE.template.md](CLAUDE.template.md) optionally produces `CLAUDE.md`, importing `AGENTS.md`. Preserve existing Claude-specific rules.

Place the four required outputs at the same scope. Their paths refer to that populated bundle, not this source directory. Do not register unfinished `.template.md` files as harness instructions.

## Fixed prerequisites

These rules are not population choices:

- Before mutation, follow `.agents/skills/isolated-workspace/SKILL.md`. Work only in an approved isolated workspace, never the primary checkout.
- During implementation, follow `.agents/skills/document-project/SKILL.md`.
- Before documentation writing, also follow `.agents/skills/asd-ste100-technical/SKILL.md` and `.agents/skills/unslop/SKILL.md`.

Resolve these paths within the target bundle's scope. Missing skills or prerequisites block the affected phase. Stop for an approved resolution, not a weaker rule or fabricated replacement. Installation is not automatically authorized.

## Field contract

- Markers are double-braced uppercase names. No template engine, expressions, loops, or conditional syntax is implied.
- Evidence comes from target files, configuration, and interfaces. Inspecting a command does not prove it works.
- Policy preserves target rules or records approved changes. Preserve existing content, scoped instructions, and approved automation unless their change is approved.
- Resolve every required field. State verified absence and its consequences; stop on unknowns instead of inventing tools, tests, or releases.
- Omit inapplicable optional fields and headings left empty. Preserve fixed instructions under nonempty headings.
- Write plain instructions, lists, or literal commands. Additional phase routes use headings and action lists, not table rows.
- Leave no unresolved markers, authoring notes, secrets, personal machine paths, guessed interfaces, or unavailable targets in an output.
- Record consequential decisions, source evidence, and uncertainty in the review record, not repeated throughout the generated instructions.

### Required evidence

- `{{PROJECT_NAME}}`: One project name throughout the bundle.
- `{{PROJECT_PURPOSE}}`: Product, users, and supported scope. Keep roadmap items distinct.
- `{{SETUP_AND_DEVELOPMENT}}`: Runtimes, package/task tools, prerequisites, working directories, setup/development commands, and installation permissions.
- `{{TEST_CONVENTIONS}}`: Existing test locations, naming, frameworks, isolation, and boundaries.
- `{{CONFIGURATION_CONTRACT}}`: Configuration sources, public keys, defaults, required groups, precedence, and secret handling, or their canonical reference.
- `{{DOCUMENTATION_LAYOUT}}`: Entry points, sources, configuration, generated output, and ownership. Identify built-output-only areas.
- `{{DOCUMENTATION_COMMANDS}}`: Actual development, build, preview, and check commands, including directory, environment, and versions.
- `{{REVIEW_COMMANDS}}`: Applicable VCS status/diff checks or an approved manual equivalent.
- `{{PROJECT_CHECKS}}`: Checks by change type, their context, prerequisites, and what their results establish. Use project thresholds.
- `{{DOCUMENTATION_CHECKS}}`: Engine, link, example, reader-task, and artifact checks. Separate builds, execution, walkthroughs, and user tests.
- `{{VALIDATION_LIMITATIONS}}`: Unsupported gates, missing tools, environment limits, and unproven outcomes.

### Required policy

- `{{READ_ONLY_ROUTE}}`: Research and inspection prerequisites, including any code-inspection gate. State explicitly when no deferred document is needed.
- `{{WORKFLOW_SETTINGS}}`: VCS, base/branch policy, and settings accepted by the isolation procedure. Keep its path contract intact.
- `{{PUBLICATION_POLICY}}`: Authority for commits, pushes, PRs, merges, releases, and deployment, including approved automation.
- `{{TASK_POLICY}}`: Work records, source of truth, scope, approvals, and exceptions.
- `{{IMPLEMENTATION_RULES}}`: Coding or content conventions and invariants. Reference reusable procedures rather than copying them.
- `{{DOCUMENTATION_AUDIENCE_AND_TASKS}}`: Audience, assumed knowledge, and supported reader tasks. Editorial content need not target developers.
- `{{DOCUMENTATION_ENGINE}}`: Approved engine and configuration/decision reference. State Markdown-only, unapproved-site, or built-output-only status. Follow `DOCUMENTATION.md`'s selection rules.
- `{{DOCUMENTATION_POLICY}}`: Project maintenance conventions, canonical references, content boundaries, and approvals.
- `{{VERSION_AND_RELEASE_POLICY}}`: Versioned units, version source, release mechanism, artifacts, and approvals. Process is not authority.
- `{{COMMIT_AND_PR_RULES}}`: Commit conventions, branch/PR rules, issue links, and review expectations. Match `AGENTS.md`'s authority.
- `{{COMPLETION_RULES}}`: Required evidence, documentation, owner decisions for blockers, and handoff obligations.

### Optional evidence

- `{{REPOSITORY_MAP}}`: Important first-party locations. Identify generated, vendored, historical, and reserved areas.
- `{{HARNESS_CHECKS}}`: Discovery, imports, projections, and live checks for supported harnesses only.

### Optional policy

- `{{CODING_ROUTE}}`: Available coding guidance selected from actual languages and extensions.
- `{{ADDITIONAL_PHASE_ROUTES}}`: Conditional review, editorial, delegation, cleanup, or instruction-maintenance routes. A route does not authorize its operation.
- `{{SKILL_REQUIREMENT_POLICY}}`: Actual selection and prerequisite-loading conventions, not assumed native harness features.
- `{{PROJECT_BOUNDARIES}}`: Additional trust, ownership, compatibility, generated-output, or data constraints.

## Consistency

- Verify every required target, skill version, prerequisite, and helper interface.
- Keep authority in `AGENTS.md`, general procedures in `CONTRIBUTING.md`, documentation policy/commands in `DOCUMENTATION.md`, and check requirements in `VALIDATION.md`.
- Reference canonical commands and configuration instead of maintaining competing copies.
- Preserve existing documentation engines and generated-output boundaries.
- Keep target facts separate from this repository's catalog tests, bootstrap choices, namespace, release tooling, and configuration.
- Check populated references and harness loading separately. Static checks prove neither model compliance nor successful execution.
