---
title: Supporting tools and other workflows
---

# Supporting tools and other workflows

Use these tools around the [five project workflows](/workflows/). They provide setup, clarification, execution safeguards, or a separate bounded result. They are not extra stages that every project must complete.

## Before you start

1. Read the target project's instructions and confirm the requested result and permitted actions.
2. Check the selected skills' profiles and authoritative instructions. Follow [installation choices](/guide/install) for missing skills rather than assuming a website listing installs them.
3. Resolve declared instruction requirements separately from runtime tools and harness capabilities. If a selected skill or requirement is missing, stop the task, list the missing names, and ask the user to install them. Do not fetch, synchronize, substitute, delegate, or continue without those instructions. Resume only after installation is confirmed and availability is verified.
4. Confirm the output destination, workspace requirements, checks, and authority for actions that write state.

A `/skill-name` label in a diagram identifies a skill, not a portable invocation. These guides use prompts as examples, not shell commands or portable slash commands. Load the intended installed skill through your harness, then adapt the prompt to the target project. Harness-specific loading is described in [first use](/guide/first-use).

Arrows show possible handoffs. They do not change `requires` declarations or grant authority for a later phase. See [relationship types](/reference/relationships).

## Workspace safeguards and setup

Apply the target project's task-branch and working-location policy before edits. [`isolated-workspace`](/skills/isolated-workspace) can establish the task ref in the current checkout or a separate workspace. The agent chooses from task constraints and asks when unclear. Use [`cleanup-workspaces`](/skills/cleanup-workspaces) only for separately authorized cleanup.

These safeguards protect planning records, source edits, documentation, and other writes alike. They belong around execution rather than inside each product-flow diagram. This repository requires a dedicated branch for every new modifying task. A worktree is optional; continuing the same task uses its verified branch.

Focused procedures:

- [Prepare a task branch and working directory](/workflows/protect-a-change).
- [Clean proven, approved workspaces](/workflows/clean-integrated-workspaces).
- [Install a reviewed skill selection](/workflows/install-selected-skills).
- [Initialize only an approved project foundation](/workflows/initialize-a-project).

Installing skills does not initialize a project. Initializing a project does not authorize feature work. The reviewed-selection manager is a separate, explicitly requested tool, not a prerequisite, companion, handoff, or missing-skill recovery step for these workflows.

## Clarification and explanation

Use [`grilling`](/skills/grilling) to settle unresolved decisions or stress-test a plan when selected. Reuse confirmed answers and inspect available project facts before asking the user.

The current `research`, `initiative`, and `specify` skills declare `grilling` as required instructions. The interview itself is contextual, but loading the declared requirement is not optional. Changing that dependency needs a separate approved skill change.

Use [`wait-what`](/skills/wait-what) when an explanation needs simpler language or missing context. For focused procedures, see [challenge a plan](/workflows/challenge-a-design) and [ask for a clearer explanation](/workflows/re-pitch-an-explanation).

## Authorized delegation

Use [`subagent-orchestration`](/skills/subagent-orchestration) when the operator authorizes specialists, independent review, or parallel work. Define bounded tasks, ownership, allowed writes, integration checks, and capacity limits.

Delegation is an execution choice, not a mandatory step between planning and coding. A task list alone does not authorize launching workers.

See [delegate bounded work](/workflows/delegate-bounded-work) or [coordinate read-only review](/workflows/coordinate-read-only-review). Keep direct execution as an available route.

## Review an existing change

An existing branch or change can enter review without repeating planning or implementation.

```text
Fixed comparison and requirements
    ↓
code-review: Standards and Spec
    ↓
Findings and verification limits
    ↓
Stop, or authorize corrections
```

[`code-review`](/skills/code-review) requires Git and a harness that supports parallel read-only reviewers. Confirm delegation authority and capacity before launching them. Pin the comparison and provide the same immutable endpoints to both reviewers.

The current skill reviews committed snapshots, not uncommitted edits. If the intended change is still uncommitted, obtain authority for the needed snapshot or agree another review method. Do not commit merely to satisfy this guide.

Find the real specification rather than inventing one. If the user confirms none exists, report the skipped Spec axis. If reviewer capabilities are unavailable, disclose the blocker and agree an alternative rather than pretend the two-axis review ran.

See [Review a fixed diff from two perspectives](/workflows/review-against-standards-and-spec).

## Learn from completed work

Use [`retro`](/skills/retro) after a bounded period with enough evidence to examine its process.

```text
Session evidence and check results
    ↓
retro: inspect problems and causes
    ↓
Recommend bounded improvements
    ↓
Stop for owner selection
```

Distinguish lasting lessons from one-off friction. Stop at recommendations. An instruction change follows its own approval process, not automatic editing during a retrospective.

See [Turn a completed issue into a small improvement](/workflows/learn-from-completed-work).

## Diagrams and writing aids

Use a diagram only when it answers the reader's relationship question. Choose [interactive HTML with Archify](/workflows/explain-with-archify) or [an editable image with Excalidraw](/workflows/draw-with-excalidraw) according to the needed output and available tools.

For prose, [shorten without losing meaning](/workflows/shorten-without-loss). Keep precise identifiers, conditions, warnings, and complete instructions.

Agent-facing guidance has a separate audience. Use [write guidance for an agent reader](/workflows/write-agent-facing-guidance) for skills and instructions, rather than treating every project documentation page as agent policy.

When instruction routes or dependency metadata drift, use [repair instruction drift through exact approval](/workflows/repair-instruction-routes). Investigating a mismatch does not authorize changing policy.
