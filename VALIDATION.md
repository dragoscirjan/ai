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
- Verify that Claude Code discovers it through an exact relative `.claude/skills/` symlink to the canonical `.agents/skills/` directory.
- Check relative references, supporting files, and command examples.
- Confirm that harness-specific behavior is explicit and does not masquerade as portable Agent Skills behavior.

## Agent-asset synchronization changes

When a change modifies `sync-agent-assets` or its catalog:

- Run `node --test .agents/skills/sync-agent-assets/scripts/sync-agent-assets.test.mjs`.
- Run the helper's `catalog --source-root <repository-root>` command and confirm that every skill directory is represented exactly once.
- Test init detection, update detection, dependency closure, ambiguous skill selection, and unknown catalog entries.
- Test clean upstream updates, local modifications, conflicts, missing target files, and upstream removals retained for approval.
- Confirm plan mode is non-mutating and lock recording requires `--apply --confirm --plan-id <approved-id>`.
- Confirm the managed lock contains no absolute paths, credentials, temporary paths, or secrets.
- Confirm the workflow uses static inspection and never runs target code or installs target dependencies for detection.
- Confirm bootstrap uses a temporary Skills CLI invocation and creates an isolated workspace before project-scoped installation.
- Confirm complete selected skill directories and dependency closures are installed.
- Confirm `skills-lock.json` remains Skills CLI-owned and `.agents/ai-assets.lock.json` remains synchronization-owned.
- Confirm Pi and OpenCode discover the synchronized skills.
- Confirm Claude Code discovers the synchronized skills through recorded relative projections and loads `AGENTS.md` through `CLAUDE.md`.
- Confirm synchronization never commits, pushes, publishes, merges, or releases without a separate explicit request.

## Coding-family changes

When a change adds or modifies `coding` or a `coding-*` skill:

- Confirm that all coding skills are sibling directories directly under `.agents/skills/`.
- Confirm that language skills require `coding` and extension skills require both `coding` and their language skill.
- Confirm that dependencies resolve through advertised skill names and paths without a harness-specific Skill tool.
- Test generic-to-language-to-extension load order, missing-dependency stops, and dependency-cycle rejection when those relationships exist.
- Confirm that wrappers contain only extension-specific differences and do not duplicate generic or language instructions.
- Confirm that project configuration takes precedence over fallback tools.
- Confirm that no skill installs, replaces, or reconfigures tools without human approval.
- Confirm that every language uses jscpd as the fallback duplicate detector while honoring project-configured alternatives.
- Confirm that numeric thresholds come only from project configuration.
- Check source links and maintenance-status notes for external guidance.
- Verify flat discovery in Pi, OpenCode, and Claude Code.

## Workspace-skill changes

When a change modifies `isolated-workspace` or `cleanup-workspaces`:

- Exercise the Git procedure in a disposable repository.
- Exercise the Jujutsu procedure in a disposable repository.
- Test the relevant safety stops, not only the successful path.
- Confirm that `AGENTS.md` still provides the required project workspace configuration.
- Confirm that callers must select `git` or `jj` explicitly and that colocated repositories do not trigger VCS inference.
- Confirm that automation detects the primary local repository and derives the sibling `<repository>--workspaces` directory without hosted-repository identity.
- Confirm that planning is non-destructive, mutation requires `--apply --confirm --plan-id <approved-id>`, and cleanup rechecks state immediately before removal.
- Confirm that active, primary, dirty, locked, conflicted, and unmerged workspaces remain protected.
- Confirm that workspace commands remain in the skills and are not duplicated in project policy files.

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
