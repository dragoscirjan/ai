---
name: background-agents
description: "When background delegation is authorized, keep the main agent available by assigning substantial work to task-scoped workers, tracking progress, and assessing concise results."
compatibility: Requires asynchronous child-agent execution and completion notification. Monitoring and steering depend on the harness. Writable lanes require owner-approved workspace creation and exact-lane cleanup procedures.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Background agents

Keep the main agent available for conversation and coordination. Give substantial research, planning, coding, documentation, review, testing, and integration work to background workers. Keep brief answers, clarification, dispatch, decisions, and final acceptance in the main conversation. Delegate tightly coupled work to one worker rather than doing it in the parent or forcing parallelism.

Use general-purpose workers with task-specific instructions. A predefined specialist roster, persistent worker memory, or a separately trained model is not required.

## 1. Confirm authority and runtime support

Require delegation authority from the user's request or applicable project instructions. Honor its task or session scope. Installing or discovering this skill does not authorize delegation, edits, experiments, installations, or publication. Each worker inherits the task's approval gates and permission ceiling.

Check the available child-agent tools for asynchronous launch, completion notification, status, cancellation, and output artifacts. Check live inspection and steering separately. Read [harness guidance](references/harnesses.md) for Pi, Claude Code, or an unfamiliar runtime before the first launch. Use only capabilities present in this session. Do not install extensions or alter permissions without approval.

If background execution or completion delivery is unavailable, explain the limitation and ask for an execution-mode decision. A failed launch is a blocker, not permission to start a foreground worker, an alternate CLI, or a long parent-owned job. Preserve the run state and any partial changes before an authorized retry.

Background execution keeps worker jobs off the main turn. It does not guarantee an immediate response during the parent's own model request or tool call.

## 2. Bound and record the work

Across the whole user task, including follow-ups and replacements, allow at most three workers and two reviewers, excluding the parent. Count every non-review child as a worker. Count failed, unsupported, cancelled, and replacement launches against the applicable limit. These are limits, not quotas. Only explicit owner instruction can raise them. Prohibit child delegation in every assignment.

Start with one worker for one substantial job. Run independent tasks concurrently only when their reads, writes, and resources cannot interfere. Keep dependent tasks sequential, including implementation followed by review. Use a fresh context for independent review.

Before launch, record a compact task board in the runtime's durable task or artifact storage. Record each assignment's objective, acceptance criteria, status, launch count, dependencies, run ID when available, working directory/ref, write ownership, report path, and next action or wake-up event. Keep secrets and full transcripts out of the board. If durable storage is unavailable, disclose the recovery limit and agree a permitted location before starting.

Give each worker a self-contained brief with:

- The objective, relevant requirements, and source or artifact pointers.
- The working directory/ref, allowed tools and operations, exclusive files or read-only boundary, and existing approval gates.
- Acceptance criteria, required verification, and stop conditions for missing context, conflicts, unsafe operations, or scope changes.
- A concise handoff contract with status, result, changed files/ref, verification evidence, unresolved concerns, and artifact paths. Full logs and detailed findings belong in artifacts.
- No nested delegation, direct owner questions, pushing, pull-request management, merging, releasing, or final acceptance. Send questions and progress through the parent.

Pass only relevant context. Use fresh worker contexts by default rather than copying the entire parent conversation. Inspect the state and provenance of any reused worker or workspace before assignment. Stop on unrelated or uncertain changes.

Read-only workers may share a directory only when their commands cannot mutate source, generated files, or shared resources. Before assigning writes, read [write ownership, integration, and cleanup](references/writable-lanes.md). Continue only with an exclusive lease and an owner-approved workspace procedure.

## 3. Launch, yield, and supervise

Launch asynchronously. Record the returned run ID and tell the user what is running and how to inspect it using the capabilities actually available. Then yield the turn while workers continue. Do not wait for the whole job, repeatedly poll status, or run a duplicate investigation in the parent. For a headless run-to-completion request, use the runtime's documented event loop instead of claiming an interactive conversation remains available.

Treat yielding as an in-progress handoff, not task completion. Record the next wake-up event. On completion notifications, reconcile the board and dispatch a ready dependent task within scope and remaining limits. Recover from durable state after compaction or reconnecting. Inspect recorded runs before relaunching work, and never mark a lost run successful.

Answer new user questions while workers run. Distinguish a separate question from a requested change to active work. Route revised scope or priorities to the affected worker, confirm the runtime accepted steering, and report unsupported steering rather than pretending it took effect. Stop or pause affected work before assigning conflicting writes. Cancellation must preserve and report partial changes.

For on-demand inspection, provide the supported fleet view, run details, bounded transcript, or log path. Label read-only observers separately from interactive attachment. Keep coordination and decision authority in the parent, even when the user follows a worker. Report meaningful progress, blockers, decisions, failures, and completion rather than streaming every tool call into the main conversation.

## 4. Assess results and close

Check each handoff against its assignment and evidence. Read detailed artifacts only when needed to resolve a finding or verify acceptance. A worker's success report is evidence, not automatic acceptance. Distinguish worker-reported checks from independently verified results.

The parent owns integration order, conflicts, review decisions, and validation. Delegate substantial integration, fixes, and test execution within the remaining limits; retain acceptance in the parent. Follow the writable-work reference for accepted ancestry and canonical-workspace validation.

A complex mutation normally receives one or two fresh-context, read-only reviewers after integration. Reviewers cannot edit, commit, or delegate. A requested Standards and Spec review uses separate reviewers and reports both axes. Both count against the task-wide reviewer limit. Resolve findings before acceptance or report them as unresolved.

Before declaring completion, reconcile all runs, launch counts, pending questions, accepted changes, verification evidence, and temporary-lane cleanup. Confirm that no worker remains active for work declared finished. Retain and report any rejected cleanup target. Close the durable task record with results, artifacts, checks, and unresolved limits. Keep final acceptance and the user-facing response parent-owned.
