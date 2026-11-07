---
name: sync-agent-assets
description: Initialize or update a project's AGENTS.md instruction graph and reusable skills from dragoscirjan/ai. Use when adopting these agent assets in another repository or synchronizing an earlier managed installation with newer upstream assets.
compatibility: Requires Git, Bun, network access, Node.js 22.20 or newer, a checkout that preserves symbolic links, and Pi, OpenCode, or Claude Code 2.1.277 or newer. Run the first initialization temporarily with the Skills CLI so the primary checkout stays clean.
metadata:
  author: dragoscirjan
  version: "1.1.0"
  opencode/slash: "true"
---

# Sync agent assets

Initialize or update instructions and skills from `dragoscirjan/ai`. Preserve target ownership rather than blindly mirroring upstream.

- **Init:** no `.agents/ai-assets.lock.json`.
- **Update:** that managed lock exists.

## Start temporarily

Keep the first run out of the primary checkout. Skills CLI 1.7.4 cannot launch Pi or OpenCode through `skills use --agent`; generate a temporary prompt:

```sh
SYNC_AGENT_PROMPT="$(
  npx --yes skills@1.7.4 use dragoscirjan/ai@sync-agent-assets
)"
```

Start either harness interactively from the target repository:

```sh
pi "$SYNC_AGENT_PROMPT

User request: Initialize or update agent assets in this repository."
```

```sh
opencode --prompt "$SYNC_AGENT_PROMPT

User request: Initialize or update agent assets in this repository."
```

Claude Code supports direct launch:

```sh
npx --yes skills@1.7.4 use dragoscirjan/ai@sync-agent-assets --agent claude-code
```

Do not pipe the prompt into Pi: redirected input selects non-interactive mode. Keep its named supporting-files directory until the session exits, then remove it. Later updates can use the merged project-local skill.

## Preserve authority

Read existing target agent instructions, contribution policy, validation rules, and Git status first. Follow stricter target rules; never stash, reset, clean, or move existing changes.

- Review fetched content before trusting it. Do not execute fetched scripts merely to inspect them.
- Detect the stack through static files only: never run target code, install its dependencies, or load its environment for detection.
- Never read, copy, log, or send secrets to another process or model.
- Keep complete selected skills canonical under `.agents/skills/`.
- Claude projections must be exact relative links: `.claude/skills/<name> -> ../../.agents/skills/<name>`. Preserve conflicting files, directories, absolute links, or other targets until their exact replacement is approved.
- Do not invoke installed initializer skills. Their installation does not authorize initialization.
- Retain removed, deselected, or locally changed assets until their deletion, migration, or replacement is approved.
- Do not commit, push, open a PR, merge, or release unless separately requested after synchronization.

## Prepare the helper and pinned source

Set `SYNC_AGENT_ASSETS_HELPER` to the absolute path of this skill's [helper](scripts/sync-agent-assets.mjs); retain that path after changing workspaces. In the examples, `TARGET_ROOT` is the actual target Git root, `WORKSPACE_ROOT` its approved isolated checkout, and source variables come from the fetch result—not guesses.

Inspect the interface and prerequisites:

```sh
node "$SYNC_AGENT_ASSETS_HELPER" --help
node "$SYNC_AGENT_ASSETS_HELPER" preflight
node "$SYNC_AGENT_ASSETS_HELPER" fetch --ref main
```

Use a developer-supplied ref instead of `main` when requested. Keep the returned sourceRoot, tempRoot, and exact commit. Stop if Git, Bun, network access, or Node.js 22.20+ is missing; do not install or reconfigure prerequisites without approval.

The helper performs static inspection, source fetching, hash comparison, and approval-bound lock recording. It does not copy, install, edit, delete, commit, or publish target assets.

Read the [data model](references/data-model.md) before interpreting lock state or creating selection JSON. Validate the complete fetched source:

```sh
node "$SYNC_AGENT_ASSETS_HELPER" catalog --source-root "$SOURCE_ROOT"
node "$SYNC_AGENT_ASSETS_HELPER" inspect --root "$TARGET_ROOT" \
  --source-root "$SOURCE_ROOT" \
  --catalog "$SOURCE_ROOT/.agents/skills/sync-agent-assets/assets/skill-catalog.json"
```

Record mode, current instructions, installed skills, manifests, extensions, recommendations, ambiguities, and managed status. The complete source is needed to read frontmatter requirements. Stop on invalid names, malformed requirements, missing targets, cycles, or catalog coverage drift; never auto-install an uncatalogued skill.

## Require an approved workspace

Before the first managed mutation, require an isolated workspace established through the target's owner-approved procedure. The project or user supplies workspace creation; this skill does not load another skill to choose it.

Confirm VCS, base commit, branch/bookmark, absolute path, status, and write ownership. Missing decisions or approval block mutation. Do not impose this source repository's branch names, base, or publication policy. Run every later command and edit from the approved workspace; never recreate a missing workspace procedure or mutate the primary checkout.

## Select assets and resolve decisions

Re-run inspection with the pinned catalog from that workspace. Classify by catalog selection:

