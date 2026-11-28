---
title: "Utility"
---

# Utility

Run background agents, initialize projects, isolate changes, and clean approved workspaces.

Choose by the task you have now. These are the collection's groups, including external recommendations. They are not a mandatory delivery pipeline.

## [`init-project`](/skills/init-project)

Initialize or adopt project foundations, TypeScript tooling, or Godot GDScript tooling only when explicitly requested.

**Choose it when:** You explicitly want a new project foundation or to adopt the supported TypeScript or Godot GDScript tooling.

## [`isolated-workspace`](/skills/isolated-workspace)

Create a dedicated task branch or bookmark before repository edits. Choose the current checkout or an isolated Git worktree or Jujutsu workspace; ask the user when the location is unclear.

**Choose it when:** A modifying task needs a dedicated branch or bookmark and a choice between the current checkout and a separate workspace.

## [`cleanup-workspaces`](/skills/cleanup-workspaces)

Audit integrated Git/Jujutsu workspaces, stale registrations, or authorized temporary lanes; apply only an approved exact cleanup plan.

**Choose it when:** You want to audit integrated workspaces, stale registrations, or explicitly authorized temporary lanes.

## [`background-agents`](/skills/background-agents)

When background delegation is authorized, keep the main agent available by assigning substantial work to task-scoped workers, tracking progress, and assessing concise results.

**Choose it when:** You authorize background workers for substantial work while keeping the main conversation available.

## Related procedures

[Choose an end-to-end workflow](/workflows/) before selecting an individual procedure.

- [Initialize only the foundation you need](/workflows/initialize-a-project) — You explicitly want a supported project foundation or tooling adoption.
- [Start a change on its own task branch](/workflows/protect-a-change) — A new task will change repository files, or an existing task needs verified continuation.
- [Delegate authorized work in the background](/workflows/delegate-bounded-work) — The operator or project authorizes background workers while the main conversation stays available.
- [Coordinate independent review without writers](/workflows/coordinate-read-only-review) — You want independent assessment but all changes must stay with the parent.
- [Clean only proven, approved workspaces](/workflows/clean-integrated-workspaces) — Completed work may have left integrated workspaces or stale registrations.
