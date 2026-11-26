---
title: "unslop"
---

# unslop

Remove AI-generated prose patterns while preserving meaning.

**Group:** [Documentation](/groups/documentation) · **Availability:** Upstream-only; approved external setup · **Scope:** project

## When to choose it

A draft contains generic phrasing, repetitive structure, filler, or claims that do not help the reader act.

**Expected result:** Cleaner, more specific writing that retains the original facts and necessary constraints.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/cursor/plugins/tree/bc697d0a5a163cec979e362b601e36f5616083fd/pstack/skills/unslop --skill unslop
```

This command selects only `unslop`.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use unslop on this draft. Remove generic framing and repetition, retain necessary detail, and flag unsupported claims instead of polishing them into facts.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

This upstream-only entry is marked for explicit invocation. Do not assume automatic model selection, or confuse an editing pass with factual verification or authorization to change project policy.

## Source and harness support

The catalog records this entry as **recommended**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://raw.githubusercontent.com/cursor/plugins/bc697d0a5a163cec979e362b601e36f5616083fd/pstack/skills/unslop/SKILL.md). This link uses the immutable upstream revision `bc697d0a5a163cec979e362b601e36f5616083fd`; there is no vendored copy here.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
