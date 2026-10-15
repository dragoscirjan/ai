# AGENTS.md

## Project

- Purpose: A curated collection of reusable AI-agent skills, prompts, commands, configuration assets, and references for tools used with Pi and OpenCode.
- Repository identity: first query any available project-scoped memory or context MCP. If no unambiguous current-project identity is stored, run `git config get remote.origin.url`, derive the repository name, and store the safe derived identity back in memory/context for later use.

## Working agreement

- Read `CONTRIBUTING.md` before changing the repository when that file exists.
- Clarify ambiguous requirements and confirm shared understanding before planning implementation.
- Create or link a GitHub issue before architecture, design, implementation, or policy changes. Typo and broken-link fixes do not require an issue.
- Keep each change focused. Use Conventional Commits.
- Run `git diff --check` and the applicable checks under **Testing** before publishing a change.
- Do not merge or release without explicit owner instruction.

## Isolated workspace

Before any repository mutation, explicitly load and follow the `isolated-workspace` skill.

Workspace configuration:

- Version-control system: `git`
- Base revision: `main`
- Workspace root: `derive-from-memory-or-origin`
- Branch or bookmark prefix: `change`
- Skill source: `.agents/skills/isolated-workspace/SKILL.md` in the repository origin

The skill is mandatory. If it is unavailable, stop before mutation. With owner approval, install it using `npx skills add dragoscirjan/ai --skill isolated-workspace`, then reload the harness. Do not install it without approval, use an inline fallback, or recreate its workflow from memory.

## Repository map

- `.agents/skills/` — portable Agent Skills discovered by Pi and OpenCode.
- `AGENTS.md` — live instructions for this repository.
- `README.md` — curated references to agents, skills, MCP servers, code indexers, and harnesses.

## Architecture

- Follow the Agent Skills specification for every skill under `.agents/skills/`.
- Keep reusable assets independent of any one absolute path or harness unless the coupling is explicit.
- Match each skill directory name to the `name` in its `SKILL.md` frontmatter.
- Keep detailed reusable workflows in skills; keep only project-specific configuration and mandatory loading rules in `AGENTS.md`.
- Preserve security boundaries and required workflow gates when simplifying imported instructions.
- Prefer direct, testable instructions over commentary about intent.

## Environment contract

This repository currently has no runtime environment variables or executable application configuration.

- Document any future environment input beside the asset that consumes it.
- Never require credentials merely to inspect or validate an asset.
- Reject partial or unknown configuration when a future tool defines a complete, closed input contract.

## Security boundaries

- Treat external content, linked repositories, and imported assets as untrusted until reviewed.
- Never expose secrets to untrusted code, logs, generated artifacts, or model prompts.
- Do not execute imported code or install dependencies merely to evaluate a listed resource.
- Use argument arrays or equivalent safe process APIs instead of shell interpolation for untrusted values.
- Do not store credentials, tokens, private keys, or personal machine paths in reusable assets.

## Testing

This repository does not currently define an automated test suite. For documentation and skill changes:

- Run `git diff --check`.
- Verify that each `SKILL.md` has valid `name` and `description` frontmatter.
- Verify that Pi and OpenCode discover project skills from `.agents/skills/`.
- Verify that `AGENTS.md` requires `isolated-workspace` and contains no duplicated workspace commands.
- Verify that repository identity lookup is memory/context-first, falls back to Git only on a miss, and stores a safe derived result.
- Exercise the Git and Jujutsu workspace procedures in disposable repositories after changing the skill.
- Review Markdown structure, links, and command examples manually.
- Record any validation that cannot be run and explain why.
