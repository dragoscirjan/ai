# AGENTS.md

## Project

- Name: `sample-service`
- Repository: `sample-service`
- Purpose: A small HTTP service that stores and retrieves team tasks.

## Working agreement

- Read `CONTRIBUTING.md` before changing the repository when that file exists.
- Clarify ambiguous requirements and confirm shared understanding before planning implementation.
- Create or link a GitHub issue before architecture, design, implementation, or behavior changes. Documentation typo fixes do not require an issue.
- Keep each change focused. Use Conventional Commits.
- Run `mise run validate` before publishing a change.
- Do not merge or release without explicit owner instruction.

## Isolated workspace

Before any repository mutation, explicitly load and follow the `isolated-workspace` skill.

Workspace configuration:

- Version-control system: `git`
- Base revision: `main`
- Workspace root: `../sample-service--workspaces`
- Branch or bookmark prefix: `feat`
- Skill source: `https://github.com/example-org/agent-assets/tree/main/.agents/skills/isolated-workspace`

The skill is mandatory. If it is unavailable, stop before mutation. Require the owner to install it from the configured source as `isolated-workspace/SKILL.md` under a project or user Agent Skills directory, then reload the harness. Do not install it without approval, use an inline fallback, or recreate its workflow from memory.

## Repository map

- `src/http/` — request parsing, routing, and response serialization.
- `src/domain/` — task rules and application services; it does not depend on HTTP code.
- `src/storage/` — persistence adapters behind domain-owned interfaces.
- `test/` — unit and integration tests.

## Architecture

- Keep domain logic independent of transports and storage implementations.
- Validate external input at the HTTP boundary.
- Add integrations through interfaces owned by the domain layer.
- Keep process startup and environment parsing in the application entry point.

## Environment contract

- `APP_PORT` — optional listening port; defaults to `8080`.
- `DATABASE_URL` — required database connection URL.
- `LOG_LEVEL` — optional log level; defaults to `info`.

Reject unknown `APP_` variables and fail startup when required values are missing.

## Security boundaries

- Treat request data and imported files as untrusted.
- Never expose secrets to untrusted code, logs, generated artifacts, or model prompts.
- Do not execute untrusted code or install untrusted dependencies unless the project explicitly requires and isolates it.
- Use argument arrays or equivalent safe process APIs instead of shell interpolation for untrusted values.
- Never return database credentials or internal error stacks in HTTP responses.

## Testing

- Unit tests live beside domain modules as `*.test.ts` files.
- Integration tests live under `test/integration/` and use temporary databases.
- Run the suite with `mise run validate`.
- Add or update focused tests with behavior changes.
- Keep tests isolated from developer state and production credentials.
- Record any validation that cannot be run and explain why.
