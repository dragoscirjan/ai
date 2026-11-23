---
title: "Requirements, companions, and handoffs"
---

# Requirements, companions, and handoffs

A line between two skill names can mean different things. Treating every useful combination as a prerequisite produces unnecessary installations and unsafe automatic follow-up work.

## Required instruction dependencies

`A → B` in this map means: resolve the installed instructions for **B before applying A**. It does not mean execute B after A. The catalog currently records **6 edges**, checked against the local `requires` frontmatter.

![Six declared instruction dependencies, directed from each requesting skill to its required instructions.](/diagrams/required-dependencies.svg)

[Open interactive diagram](/diagrams/required-dependencies.html){class="vp-raw"} · [Download SVG](/diagrams/required-dependencies.svg) · [Editable candidate](/diagram-sources/required-dependencies.json)

| Requesting skill | Required instructions |
| --- | --- |
| [`initiative`](/skills/initiative) | [`grilling`](/skills/grilling) |
| [`research`](/skills/research) | [`grilling`](/skills/grilling) |
| [`specify`](/skills/specify) | [`grilling`](/skills/grilling) |
| [`grill-me`](/skills/grill-me) | [`grilling`](/skills/grilling) |
| [`coding-with-rules`](/skills/coding-with-rules) | [`coding`](/skills/coding) |
| [`cleanup-workspaces`](/skills/cleanup-workspaces) | [`isolated-workspace`](/skills/isolated-workspace) |

The `requires` declaration is a project extension, not a standard Agent Skills field or a native loader guarantee. Resolve recursively in array order, stop on missing requirements or cycles, and obtain approved setup. Direct Skills CLI installation does not automatically install this closure. If a selected skill or required instructions are missing, stop the task and ask the user to install them. Resume only after installation is confirmed and availability is verified.

## Installation prerequisites

These are things that must exist before installation or use: an approved source, a trusted checkout, a parser dependency, filesystem support, or other documented setup. Do not turn a tool prerequisite into a new skill dependency. Installation still needs applicable approval.

## Runtime and harness requirements

A skill can need Bun, Node.js, a local browser, a rendering CLI, or authorized subagent tools without requiring another skill. The profile's runtime section comes from the catalog; the linked authoritative instructions define the complete contract. A supported harness name does not prove those capabilities are present.

## Optional companions

A companion helps under a stated condition. For example, choose `tdd` when the owner wants test-first work, or a diagram skill when the reader needs a visual relationship explanation. Do not install or run every companion automatically.

## Phase handoffs and owner decisions

A workflow arrow suggests a later phase; it is not a new `requires` edge or permission to continue. Research can end at findings, planning at a task list, scaffolding at a skeleton, and review at findings. Approval gates remain on the operation they protect. A draft cannot approve itself, and a successful review cannot authorize a merge or release.

[Choose a workflow](/workflows/) or [inspect an individual skill](/skills/).
