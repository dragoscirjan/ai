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

- Verify core `name` and `description` frontmatter and the approved project/harness extensions. Do not claim raw strict Agent Skills compliance for files using nonstandard fields.
- Validate optional `requires` as one nonempty inline JSON-compatible array: unique valid names, local or catalogued external targets, and no self-reference or cycles. A catalog entry does not prove installation: missing external requirements must stop invocation for approved setup. Check declared load order and independence of unmarked leaves.
- Verify that each skill directory name matches its declared `name`.
- Verify that Pi discovers the changed source skill recursively from `.agents/skills/<category>/<name>/`.
- Verify that synchronized installations remain flat under `.agents/skills/<name>/` and are discoverable in each selected harness. For Claude Code, check exact relative destination-project `.claude/skills/<name>` projections. This source repository has no Claude skill projections.
- Check relative references, supporting files, and command examples.
- Confirm that harness-specific behavior is explicit and does not masquerade as portable Agent Skills behavior.

## Skill synchronization changes

When a change modifies `sync-my-skills` or its catalog:

- Use the approved pinned parser setup (`npm ci --ignore-scripts` in the manager package); never install dependencies merely for target detection.
- Run `node --test .agents/skills/agentic-work/sync-my-skills/scripts/sync-my-skills.test.mjs` and syntax checks for its `.mjs` helpers.
- Run `catalog --source-root <repository-root>` and confirm every local skill is represented exactly once, alongside valid catalog-only upstream entries.
- Test strict YAML parsing, duplicate keys, unsafe paths/tags/aliases, source revisions, unknown entries, missing requirements, and cycles. Every `npx` argument array must start with `npx, -y`.
- Test default catalog refresh, newly added entries, explicit bundled/local modes, unsupported-schema/owner stops, byte-bound catalog provenance, shared authored-source commits, and stage invalidation when only the catalog source pin changes. Never claim a manager self-update or silent offline fallback.
- Test context evidence, non-coding projects, every-remaining-skill decision coverage, previously declined entries, unknown/custom installations, and explicit harness subsets. Verify the documentation trio is recommended without language signals, may be declined entirely, and never initializes a site or installs automatically.
- Test authored/upstream/adapted preparation, complete supporting/legal files, OpenAI-metadata exclusion, output-bound adaptation review, unchanged-result reuse, and changed-source/rule/target stops.
- Test local/unmanaged conflicts, missing files, upstream removals, exact deprecated choices, complete removal snapshots, stale plans, path/symlink escapes, and primary-checkout protection.
- Confirm plan mode does not mutate the target and apply requires an isolated Git worktree plus `--apply --confirm --plan-id <approved-id>`.
- Test version-1/2 lock migration: legacy instruction records stay historical and files remain byte-identical until explicit bundle adoption. Test version-3 ownership and retention when later instruction changes are declined.
- Test selectable instruction scope: the complete four-file bundle and optional Claude import; existing/custom rules, fixed template prose, required guidance, resolved fields, consistent project names, exact-path resolutions, and separate policy approval. Reject arbitrary root paths, partial bundles, hidden fixed rules, and unsupported destinations.
- Test unchanged template inputs, pinned source acquisition, target binding, evidence/prerequisite changes, edited outputs, and stale plans. Verify skill/deferred-document actions precede startup imports and the lock is last. Static checks do not prove semantic preservation or command execution.
- Confirm the lock contains no absolute machine paths, credentials, temporary paths, or secrets. Preserve its provenance, approved decisions, and local-change baseline.
- Confirm `skills-lock.json` remains Skills CLI-owned and `.agents/ai-assets.lock.json` remains synchronization-owned.
- Test personal command setup in disposable home directories, including collisions and stale approvals. Do not mutate live personal configuration during tests. For Pi runtime discovery, distinguish global command loading from project skills and document the native project-trust requirement; any test-only approval must remain confined to the reviewed disposable fixture.
- Verify recursive source inventory, exact catalog source-path coverage, duplicate-name rejection, category symlink rejection, and flat destination paths with complete supporting/legal files. Verify Pi/OpenCode destination discovery and only the selected destination-project Claude relative projections. Distinguish static adapter/reference checks from live harness validation and model compliance. For populated instructions, verify active imports and the complete reference graph separately.
- Confirm there is only one manager skill, no old-name compatibility package, and no automatic commit, push, publication, merge, or release.

