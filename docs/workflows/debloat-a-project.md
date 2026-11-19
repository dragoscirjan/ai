---
title: Debloat a project
---

# Debloat a project

Reduce unnecessary complexity in existing code, configuration, dependencies, or abstractions without removing required behavior.

Start with a bounded area that seems harder to understand or maintain than its requirements justify. Finish with evidence-backed decisions and, when authorized, verified reductions. Keeping the current design is a valid outcome.

## Workflow

![Evidence-backed keep, simplify, or defer decisions and behavior-preserving reductions.](/diagrams/debloat-a-project.svg)

[Open interactive diagram](/diagrams/debloat-a-project.html){class="vp-raw"} · [Download SVG](/diagrams/debloat-a-project.svg) · [Editable source](/diagram-sources/debloat-a-project.json)

The diagram shows suggested handoffs, not automatic execution or new instruction dependencies. Select a node in the interactive diagram for its source references.

<details>
<summary>Read the flow as text</summary>

```text
/debloat: inspect requirements
    ↓
Trace consumers, costs, and risks
    ↓
Decide: keep / simplify / defer
    ↓
Agree a bounded reduction
    ↓
Establish behavior checks
    ↓
/coding-with-rules: simplify
    ↓
Verify → review if selected
    ├─ changed behavior → reassess
    └─ broad redesign → planning
```

</details>

The investigation selects justified changes. The implementation branch is conditional on approval, not an automatic consequence of finding a candidate.

## Before you start

Use [`debloat`](/skills/debloat) in simplify mode for an existing project. Its prevent mode can instead challenge a proposed design before implementation.

Confirm the allowed area, required behavior, public contracts, compatibility obligations, and edit authority. Read the [execution safeguards](/workflows/supporting-tools#before-you-start). An inventory or review request stays read-only.

Do not define success as a line, file, or package deletion quota. The goal is lower total comprehension, maintenance, testing, security, and operating cost.

## Steps

### 1. Investigate each candidate

Read its implementation, tests, configuration, manifests, and contracts. Trace actual consumers, including exports, plugins, CLIs, generated code, build or deployment wiring, and integrations where relevant.

For each candidate, record its requirement, consumers, present cost, a concrete simpler alternative, risks, and unknowns. An import search alone cannot prove a mechanism is unused.

Investigate pass-through layers, speculative extension points, duplicated facts, flags, dependencies, and optimizations. Do not treat any of those categories as automatic deletion orders.

### 2. Choose keep, simplify, or defer

| Decision | Evidence to record                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------- |
| Keep     | The requirement, boundary, measured constraint, or lower total cost that justifies the current mechanism |
| Simplify | The concrete alternative and how it preserves required behavior and consumers                            |
| Defer    | The unknown consumer, compatibility risk, missing evidence, or absent authority blocking a safe decision |

Retain justified authorization, established cryptography, error handling, observability, recovery, and necessary tests. Replacing a maintained library with custom code can increase obligations even if it removes a dependency.

Compare the total change, including work shifted to callers. Fewer lines alone are not evidence of a better design.

### 3. Bound the approved change

Present the proposed reductions and their risks before editing. Keep unrelated cleanup out of the change.

A small, clear reduction can go directly to implementation. For a wide restructuring or unsettled contract, return to [planning](/workflows/plan-a-project) to agree behavior and divide the work. Use compatibility-preserving sequencing when required.

If the current design remains the simpler sound choice, stop with the keep decision.

### 4. Preserve behavior while simplifying

Use [`coding-with-rules`](/skills/coding-with-rules) for source changes. Establish focused behavioral coverage before collapsing or removing a mechanism. Use contract or integration checks across important boundaries.

Preserve public behavior, defaults, errors, side effects, and compatibility unless their change is explicitly approved. Make small, reviewable reductions, recheck consumers after rewiring, and remove only newly unnecessary mechanisms within scope.

If meaningful coverage is infeasible, report that limitation before relying on weaker checks. Do not delete or weaken tests to make the new design pass.

### 5. Verify the reduction

Run the applicable project checks, inspect the full diff, and use [independent review](/workflows/supporting-tools#review-an-existing-change) when requested and supported.

Update affected documentation when configuration, public interfaces, or reader tasks change. For an internal-only reduction, give a concrete no-documentation-change reason.

Stop and reassess if a necessary boundary disappears or an unapproved behavior change appears.

## Example: investigate an export factory

This is an illustrative candidate in the reporting project, not an observed problem in this collection.

An export factory appears to choose only one CSV exporter. A safe initial request is:

```text
Review the export factory and forwarding layers with /debloat in simplify
mode. Stay read-only. Trace public consumers, plugins, configuration, and
tests before calling anything unused. Propose keep, simplify, or defer for
each candidate. Preserve CSV behavior, permissions, and compatibility.
Do not remove dependencies or edit code yet.
```

If inspection proves that direct construction preserves every required consumer and contract, the proposal can describe that reduction and its checks. If plugins create exporters through the factory, retain the required boundary or defer until compatibility is understood.

After the owner approves a specific reduction, implement it with behavior checks. Record both what was removed and which complexity remained justified.

## Report and stop

Report scope, evidence-backed decisions, actual changes, retained complexity, checks and unrun reasons, uncertainties, and any next approval needed.

A proposal is not permission to edit. A successful reduction is not permission to continue simplifying unrelated areas, merge, or release.

For the narrower design-review procedure, see [Remove complexity without removing requirements](/workflows/simplify-a-design).
