# Project instructions

Read when the user selects instruction-file changes. Also read the `README.md` contract in this run's pinned template source before drafting. The repository's `templates/` directory is the source, not an active instruction bundle to copy blindly.

## Scope and prerequisites

The required bundle is `AGENTS.md`, `CONTRIBUTING.md`, `DOCUMENTATION.md`, and `VALIDATION.md`, all at the target repository root. `CLAUDE.md` is an optional import bridge. Nested instructions and unselected files stay untouched; inspect their effects on scope and report conflicts.

Adoption requires the template's fixed guidance at its canonical target paths:

- `.agents/skills/document-project/SKILL.md`
- `.agents/skills/asd-ste100-technical/SKILL.md`
- `.agents/skills/unslop/SKILL.md`

Each requirement and its declared closure must be explicitly selected or already installed and reviewed. A catalog entry alone is not installation evidence. The helper fingerprints existing guidance; changed content requires another review. Missing guidance or tools block the affected phase. Offer an approved resolution or retain skills-only scope where current target rules permit it.

The user may decline instruction changes. That preserves the files; it never waives the rules already governing the operation. Proposed instructions cannot grant their own adoption authority.

## Investigate, then grill

Read the effective instruction graph and relevant project evidence. Separate verified facts with source paths, inferred intent, existing policy, confirmed owner decisions, and unresolved questions. Inspect public configuration/schema/example sources, not credentials or unrelated private material. Reading a command is not proof it runs.

Use the template contract's required fields as the completion checklist. Establish:

- Project purpose, supported users/tasks, success conditions, non-goals, owned sources, generated content, and scoped instructions.
- Important user workflows, operating behaviour, integrations, compatibility/data constraints, and which architecture or development choices are fixed versus open.
- Actual runtimes, setup/development commands, environments, test conventions, and configuration precedence.
- Documentation audience, sources, existing engine, commands, ownership, and maintenance boundaries.
- Applicable checks and their real thresholds, missing tools, limitations, and completion obligations.
- Task records, explicit VCS, base revision, mandatory task-ref creation, working-location choices, implementation invariants, approved automation, and publication authority.

Find facts yourself. Ask project-specific questions about unresolved intent and policy in frontier rounds: ask only decisions whose prerequisites are settled, wait, then ask the dependent questions. An open question is appropriate when the purpose itself is unknown; use native choices for bounded decisions. Explain why an answer matters and distinguish a recommendation from an accepted choice. Reuse verified facts and earlier explicit decisions rather than asking the owner to retrieve facts or repeat answers.

Cover how the project should be developed, not just its current files: implementation invariants, testing expectations, documentation audience, permitted automation, and decisions reserved for the owner. Preserve existing policy unless the user explicitly changes it; neither silence nor a template default is approval.

No new site is implied by `DOCUMENTATION.md`. Preserve an approved engine. For a project without an approved site, describe its actual Markdown workflow and absent commands rather than inventing a build or configuring VitePress/MkDocs.

## Confirm understanding before drafting

Read back the project purpose, users and supported behaviour, success conditions, non-goals, important constraints, and consequential development decisions. Label remaining inferences and blockers. Ask the owner to confirm that understanding or correct it, then wait. Resolve corrections through the relevant decision rounds and show the corrected read-back. Previously confirmed decisions can be reused; the current read-back still requires explicit confirmation.

Draft only after the owner explicitly confirms the read-back of project purpose, supported behaviour, non-goals, constraints, and consequential development decisions. A request to sync skills, selection of the instruction bundle, a filled template checklist, or approval of this understanding is not approval of the eventual instruction-policy changes.

**Ready to draft:** the owner confirmed the current read-back, every required evidence/policy field is grounded, material unknowns are resolved, and selected scope is confirmed. An unresolved material choice blocks instruction drafting. Offer a return to skills-only scope where target rules permit it rather than guessing.

## Prepare and draft

Run `prepare` with `--instructions`; add `--claude-import` only for the chosen Claude bridge. Carry the same `--catalog`, worktree, selected skills, and target requirements used by the rest of the run. Source acquisition needs a trusted complete checkout or explicit `--fetch` permission.

The external stage contains:

- `templates/`: immutable template source and its contract.
- `instructions/`: the only instruction candidates to edit. Existing files are the initial baseline; missing files start as unfinished templates.

Write the candidates with LLM reasoning. The helper does not substitute placeholders or choose policy. Retain fixed template prose and gates; its headings/fields organize the draft. Fill required fields, omit inapplicable optional content, and refactor existing material into the bundle without losing meaningful project rules. Preserve Claude-specific content alongside its import.

Use one project name. Keep authority in `AGENTS.md`, general procedures in `CONTRIBUTING.md`, documentation policy/commands in `DOCUMENTATION.md`, and check requirements in `VALIDATION.md`. Reference canonical commands rather than maintaining contradictory copies. Output must have no unresolved authoring markers, private machine paths, or credential values.

Treat new safety, task-branch, working-location, skill-loading, validation, or publication rules as protected policy changes. Describe their effects separately from prose cleanup and request explicit owner approval. The fixed template prerequisites are not optional population choices.

## Review and approve

Inspect each actual diff against both the target's original rules and the template contract. Validate the complete reference graph, required guidance/version, all required fields, source evidence, decisions, commands, and limits. Root symlink/directory destinations stop rather than being overwritten.

Run `review-instructions` with a substantive note. Record facts checked, the owner's understanding confirmation and resolved corrections, consequential decisions, preserved rules, and uncertainty resolved. This note records the conversation; static review does not independently enforce the understanding checkpoint. Pass `--evidence <json-file>` for additional source paths used by the draft; the file is an array of project-relative filenames or verified absences. The helper also fingerprints root instructions, README files, standard manifests/configurations, and workflows. List custom command/configuration evidence explicitly. Credential files are not evidence inputs.

Static checks enforce scope, unchanged template inputs, resolved markers, consistent project names, visible fixed rules, current evidence, and reviewed output digests. They do not prove semantic correctness, policy preservation, command execution, or user comprehension; those require the review above.

Record the selected `instructionFiles`, the owner's `instructionApproval` note, and any exact-path collision resolutions in selection. Present all writes and new ownership, including unchanged files being adopted. A technical review note is not the owner's policy approval. Then obtain approval for the current combined plan.

## Apply and hand off

Apply in the reviewed isolated worktree only. Guidance and deferred documents are written before startup imports; the lock is last. This reduces activation risk but is not an atomic multi-file transaction. On interruption, preserve the stage/worktree, inspect the active graph, and obtain a new plan before continuing.

Check every selected instruction, preserved custom rule, import, prerequisite, evidence result, and installed digest. Unselected root/scoped files remain unchanged. Version-1/2 instruction records stay historical until explicitly adopted; declining updates never deletes existing instructions.

Report static checks, executed examples, agent walkthroughs, and actual user tests separately. Reload or restart from the reported worktree before checking new instructions and skills. Native trust and publication remain separate owner decisions.