## Coding-family changes

When a change adds or modifies `coding`, `coding-with-rules`, or its references:

- Confirm that source `coding` and `coding-with-rules` are sibling skills under `.agents/skills/coding/`; synchronized installations remain siblings directly under `.agents/skills/`.
- Confirm that `coding` remains independent and `coding-with-rules` declares exactly `requires: ["coding"]`.
- Confirm that language and extension documents are plain Markdown under `coding-with-rules/references/`, not separately discoverable skills or `requires` targets.
- Confirm project routing selects `coding-with-rules`, resolves `coding` first, and reads only task-relevant language references before extension references. Check ambiguous headers, Bash versus POSIX selection, unsupported-language fallback, and missing-mapped-reference stops. Test declared requirement order, missing-requirement stops, and cycle rejection without a harness-specific Skill tool.
- Keep code-helper dependencies separate from instruction requirements; test their combined installation closure.
- Confirm extension guidance does not duplicate generic or language instructions.
- Confirm that project configuration takes precedence over fallback tools.
- Confirm that no skill installs, replaces, or reconfigures tools without human approval.
- Confirm that every language reference uses jscpd as the fallback duplicate detector while honoring project-configured alternatives.
- Confirm that numeric thresholds come only from project configuration.
- Check source links and maintenance-status notes for external guidance.
- Verify source discovery of `coding` and `coding-with-rules` in Pi and synchronized destination discovery in Pi, OpenCode, and Claude Code, including exact relative destination-project Claude projections. Do not advertise reference files as skills; distinguish source/static checks from live discovery.

## Workspace-skill changes

When a change modifies `isolated-workspace` or `cleanup-workspaces`:

- Exercise the Git procedure in a disposable repository.
- Exercise the Jujutsu procedure in a disposable repository.
- Test the relevant safety stops, not only the successful path.
- Confirm that `AGENTS.md` provides the VCS, base revision, and task-branch policy.
- Exercise task-branch creation in the current checkout as well as the isolated path. Verify same-task continuation, unrelated-change preservation, and branch/bookmark creation before task edits.
- Confirm that callers must select `git` or `jj` explicitly and that colocated repositories do not trigger VCS inference.
- Confirm that automation detects the primary local repository and derives the sibling `<repository>--workspaces` directory without hosted-repository identity.
- Confirm that isolated-workspace planning is non-destructive, applying its plan requires `--apply --confirm --plan-id <approved-id>`, and cleanup rechecks state immediately before removal.
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

## Documentation changes

- Verify the documentation impact assessment. User-visible changes need affected documentation updated in the same change; a no-change decision needs a concrete reason.
- Walk through the first-use instructions from the stated starting point. Check prerequisites, working directory, file names, commands or UI actions, expected results, likely failures, and recovery. Assume standard development skills, but check for missing project-specific knowledge or steps.
- Check affected navigation, links, examples, and obsolete instructions. Preserve correct content and keep unrelated cleanup out of scope.
- Run the approved site's build and available link checks. For VitePress, verify navigation and the configured base path. Do not install tools, create a site, migrate a site, or weaken checks without approval.
- Report site checks, executed examples, documentation walkthroughs, and actual user testing separately. Do not claim that a successful build proves usability or that an unexecuted walkthrough passed.
- Report blocked required documentation or checks and obtain an explicit owner decision before treating the change as complete.

## Policy and instruction changes

When a change modifies `AGENTS.md`, `CONTRIBUTING.md`, `VALIDATION.md`, or another instruction file:

- Confirm that `AGENTS.md` contains only startup routing, project configuration, always-on security, and owner authority.
- Confirm that every deferred document or mandatory skill has a clear trigger in `AGENTS.md`.
- Confirm that read-only analysis does not require deferred contributor instructions unless it needs repository identity.
- Confirm that planning or performing a repository change requires `CONTRIBUTING.md`.
- Confirm that every new modifying task requires a dedicated task branch, or a dedicated change and bookmark for Jujutsu.
- Confirm that current-checkout and isolated-workspace execution both satisfy the task-branch gate. Worktree creation is a task-level choice, not a universal prerequisite.
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
