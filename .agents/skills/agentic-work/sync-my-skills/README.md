# Sync selected skill categories

Use this personal skill to choose categories, approve catalog-generated commands, and install their skills. It uses the Skills CLI directly. There is no custom synchronization engine, parser setup, plan ID, or manager-owned lock.

## Install and invoke

You need Node.js 22.20 or newer, npm/npx, Git, and a harness with native checkbox controls. Review the source before approving installation:

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/agentic-work/sync-my-skills --skill sync-my-skills --global --agent pi --yes
```

Choose the appropriate agent instead of `pi` for another harness. Reload its resources and invoke the installed skill. Source changes in an uncommitted checkout are not part of the published installation.

For an optional Pi prompt alias, review `assets/commands/pi.md` before copying it to your personal prompts directory. OpenCode has its own small command stub. Existing aliases may contain obsolete workflow instructions; review and approve their replacement rather than overwriting personal configuration automatically.

## What happens

1. The agent reads the bundled YAML and the project's existing rules, then offers its six category checkboxes. Selecting a category includes all project-scoped members and prerequisites. There is no per-skill menu.
2. The agent generates the catalogued install commands, explains exact destinations and required adaptations, and asks for approval. After approval, it executes those commands directly and verifies the result.
3. Only after successful skill installation does it ask whether to review `AGENTS.md` and its dependencies. A decline or no necessary change means no instruction edits. Necessary edits require their own approval.

Skipped content, custom skills, and legacy manager locks remain untouched. The Skills CLI owns any lock it creates. Existing target rules determine task branches, working locations, checks, and approvals. Installation does not authorize running installed scripts, initializing tools or sites, granting trust, or publishing.

If an installer cannot satisfy catalogued filters, legal files, or adaptation requirements, stop for a reviewed resolution. Do not bypass those requirements or invent another installer. Never report a generated command as executed, or static inspection as live harness verification.

## Maintain the inventory

[skill-catalog.yaml](assets/skill-catalog.yaml) is the only category and membership inventory. Documentation derives its groups from it. [The schema](assets/skill-catalog.schema.json) defines the data contract. Keep source pins, command argument arrays, prerequisites, notices, and adaptation intent current.

Run the existing repository documentation/catalog checks when changing the inventory. No installation is needed to validate it. The [external authoring notes](references/external-skills.md) concern maintaining this repository, not the runtime sync workflow.

The full refactor continues [#95](https://github.com/dragoscirjan/ai/issues/95) on its existing branch. It replaces the retired script-driven manager; it does not migrate old custom lock data or update personal installations automatically.
