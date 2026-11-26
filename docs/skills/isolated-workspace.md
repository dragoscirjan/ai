---
title: "isolated-workspace"
---

# isolated-workspace

Create a dedicated task branch or bookmark before repository edits. Choose the current checkout or an isolated Git worktree or Jujutsu workspace; ask the user when the location is unclear.

**Group:** [Utility](/groups/utility) · **Availability:** Authored here · **Scope:** project

## When to choose it

A modifying task needs a dedicated branch or bookmark and a choice between the current checkout and a separate workspace.

**Expected result:** A verified task branch or bookmark, explicit VCS, resolved base, selected working directory, and status. A separate workspace is optional.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/utility/isolated-workspace --skill isolated-workspace
```

This command selects only `isolated-workspace`.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use isolated-workspace to plan a new Git task branch change/example from main. Recommend the current checkout or a separate worktree, and ask if unclear. Show the selected setup before creating anything.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

- Requires Git or Jujutsu 0.38 or newer. The isolated path also requires Bun.

Create a task ref before edits in either location. Preserve unrelated work and existing refs. An isolated setup still needs its exact plan approval; a failed setup does not authorize switching locations.

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/utility/isolated-workspace/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
