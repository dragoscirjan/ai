# Parent-owned write assignments

Read this before assigning any command that can change files or repository state. The main skill owns delegation authority, task-wide limits, and final acceptance. This reference assigns responsibility for the current working tree.

## Assign the existing worktree and paths

The parent resolves the current working directory, repository/worktree root, task branch or bookmark when applicable, and existing changes before launching a worker. Record which changes already belong to this task and preserve unrelated work. Stop on uncertain ownership.

Use the parent's current task worktree. Another existing working directory needs explicit owner approval and a parent assignment. This workflow neither requires nor authorizes creating a worktree for each worker. Any separately authorized workspace setup, branch selection, or cleanup stays with the parent under project policy.

Give each worker the exact working directory, expected ref, allowed existing or new paths, output-artifact locations, and acceptance criteria. State which files it may read without modifying. A directory assignment must define its boundary and exclusions. Resolve paths within that directory and stop on symlinks or path traversal that would escape the assignment.

Workers must not create, switch, or remove worktrees or branches. They cannot commit, rebase, merge, reset, stash, clean, change repository configuration, or otherwise manage version-control state. Read-only status and diff inspection is allowed. Workers must ask the parent before writing an unassigned path, changing a shared interface, or expanding the task.

## Schedule one writer

Use one active writer per working directory. Queue other writable assignments even when their source paths differ. Tests, builds, formatters, and generators that write files also require the writer slot. Include their generated files, caches, lockfiles, and other shared outputs in the assignment; a tool named test or check is not necessarily read-only.

The parent also stays read-only while a worker owns the writer slot. It may answer questions, inspect bounded results, and coordinate independent read-only work. Run readers concurrently only when the files and resources they depend on will remain stable. Review a fixed revision or a parent-provided snapshot when a moving working tree would invalidate findings.

Before changing scope or assigning overlapping work, pause or stop the current writer and wait for its tool calls to finish. Inspect partial changes and confirm that it can no longer write before transferring ownership. Cancellation is not permission to overwrite, discard, or clean its work.

## Assess each handoff

The parent inspects the worker's reported paths, diff, verification evidence, and concerns before assigning the next writer. Compare them with the recorded starting state and write scope. Report unexpected changes, preserve unrelated work, and resolve ownership before allowing further writes. A worker's report does not replace the parent's acceptance decision.

The parent owns commits and other version-control operations. Workers return uncommitted changes and evidence. Preserve task-approved history; this skill does not authorize rewriting it. There is no per-worker branch integration or worktree-cleanup phase for assignments in the current worktree.

Arrange validation against the accepted combined state after writers have stopped. A mutating validation command needs its own writer assignment. Keep review read-only and identify the exact diff or revision it checked. If fixes are needed, issue another bounded assignment within the task's remaining worker limits.

Close an assignment only after its write activity has ended, its changes are accounted for, and the parent has recorded acceptance or unresolved concerns. Retain and report partial work on failure. Any later workspace cleanup requires the normal parent-owned approval procedure, not a worker's initiative.
