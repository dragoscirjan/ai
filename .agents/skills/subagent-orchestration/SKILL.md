---
name: subagent-orchestration
description: Bound and coordinate child-agent workers, read-only reviewers, isolated temporary lanes, integration, validation, and lane cleanup. Use before delegating any task to child agents.
compatibility: Requires a harness with child-agent support; writable parallel lanes also need owner-approved workspace creation and exact-lane cleanup procedures.
metadata:
  author: dragoscirjan
  version: "1.0"
  opencode/slash: "true"
---

# Subagent orchestration

Keep simple tasks parent-owned. Delegate only when independent investigation, implementation, or review lanes reduce risk or materially improve throughput.

The parent remains accountable for the complete task. Child agents do not become independent coordinators.

## Enforce task-wide bounds

For one user task, including follow-up and replacement agents:

- use no more than three worker agents total
- use no more than two reviewer agents total
- exclude the parent from both counts
- count every non-review child role as a worker
- count failed, unsupported, cancelled, and replacement launches
- treat the bounds as limits, not quotas

Only an explicit owner instruction may raise a bound. Do not infer permission from task size, deadlines, harness capacity, or an earlier task.

Child agents must not delegate or launch other child agents. Give every child prompt this prohibition. Nested delegation is not an additional source of capacity.

If delegation is unavailable or fails, report that fact. The parent may continue directly when it can do so safely within the approved scope.

## Decide whether to delegate

Keep the task parent-owned when it is narrow, sequential, or cheaper to complete than to coordinate. Examples include one-file edits, small documentation fixes, and changes with tightly coupled steps.

A task may be complex enough to delegate when it has genuinely independent seams, such as:

- separate implementation areas with stable contracts
- a bounded research question that can remain read-only
- platform-specific checks that do not share mutable state
- fresh-context review of a completed mutation

Do not split work merely to consume the available limits.

## Establish the parent control plane

Before the first child launch, the parent records a lane board with, at minimum:

- lane and role
- assigned scope and acceptance contract
- workspace and branch or bookmark, when writable
- exclusive files or shared contract boundary
- status and child launch count

The parent owns:

- scope and task decomposition
- the lane board and all child communication
- write leases and conflict resolution
- the canonical pull-request branch and workspace
- integration order and accepted ancestry
- task-level validation
- temporary-lane cleanup
- final acceptance and final response

Children report to the parent only. They do not contact the owner, push, open or update pull requests, merge, release, or present work as finally accepted.

## Assign read and write lanes

Read-only children may share a workspace only when their commands cannot mutate repository or generated state.

A writable child receives one explicit write lease:

- assigned files or an exclusive contract boundary
- one isolated sibling workspace
- one branch or bookmark based on the canonical pull-request ref
- no nested workspace
- no files already leased to another writer

A worker must request parent permission before editing an unassigned or already claimed file. The parent either changes the lease explicitly or keeps the file parent-owned.

Before assigning any reused lane, inspect its status and provenance and confirm that all existing changes belong to this task and its assigned owner. Unrelated or uncertain work blocks assignment; never overwrite or absorb it. When more than one writer is active, create every temporary lane through an owner-approved workspace procedure. Stop if none is available. Name each lane ref `${CANONICAL_REF}--lane-${LANE_KEY}` with a one-component lane key; its workspace leaf is that ref's basename. Reserve `--lane-` for lanes, never canonical refs. Pass the canonical ref explicitly as the base; never default to trunk or base one lane on another. Preserve one writer per workspace.

## Maintain one canonical pull-request workspace

Use one canonical branch or bookmark and workspace for the pull request. Temporary Git branches/worktrees and Jujutsu bookmarks/workspaces are implementation lanes only.

Workers may create lane-local commits needed for integration, but they do not integrate their own work into the canonical ref. The parent:

1. inspects the lane diff and validation evidence
2. rejects or accepts the lane as a unit
3. rebases accepted lane work onto the current canonical ref when needed
4. fast-forwards the canonical ref so accepted lane commits remain in its ancestry
5. resolves cross-lane conflicts in the canonical workspace

Do not squash or copy changes in a way that discards accepted lane ancestry. Later changes start in a new lane based on the updated canonical ref; do not reuse a removed lane.

## Review complex mutations

A complex mutation normally receives one or two fresh-context, read-only reviewers after integration. Reviewer limits are task-wide, and reviewers do not edit, commit, or delegate.

For a requested two-axis review, keep Standards and Spec reviewers separate and aggregate their results without collapsing the axes. Both launches count against the two-reviewer limit.

The parent evaluates findings, applies or delegates approved fixes within the remaining worker limit, reruns relevant validation, and makes final acceptance decisions.

## Clean temporary lanes

Remove every integrated temporary lane before presenting the pull request. Use an owner-approved exact-lane cleanup procedure from the surviving canonical workspace; stop if none is available. The target ref must be the direct `${CANONICAL_REF}--lane-${LANE_KEY}` lane, with the matching workspace leaf. Review its bound plan before applying with confirmation and the matching plan ID.

For a temporary lane created for the current task under this approved orchestration workflow, the owner's initial authorization to use temporary lanes also authorizes the parent to confirm that exact cleanup plan without another owner round trip. This exception does not authorize ordinary cleanup, cleanup of another task, or cleanup of an unrelated workspace.

If a lane is dirty, active, locked, conflicted, detached, changed, unintegrated, inaccessible, or otherwise rejected, stop cleanup for that lane and report it. Never force removal or broaden the target.

## Finish

Before the final response, the parent confirms:

- task-wide worker and reviewer counts stayed within bounds
- no child performed nested delegation
- all accepted changes are on the canonical ref
- required validation ran from the canonical workspace
- integrated temporary lanes were removed
- failed or unsupported delegation and retained lanes are disclosed
- final acceptance remains parent-owned
