# AI agent assets

This repository contains reusable skills, instructions, configuration assets, and references for AI coding agents. The assets target Pi and OpenCode, while portable skills follow the Agent Skills format.

## Skills

| Skill | Purpose |
|---|---|
| [`cleanup-workspaces`](.agents/skills/cleanup-workspaces/SKILL.md) | Audit and safely remove integrated Git worktrees and Jujutsu workspaces. |
| [`asd-ste100-technical`](.agents/skills/asd-ste100-technical/SKILL.md) | Apply ASD-STE100-inspired plain language to developer-facing prose without losing technical precision. |
| [`coding`](.agents/skills/coding/SKILL.md) | Apply project-first design, security, testing, and quality gates to code changes in any language. |
| [`coding-js`](.agents/skills/coding-js/SKILL.md) | Apply JavaScript guidance and project-first quality gates to `.js` files. |
| [`coding-mjs`](.agents/skills/coding-mjs/SKILL.md) | Add ECMAScript-module semantics for `.mjs` files. |
| [`coding-cjs`](.agents/skills/coding-cjs/SKILL.md) | Add CommonJS semantics for `.cjs` files. |
| [`coding-jsx`](.agents/skills/coding-jsx/SKILL.md) | Add framework-neutral JSX rendering, security, and accessibility guidance. |
| [`coding-ts`](.agents/skills/coding-ts/SKILL.md) | Apply TypeScript typing, runtime-boundary, and quality-gate guidance to `.ts` files. |
| [`coding-mts`](.agents/skills/coding-mts/SKILL.md) | Add TypeScript ECMAScript-module semantics for `.mts` files. |
| [`coding-cts`](.agents/skills/coding-cts/SKILL.md) | Add TypeScript CommonJS semantics for `.cts` files. |
| [`coding-tsx`](.agents/skills/coding-tsx/SKILL.md) | Add framework-neutral TSX typing, rendering, security, and accessibility guidance. |
| [`coding-c`](.agents/skills/coding-c/SKILL.md) | Apply C ownership, memory-safety, portability, and project-first quality-gate guidance. |
| [`coding-cpp`](.agents/skills/coding-cpp/SKILL.md) | Apply modern C++ lifetime, ownership, type-safety, portability, and project-first quality-gate guidance. |
| [`coding-rs`](.agents/skills/coding-rs/SKILL.md) | Apply Rust ownership, unsafe-boundary, API-compatibility, supply-chain, and project-first quality-gate guidance. |
| [`coding-zig`](.agents/skills/coding-zig/SKILL.md) | Apply Zig allocation, cleanup, low-level safety, compiler-compatibility, and project-first quality-gate guidance. |
| [`grill-me`](.agents/skills/grill-me/SKILL.md) | Start an explicit grilling interview. |
| [`grilling`](.agents/skills/grilling/SKILL.md) | Interview a user until a plan or decision has no unresolved branches. |
| [`isolated-workspace`](.agents/skills/isolated-workspace/SKILL.md) | Create or reuse a protected change workspace before repository mutation. |
| [`instruction-maintenance`](.agents/skills/instruction-maintenance/SKILL.md) | Diagnose instruction drift, propose an exact adaptation, and wait for human approval before mutation. |
| [`unslop`](.agents/skills/unslop/SKILL.md) | Remove common AI writing patterns from an existing draft. |

## Use the skills

Pi and OpenCode discover project skills from `.agents/skills/` when they run inside this repository.

Install one skill into another project with the Skills CLI:

```sh
npx skills add dragoscirjan/ai --skill isolated-workspace
```

Replace `isolated-workspace` with the required skill name. Review a skill and its supporting files before installing or trusting it.

## Repository map

- [`.agents/skills/`](.agents/skills/) contains portable Agent Skills.
- [`AGENTS.md`](AGENTS.md) contains the small startup routing and safety contract for coding agents.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) contains contribution policy loaded before actionable change planning.
- [`VALIDATION.md`](VALIDATION.md) contains checks loaded before validation or publication.
- [`RESOURCES.md`](RESOURCES.md) contains the curated list of external tools and references.

## Contribute

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before planning a repository change. Run the applicable checks in [`VALIDATION.md`](VALIDATION.md) before publishing it.

Do not merge or release without explicit owner instruction.
