# Set up optional authoring skills

This setup is for contributors working in this repository. It is separate from the cross-project Node.js `sync-skills` CLI and from instruction-document maintenance.

## Review the installer

Read [`scripts/install-dev-skills.sh`](https://github.com/dragoscirjan/ai/blob/main/scripts/install-dev-skills.sh) and the [catalog](../../catalog/skill-catalog.yaml) before approving downloads. The Bash script groups external authoring skills by source and installs them from upstream `main` branches. Those inputs are mutable. Review and trust the sources before running them.

You need Bash 4 or newer, Node.js 24, npm/npx, and Git. From the repository root, after approving this setup:

```sh
bash scripts/install-dev-skills.sh
```

The script installs dependencies under the ignored `.agents/skills/external/<name>/` directory. It can move existing flat installations there; existing categorized adaptations and external-folder copies remain unchanged. It does not install globally or synchronize project instruction files. Reload the agent's skill discovery afterward, for example `/reload` in Pi.

Catalogued upstream instructions are installation requirements only when selected by the project or a skill's declared `requires` array. A catalog entry alone does not authorize a fetch. Missing required skills stop the affected workflow until the user arranges approved setup.

## Preserve source ownership

Use catalogued upstream sources for unchanged external skills. Do not silently edit ignored upstream copies and describe them as maintained source. Substantial adaptations need their own reviewed source and catalog provenance. Preserve supporting files and legal notices, and exclude unwanted provider metadata from managed outputs.

The maintained `code-review`, `grill-me`, and `tdd` variants now live in the categorized source directories. The authoring installer keeps those sources rather than downloading replacements when no older ignored copy is present. If an older copy under `.agents/skills/external/` duplicates a maintained skill, inspect and preserve it outside discovery or approve its exact removal before reloading. Do not discard local changes or keep two discovered copies of the same name.

The Node.js CLI copies reviewed variants directly; it does not adapt instructions or call an LLM during synchronization. New upstream versions need normal source review before a maintained update is published. The guard against future unprepared remote adaptations stays in place.

## Check skill independence

Review each complete portable package, not only its SKILL.md. Cross-skill names, links, helper imports, and invocation examples must refer only to self or declared requirements. Keep source attribution, legal notices, same-package references, and relevant software/runtime documentation. Collection setup and migration history belong in repository documentation, not skill packages or individual profiles. Do not add dependencies merely to keep a recommendation. Source checks and acquired-package verification enforce this boundary.

## Check and recover

Run the network-free installer tests from the repository root:

```sh
node --test scripts/install-dev-skills.test.mjs
```

If a source or command fails, inspect the reported installation and missing skill. Do not substitute another skill, initialize tools, change trust, or rerun installations without the necessary approval. The retired `sync-my-skills` manager, its parser setup, and its personal commands are not required by this authoring installer.
