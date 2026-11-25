# Review project instructions

`sync-my-agents` maintains `AGENTS.md` and the instruction documents it references. It does not synchronize skills, install dependencies, or require a fixed document bundle.

## Install and invoke

Review the skill and use a published repository ref containing it. With Node.js and npm/npx available:

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/agentic-work/sync-my-agents --skill sync-my-agents
```

This command installs into the project. Add `--global` only for an approved personal installation. With the repository CLI, use `--scope personal` for that explicit personal operation. Installation does not invoke the skill or authorize edits to instruction documents.

Load the skill explicitly in your agent and identify the project. For example:

```text
Use sync-my-agents to review AGENTS.md and its referenced instruction documents against this project. Inspect evidence, ask about unresolved decisions, and show exact diffs before editing. Do not install skills or copy a template bundle.
```

The review produces necessary document changes or explains why no change is needed. Confirm the exact diffs before the agent applies them. Approval of project facts is not approval of unseen policy changes.

## Dependencies and limits

Dependencies mean referenced instruction documents such as `CONTRIBUTING.md` and `VALIDATION.md`. Missing documents and cycles need an explicit decision; the agent must not invent missing instructions. Missing required skills stop the affected phase and require setup outside this skill.

The target project's branch, workspace, validation, security, and owner-approval rules still apply. Commits, publication, initializers, trust changes, merges, and releases are not part of this operation.

Use the separate [Node.js installation CLI](../../../../docs/guide/install.md) for skills. Legacy `sync-my-skills` installations and locks are not removed automatically.
