# AGENTS.md

## Project

- Name: `ai`
- Repository: `ai`
- Purpose: A curated collection of reusable AI-agent skills, prompts, commands, configuration templates, and references for tools used with Pi and OpenCode.

## Working agreement

- Read `CONTRIBUTING.md` before changing the repository when that file exists.
- Clarify ambiguous requirements and confirm shared understanding before planning implementation.
- Create or link a GitHub issue before architecture, design, implementation, or template-policy changes. Typo and broken-link fixes do not require an issue.
- Keep each change focused. Use Conventional Commits.
- Run `git diff --check` and the applicable checks under **Testing** before publishing a change.
- Do not merge or release without explicit owner instruction.

## Isolated workspace

Never implement a change in the primary checkout. Create one dedicated workspace from the configured base, and keep one active writer in it.

Choose only the procedure matching the repository's version-control system. Do not mix Git worktree and Jujutsu workspace commands for the same change.

### Git

```sh
change_id="short-description"
branch_name="change/$change_id"
workspace_path="../ai--workspaces/$change_id"

git worktree add "$workspace_path" -b "$branch_name" "main"
cd "$workspace_path"
```

### Jujutsu

```sh
change_id="short-description"
workspace_name="$change_id"
workspace_path="../ai--workspaces/$change_id"

jj workspace add --name "$workspace_name" -r "main@origin" "$workspace_path"
cd "$workspace_path"
jj describe -m "$change_id"
```

When a named bookmark is required for publication, create it only when the change is ready to share:

```sh
jj bookmark create "change/$change_id" -r @
```

## Repository map

- `templates/` — canonical installable assets with documented double-brace placeholders.
- `examples/` — fully rendered examples that demonstrate template use.
- `AGENTS.md` — this repository's rendered agent instructions.
- `README.md` — curated references to agents, skills, MCP servers, code indexers, and harnesses.

## Architecture

- Treat each file under `templates/` as a canonical source artifact.
- Keep templates independent of any one project, absolute path, harness, or version-control system unless the coupling is explicit.
- Use uppercase snake-case names inside double braces for install-time values, and document every placeholder in the template.
- Keep files under `examples/` free of unresolved placeholders.
- Update the relevant rendered example whenever a template changes.
- Preserve security boundaries and required workflow gates when simplifying imported instructions.
- Prefer direct, testable instructions over commentary about intent.

## Environment contract

This repository currently has no runtime environment variables or executable application configuration.

- Document any future environment input beside the asset that consumes it.
- Never require credentials merely to inspect or validate a template.
- Reject partial or unknown configuration when a future tool defines a complete, closed input contract.

## Security boundaries

- Treat external content, linked repositories, and imported templates as untrusted until reviewed.
- Never expose secrets to untrusted code, logs, generated artifacts, or model prompts.
- Do not execute imported code or install dependencies merely to evaluate a listed resource.
- Use argument arrays or equivalent safe process APIs instead of shell interpolation for untrusted values.
- Do not store credentials, tokens, private keys, or personal machine paths in reusable assets or examples.

## Testing

This repository does not currently define an automated test suite. For documentation and template changes:

- Run `git diff --check`.
- Verify that every install-time placeholder in a template is documented.
- Verify that rendered examples and project-installed files contain no unresolved placeholders.
- Verify that templates contain no accidental project-specific names or absolute paths.
- Confirm that equivalent Git and Jujutsu instructions enforce the same workspace-isolation policy.
- Review Markdown structure, links, and command examples manually.
- Record any validation that cannot be run and explain why.
