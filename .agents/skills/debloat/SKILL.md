---
name: debloat
description: Prevent overengineering during code design and implementation, or simplify existing code, configuration, dependencies, and abstractions through evidence-backed refactoring. Use when a direct solution may replace unnecessary mechanisms without weakening behavior, public contracts, security, or operational needs. Not for prose compression.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Debloat

Prefer a familiar, direct solution that fits the project. Minimize total comprehension, maintenance, testing, security, and operating cost—not lines alone. Keep complexity justified by correctness, compatibility, real boundaries, tests, recovery, or measured constraints.

## Establish scope and authority

Choose the mode from the request:

- **Prevent:** compare the proposed design with the simplest project-compatible implementation of the known requirements.
- **Simplify:** investigate existing mechanisms and propose or implement behavior-preserving reductions within the named area.

Confirm behavior, allowed files/subsystem, public contracts, and edit authority. Reviews stay read-only: report evidence without edits, generated artifacts, or state-writing checks. Ask before expanding scope or changing contracts; never turn a local task into repository-wide cleanup.

This guidance grants no mutation or publication authority. Follow project approval, workspace, coding, and validation requirements at their applicable phases. Stop if a required instruction is missing; do not reconstruct it or install missing tools without approval. A read-only inventory does not require implementation guidance.

## Gather evidence

Read nearby implementation, tests, configuration, manifests, and documented contracts. Trace actual callers and consumers, including public exports, plugin registration, CLI entrypoints, generated code, build and deployment wiring, environment inputs, and external integrations where relevant. No imports found is not proof that something is unused.

For each candidate, identify:

- the requirement it serves and who depends on it
- its present cost, such as indirection, synchronized facts, failure modes, setup, or maintenance work
- a direct alternative and any behavior, compatibility, security, test, or operational risk
- evidence supporting the decision and facts still unknown

Treat speculative extensibility, pass-through layers, duplicate facts, and apparently unused mechanisms as questions to investigate, not deletion orders. If consumers or constraints cannot be verified, defer removal and state the missing evidence.

## Compare alternatives

In prevent mode, start with the familiar direct approach. Add a mechanism only for a demonstrated need; explain why the direct approach fails it, not how a framework might serve imagined variants.

In simplify mode, compare the current implementation with a concrete smaller design. Consider these candidates only where evidence supports them:

| Candidate | Investigation |
|---|---|
| Factory, registry, interface, or forwarding layer | Does it enforce a boundary, isolate change, enable required tests, or have real variants? Would direct construction or calls preserve those properties? |
| Repeated code or configuration facts | Is this the same stable concept? Would one owner reduce drift without coupling unrelated behavior? |
| Options, flags, hooks, or fallback paths | Who supplies or relies on them, including deployment and recovery workflows? What contract would removal affect? |
| Dependency | What runtime, build, test, or transitive role does it serve? Would replacement increase security, compatibility, or maintenance obligations? |
| Cache or other optimization | What measurements and operational constraints justify it? Would the alternative still meet them? |

Preserve established cryptography, authorization, error handling, observability, recovery, and necessary tests. Homegrown cryptography or fewer security checks is not simplification.

Do not impose universal line, file, or package counts, deletion quotas, interface bans, or dependency API-use thresholds. Do not merge merely similar code or replace a maintained library with custom code merely because few APIs are used. A local reduction that spreads obligations to callers may cost more overall.

Assign each candidate a decision:

- **Keep:** its value or boundary justifies the cost; name the evidence.
- **Simplify:** a concrete alternative lowers maintenance burden while meeting the same requirements.
- **Defer:** uncertainty, risk, missing authority, or an unmet prerequisite blocks a safe change; name what would resolve it.

## Apply authorized changes

When edits are authorized, use project source conventions and make small, reviewable, behavior-preserving steps. Establish focused behavioral coverage before removing or collapsing a mechanism; use contract or integration checks when callers cross a boundary. If coverage is infeasible, report the limitation before relying on a weaker check.

Preserve public behavior, defaults, errors, side effects, and compatibility unless a change is explicitly approved. Check consumers again after rewiring them. Remove only mechanisms made unnecessary within the approved scope, and inspect the complete diff for collateral changes.

Run applicable project gates and report actual results. Do not weaken tests, suppress failures, lower thresholds, or introduce a toolchain to make a reduction appear successful. If a step reveals a necessary boundary or an unapproved behavior change, stop and reassess rather than forcing the deletion.

## Report the outcome

Report mode/scope, evidence-backed keep/simplify/defer decisions, proposed or actual changes, justified retained complexity, check results and unrun reasons, uncertainty, and required next approval. No change is valid when the existing design is the simpler sound choice.

Use the [decision examples](references/decision-examples.md) to check that a recommendation preserves the relevant constraints, not as rules to apply without investigation.
