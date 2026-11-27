# Write ownership, integration, and cleanup

Read this before assigning writes or creating a temporary worker workspace. The main skill owns delegation authority, task-wide limits, worker restrictions, and final acceptance.

## Lease one working directory

Give each writable worker an explicit lease covering assigned files or an exclusive contract boundary, one isolated sibling workspace, and one branch or bookmark based on the canonical pull-request ref. Use one writer per working directory and keep files exclusive to one writer. Read-only reviewers must not observe a moving diff when they need a fixed snapshot.

Create temporary lanes only through an owner-approved workspace procedure. Stop if the required procedure or ownership evidence is missing.

A worker must ask the parent before editing an unassigned or claimed file. The parent explicitly changes the lease or assigns the file to another worker after the prior lease ends. Preserve unrelated changes.

For temporary lanes, use `${CANONICAL_REF}--lane-${LANE_KEY}` with a one-component lane key and a workspace leaf matching the ref's basename. Reserve `--lane-` for lanes, not canonical refs. Pass the canonical ref explicitly as base. A lane must neither default to trunk nor start from another lane. Keep workspaces unnested.

## Integrate into one canonical ref

Temporary Git branches/worktrees and Jujutsu bookmarks/workspaces are implementation lanes, not separate pull-request workspaces. Workers may make authorized lane-local commits. They cannot accept their own work into the canonical ref.

The parent performs this sequence:

1. Inspect the lane diff and verification evidence, then accept or reject the lane as a unit.
2. Arrange rebasing of accepted lane work onto the current canonical ref when needed. Delegate substantial conflict resolution to an authorized worker in an isolated lane. Escalate decisions that change scope or contracts to the parent.
3. Fast-forward the canonical ref so accepted lane commits remain in its ancestry. Keep this acceptance operation parent-owned.
4. Arrange relevant validation against the integrated canonical state and inspect the returned evidence. A read-only validation worker may use the canonical workspace only if its commands cannot mutate shared state. Otherwise validate an isolated copy of the exact canonical revision.

Preserve accepted ancestry rather than squashing or copying changes. Integration and validation stay within the task's remaining worker allowance. If capacity or approval is missing, report the blocker. Start later changes in a new lane based on the updated canonical ref; a removed lane stays removed.

## Remove integrated lanes

Remove every integrated temporary lane before presenting the pull request. Use an owner-approved exact-lane cleanup procedure from the surviving canonical workspace. Stop if none exists.

The target must be the direct `${CANONICAL_REF}--lane-${LANE_KEY}` ref with its matching workspace leaf. Review its bound plan and apply only with confirmation and the matching plan ID.

The owner's initial authorization of temporary lanes for this current task also authorizes the parent to confirm their exact cleanup plans. This exception covers neither ordinary cleanup nor another task or unrelated workspace.

Stop cleanup for a dirty, active, locked, conflicted, detached, changed, unintegrated, inaccessible, or otherwise rejected lane. Retain and report it. Never force removal or widen the target.
