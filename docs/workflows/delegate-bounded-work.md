---
title: "Delegate authorized work in the background"
---

# Delegate authorized work in the background

This is a focused procedure. For its place in a larger workflow, see [Supporting tools and additional workflows](/workflows/supporting-tools).

The operator or project authorizes background workers while the main conversation stays available.

**Finish with:** Bounded worker results assessed by the parent, with progress inspection and verification evidence.

## Read the diagram

![Delegate authorized work in the background: suggested skill handoffs with approval stops where applicable.](/diagrams/delegate-bounded-work.svg)

[Open interactive diagram](/diagrams/delegate-bounded-work.html){class="vp-raw"} · [Download SVG](/diagrams/delegate-bounded-work.svg) · [Editable candidate](/diagram-sources/delegate-bounded-work.json)

Arrows show this suggested sequence, not declared `requires` dependencies. Approval arrows are conditional. Declining a gate stops that branch without authorizing its writes. The numbered steps below are the text equivalent of the diagram.

## Before you start

Use a trusted project and follow its instructions. Confirm the requested scope, installed skills, runtime tools, and any required workspace or approval. No additional instruction requirement is recorded for these selected steps.

## Steps

1. **Confirm authority and paths.** [`background-agents`](/skills/background-agents) provides the guidance for this step.
2. **Bound child handoffs.** [`background-agents`](/skills/background-agents) provides the guidance for this step.
3. **Run authorized child work.** [`background-agents`](/skills/background-agents) provides the guidance for this step.
4. **Integrate and validate.** [`background-agents`](/skills/background-agents) provides the guidance for this step.

## Where to stop

Confirm background execution and completion delivery before launch. The parent assigns the current worktree and exact writable paths, with one writer per directory. Workers do not manage worktrees or branches. Report unsupported monitoring or steering, and preserve approval and acceptance gates.

## Optional branches

- Choose [`isolated-workspace`](/skills/isolated-workspace) when a modifying task needs a dedicated branch or bookmark and a choice between the current checkout and a separate workspace.
- Choose [`code-review`](/skills/code-review) when you want changes since a fixed commit, branch, tag, or merge-base checked against both standards and the originating specification.

Optional branches are not prerequisites or permission to launch another phase. You can omit them or stop at the stated result. See [relationship types](/reference/relationships) for the distinction.
