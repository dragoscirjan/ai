# AGENTS.md

## Repository purpose

This repository stores reusable AI-agent assets: skills, prompts, commands, and configuration templates.

## Working rules

- Treat files under `templates/` as source artifacts. Keep them generic and ready to copy into another repository.
- Do not add project-specific names, paths, tools, or policies to a template unless they are explicit placeholders.
- Use `{{UPPER_SNAKE_CASE}}` for install-time placeholders.
- Keep rendered files under `examples/` free of unresolved placeholders.
- When a template changes, update its example in the same change.
- Prefer direct, testable instructions over commentary about intent.
- Preserve security boundaries and required workflow gates when simplifying instructions.

## Development workflow

- Clarify requirements before changing a template when installation behavior or policy is ambiguous.
- Track non-trivial changes in an issue.
- Work in a dedicated Git worktree or Jujutsu workspace rather than the primary checkout.
- Keep one active writer per workspace.
- Use focused changes and Conventional Commits.
- Run the repository's available validation before publishing a change.
- Do not merge without explicit owner instruction.

## Template validation

Before publishing a template change, verify that:

1. Every install-time value uses `{{UPPER_SNAKE_CASE}}` syntax.
2. Every placeholder is documented in the template's variable table.
3. The example contains no `{{...}}` placeholders.
4. Git and Jujutsu instructions are clearly separated and express the same isolation policy.
5. Commands do not assume a specific absolute project path.
6. Project-specific sections are concise and replaceable.
