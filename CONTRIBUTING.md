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

Local workspace creation does not require hosted-repository identity. The `isolated-workspace` automation detects the primary local repository and derives its sibling workspace directory directly.

When another workflow needs hosted-repository identity, query project-scoped memory or context first. On a miss, read the Git origin once, sanitize the result, and store only an unambiguous `host/owner/repository` identity with its provenance. Never store credentials, token-bearing URLs, embedded user information, or personal filesystem paths.

## Architecture rules

- Follow the [Agent Skills specification](https://agentskills.io/specification) for core skill fields. The `require` convention below is an explicit project extension, not a standard or native harness feature. Preserve documented harness-specific fields where applicable.
- Match each skill directory name to the `name` in its `SKILL.md` frontmatter.
- Keep reusable assets independent of absolute machine paths and individual harnesses unless the coupling is explicit.
- Keep detailed reusable workflows in skills. Keep only startup routing, project configuration, security boundaries, and owner authority in `AGENTS.md`.
- Preserve security boundaries and required workflow gates when simplifying imported instructions.
- Prefer direct, testable instructions over commentary about intent.
- Do not duplicate workspace commands outside the workspace skills.

## Independent skills and explicit composition

Keep each leaf skill useful on its own: state its scope, real prerequisites, and operation-specific safeguards. Project instructions or the user select additional skills; do not make leaves load them implicitly.

Declare instruction dependencies only for thin, intentional compositions or the owner-approved `cleanup-workspaces` → `isolated-workspace` exception. For example:

```yaml
require: ["grilling"]
```

Omit the field when no skills are required. When present, use exactly one unquoted top-level `require` key with a nonempty, single-line JSON-compatible array of unique skill names. Multiline lists, unquoted items, anchors, and trailing comments are unsupported for this property. Names must exist; self-references and cycles are invalid.

The declaration is the sole source of mandatory prompt dependencies. Resolve requirements recursively in array order, loading each skill once before its caller. The composition body defines execution sequence, handoffs, and stops; do not repeat loading procedures or component instructions. An optional reference is not a requirement.

Keep shared-code installation dependencies in catalog `dependencies`; capability `requires` is separate. The synchronization planner includes both code dependencies and frontmatter requirements in the approval-bound installation closure. Managed project profiles may add the policy bundle required by imported instructions.

Top-level `require` is not part of the Agent Skills standard and fails its strict reference validator. It acquires model-driven semantics through project routing, not a custom harness loader. External Skills CLI commands do not automatically install these requirements. Outside a managed project, install the declared skills and supply this routing convention explicitly. Report tested harness behavior separately from source inspection or unverified compatibility.

## Human-approved instruction adaptation

When repository instructions no longer fit an observed workflow, follow the `instruction-maintenance` skill. An agent may inspect the instruction graph and present an exact proposal without prior approval. It must not mutate instructions until a human explicitly approves that proposal.

Approval is limited to the stated files and rule changes. Changed evidence, scope, dependencies, handoffs, or protected rules require a revised proposal and new approval. After approval, follow the normal issue, isolated-workspace, validation, commit, and pull-request gates.

This adaptation workflow covers instruction routes, deferred policy documents, dependency or handoff statements, and skill routing metadata. It does not authorize changes to detailed skill behavior.

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
