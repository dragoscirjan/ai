---
name: debloat
description: Prevent overengineering during code design and implementation, or simplify existing code, configuration, dependencies, and abstractions through evidence-backed refactoring. Use when a direct solution may replace unnecessary mechanisms without weakening behavior, public contracts, security, or operational needs. Not for prose compression.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Debloat

Prefer a familiar, direct solution that fits the project. Minimize the total burden of understanding, changing, testing, securing, and operating it, not just its line count. Complexity is justified when it serves correctness, security, compatibility, a genuine boundary, tests, operational recovery, or measured constraints.

## Establish scope and authority

Choose the mode from the request:

- **Prevent:** compare the proposed design with the simplest project-compatible implementation of the known requirements.
- **Simplify:** investigate existing mechanisms and propose or implement behavior-preserving reductions within the named area.

Confirm the affected behavior, allowed files or subsystem, public contracts, and whether the request permits edits. A review-only request stays read-only: report candidates and evidence without editing files, generating artifacts, or running checks that write state. Do not turn a local task into repository-wide cleanup. Ask before expanding scope or changing behavior or contracts.

This skill does not authorize mutation or publication and does not require `scaffold`. Either skill can be used independently. It is engineering guidance, not a writing-compression workflow.

Follow applicable project instructions by phase:

- Before code design or implementation, locate and read the sibling `coding` skill through its advertised name and path. Load the applicable advertised language and extension skills in their required order. Use their standards rather than duplicating them here.
- Before any repository mutation, satisfy the project's workspace and approval gates, including `isolated-workspace` when required.
- Before validation, follow the project's validation policy and configured checks.

If a required skill or instruction is unavailable, stop its gated phase and ask the owner to expose it. Do not reconstruct it or automatically install skills, tools, or dependencies. A read-only inventory does not require preloading implementation skills.

## Gather evidence

Read nearby implementation, tests, configuration, manifests, and documented contracts. Trace actual callers and consumers, including public exports, plugin registration, CLI entrypoints, generated code, build and deployment wiring, environment inputs, and external integrations where relevant. No imports found is not proof that something is unused.

For each candidate, identify:

- the requirement it serves and who depends on it
- its present cost, such as indirection, synchronized facts, failure modes, setup, or maintenance work
- a direct alternative and any behavior, compatibility, security, test, or operational risk
- evidence supporting the decision and facts still unknown

Treat speculative extensibility, pass-through layers, duplicate facts, and apparently unused mechanisms as questions to investigate, not deletion orders. If consumers or constraints cannot be verified, defer removal and state the missing evidence.

## Compare alternatives

In prevent mode, start with the project's familiar direct approach. Add a mechanism only for an identified need; record why the direct approach is insufficient. Do not create a framework for imagined future variants.

In simplify mode, compare the current implementation with a concrete smaller design. Consider these candidates only where evidence supports them:

| Candidate | Investigation |
|---|---|
| Factory, registry, interface, or forwarding layer | Does it enforce a boundary, isolate change, enable required tests, or have real variants? Would direct construction or calls preserve those properties? |
| Repeated code or configuration facts | Is this the same stable concept? Would one owner reduce drift without coupling unrelated behavior? |
| Options, flags, hooks, or fallback paths | Who supplies or relies on them, including deployment and recovery workflows? What contract would removal affect? |
| Dependency | What runtime, build, test, or transitive role does it serve? Would replacement increase security, compatibility, or maintenance obligations? |
| Cache or other optimization | What measurements and operational constraints justify it? Would the alternative still meet them? |

Keep established cryptography and authorization controls. A shorter homegrown replacement or fewer security checks is not simplification. Preserve error handling, observability, recovery paths, and tests that protect real requirements.

Do not impose universal line, file, or package counts, deletion quotas, interface bans, or dependency API-use thresholds. Do not merge merely similar code or replace a maintained library with custom code merely because few APIs are used. A local reduction that spreads obligations to callers may cost more overall.

Assign each candidate a decision:

- **Keep:** its value or boundary justifies the cost; name the evidence.
- **Simplify:** a concrete alternative lowers maintenance burden while meeting the same requirements.
- **Defer:** uncertainty, risk, missing authority, or an unmet prerequisite blocks a safe change; name what would resolve it.

## Apply authorized changes

For an edit-authorized task, follow `coding` and applicable language guidance. Make small, reviewable, behavior-preserving steps. Establish focused behavioral coverage before removing or collapsing a mechanism; use contract or integration checks when callers cross a boundary. If coverage is infeasible, report the limitation before relying on a weaker check.

Preserve public behavior, defaults, errors, side effects, and compatibility unless a change is explicitly approved. Check consumers again after rewiring them. Remove only mechanisms made unnecessary within the approved scope, and inspect the complete diff for collateral changes.

Run applicable project gates and report actual results. Do not weaken tests, suppress failures, lower thresholds, or introduce a toolchain to make a reduction appear successful. If a step reveals a necessary boundary or an unapproved behavior change, stop and reassess rather than forcing the deletion.

## Report the outcome

Report the mode and scope, keep/simplify/defer decisions with evidence, changes made or proposed, justified retained complexity, checks passed or failed, checks not run and why, and remaining uncertainty. State any approval needed for a later step. No change is a valid result when the existing design is the simpler sound choice.

Use the [decision examples](references/decision-examples.md) to check that a recommendation preserves the relevant constraints, not as rules to apply without investigation.
