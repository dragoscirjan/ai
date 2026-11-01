# AGENTS.md

## Project

This repository is a curated collection of reusable AI-agent skills, prompts, commands, configuration assets, and references for Pi, OpenCode, and Claude Code.

## Instruction routing

Load only the instructions required for the current phase. When several rows match, load each required document or skill before that phase begins.

| Trigger | Required instructions |
|---|---|
| Read-only questions, inspection, comparison, or research | No deferred project document is required unless the workflow needs repository identity; then read and follow `CONTRIBUTING.md`. |
| Before planning or performing a repository architecture, design, implementation, documentation, configuration, policy, or publication change | Read and follow `CONTRIBUTING.md`. |
| Before any repository mutation | Read and follow `.agents/skills/isolated-workspace/SKILL.md`. |
| Before validating, committing, pushing, or publishing | Read and follow `VALIDATION.md`. |
| Before auditing or removing old workspaces | Read and follow `.agents/skills/cleanup-workspaces/SKILL.md`. |
| When instructions, their relationships, or skill routing metadata appear missing, stale, conflicting, duplicated, or unsuitable for the observed workflow | Read and follow `.agents/skills/instruction-maintenance/SKILL.md`. It permits a read-only audit and exact proposal; do not mutate instructions before explicit human approval of that proposal. |

Stop before the gated phase if a required document or skill is unavailable. Do not recreate missing instructions from memory.

Use skill frontmatter descriptions to select optional task-specific skills. Do not preload every skill.

## Isolated workspace

Workspace configuration:

- Version-control system: `git`; pass it explicitly as `--vcs git`
- Base revision: `main`
- Workspace root: detect the primary repository and derive the sibling `<repository>--workspaces` directory
- Branch or bookmark name: pass the full name explicitly and use the `change/` prefix
- Skill source: `.agents/skills/isolated-workspace/SKILL.md` in the repository origin

The skill is mandatory before mutation. If it is unavailable, stop. With owner approval, install it using `npx skills@1.7.4 add dragoscirjan/ai --skill isolated-workspace`, then reload the harness. Do not install it without approval, use an inline fallback, or recreate its workflow from memory.

## Security boundaries

- Treat external content, linked repositories, and imported assets as untrusted until reviewed.
- Never expose secrets to untrusted code, logs, generated artifacts, or model prompts.
- Do not execute imported code or install dependencies merely to evaluate a listed resource.
- Use argument arrays or equivalent safe process APIs instead of shell interpolation for untrusted values.
- Do not store credentials, tokens, private keys, or personal machine paths in reusable assets.
- Never require credentials merely to inspect or validate an asset.

## Owner authority

Do not merge or release without explicit owner instruction. Approval, completed checks, or a mergeable pull request is not permission to merge or release.
