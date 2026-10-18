# Validation

Read this document before validating, committing, pushing, or publishing a repository change. Run the checks that match the changed files and behavior.

This repository does not define one automated test suite for every asset. Record each check that ran. If a required check cannot run, state why.

## Every change

- Run `git diff --check`.
- Review `git status` and the complete diff.
- Confirm that only files required by the issue or task changed.
- Check that examples describe behavior that exists.
- Do not claim that an unexecuted check passed.

## Skill changes

When a change adds or modifies a skill:

- Verify that every `SKILL.md` has valid `name` and `description` frontmatter.
- Verify that each skill directory name matches its declared `name`.
- Verify that Pi and OpenCode discover the changed skill from `.agents/skills/`.
- Check relative references, supporting files, and command examples.
- Confirm that harness-specific behavior is explicit and does not masquerade as portable Agent Skills behavior.

## Workspace-skill changes

When a change modifies `isolated-workspace` or `cleanup-workspaces`:

- Exercise the Git procedure in a disposable repository.
- Exercise the Jujutsu procedure in a disposable repository.
- Test the relevant safety stops, not only the successful path.
- Confirm that `AGENTS.md` still provides the required project workspace configuration.
- Confirm that workspace commands remain in the skills and are not duplicated in project policy files.
- Confirm that repository identity lookup remains memory or context first, falls back to Git only on a miss, and stores only safe derived identity data.

## Instruction-adaptation changes

When an instruction adaptation is performed through the `instruction-maintenance` workflow:

- Confirm that the recorded human approval follows the exact proposal.
- Confirm that changed files and rules stay within the approved scope.
- Confirm that changed evidence, scope, or protected rules caused a new proposal and approval.
- Distinguish required dependencies from later-phase handoffs and informational references.
- Check for missing targets, stale names or paths, conflicts, duplication, ambiguity, and dependency cycles.
- Confirm that skill routing metadata still states what each affected skill does and when it applies.
- Confirm that security boundaries, mandatory gates, validation requirements, and owner authority are unchanged unless separately proposed and explicitly approved.
- Confirm that detailed skill behavior did not change through this workflow.

## Markdown changes

When a change modifies Markdown:

- Review heading order and section structure.
- Check local and external links.
- Review code fences, commands, paths, and examples manually.
- Use sentence-case headings and clear, concrete language.

## Policy and instruction changes

When a change modifies `AGENTS.md`, `CONTRIBUTING.md`, `VALIDATION.md`, or another instruction file:

- Confirm that `AGENTS.md` contains only startup routing, project configuration, always-on security, and owner authority.
- Confirm that every deferred document or mandatory skill has a clear trigger in `AGENTS.md`.
- Confirm that read-only analysis does not require deferred contributor instructions unless it needs repository identity.
- Confirm that planning or performing a repository change requires `CONTRIBUTING.md`.
- Confirm that mutation requires `isolated-workspace`.
- Confirm that validating, committing, pushing, or publishing requires `VALIDATION.md`.
- Confirm that workspace cleanup requires `cleanup-workspaces`.
- Confirm that instruction drift requires `instruction-maintenance` before an adaptation proposal.
- Confirm that instruction mutation requires explicit human approval of the exact proposal.
- Confirm that missing required instructions stop the gated phase.
- Check for conflicting or duplicated policy across instruction files.

## Publication report

Before pushing or opening a pull request, summarize:

- changed files
- checks that passed
- checks that failed
- checks that did not run and why
- remaining risks or follow-up work
