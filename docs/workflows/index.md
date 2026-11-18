---
title: "Project workflows"
---

# Project workflows

Choose the result you need. Each guide explains where to start, which skill to use next, what to carry into the next phase, and when to return to earlier work.

| Your goal | Workflow |
| --- | --- |
| Define requirements, limitations, and implementation-ready tasks. | [Plan a project or feature](/workflows/plan-a-project) |
| Turn an agreed task into tested behavior and reviewed changes. | [Implement a planned task](/workflows/implement-a-task) |
| Find an evidence-backed cause, then fix and verify the failure. | [Debug an application problem](/workflows/debug-a-problem) |
| Create or improve a documentation website around reader tasks. | [Document a project](/workflows/document-a-project) |
| Reduce unnecessary complexity while preserving required behavior. | [Debloat a project](/workflows/debloat-a-project) |

## How the workflows connect

```text
Planning → agreed task
    ↓
Implementation

Failure → debugging → verified fix
Missing guidance → documentation
Complexity → debloating
```

Debugging and debloating reuse implementation and review after their investigation. Documentation can be a separate project or part of any behavior-changing task. Return to planning when a finding changes requirements or scope.

You can start with an existing specification or task. You do not need to repeat research or create documents merely to complete a pipeline. Research can also stop at findings without producing implementation work.

## Read the flows

Arrows show suggested handoffs, not automatic execution or instruction dependencies. The guides mark optional branches and explicit stops. A handoff carries the agreed scope, decisions, and verification evidence; it does not grant permission for the next action. See [requirements and handoffs](/reference/relationships) for the dependency rules.

## Supporting tools and other workflows

Workspace isolation and cleanup protect execution; they are not stages in a product workflow. Interviews, delegation, and diagrams help only when the task needs them. See [supporting tools](/workflows/supporting-tools) for setup, limitations, and focused procedures.

Two additional workflows can stand alone: [review an existing change](/workflows/review-against-standards-and-spec) and [learn from completed work](/workflows/learn-from-completed-work). Neither automatically changes the project.
