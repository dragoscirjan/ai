---
title: "cleanup-workspaces"
---

# cleanup-workspaces

Audit integrated Git/Jujutsu workspaces, stale registrations, or authorized temporary lanes; apply only an approved exact cleanup plan.

**Group:** [Utility](/groups/utility) · **Availability:** Authored here · **Scope:** project

## When to choose it

You want to audit integrated workspaces, stale registrations, or explicitly authorized temporary lanes.

**Expected result:** An evidence-based cleanup plan, followed only by the exact approved removals and a post-cleanup audit.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/utility/cleanup-workspaces --skill cleanup-workspaces
```

This command selects only `cleanup-workspaces`.

Required instruction packages: [`isolated-workspace`](/skills/isolated-workspace#install-this-skill). If any are missing, the agent must stop and ask you to install them before continuing. The command above does not install these requirements.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use cleanup-workspaces to audit this repository. Show eligible and retained workspaces, exact paths and tips, and the plan ID. Do not remove anything yet.
```

## Requirements and boundaries

**Catalogued instruction requirements:** [`isolated-workspace`](/skills/isolated-workspace)

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

- Requires Bun and either Git with worktree support or Jujutsu 0.38 or newer with workspace support.

Resolve isolated-workspace first. Dirty, uncertain, or unproven lanes remain protected; audit permission is not removal permission. Never infer integration from a similar or squash-shaped diff alone.

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/utility/cleanup-workspaces/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
