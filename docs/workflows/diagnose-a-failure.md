---
title: "Find the root cause before proposing a fix"
---

# Find the root cause before proposing a fix

This is a focused procedure. For its place in a larger workflow, see [Debug an application problem](/workflows/debug-a-problem).

A test, build, runtime result, or previously working behavior fails unexpectedly.

**Finish with:** A supported diagnosis and a separate proposed fix, not a stack of guesses.

## Read the diagram

![Find the root cause before proposing a fix: suggested skill handoffs with approval stops where applicable.](/diagrams/diagnose-a-failure.svg)

[Open interactive diagram](/diagrams/diagnose-a-failure.html){class="vp-raw"} · [Download SVG](/diagrams/diagnose-a-failure.svg) · [Editable candidate](/diagram-sources/diagnose-a-failure.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Reproduce and collect evidence.** [`systematic-debugging`](/skills/systematic-debugging) provides the guidance for this step.
2. **Trace the root cause.** [`systematic-debugging`](/skills/systematic-debugging) provides the guidance for this step.
3. **Test one hypothesis.** [`systematic-debugging`](/skills/systematic-debugging) provides the guidance for this step.
4. **Report cause and fix proposal.** [`systematic-debugging`](/skills/systematic-debugging) provides the guidance for this step.

## Where to stop

Stop at diagnosis when the request is diagnostic. Mutating experiments still need the project's isolation and approval; implementation is a later authorized phase.

## Optional branches

- Choose [`coding-with-rules`](/skills/coding-with-rules) when code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.
- Choose [`tdd`](/skills/tdd) when you explicitly want test-first feature or bug work, or integration-test slices through public behavior.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
