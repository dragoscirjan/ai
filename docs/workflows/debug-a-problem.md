---
title: Debug an application problem
---

# Debug an application problem

Find why an application fails before choosing a correction.

Start with unexpected behavior, a regression, or a failing test, build, or integration. Finish with an evidence-backed cause and verified fix, or a precise blocker and the next useful observation.

## Workflow

![Evidence-first diagnosis, regression checks, an authorized correction, and reassessment loops.](/diagrams/debug-a-problem.svg)

[Open interactive diagram](/diagrams/debug-a-problem.html){class="vp-raw"} · [Download SVG](/diagrams/debug-a-problem.svg) · [Editable source](/diagram-sources/debug-a-problem.json)

The diagram shows suggested handoffs, not automatic execution or new instruction dependencies. Select a node in the interactive diagram for its source references.

<details>
<summary>Read the flow as text</summary>

```text
/systematic-debugging
    ↓
Investigate → compare
    ↓
Test one hypothesis
    ├─ unsupported → investigate
    └─ supported cause
           ↓
Observe a regression failure
    ↓
/coding-with-rules: smallest fix
    ↓
Verify → review if selected
    └─ still failing → investigate
```

</details>

Debugging joins the [implementation workflow](/workflows/implement-a-task) only after the cause and correction scope are understood. It does not need feature scaffolding by default.

## Before you start

Record expected and observed behavior, the failing action, and the relevant revision and environment. Use sanitized inputs and keep secrets out of diagnostic output.

Load [`systematic-debugging`](/skills/systematic-debugging). Read the target project's instructions and [execution safeguards](/workflows/supporting-tools#before-you-start). Diagnostic edits and state-writing tests need the same authority and workspace protection as other mutations.

A diagnosis-only request stops at findings. It does not authorize a fix or infrastructure changes.

## Steps

### 1. Bound the failure

Read the complete relevant error or stack trace. Reproduce the problem with the smallest safe case and record its inputs, preconditions, and frequency.

Inspect recent changes, but treat timing as a lead rather than proof. Trace the invalid value or state back to its origin. At component boundaries, compare what entered, what left, and the configuration each component used.

If you cannot reproduce the failure, identify the missing observation. Do not substitute a plausible explanation for evidence.

### 2. Compare and test one explanation

Find a working case or a last-known-working revision. Compare inputs, lifecycle, dependencies, ownership, and configuration. If no working comparison exists, use the documented contract and disclose that limit.

State one falsifiable hypothesis, its prediction, the smallest safe experiment, the observed result, and the next action. Change one relevant variable at a time.

A rejected hypothesis returns to investigation. An inconclusive result needs better evidence, not a speculative production patch.

### 3. Establish regression evidence

Before applying the correction, observe a regression test or executable reproduction failing for the intended reason. An existing failing test can already supply this evidence.

Full [`tdd`](/skills/tdd) is optional. Regression evidence before the fix is already part of `systematic-debugging`. If automated coverage is infeasible, explain why and use the strongest safe reproduction available. Do not call manual observation automated coverage.

### 4. Correct the cause and verify

Use [`coding-with-rules`](/skills/coding-with-rules) for the corrective code or toolchain change. Keep the correction small and exclude unrelated refactoring.

Rerun the regression case and broader relevant checks. Remove temporary diagnostics you introduced unless they belong in the final fix, then rerun affected checks.

For intermittent problems, report trial counts and conditions. One passing run is not proof that flakiness is gone. Use [independent code review](/workflows/supporting-tools#review-an-existing-change) when requested and supported.

### 5. Reassess when the evidence changes

If the fix fails, return to investigation. After three failed corrective attempts at the same unresolved failure, stop patching and reassess the reproduction, assumptions, environment, coupling, and architecture.

This count concerns corrective attempts, not ordinary diagnostic observations. Architectural changes still require owner agreement. Return to [planning](/workflows/plan-a-project) if the demonstrated cause requires broader scope or changed behavior.

## Example: an exported name creates an extra column

This is an illustrative failure in the reporting project, not an observed defect in this collection.

A name containing a comma, such as `North, West`, appears as two CSV columns. A useful initial request is:

```text
Diagnose why exporting the name "North, West" produces an extra column.
Use /systematic-debugging. Compare it with a name without a comma and trace
the serialized field through the existing export path. Report the supported
cause and a bounded correction proposal before editing.
```

If inspection supports incorrect field escaping as the cause, the next authorized phase should establish a failing export test before changing the serializer. The expected result is one preserved name field and unchanged unrelated export behavior.

If the serializer is correct but the consuming application misreads the file, investigate that boundary instead. Do not change quoting merely because it was the first hypothesis.

## Report the result

Separate the demonstrated cause, corrective change, verification, and remaining uncertainty. Report any temporary containment separately from the root-cause fix.

An authorized rollback can contain an incident without proving its cause. Leave the diagnosis open until the evidence supports it.

For a diagnosis-only procedure, see [Find the root cause before proposing a fix](/workflows/diagnose-a-failure).
