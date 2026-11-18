---
title: "Delegate only the work that was authorized"
---

# Delegate only the work that was authorized

This is a focused procedure. For its place in a larger workflow, see [Supporting tools and additional workflows](/workflows/supporting-tools).

The operator explicitly asks for specialists, independent review, or parallel work.

**Finish with:** Bounded child results integrated and validated by the parent.

## Read the diagram

![Delegate only the work that was authorized: suggested skill handoffs with approval stops where applicable.](/diagrams/delegate-bounded-work.svg)

[Open interactive diagram](/diagrams/delegate-bounded-work.html){class="vp-raw"} · [Download SVG](/diagrams/delegate-bounded-work.svg) · [Editable candidate](/diagram-sources/delegate-bounded-work.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Confirm authority and lanes.** [`subagent-orchestration`](/skills/subagent-orchestration) provides the guidance for this step.
2. **Bound child handoffs.** [`subagent-orchestration`](/skills/subagent-orchestration) provides the guidance for this step.
3. **Run authorized child work.** [`subagent-orchestration`](/skills/subagent-orchestration) provides the guidance for this step.
4. **Integrate and validate.** [`subagent-orchestration`](/skills/subagent-orchestration) provides the guidance for this step.

## Where to stop

Read-only children do not need write lanes. Authorized concurrent writers do, and temporary-lane cleanup has its own ownership and approval rules.

## Optional branches

- Choose [`isolated-workspace`](/skills/isolated-workspace) when a repository change needs a separate Git worktree or Jujutsu workspace instead of writes in the primary checkout.
- Choose [`code-review`](/skills/code-review) when you want changes since a fixed commit, branch, tag, or merge-base checked against both standards and the originating specification.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
