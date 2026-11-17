---
title: "wait-what"
---

# wait-what

Explain the current proposal again with simpler language and missing context.

**Group:** [Discovery and planning](/groups/discovery) · **Availability:** Upstream-only; approved external setup · **Scope:** project

## When to choose it

The last answer is hard to understand or omits context needed to follow the current proposal.

**Expected result:** A clearer explanation with the missing context, plain technical language, and the project's existing vocabulary.

## Try it

Load the installed skill in your harness, then adapt this request to your project. This is a prompt, not a shell command.

```text
Use wait-what to explain your last answer again. Start with the missing context, use plain technical language and existing glossary terms, and ask about unavailable context. Do not edit files.
```

## Requirements and boundaries

**Catalogued instruction requirements:** None recorded in the catalog.

Resolve required instructions in their declared order before applying the skill. The project-specific `requires` extension is not a native harness installation guarantee. A missing requirement stops the affected phase; it does not authorize a download.

**Runtime and setup:**

No additional runtime is recorded in the catalog. Check the authoritative instructions and target project before use.

This explicitly invoked upstream entry requests clarification, not adversarial design review. Use GLOSSARY.md and GLOSSARY-MAP.md to resolve project vocabulary; ask about missing context rather than inventing it. Do not create a glossary or implement changes as a side effect.

## Useful combinations

- [`asd-ste100-technical`](/skills/asd-ste100-technical) — Technical instructions or explanations need plain language without losing conditions, risks, or precise identifiers.
- [`unslop`](/skills/unslop) — A draft contains generic phrasing, repetitive structure, filler, or claims that do not help the reader act.
- [`document-project`](/skills/document-project) — Implementation changes how readers use the project, or existing documentation blocks a real developer task.

These are optional companions, not extra declared requirements. Choose only what the task needs.

- [Research before choosing an approach](/workflows/research-a-decision)
- [Turn an idea into an outcome-level brief](/workflows/shape-an-initiative)
- [Challenge a plan without implementing it](/workflows/challenge-a-design)
- [Turn a completed issue into a small improvement](/workflows/learn-from-completed-work)
- [Ask for a clearer explanation](/workflows/re-pitch-an-explanation)

## Install or inspect

Start with the [reviewed installation guide](/guide/install). The catalog records this entry as **optional**, not as automatically selected for every project.

[Read the authoritative skill instructions](https://raw.githubusercontent.com/mattpocock/skills/d80fa0f4ebe0c5714af0adf8670336065233ecc6/skills/productivity/wait-what/SKILL.md). This link uses the immutable upstream revision `d80fa0f4ebe0c5714af0adf8670336065233ecc6`; there is no vendored copy here.

Supported catalog harnesses: `pi`, `opencode`, `claude-code`. Runtime availability and actual discovery must still be checked in your chosen harness.
