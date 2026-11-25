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

The Node.js CLI stops for remote entries that require semantic adaptation. The authoring installer does not turn raw upstream inputs into approved target-project adaptations.

## Check and recover

Run the network-free installer tests from the repository root:

```sh
node --test scripts/install-dev-skills.test.mjs
```

If a source or command fails, inspect the reported installation and missing skill. Do not substitute another skill, initialize tools, change trust, or rerun installations without the necessary approval. The retired `sync-my-skills` manager, its parser setup, and its personal commands are not required by this authoring installer.
