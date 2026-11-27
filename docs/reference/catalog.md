---
title: "Catalog reference"
---

# Catalog reference

The [YAML catalog](https://github.com/dragoscirjan/ai/blob/main/catalog/skill-catalog.yaml) owns names, sources, selection defaults, runtime notes, installation mechanisms, and legal records. This site adds learning prose and presentation groups; it does not replace that inventory.

## Availability

- **Authored here:** this repository maintains the skill.
- **Upstream-derived; maintained here:** use the maintained local copy, not an assumed unchanged upstream replacement.
- **Upstream-only:** the catalog points to an immutable external source. Listing it does not install it.
- **Pinned upstream input; adaptation required:** the catalog records immutable input and an adaptation recipe. Review the adapted output and legal notices before use.

| Skill | Availability | Selection default |
| --- | --- | --- |
| [`archify`](/skills/archify) | Upstream-only; approved external setup | optional |
| [`asd-ste100-technical`](/skills/asd-ste100-technical) | Authored here | recommended |
| [`caveman`](/skills/caveman) | Authored here | optional |
| [`cleanup-workspaces`](/skills/cleanup-workspaces) | Authored here | optional |
| [`code-review`](/skills/code-review) | Upstream-derived; maintained here | optional |
| [`coding`](/skills/coding) | Authored here | detected |
| [`coding-with-rules`](/skills/coding-with-rules) | Authored here | optional |
| [`debloat`](/skills/debloat) | Authored here | optional |
| [`grilling`](/skills/grilling) | Upstream-only; approved external setup | optional |
| [`document-project`](/skills/document-project) | Authored here | recommended |
| [`excalidraw`](/skills/excalidraw) | Authored here | optional |
| [`grill-me`](/skills/grill-me) | Upstream-only; approved external setup | optional |
| [`init-project`](/skills/init-project) | Authored here | initializer |
| [`initiative`](/skills/initiative) | Authored here | optional |
| [`instruction-maintenance`](/skills/instruction-maintenance) | Authored here | optional |
| [`isolated-workspace`](/skills/isolated-workspace) | Authored here | optional |
| [`plan-tasks`](/skills/plan-tasks) | Authored here | optional |
| [`research`](/skills/research) | Authored here | optional |
| [`retro`](/skills/retro) | Authored here | optional |
| [`scaffold`](/skills/scaffold) | Authored here | optional |
| [`specify`](/skills/specify) | Authored here | optional |
| [`background-agents`](/skills/background-agents) | Authored here | optional |
| [`sync-my-agents`](/skills/sync-my-agents) | Authored here | optional |
| [`systematic-debugging`](/skills/systematic-debugging) | Upstream-derived; maintained here | optional |
| [`tdd`](/skills/tdd) | Upstream-derived; maintained here | optional |
| [`unslop`](/skills/unslop) | Upstream-only; approved external setup | recommended |
| [`wait-what`](/skills/wait-what) | Upstream-derived; maintained here | optional |
| [`writing-for-agents`](/skills/writing-for-agents) | Upstream-only; approved external setup | optional |

A recommended default is not approval. A declined skill stays unchanged; policy already active in the target project still applies. Read each profile for runtime setup and its authoritative source.

## What the harness labels mean

The catalog targets Pi, OpenCode, and Claude Code. That expresses intended compatibility, not proof of live discovery, every harness capability, or model compliance. The manager uses harness-specific adapters; custom configuration roots need separate verification.

## What is not a skill

Language and extension documents under `coding-with-rules/references/` are conditional references, not separate installable skills. Shared helper code and package dependencies are software dependencies, not instruction `requires` edges.
