# Install the skills you choose

Each [skill profile](/skills/) has a command that selects only that skill. You do not need to install the whole collection or use the personal manager.

## Before you start

All commands on this page need a working agent harness, Node.js 22.20 or newer, Git, and npm/npx. Follow the target project's branch, workspace, and approval rules before writes.

Installation downloads code and changes personal or project files. Review the source, destinations, and applicable approvals first. No credentials are required to inspect the public collection. Custom harness configuration directories need their own reviewed setup.

## Install one skill

Review the target project's instructions and the skill source first. Run the selected profile's command from the target project. For example, this command selects only `asd-ste100-technical`:

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/documentation/asd-ste100-technical --skill asd-ste100-technical
```

The URL names the actual grouped source directory. The installed skill keeps its ordinary name; the source category is not an installed namespace. The installer should report `asd-ste100-technical` as the selected skill. Follow its harness prompts and verify discovery in your chosen harness. Other profiles provide their own command, including pinned external sources where applicable.

Before using a skill, confirm that it and its declared instruction requirements are installed. If any are missing, the agent must stop, list the missing names, and ask you to install them. It must not install, synchronize, substitute, or continue without those instructions. Resume only after installation is confirmed and availability is verified.

Use each missing skill's own install command after reviewing its source and the target project's instructions. Direct Skills CLI installation does not install declared requirements automatically. Optional companions remain optional.

## Optional category installer

`sync-my-skills` is a personal, explicitly requested workflow. No other skill needs it as a prerequisite, companion, handoff, or recovery step. Missing instructions during another task are still a setup stop, not permission to run this workflow.

Install only the personal skill after reviewing its source:

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/agentic-work/sync-my-skills \
  --skill sync-my-skills --global --agent pi --yes
```

Select another supported agent instead of `pi` where appropriate. Expect the installer to identify only `sync-my-skills`. Reload the chosen harness and verify discovery. In Pi, invoke the skill explicitly with `/skill:sync-my-skills`. Optional command stubs are described in the [skill guide](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/agentic-work/sync-my-skills/README.md). Existing personal aliases may contain obsolete wizard instructions; review and approve any replacement.

The agent reads the YAML's six documentation categories and presents checkboxes. Each selected category includes all project-scoped members and prerequisites. It generates the catalogued commands, shows exact destinations and consequential changes, and waits for approval before running them directly. There is no custom sync script, manager parser setup, or plan ID.

After successful skill installation, the agent asks whether to review `AGENTS.md` and its dependencies for necessary updates. A decline or no necessary change means no instruction edits. Other changes require separate approval under existing target policy, not automatic adoption of a template bundle.

Verify actual installation and harness discovery. Generated commands, static files, and symlinks alone do not prove live behaviour. Legacy manager locks and unselected/custom content stay untouched; the Skills CLI owns any lock it creates. Source filtering, legal notices, adaptation requirements, tool setup, trust, and publication retain their own safeguards.

Use the [first useful request](/guide/first-use) next.
