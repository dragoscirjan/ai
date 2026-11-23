# Isolated workspace

`isolated-workspace` creates a dedicated task branch or Jujutsu change and bookmark, then verifies the selected working directory. The task may use the current checkout or a separate worktree/workspace. The agent selects the location from task requirements and repository state, and asks when the choice is unclear.

A new modifying task always needs its own task ref. Continuing the same task uses its verified existing ref. Read-only work needs neither a new ref nor a workspace. Each working directory has one writer.

## Current checkout

After selecting in-place work, follow [current-checkout setup](references/current-checkout.md). This path uses Git or Jujutsu directly and does not require Bun. Verify a clean starting point, create the task ref, and confirm the current ref and status before edits. Preserve unrelated changes and stop when ownership is unclear.

For isolated work, the automation below creates the task ref and workspace together. Existing refs may be attached or reused only for a verified continuation. The tracked task has one canonical integration directory; approved orchestration may create temporary sibling lanes beside it.

## Isolated-workspace automation

Only the isolated path uses the Bun-executed TypeScript automation:

- [`scripts/create.ts`](scripts/create.ts) plans, creates, attaches, repairs, or reuses a workspace.
- [`scripts/lib.ts`](scripts/lib.ts) provides shared argument, command, repository-discovery, path, and output helpers.
- [`scripts/create.test.ts`](scripts/create.test.ts) exercises Git, Jujutsu, collisions, mutation gates, and explicit selection in a colocated repository.

For this helper, the caller must provide:

```text
--vcs git|jj
--branch FULL_NAME
```

The VCS is never inferred. The script detects the primary local repository and derives a sibling `<repository>--workspaces` directory. The final component of the branch or bookmark becomes the workspace directory and Jujutsu workspace name. One writer owns each workspace.

The default mode emits a JSON plan and does not create a workspace. The plan includes a `planId`. Mutation requires `--apply`, `--confirm`, and that exact ID through `--plan-id`; the script rechecks the plan immediately before running commands.

## Examples

For the relative commands below, use this skill's directory inside the target checkout as the working directory. If the helper is outside that checkout, invoke its absolute path from the target checkout instead. Read the approval and safety gates in [`SKILL.md`](SKILL.md) before applying a plan.

Plan and then create a Git workspace:

```sh
bun scripts/create.ts --vcs git --branch change/issue-42 --base main
bun scripts/create.ts --vcs git --branch change/issue-42 --base main \
  --apply --confirm --plan-id PLAN_ID
```

Plan and then create a temporary Git lane from the explicit canonical ref:

```sh
bun scripts/create.ts --vcs git \
  --branch change/issue-42--lane-worker-a \
  --base change/issue-42
bun scripts/create.ts --vcs git \
  --branch change/issue-42--lane-worker-a \
  --base change/issue-42 \
  --apply --confirm --plan-id PLAN_ID
```

Use the same pattern with `--vcs jj`. Before creating or reusing a temporary lane, read [lane identity, ownership, and base requirements](references/orchestration-lanes.md).

Plan and then create a Jujutsu workspace and bookmark:

```sh
bun scripts/create.ts --vcs jj --branch change/issue-42 --base 'trunk()'
bun scripts/create.ts --vcs jj --branch change/issue-42 --base 'trunk()' \
  --apply --confirm --plan-id PLAN_ID
```

Run the tests from the repository root:

```sh
bun test ./.agents/skills/utility/isolated-workspace/scripts/create.test.ts
```

See [`SKILL.md`](SKILL.md) for the complete agent workflow and safety contract. Cleanup is handled separately by [`cleanup-workspaces`](../cleanup-workspaces/SKILL.md).
