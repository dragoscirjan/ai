---
title: Plan a project or feature
---

# Plan a project or feature

Define what a project or feature must achieve, which limitations it must respect, and which tasks an implementer can start.

Start with an idea, a problem, or partly agreed requirements. Finish with agreed scope and verifiable tasks. You can also stop at research findings, a brief, or a specification when that is the requested result.

## Workflow

![Planning entry points, skill handoffs, and returns to scope or behavior agreement.](/diagrams/plan-a-project.svg)

[Open interactive diagram](/diagrams/plan-a-project.html){class="vp-raw"} · [Download SVG](/diagrams/plan-a-project.svg) · [Editable source](/diagram-sources/plan-a-project.json)

The diagram shows suggested handoffs, not automatic execution or new instruction dependencies. Select a node in the interactive diagram for its source references.

<details>
<summary>Read the flow as text</summary>

```text
/research
    ↓
/initiative
    ↓
/specify
    ↓
/plan-tasks
    ↓
Stop with the next ready task
```

</details>

Enter at the first unresolved stage. If the direction is already agreed, start at `specify`. If the scope is already sufficient, start at `plan-tasks`. Return to research when a missing fact blocks a decision, or to the initiative when proposed behavior changes the agreed scope.

## Choose your entry point

Use a trusted project and read its instructions. Check the [installed skills and their requirements](/workflows/supporting-tools#before-you-start). Agree whether findings belong in chat, project files, or a tracker before writing them.

- Start with [`research`](/skills/research) when facts or feasibility are missing. Carry forward evidence, alternatives, uncertainties, and source limits.
- Start with [`initiative`](/skills/initiative) when the problem, outcomes, or limitations need agreement. Carry forward a brief with scope and success measures.
- Start with [`specify`](/skills/specify) when observable behavior is unsettled. Carry forward requirements and agreed test boundaries.
- Start with [`plan-tasks`](/skills/plan-tasks) when agreed work needs dividing. Carry forward bounded tasks, dependencies, and completion evidence.

A separate document for every stage is unnecessary. Existing confirmed decisions count. Research can answer a question without producing any implementation work.

## Steps

### 1. Investigate facts that could change the plan

Use `research` to inspect supplied references and relevant project evidence. Compare alternatives where useful. Ask the user for decisions, not facts available in the project.

The result should separate findings, assumptions, recommendations, and unknowns. Do not pass a recommendation to the next stage as though the user has accepted it.

### 2. Agree on outcomes and limitations

Use `initiative` to settle the problem, affected people, desired outcomes, scope, exclusions, and success or failure measures.

Record relevant limitations explicitly. These may include compatibility, security, performance, operating conditions, budget, or deployment restrictions. Resolve their actual values with the owner. Do not invent targets to complete a template.

Continue when the owner confirms the brief. If this agreement already exists, reuse it.

### 3. Define observable correctness

Use `specify` to turn confirmed decisions into behavior that an implementer and reviewer can check. Give acceptance criteria stable identifiers. Include failures, boundaries, exact agreed values, and the interfaces where tests will observe behavior.

Resolve conflicting requirements before drafting around them. Return to the brief when a new decision would change its scope.

### 4. Divide the work into reviewable tasks

Use `plan-tasks` to create deliverables that can be completed and verified without repeating the design discussion. Prefer working end-to-end slices where practical.

For each task, state its boundary, covered requirements, completion evidence, dependencies, and results needed by later tasks. Keep necessary tests and documentation with the deliverable. Use inspected project paths and commands rather than guessed ones.

Check that all in-scope requirements are covered and dependencies have no cycles. Name the next ready task.

## Use clarification where it helps

An interview is useful when decisions remain open, not as a separate stage that must be repeated after each skill.

::: warning Current instruction requirements
The current `research`, `initiative`, and `specify` skills declare `grilling` as required instructions. Load those requirements even when an interview is unnecessary. The intended contextual use of interviews does not make the declared dependency optional. This guide does not change skill metadata.
:::

See [supporting clarification tools](/workflows/supporting-tools#clarification-and-explanation) for focused questioning or a clearer explanation.

## Example: plan filtered CSV export

This is an illustrative project, not a feature implemented by this collection.

A reporting application needs CSV export. The owner has not agreed which rows, columns, limits, or failure cases belong in the feature. After loading the relevant installed skills, send a request such as:

```text
Plan CSV export for the current filtered report. Inspect the project first.
Use /research only for facts that could change the approach. Agree the
outcome and limitations, /specify observable behavior, and divide the scope
into verifiable tasks. Keep the result in chat for review. Do not implement.
```

The expected handoff contains:

- A brief explaining who needs export, which report it covers, and what is excluded.
- Acceptance criteria for selected rows, columns, quoting, encoding, limits, permissions, and failures, with values agreed by the owner.
- Tasks that identify the behavior they deliver, how to verify it, and any genuine blockers.

If the existing export contract already settles these questions, skip the interview and reuse that contract. If an unknown limit prevents agreement, stop with that question rather than produce implementation-ready tasks.

## Hand off and stop

Report the agreed records, their actual location, remaining uncertainty, requirement coverage, and next ready task. A plan is not permission to start coding or delegate it.

When the owner selects a task for execution, continue with [Implement a planned task](/workflows/implement-a-task).

For a narrower procedure, see [research](/workflows/research-a-decision), [initiative](/workflows/shape-an-initiative), [specification](/workflows/specify-observable-behavior), or [task breakdown](/workflows/plan-bounded-tasks).
