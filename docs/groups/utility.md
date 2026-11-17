---
title: "Utility"
---

# Utility

Initialize projects, isolate changes, and clean approved workspaces.

Choose by the task you have now. These are the collection's groups, including external recommendations. They are not a mandatory delivery pipeline.

## [`init-project`](/skills/init-project)

Initialize or adopt project foundations, TypeScript tooling, or Godot GDScript tooling only when explicitly requested.

**Choose it when:** You explicitly want a new project foundation or to adopt the supported TypeScript or Godot GDScript tooling.

## [`isolated-workspace`](/skills/isolated-workspace)

Create or reuse an isolated Git worktree or Jujutsu workspace before mutation, using an explicit VCS and branch or bookmark.

**Choose it when:** A repository change needs a separate Git worktree or Jujutsu workspace instead of writes in the primary checkout.

## [`cleanup-workspaces`](/skills/cleanup-workspaces)

Audit integrated Git/Jujutsu workspaces, stale registrations, or authorized temporary lanes; apply only an approved exact cleanup plan.

**Choose it when:** You want to audit integrated workspaces, stale registrations, or explicitly authorized temporary lanes.

## Try a workflow

- [Initialize only the foundation you need](/workflows/initialize-a-project) — You explicitly want a supported project foundation or tooling adoption.
- [Move a change out of the primary checkout](/workflows/protect-a-change) — The requested work will mutate a repository.
- [Clean only proven, approved workspaces](/workflows/clean-integrated-workspaces) — Completed work may have left integrated workspaces or stale registrations.
