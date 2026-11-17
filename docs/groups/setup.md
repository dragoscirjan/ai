---
title: "Setup"
---

# Setup

Install selected skills, initialize projects, and protect the primary checkout.

Choose by the task you have now. These groups describe reader needs, not a mandatory delivery pipeline.

## [`sync-my-skills`](/skills/sync-my-skills)

Synchronize project skills and agent instructions through a guided, approved plan.

**Choose it when:** You want to choose project skills and review an optional instruction bundle without replacing custom policy blindly.

## [`init-project`](/skills/init-project)

Initialize or adopt project foundations, TypeScript tooling, or Godot GDScript tooling only when explicitly requested.

**Choose it when:** You explicitly want a new project foundation or to adopt the supported TypeScript or Godot GDScript tooling.

## [`isolated-workspace`](/skills/isolated-workspace)

Create or reuse an isolated Git worktree or Jujutsu workspace before mutation, using an explicit VCS and branch or bookmark.

**Choose it when:** A repository change needs a separate Git worktree or Jujutsu workspace instead of writes in the primary checkout.

## Try a workflow

- [Install a reviewed skill selection](/workflows/install-selected-skills) — An existing project needs useful skills, not an automatic copy of the entire collection.
- [Initialize only the foundation you need](/workflows/initialize-a-project) — You explicitly want a supported project foundation or tooling adoption.
- [Move a change out of the primary checkout](/workflows/protect-a-change) — The requested work will mutate a repository.