- **manager/bootstrap/core:** include the managed policy bundle and explain why.
- **detected/wrapper:** include on strong project evidence, with code and instruction requirement closure.
- **optional/initializer:** ask when relevant or marked for consideration.
- **New but catalogued:** apply its selection mode; never install merely because it is new.
- **Uncatalogued:** stop and report the defect.

Ask for decisions, not facts available from files or Git. Resolve ambiguous language/runtime evidence, initializer usefulness, harness support, instruction ownership/conflicts, local edits, upstream removals/renames, and optional skill choices. Record declined skills and reasons; reopen settled choices only when evidence changes. A deeper interview can be selected by the caller; it is not an implicit dependency here.

Do not install interview or workspace skills merely to perform this planning. The approved final selection may still include them through managed project profiles.

## Obtain the exact instruction adaptation

Manage the root closure `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, and `VALIDATION.md`.

Require an approved instruction-graph proposal through the target's workflow before writing these files. Preserve target rules and owner authority; merge rather than overwrite. Derive VCS, base, prefixes, quality commands, identity, and publication policy from the target. Remove source-specific identity and personal paths. Include only routes whose requirements will exist after installation; stop on missing instructions, unresolved conflicts, or ambiguous ownership.

Keep `CLAUDE.md` as `@AGENTS.md` when no Claude-specific rules exist. Otherwise preserve those rules and place the import first so the shared graph is loaded.

Show complete proposed contents or precise diffs for each root file and wait for explicit approval. Neither skill selection nor a general synchronization request approves instruction changes.

## Plan and apply synchronization

For updates, compare the pinned candidate to the lock:

```sh
node "$SYNC_AGENT_ASSETS_HELPER" compare \
  --root "$WORKSPACE_ROOT" --source-root "$SOURCE_ROOT"
```

Handle states without discarding local work:

- `unchanged`: no action.
- `upstream-changed-clean`: update candidate, not automatic permission.
- `adaptation-required`: regenerate and approve the instruction adaptation.
- `local-modified` or `conflict`: preserve and obtain an exact adaptation/merge decision.
- `missing`: ask whether to restore or stop managing it.
- `upstream-removed-retain` or `retained-no-update`: retain until an explicit migration, deletion, or re-selection is approved.

Present one plan covering mode, pinned commit, workspace, exact root diffs, selected/declined/new/retained/removed assets, combined dependency closure, complete skill directories, every Claude projection, both lockfiles, mutation commands, validation, conflicts, and any required manager rerun.

Wait for approval. Changed evidence, source commit, selection, dependency closure, conflicts, or content invalidates the plan and requires renewed approval.

After approval:

1. Write only approved root adaptations.
2. Inspect every destination Claude path before installation; preserve conflicts until approved replacement.
3. Install selected skills and their complete dependencies atomically with `npx skills@1.7.4 add "$SOURCE_ROOT"`, using repeated `--skill NAME`, `--agent pi --agent opencode --agent claude-code --yes`. Do not use `--copy`; retain canonical directories and relative projections.
4. Do not pass rejected or removed skills to the installer. Preserve approved retained paths and reasons in `retainedFiles`.
5. Update this manager last. If its workflow, helper, catalog, or lock schema changed, stop and require a fresh run before relying on the new version.

Skills CLI owns `skills-lock.json`; do not hand-edit it. This workflow owns `.agents/ai-assets.lock.json`.

## Record and verify

Create selection JSON outside the target with selected skills, declined reasons, root files, adaptations, and approved retained paths/reasons. Never include credentials or personal/temporary absolute paths.

Generate a read-only record plan:

```sh
node "$SYNC_AGENT_ASSETS_HELPER" record \
  --root "$WORKSPACE_ROOT" --source-root "$SOURCE_ROOT" \
  --source-commit "$SOURCE_COMMIT" --repository "$SOURCE_REPOSITORY" \
  --ref "$SOURCE_REF" --selection "$SELECTION_FILE"
```

Review selection, roots, file count, complete lock, and plan ID. Rebuild the same command with `--apply --confirm --plan-id PLAN_ID` only after approval. It rejects source/target structural differences, dirty or changed source commits, unsafe or symlinked managed paths, missing files, stale plans, and invalid catalog/dependency state.

Run target validation and verify:

- `git diff --check` and only approved changes.
- Skill directory/frontmatter names, complete supporting files, and installed dependency closure.
- Pi/OpenCode discovery and exact Claude projections; distinguish static checks from live discovery.
- The shared import precedes Claude-specific instructions.
- Installer lock consistency and no secrets/personal paths in the managed lock.
- Managed status is clean immediately after recording:

```sh
node "$SYNC_AGENT_ASSETS_HELPER" status --root "$WORKSPACE_ROOT"
```

Report changed/installed/retained assets, source commit, actual checks and unrun limits, conflicts, rerun needs, and owner actions. Leave the workspace for the developer; do not publish automatically.

Clean the fetched temporary checkout only after validation and recording:

```sh
node "$SYNC_AGENT_ASSETS_HELPER" cleanup --source-root "$SOURCE_ROOT"
```
