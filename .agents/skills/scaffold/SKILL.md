---
name: scaffold
description: Create real source skeleton files for an approved feature without implementing its behavior. Use to establish minimal files, types, signatures, and contracts in an isolated workspace, then stop at a scaffold-only handoff or authorized pull request.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Scaffold

Produce source skeleton files, not a chat-only implementation plan. Keep the change structural and explicitly unfinished, regardless of feature size. This skill does not implement behavior or introduce a DSL, parser, code generator, runtime, or agent extension.

## Phase 1: Inspect and agree on scope

Read the project's instructions and contribution policy. Inspect existing behavior, nearby source, tests, public contracts, build configuration, and CI before proposing structure.

Hand off to [coding](../coding/SKILL.md) for project-first analysis and applicable language or extension guidance. Load the matching advertised skills based on repository evidence, not a preferred language or framework. Apply their standards within this scaffold-only scope; their implementation steps do not authorize business logic here. If a required skill or instruction is missing, stop that phase and report it. Never auto-install it.

Establish:

- the approved feature boundary and observable contracts
- existing implementations and entrypoints that must remain unchanged
- the minimal files, declarations, signatures, and dependencies justified by that boundary
- unresolved requirements and the evidence for each structural choice

Ask for clarification before choosing unresolved data models, authorization rules, external-system contracts, or other product behavior. Do not turn guesses into types, defaults, or comments. If the project provides no language or framework evidence, request that decision instead of selecting one.

Present a concise file-level scope and obtain approval before writing skeletons. Honor existing approval only when it covers that exact scope. A large feature still yields files after approval, not a large Markdown substitute. If scope or authority remains unresolved, stop and report the blocker rather than emitting speculative skeletons.

## Phase 2: Establish the workspace

Before any repository mutation, follow the project's workspace gate through [isolated-workspace](../isolated-workspace/SKILL.md). Verify the approved workspace, branch or bookmark, base, current status, and write ownership before editing. Do not duplicate its commands here or modify the primary checkout.

Loading this skill grants no commit, push, pull-request, merge, or release authority. Follow the current request and project workflow. Stop at a missing permission or conflicting gate; do not bypass it to produce files or publish a PR.

## Phase 3: Write only the structure

Hand off to `coding` and the selected language guidance for source conventions, constrained as follows:

- Write the smallest justified source files in the approved workspace using existing naming, layout, and type conventions. Do not force classes, interfaces, frameworks, or new dependencies.
- Add only necessary types, declarations, signatures, and contracts. Abstract or interface declarations need no body.
- Inside each unimplemented function body, leave a brief high-level comment describing its agreed responsibility and a language-native fail-fast placeholder, such as a not-implemented exception or panic. Do not use a fake success value, empty no-op body, or fabricated data. Avoid module-load placeholders that break unrelated imports.
- Do not implement business logic, algorithms, external calls, or side effects. The explicit placeholder failure is allowed; it must not masquerade as completed behavior.
- Preserve existing working function bodies. Do not replace implementations with stubs, or route production entrypoints to unfinished code. If an agreed structure cannot coexist safely, stop and seek a revised scope.
- Keep comments brief and about behavior or constraints. Do not hide implementation in prose, add boilerplate footers, or invent requirements to fill a file.

Neither `debloat` nor this skill requires the other. If both are requested, keep their scopes and approvals separate; simplification is not permission to stub working behavior.

## Phase 4: Validate the scaffold

Read the project's validation instructions. Hand off to `coding` and the selected language guidance for applicable, non-mutating checks using declared existing toolchains. Aim for syntactically and type-valid skeletons where feasible; do not auto-install tooling or change the toolchain to make them pass.

Review the complete diff for structural scope and preserved behavior. Verify that unimplemented callable bodies fail explicitly and no production route reaches them through new wiring. Follow existing test conventions for any contract checks justified by this scope; do not assert that unfinished functionality works.

Report each check actually run and its result. Separate pre-existing failures, placeholder-related failures, and other new failures. List checks not run and why. Never weaken or skip tests, suppress errors, fabricate passing results, or claim feature completion because the scaffold compiles.

## Phase 5: Publish only as authorized, then stop

The default deliverable is real source files and, when authorized under the project workflow, a clearly labeled scaffold-only PR. Include the issue or approved scope, changed files, unfinished behavior, validation results and gaps, and decisions still required. If publishing is not authorized, retain the files in the approved workspace and report that boundary without pushing or opening a PR.

Keep the completion summary short: point to changed files and the PR if created, identify the active branch or bookmark and workspace, and list remaining gaps. Do not repeat all source in chat.

Stop after the scaffold handoff. Implementing the unfinished behavior requires a separate explicit instruction. Approval of the scaffold or merging its PR is not that instruction and never authorizes a merge or release by itself.
