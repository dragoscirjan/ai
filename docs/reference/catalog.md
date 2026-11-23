---
title: "Catalog reference"
---

# Catalog reference

The [YAML catalog](https://github.com/dragoscirjan/ai/blob/main/.agents/skills/agentic-work/sync-my-skills/assets/skill-catalog.yaml) owns categories, membership, names, sources, runtime notes, installation mechanisms, and legal records. This site adds learning prose and presentation groups; it does not replace that inventory.

## Availability

- **Authored here:** this repository maintains the skill.
- **Upstream-derived; maintained here:** use the maintained local copy, not an assumed unchanged upstream replacement.
- **Upstream-only:** the catalog points to an immutable external source. Listing it does not install it.
- **Pinned upstream input; adaptation required:** the catalog records immutable input and an adaptation recipe. Review the adapted output and legal notices before use.

| Skill | Availability | Selection default |
| --- | --- | --- |
| [`initiative`](/skills/initiative) | Authored here | undefined |
| [`research`](/skills/research) | Authored here | undefined |
| [`specify`](/skills/specify) | Authored here | undefined |
| [`plan-tasks`](/skills/plan-tasks) | Authored here | undefined |
| [`retro`](/skills/retro) | Authored here | undefined |
| [`grill-me`](/skills/grill-me) | Pinned upstream input; adaptation required | undefined |
| [`grilling`](/skills/grilling) | Upstream-only; approved external setup | undefined |
| [`wait-what`](/skills/wait-what) | Upstream-only; approved external setup | undefined |
| [`coding`](/skills/coding) | Authored here | undefined |
| [`coding-with-rules`](/skills/coding-with-rules) | Authored here | undefined |
| [`scaffold`](/skills/scaffold) | Authored here | undefined |
| [`code-review`](/skills/code-review) | Pinned upstream input; adaptation required | undefined |
| [`systematic-debugging`](/skills/systematic-debugging) | Upstream-derived; maintained here | undefined |
| [`tdd`](/skills/tdd) | Pinned upstream input; adaptation required | undefined |
| [`debloat`](/skills/debloat) | Authored here | undefined |
| [`asd-ste100-technical`](/skills/asd-ste100-technical) | Authored here | undefined |
| [`caveman`](/skills/caveman) | Authored here | undefined |
| [`document-project`](/skills/document-project) | Authored here | undefined |
| [`unslop`](/skills/unslop) | Upstream-only; approved external setup | undefined |
| [`excalidraw`](/skills/excalidraw) | Authored here | undefined |
| [`archify`](/skills/archify) | Upstream-only; approved external setup | undefined |
| [`writing-for-agents`](/skills/writing-for-agents) | Pinned upstream input; adaptation required | undefined |
| [`sync-my-skills`](/skills/sync-my-skills) | Authored here | undefined |
| [`init-project`](/skills/init-project) | Authored here | undefined |
| [`isolated-workspace`](/skills/isolated-workspace) | Authored here | undefined |
| [`cleanup-workspaces`](/skills/cleanup-workspaces) | Authored here | undefined |
| [`instruction-maintenance`](/skills/instruction-maintenance) | Authored here | undefined |
| [`subagent-orchestration`](/skills/subagent-orchestration) | Authored here | undefined |

A recommended default is not approval. A declined skill stays unchanged; policy already active in the target project still applies. Read each profile for runtime setup and its authoritative source.

## What the harness labels mean

The catalog targets Pi, OpenCode, and Claude Code. That expresses intended compatibility, not proof of live discovery, every harness capability, or model compliance. The manager uses harness-specific adapters; custom configuration roots need separate verification.

## What is not a skill

Language and extension documents under `coding-with-rules/references/` are conditional references, not separate installable skills. Shared helper code and package dependencies are software dependencies, not instruction `requires` edges.
