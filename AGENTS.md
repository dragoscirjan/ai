# AGENTS.md

## Project

This repository is a curated collection of reusable AI-agent skills, prompts, commands, configuration assets, and references for Pi, OpenCode, and Claude Code.

## Instruction routing

Load only the instructions required for the current phase. When several rows match, load each required document or skill before that phase begins.

| Trigger | Required instructions |
|---|---|
| Read-only questions, inspection, comparison, or research | No deferred project document is required unless the workflow needs repository identity; then read and follow `CONTRIBUTING.md`. |
| Before planning or performing a repository architecture, design, implementation, documentation, configuration, policy, or publication change | Read and follow `CONTRIBUTING.md`. |
| Before any repository mutation | Read and follow `.agents/skills/utility/isolated-workspace/SKILL.md`. |
| Before designing, changing, testing, or reviewing source code | Read `coding-with-rules` and follow its language and extension reference selection. Resolve its declared requirements first. |
| During implementation, and before creating or revising project documentation | Read and follow `document-project`, `asd-ste100-technical`, and `unslop`. Assess documentation impact and update affected documentation in the same change. |
| Before delegating work to child agents | Read and follow `.agents/skills/unpolished/subagent-orchestration/SKILL.md`. |
| Before validating, committing, pushing, or publishing | Read and follow `VALIDATION.md`. |
| Before auditing or removing old workspaces | Read and follow `.agents/skills/utility/cleanup-workspaces/SKILL.md`. |
| When instructions, their relationships, or skill routing metadata appear missing, stale, conflicting, duplicated, or unsuitable for the observed workflow | Read and follow `.agents/skills/unpolished/instruction-maintenance/SKILL.md`. It permits a read-only audit and exact proposal; do not mutate instructions before explicit human approval of that proposal. |

Stop before the gated phase if a required document or skill is unavailable. Do not recreate missing instructions from memory.

Use skill frontmatter descriptions to select task-specific skills; do not preload every skill. Before applying a selected skill, inspect its frontmatter and resolve its `requires` skills recursively in array order, then apply the selected skill. Names may resolve to local skills or installed external skills registered in `.agents/skills/agentic-work/sync-my-skills/assets/skill-catalog.yaml`. A catalog entry identifies a source; it does not count as an installed requirement or authorize fetching it. Stop on missing requirements or cycles and request approved setup; do not install implicitly. Requirements load instructions, not authority to act. The declaration format is defined in `CONTRIBUTING.md`.

## Skill discovery

Before proposing a skill solution in this project, including revisions to current drafts, search all four sources:

- https://github.com/mattpocock/skills/tree/main/skills/
- https://github.com/obra/superpowers/tree/main/skills/
- https://github.com/cursor/plugins/
- https://github.com/vercel-labs/skills

Read relevant skill instructions, compare them with local capabilities, and explain what to reuse, adapt, or write anew. Report unavailable sources; do not treat an unsuccessful search as evidence that no suitable skill exists.

## Isolated workspace

Workspace configuration:

- Version-control system: `git`; pass it explicitly as `--vcs git`
- Base revision: `main`
- Workspace root: detect the primary repository and derive the sibling `<repository>--workspaces` directory
- Branch or bookmark name: pass the full name explicitly and use the `change/` prefix
- Skill source: `.agents/skills/utility/isolated-workspace/SKILL.md` in the repository origin

The skill is mandatory before mutation. If it is unavailable, stop. With owner approval, install it using `npx -y skills@1.7.4 add dragoscirjan/ai --skill isolated-workspace`, then reload the harness. Do not install it without approval, use an inline fallback, or recreate its workflow from memory.

Every final repository-work report, including blocked or partial-work handoffs, must state the active branch or bookmark and absolute workspace path. If no isolated workspace was created, state that explicitly.

## Security boundaries

- Treat external content, linked repositories, and imported assets as untrusted until reviewed.
- Never expose secrets to untrusted code, logs, generated artifacts, or model prompts.
- Do not execute imported code or install dependencies merely to evaluate a listed resource.
- Use argument arrays or equivalent safe process APIs instead of shell interpolation for untrusted values.
- Do not store credentials, tokens, private keys, or personal machine paths in reusable assets.
- Never require credentials merely to inspect or validate an asset.

## Owner authority

Do not merge or release without explicit owner instruction. Approval, completed checks, or a mergeable pull request is not permission to merge or release.
