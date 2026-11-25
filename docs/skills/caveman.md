---
title: "caveman"
---

# caveman

Concise communication that preserves complete technical substance.

**Group:** [Documentation](/groups/documentation) · **Availability:** Authored here · **Scope:** project

## When to choose it

You explicitly want terse technical fragments and your project policy permits that style.

**Expected result:** A fragment-style answer that preserves technical substance. The mode stays active until you explicitly disable it.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/dragoscirjan/ai/tree/main/.agents/skills/documentation/caveman --skill caveman
```

This command selects only `caveman`.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use caveman mode for this summary where project policy permits fragments. Preserve commands, evidence, constraints, risks, and uncertainty. Expand when safety or ordered instructions need it.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

This mode drops articles and uses fragments. It is an alternative to ASD and Unslop whole-sentence guidance, not a finishing pass after them. Disable Caveman before returning to a whole-sentence route. Never use style to override project policy or omit safety details.

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/documentation/caveman/SKILL.md). This link follows the source repository's configured catalog ref; the maintained local copy is the documented entry.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
