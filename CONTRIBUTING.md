# Contributing to ai

Contributions through focused issues and pull requests are welcome. This guide applies to human contributors and coding agents.

Read this document before planning or performing a repository architecture, design, implementation, documentation, configuration, policy, or publication change.

## Contribution workflow

1. Clarify ambiguous requirements and confirm shared understanding.
2. Create or link a GitHub issue before architecture, design, implementation, or policy changes. Typo and broken-link fixes do not require an issue.
3. Keep each change focused on one issue or task.
4. Follow the isolated-workspace gate and configuration in `AGENTS.md` before changing repository state.
5. Update documentation when behavior, policy, or usage changes.
6. Read and follow [`VALIDATION.md`](VALIDATION.md) before validating or publishing the change.
7. Commit with [Conventional Commits](https://www.conventionalcommits.org/).
8. Open a pull request linked to the issue when an issue is required.

Do not merge or release without explicit owner instruction. Approval, completed checks, or a mergeable pull request is not permission to merge or release.

## Repository identity for automated contributors

When a workflow needs repository identity, query project-scoped memory or context first. The reusable `isolated-workspace` skill owns the Git fallback, sanitization, and caching procedure. Do not duplicate or bypass that procedure.

Store only safe identity data. Never store credentials, token-bearing URLs, embedded user information, or personal filesystem paths.

## Architecture rules

- Follow the [Agent Skills specification](https://agentskills.io/specification) for every skill under `.agents/skills/`.
- Match each skill directory name to the `name` in its `SKILL.md` frontmatter.
- Keep reusable assets independent of absolute machine paths and individual harnesses unless the coupling is explicit.
- Keep detailed reusable workflows in skills. Keep only startup routing, project configuration, security boundaries, and owner authority in `AGENTS.md`.
- Preserve security boundaries and required workflow gates when simplifying imported instructions.
- Prefer direct, testable instructions over commentary about intent.
- Do not duplicate workspace commands outside the workspace skills.

## Environment contract

This repository has no runtime environment variables or executable application configuration.

- Document any future environment input beside the asset that consumes it.
- Reject partial or unknown configuration when a future tool defines a complete, closed input contract.
- Do not introduce credentials merely to inspect, validate, or demonstrate an asset.

## Pull requests

A pull request should:

- contain one focused change
- explain what changed and why
- link the relevant issue when required
- report the checks that ran
- state any validation that could not run
- avoid claiming unsupported or unverified behavior

The repository owner decides when to merge or release.
