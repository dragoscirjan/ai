---
title: "Find a skill"
---

# Find a skill

The catalog contains **28 skills**: 24 local entries and 4 upstream-only entries. Search by an exact skill name or start with your task.

![Six task-oriented groups for choosing skills; these are discovery routes, not runtime dependencies.](/diagrams/skill-groups.svg)

[Open interactive diagram](/diagrams/skill-groups.html) · [Download SVG](/diagrams/skill-groups.svg) · [Editable candidate](/diagram-sources/skill-groups.json)

## [Setup](/groups/setup)

Install selected skills, initialize projects, and protect the primary checkout.

- [`sync-my-skills`](/skills/sync-my-skills) — Synchronize project skills and agent instructions through a guided, approved plan.
- [`init-project`](/skills/init-project) — Initialize or adopt project foundations, TypeScript tooling, or Godot GDScript tooling only when explicitly requested.
- [`isolated-workspace`](/skills/isolated-workspace) — Create or reuse an isolated Git worktree or Jujutsu workspace before mutation, using an explicit VCS and branch or bookmark.

## [Discovery and planning](/groups/discovery)

Investigate questions and agree on outcomes, specifications, and tasks.

- [`research`](/skills/research) — Research a question, compare alternatives, or investigate feasibility; report verified evidence, uncertainty, and limits.
- [`initiative`](/skills/initiative) — Turn an idea or research into an agreed brief covering the problem, outcomes, scope, constraints, and success measures.
- [`specify`](/skills/specify) — Turn agreed decisions into a compact specification with observable behavior, acceptance criteria, constraints, and test boundaries.
- [`plan-tasks`](/skills/plan-tasks) — Divide an agreed specification or clear scope into bounded, verifiable tasks with explicit dependencies and completion evidence.
- [`grill-me`](/skills/grill-me) — A relentless interview to sharpen a plan or design.
- [`grilling`](/skills/grilling) — Stress-test a plan or decision through an explicit interview.
- [`wait-what`](/skills/wait-what) — Explain the current proposal again with simpler language and missing context.

## [Coding and quality](/groups/coding)

Implement, test, diagnose, simplify, and review code.

- [`coding`](/skills/coding) — Design, implement, refactor, review, or test code under project conventions, risk-based security, and behavior-focused checks.
- [`coding-with-rules`](/skills/coding-with-rules) — Language-aware coding: resolve the base workflow, then select rules for the languages and file extensions being changed.
- [`scaffold`](/skills/scaffold) — Create source skeletons for an approved feature, validate their structure, and stop before implementing behavior.
- [`tdd`](/skills/tdd) — Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
- [`debloat`](/skills/debloat) — Prevent overengineering during design; simplify existing code, configuration, or dependencies while preserving required behavior, contracts, security, and operational needs.
- [`code-review`](/skills/code-review) — Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes: Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/spec asked for?). Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to "review since X".
- [`systematic-debugging`](/skills/systematic-debugging) — Diagnose bugs, failing tests, regressions, flaky behavior, and unexpected results through evidence, root-cause tracing, and single-hypothesis experiments before proposing fixes. Use for debugging in any language, including failures across component or environment boundaries.

## [Documentation and communication](/groups/writing)

Explain technical work and write instructions that readers can follow.

- [`document-project`](/skills/document-project) — Maintain task-based developer documentation during implementation; create or refactor VitePress/MkDocs documentation within approved scope.
- [`asd-ste100-technical`](/skills/asd-ste100-technical) — Technical writing: use ASD-STE100-inspired plain language for software responses and documentation.
- [`caveman`](/skills/caveman) — Concise communication that preserves complete technical substance.
- [`unslop`](/skills/unslop) — Remove AI-generated prose patterns while preserving meaning.
- [`writing-for-agents`](/skills/writing-for-agents) — Writing documents for agents. Use when creating or editing skills, or modifying AGENTS.md or CLAUDE.md.

## [Diagrams](/groups/diagrams)

Choose editable images or interactive HTML for the reader's task.

- [`archify`](/skills/archify) — Generate validated interactive HTML diagrams or one-page explainers with Archify, including architecture, workflows, Mermaid input, and image/SVG/WebM exports.
- [`excalidraw`](/skills/excalidraw) — Generate PNG or SVG diagrams with local Excalidraw rendering. Use for project structure, component relationships, workflows, or revisions to an existing diagram. Retain scene JSON as editable source and deliver images first.

## [Coordination and maintenance](/groups/maintenance)

Coordinate agents, repair instruction routes, and improve the working process.

- [`subagent-orchestration`](/skills/subagent-orchestration) — Before delegating, bound child-agent work, assign read/write lanes, integrate results, review, validate, and clean temporary lanes.
- [`cleanup-workspaces`](/skills/cleanup-workspaces) — Audit integrated Git/Jujutsu workspaces, stale registrations, or authorized temporary lanes; apply only an approved exact cleanup plan.
- [`instruction-maintenance`](/skills/instruction-maintenance) — Audit instruction drift, routing, and skill metadata; propose exact changes for human approval before mutation.
- [`retro`](/skills/retro) — Review a bounded work period for evidence-backed process improvements, including workflow, instructions, tools, and handoffs.

The YAML catalog is the only authored inventory. Grouping and learning prose reference its IDs; generated pages do not define a second installable collection. See the [catalog reference](/reference/catalog).
