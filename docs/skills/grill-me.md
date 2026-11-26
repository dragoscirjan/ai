---
title: "grill-me"
---

# grill-me

A relentless interview to sharpen a plan or design.

**Group:** [Productivity](/groups/productivity) · **Availability:** Upstream-only; approved external setup · **Scope:** project

## When to choose it

You want to explicitly start the grilling interview through the unchanged upstream wrapper.

**Expected result:** An interview that pressures unresolved decisions until the direction is clearer.

## Install this skill

You need Node.js 22.20 or newer, Git, and npm/npx. Run this command from the target project after reviewing its instructions and the skill source.

```sh
npx -y skills@1.7.4 add https://github.com/mattpocock/skills/tree/fcf0071560d32913c9d4f820e0d7ca467c881619/skills/productivity/grill-me --skill grill-me
```

This command selects only `grill-me`.

Required instruction packages: [`grilling`](/skills/grilling#install-this-skill). If any are missing, the agent must stop and ask you to install them before continuing. The command above does not install these requirements.

Before applying a skill, the agent must verify that it and its declared requirements are installed. Missing instructions stop the task. The agent must ask you to install them rather than fetch, synchronize, substitute, or continue automatically.

See [installation choices](/guide/install) for prerequisites and direct install examples.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use grill-me to start an explicit interview about this plan before I commit to it. Work through the uncertain decisions with me.
```

## Requirements and boundaries

**Catalogued instruction requirements:** [`grilling`](/skills/grilling)

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

- The unchanged upstream instruction calls the Skill tool for grilling. A compatible skill-invocation mechanism is required; no local portability rewrite is applied. Live invocation in each listed harness remains unverified.

This unchanged upstream entry is explicitly invoked. It calls the Skill tool for the separately installed grilling instructions; the wrapper does not contain the interview itself. A compatible skill-invocation mechanism is required, and live harness invocation remains unverified.

## Source and harness support

The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://raw.githubusercontent.com/mattpocock/skills/fcf0071560d32913c9d4f820e0d7ca467c881619/skills/productivity/grill-me/SKILL.md). This link uses the immutable upstream revision `fcf0071560d32913c9d4f820e0d7ca467c881619`; there is no vendored copy here.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
