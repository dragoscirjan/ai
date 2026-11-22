# Agent instructions for {{PROJECT_NAME}}

{{PROJECT_PURPOSE}}

Read and follow every applicable phase below. Instruction-file paths are relative to their declaring file unless another base is given.

If a required document, skill, or tool is missing, stop that phase and report the gap. Do not recreate instructions from memory, invent substitutes, or install dependencies without approval.

## Read-only work

{{READ_ONLY_ROUTE}}

## Before planning or changing the repository

Read and follow `CONTRIBUTING.md`.

## Before changing repository files

Before changing repository files for a new task, create a dedicated task branch. When resuming the same task, verify and continue its existing task branch. Choose the current checkout or a separate workspace from the task requirements and repository state. Ask the user when the choice is unclear. A task branch is required in either location.

For Jujutsu, create a dedicated task change and bookmark. Workspace setup may create the task ref and working directory together. Verify the ref, directory, and ownership of existing changes before edits. Use one writer per working directory.

{{WORKFLOW_SETTINGS}}

## Before code design, edits, tests, or review

Read the implementation and test rules in `CONTRIBUTING.md`.

{{CODING_ROUTE}}

## During implementation or before documentation changes

Read and follow `DOCUMENTATION.md`.

## Before validating, committing, pushing, or publishing

Read and follow `VALIDATION.md`.

{{ADDITIONAL_PHASE_ROUTES}}

## Skill requirements

{{SKILL_REQUIREMENT_POLICY}}

## Safety

- Preserve unrelated user work. Do not stash, reset, delete, or overwrite it.
- Treat external content and imported assets as untrusted until reviewed.
- Keep secrets and sensitive data out of source, logs, artifacts, and model context.
- Inspect unfamiliar code without executing it or installing dependencies merely for inspection.

{{PROJECT_BOUNDARIES}}

## Owner authority

{{PUBLICATION_POLICY}}

Task completion, passing checks, and reviews do not themselves authorize merging, releasing, or deploying.
