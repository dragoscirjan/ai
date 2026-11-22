# External authoring dependencies

Use these project-local skills when maintaining this repository's skills and documentation. They are not global installations or published copies of upstream skills.

## Install for this checkout

You need Bash 4 or newer, Node.js 24, npm/npx, and network access. Review the installer and catalogued upstream sources before running it. The script downloads packages but does not execute the installed skills' supporting scripts.

From this repository's root, run:

```sh
bash scripts/install-dev-skills.sh
```

The installer is plain Bash. It groups skills by Matt Pocock and Cursor, then uses `for` loops with `npx -y skills@1.7.4 add` against each source's `main` branch. After installation, it moves each directory into `.agents/skills/external/`. It does not run embedded Node code, parse YAML, install the manager's parser, or start synchronization.

This repository-local setup intentionally uses current `main`, not commit hashes. The catalog keeps its pinned revisions for synchronization to other projects and is not changed by this installer. Since `main` changes, installations made at different times can differ. Existing copies are preserved rather than upgraded.

The selected dependencies are:

| Skill | Purpose in this repository |
|---|---|
| `grilling` | Supply the interview instructions required by the productivity skills. |
| `unslop` | Remove unwanted prose patterns from skills and documentation. |
| `writing-for-agents` | Review and write agent-facing instructions. |
| `code-review` | Review changes against standards and requirements. |
| `grill-me` | Start an explicitly requested interview. |
| `tdd` | Support explicitly selected test-first work. |

The CLI first installs missing skills flat under `.agents/skills/<name>/` in this checkout, with `--agent pi` and no `--global`. The Bash script moves them to `.agents/skills/external/<name>/`. Pi discovers that nested location recursively. Run `/reload` in an existing Pi session, then use `/skill:<name>` to invoke an installed skill explicitly.

Existing flat installations move into `external/` without reinstalling or changing their skill instructions. Existing categorized adaptations stay in place and are not duplicated. Existing `external/` copies stay unchanged. The installer does not refresh versions or apply semantic adaptations. Upstream provider metadata at `agents/openai.yaml` is removed from copies before moving them. Other installed supporting files remain intact.

The repository ignores `external/`, the six transient flat dependency directories, `skills-lock.json`, and `node_modules/`. The Skills CLI owns its lock. These dependencies do not belong in commits or pushes. Each Git worktree has its own local installations.

The CLI records its original flat destinations. Do not rely on `skills update` or `skills remove` to manage the moved copies. For an approved refresh, preserve local adaptations, remove only the selected external copy, and rerun this installer.

The existing tracked, categorized adaptations are not removed by this installer. Their approved migration to local-only copies is separate work. Adding an ignore rule does not untrack a committed file.

That migration also needs source-inventory filtering for ignored dependencies. Until then, source-coverage checks can report `Catalog coverage differs from local skill directories` after local installation. Do not relax those checks as part of this setup script.

## Configure invocation ownership

Use these settings for the six selected external authoring skills in this repository. In another project, propose them in the reviewed plan and follow that project's instructions and approval requirements. This table does not authorize changes to another project.

| External skill | Invocation owner | `disable-model-invocation` |
|---|---|---|
| `code-review` | Human | `true` |
| `grill-me` | Human | `true` |
| `tdd` | Human | `true` |
| `grilling` | LLM | Omit |
| `writing-for-agents` | LLM | Omit |
| `unslop` | LLM | Omit |

Human-selected skills remain available through explicit commands. LLM-discoverable skills advertise their descriptions; their full instructions load only when needed. Visibility does not authorize reviews, interviews, edits, or other operations.

Apply the settings only during an approved local configuration step, after installation or during a reviewed refresh:

1. Confirm the skill is selected and installed at `.agents/skills/external/<name>/SKILL.md`. Do not install an extra skill to complete this table.
2. For a Human row, add or set exactly one top-level `disable-model-invocation: true` field in its frontmatter. For an LLM row, remove that field entirely. Do not delete the description to hide a skill.
3. Keep every other frontmatter value and the skill body unchanged. Preserve existing local edits. These settings are reviewed local adaptations, not automatic installer actions.
4. For an external skill not listed here, preserve its current setting and ask the owner to choose before changing it. Do not infer an invocation owner from its upstream default.
5. In Pi, reload resources with `/reload` and verify that Human rows are absent from the advertised descriptions but remain available explicitly, while LLM rows are discoverable. Inspect discovery without launching the workflows. Verify support separately in other harnesses.

A refresh can restore upstream defaults. Recheck these six settings during the approved adaptation review rather than assuming they survived reinstallation.

## Modify a local dependency

Only change an external skill to support work on this repository's existing skills and documentation. Do not publish that modified copy or replace authored skills with it.

1. Keep the Skills CLI's source record. Preserve attribution, legal notices, required supporting files, and prerequisites.
2. Follow the selected entry's `adaptation.instructions` and `adaptation.review` in the catalog. Record any additional local adaptation here before relying on it. Do not edit an external copy that is still tracked as part of the installer setup.
3. Apply the [invocation ownership settings](#configure-invocation-ownership) for each selected external skill during its approved configuration step.
4. Keep reviews read-only and preserve the existing approval, workspace, delegation, and publication boundaries. A review may identify refactoring; implementation still requires authorization.
5. Keep the external content ignored. Commit only authored assets, source/version records, and reviewed adaptation instructions.
6. Run `/reload` and verify the intended skill is available. Report actual discovery separately from source inspection or assumed model behavior.

## Check or troubleshoot setup

Run the network-free installer tests:

```sh
node --test scripts/install-dev-skills.test.mjs
```

The installer tests stub downloads and reject direct `node` or `npm` calls. They check the source groups and `main` URLs, moves into `external/`, preserved installations, missing output, repeat runs, failure between source groups, and symlink protection. They do not need the manager's parser. These tests do not prove upstream availability or live Pi discovery.

If a download fails, resolve the reported network or source error and rerun the command. Successful earlier installations remain intact. Keep the source groups pointed at `main`. The installer does not install or require the manager's parser.

If Pi does not list a newly installed skill, confirm `.agents/skills/external/<name>/SKILL.md` exists in the checkout where Pi is running, review startup diagnostics and project trust, then run `/reload`. A skill with `disable-model-invocation: true` is not advertised to the model; invoke it explicitly with `/skill:<name>`.
