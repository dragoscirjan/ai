# External authoring dependencies

Use these project-local skills when maintaining this repository's skills and documentation. They are not global installations or published copies of upstream skills.

## Install for this checkout

You need Bash 4 or newer, Node.js 24, npm/npx, and network access. Review the installer and catalogued upstream sources before running it. The script downloads packages but does not execute the installed skills' supporting scripts.

From this repository's root, run:

```sh
bash scripts/install-dev-skills.sh
```

The installer reads pinned revisions and upstream paths from `../assets/skill-catalog.yaml` through the manager's strict parser. If the parser is absent, it first runs `npm ci --ignore-scripts` in the manager package. It does not refresh the catalog, install the personal manager, or start synchronization.

The selected dependencies are:

| Skill | Purpose in this repository |
|---|---|
| `grilling` | Supply the interview instructions required by the productivity skills. |
| `unslop` | Remove unwanted prose patterns from skills and documentation. |
| `writing-for-agents` | Review and write agent-facing instructions. |
| `code-review` | Review changes against standards and requirements. |
| `grill-me` | Start an explicitly requested interview. |
| `systematic-debugging` | Diagnose failures before changing behavior. |
| `tdd` | Support explicitly selected test-first work. |

Missing skills install flat under `.agents/skills/<name>/` in this checkout, with `--agent pi` and no `--global`. Pi discovers that location. Run `/reload` in an existing Pi session, then use `/skill:<name>` to invoke an installed skill explicitly.

The installer preserves existing flat installations and catalogued categorized adaptations. It does not refresh versions or apply semantic adaptations. Re-running it fills missing dependencies without overwriting local edits. Upstream provider metadata at `agents/openai.yaml` is removed from newly installed copies. Other installed supporting files remain intact.

The repository ignores the seven flat dependency directories, `skills-lock.json`, and `node_modules/`. The Skills CLI owns its lock. These dependencies do not belong in commits or pushes. Each Git worktree has its own local installations.

The existing tracked, categorized adaptations are not removed by this installer. Their approved migration to local-only copies is separate work. Adding an ignore rule does not untrack a committed file.

## Modify a local dependency

Only change an external skill to support work on this repository's existing skills and documentation. Do not publish that modified copy or replace authored skills with it.

1. Preserve the catalogued upstream revision, attribution, legal notices, required supporting files, and prerequisites.
2. Follow the selected entry's `adaptation.instructions` and `adaptation.review` in the catalog. Record any additional local adaptation here before relying on it. Do not edit an external copy that is still tracked as part of the installer setup.
3. For local-only `code-review`, `grill-me`, and `tdd`, use `disable-model-invocation: true`. Keep `systematic-debugging`, `writing-for-agents`, and the shared `grilling` instructions model-discoverable by omitting that property. Preserve upstream `unslop` as an explicit command. These are local adaptation instructions, not automatic installer actions.
4. Keep reviews read-only and preserve the existing approval, workspace, delegation, and publication boundaries. A review may identify refactoring; implementation still requires authorization.
5. Keep the external content ignored. Commit only authored assets, source/version records, and reviewed adaptation instructions.
6. Run `/reload` and verify the intended skill is available. Report actual discovery separately from source inspection or assumed model behavior.

## Check or troubleshoot setup

Run the network-free installer tests:

```sh
node --test scripts/install-dev-skills.test.mjs
```

The tests stub downloads and parser setup. They cover repository-local destinations, pinned URLs, existing installations, catalog failures, missing output, and repeat runs. They do not prove upstream availability or live Pi discovery.

If a download fails, resolve the reported network or source error and rerun the command. Successful earlier installations remain intact. If parser setup fails, check the manager package's Node.js requirement and npm error before retrying. Do not disable lifecycle-script restrictions or switch to unpinned sources.

If Pi does not list a newly installed skill, confirm `.agents/skills/<name>/SKILL.md` exists in the checkout where Pi is running, review startup diagnostics and project trust, then run `/reload`. A skill with `disable-model-invocation: true` is not advertised to the model; invoke it explicitly with `/skill:<name>`.
