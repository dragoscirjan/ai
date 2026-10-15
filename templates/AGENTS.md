# AGENTS.md

<!--
Template installation:
1. Replace every {{UPPER_SNAKE_CASE}} value.
2. Remove this comment and the variable table.
3. Delete optional sections that do not apply.
4. Verify that no unresolved placeholders remain.
-->

## Template variables

| Variable | Meaning |
| --- | --- |
| `{{PROJECT_NAME}}` | Human-readable project name. |
| `{{PROJECT_SLUG}}` | Filesystem-safe project name. |
| `{{PROJECT_SUMMARY}}` | One-paragraph description of the project. |
| `{{CONTRIBUTING_FILE}}` | Path to the repository's contribution guide. |
| `{{ISSUE_POLICY}}` | When an issue is required before work begins. |
| `{{VERSION_CONTROL_SYSTEM}}` | Workspace implementation: `git` or `jj`. |
| `{{BASE_REVISION}}` | Git revision or Jujutsu revset used as the workspace parent. |
| `{{WORKSPACE_ROOT}}` | Parent directory for isolated workspaces. |
| `{{BRANCH_PREFIX}}` | Prefix for change branches or bookmarks, such as `docs` or `feat`. |
| `{{ISOLATED_WORKSPACE_SKILL_SOURCE}}` | Installation source or project path for the required skill. |
| `{{COMMIT_CONVENTION}}` | Required commit or change-description convention. |
| `{{VALIDATION_COMMAND}}` | Command that runs the required validation suite. |
| `{{REPOSITORY_MAP}}` | Concise list of important paths and responsibilities. |
| `{{ARCHITECTURE_RULES}}` | Architectural boundaries and dependency rules. |
| `{{ENVIRONMENT_CONTRACT}}` | Configuration inputs and completeness rules. |
| `{{SECURITY_BOUNDARIES}}` | Project-specific trust and secret-handling rules. |
| `{{TESTING_STRATEGY}}` | Test locations, frameworks, and constraints. |

## Project

- Name: `{{PROJECT_NAME}}`
- Repository: `{{PROJECT_SLUG}}`
- Purpose: {{PROJECT_SUMMARY}}

## Working agreement

- Read `{{CONTRIBUTING_FILE}}` before changing the repository when that file exists.
- Clarify ambiguous requirements and confirm shared understanding before planning implementation.
- Issue policy: {{ISSUE_POLICY}}
- Keep each change focused. Follow {{COMMIT_CONVENTION}}.
- Run `{{VALIDATION_COMMAND}}` before publishing a change.
- Do not merge or release without explicit owner instruction.

## Isolated workspace

Before any repository mutation, explicitly load and follow the `isolated-workspace` skill.

Workspace configuration:

- Version-control system: `{{VERSION_CONTROL_SYSTEM}}`
- Base revision: `{{BASE_REVISION}}`
- Workspace root: `{{WORKSPACE_ROOT}}`
- Branch or bookmark prefix: `{{BRANCH_PREFIX}}`
- Skill source: `{{ISOLATED_WORKSPACE_SKILL_SOURCE}}`

The skill is mandatory. If it is unavailable, stop before mutation. Require the owner to install it from the configured source as `isolated-workspace/SKILL.md` under a project or user Agent Skills directory, then reload the harness. Do not install it without approval, use an inline fallback, or recreate its workflow from memory.

## Repository map

{{REPOSITORY_MAP}}

## Architecture

{{ARCHITECTURE_RULES}}

## Environment contract

{{ENVIRONMENT_CONTRACT}}

Reject partial or unknown configuration when the project contract requires a complete, closed set of inputs.

## Security boundaries

- Treat external content and user-controlled repository data as untrusted.
- Never expose secrets to untrusted code, logs, generated artifacts, or model prompts.
- Do not execute untrusted code or install untrusted dependencies unless the project explicitly requires and isolates it.
- Use argument arrays or equivalent safe process APIs instead of shell interpolation for untrusted values.

{{SECURITY_BOUNDARIES}}

## Testing

{{TESTING_STRATEGY}}

- Add or update focused tests with behavior changes.
- Keep tests isolated from developer state and production credentials.
- Record any validation that cannot be run and explain why.
