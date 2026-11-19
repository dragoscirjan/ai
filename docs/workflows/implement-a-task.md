---
title: Implement a planned task
---

# Implement a planned task

Turn one agreed task into tested behavior and reviewed changes.

Start with a task from planning or equally clear direct scope. Finish with the requested behavior, verification evidence, affected documentation, and resolved or disclosed review findings. Do not repeat planning merely because a task arrived without a separate brief.

## Workflow

![Task implementation with optional scaffolding, TDD, independent review, and correction loops.](/diagrams/implement-a-task.svg)

[Open interactive diagram](/diagrams/implement-a-task.html){class="vp-raw"} · [Download SVG](/diagrams/implement-a-task.svg) · [Editable source](/diagram-sources/implement-a-task.json)

The diagram shows suggested handoffs, not automatic execution or new instruction dependencies. Select a node in the interactive diagram for its source references.

<details>
<summary>Read the flow as text</summary>

```text
An agreed task
    ↓
Optional /scaffold → STOP
    ↓ explicit instruction
/coding-with-rules
    ↓
Checks → /code-review if selected
    ├─ correction
    │    ↓
    │  /coding-with-rules → checks
    └─ scope changes → planning
```

</details>

If the existing structure is sufficient, go directly to implementation. Scaffolding is useful when the file structure or interfaces need their own review.

## Before you start

Read the task, acceptance criteria, project instructions, affected code, and tests. Confirm the permitted changes and [execution safeguards](/workflows/supporting-tools#before-you-start).

Use [`coding-with-rules`](/skills/coding-with-rules) throughout source design, scaffolding, implementation, testing, and corrections. It loads the base `coding` instructions and the relevant language references.

Return to [planning](/workflows/plan-a-project) if a missing requirement would force you to invent behavior. A local implementation choice that preserves agreed contracts does not require restarting the entire planning flow.

## Steps

### 1. Establish structure only when needed

Use [`scaffold`](/skills/scaffold) for approved source skeletons. Agree the exact file-level scope, preserve working behavior, and leave unfinished callables explicitly unfinished.

Stop after the structural handoff. The current skill requires a separate explicit instruction before implementing behavior. A compiled skeleton is not a completed feature, and scaffold approval does not authorize the next phase.

For a task that only changes an existing function or behavior, omit this branch.

### 2. Implement one behavior slice

Apply `coding-with-rules` to the smallest change that satisfies the task. Preserve public contracts unless the task explicitly changes them.

Tests are required for changed behavior even when you do not choose TDD. Cover the relevant public behavior, boundaries, failures, and security regressions. Use configured project checks rather than adding tools or changing thresholds without approval.

### 3. Use the test-first variant when selected

With [`tdd`](/skills/tdd), agree the public test boundaries before writing tests. Confirmed boundaries in the specification can supply that agreement.

```text
One agreed behavior
    ↓
/tdd: observe one failing test
    ↓
/coding-with-rules: minimal change
    ↓
Observe green
    ├─ next behavior → repeat
    └─ task complete → review
```

Keep TDD and coding guidance active together. Do not write all tests first and all implementation afterward.

The local TDD skill defines a red/green loop. It places refactoring in the review stage rather than inside that loop. Corrective refactoring must preserve required behavior and pass the relevant checks.

### 4. Review and correct the change

Run applicable project quality gates and inspect the full diff against the task. Update affected reader guidance with [`document-project`](/skills/document-project).

Use [`code-review`](/skills/code-review) when that independent review is requested and supported. It checks Standards and Spec separately against fixed Git snapshots. Read its [review prerequisites](/workflows/supporting-tools#review-an-existing-change) before invoking it.

For each actionable finding, make the bounded correction, rerun affected checks, and review again. Add a test when a finding exposes an uncovered behavior. Return to scaffolding only when revised structure needs its own approved handoff.

If a finding changes requirements or expands scope, stop for agreement in planning. Review findings are not permission for unrelated cleanup.

## Example: implement a CSV quoting task

This example continues the illustrative reporting project from the planning guide. It is not an executed test.

Suppose the agreed task is to preserve CSV fields containing commas and quotes through the application's existing export interface. After loading the installed coding skills, request:

```text
Implement the agreed CSV quoting task using /coding-with-rules and TDD.
Use the export interface and test boundaries confirmed in the specification.
First observe a failing test for a field containing a comma. Make it pass,
then cover a quoted field. Preserve filtering, columns, and permissions.
Update affected documentation and report the actual checks.
Do not commit, push, or launch reviewers without the required authorization.
```

Expected evidence includes the observed red and green results, requirement coverage, the full change, and documentation impact. A review handoff also identifies the specification and an approved fixed Git comparison.

If a test boundary is still undecided, settle it before writing tests. If independent review cannot run, report that limitation rather than label the change reviewed.

## Finish the task

Report changed behavior, acceptance-criterion results, checks and unrun reasons, documentation impact, remaining findings, and the next decision. Include the branch and workspace where project policy requires them.

Task completion does not grant commit, push, merge, or release authority. Return to the task list only after the selected deliverable is accounted for.

Focused procedures remain available for [a small approved change](/workflows/implement-a-small-change), [test-first work](/workflows/build-test-first), and [scaffold-only work](/workflows/scaffold-without-implementation).
