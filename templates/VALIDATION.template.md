# Validation

Read this document before validating, committing, pushing, or publishing a repository change. Run the checks that match the changed behavior and files. Use the project's configured tools; do not invent commands or thresholds.

## Every change

- Review repository status and the complete diff.
- Confirm that only approved task files changed and unrelated user work remains intact.
- Check examples, paths, links, and documentation against behavior that exists.
- Report checks as passed, failed, not run, or unsupported. Never report an unexecuted check as passed.

{{REVIEW_COMMANDS}}

## Project checks by change type

{{PROJECT_CHECKS}}

## Documentation checks

{{DOCUMENTATION_CHECKS}}

## Instruction and skill changes

When instruction documents or installed skills change:

- Check document scope, phase routes, local references, and required targets for missing files, conflicts, duplication, and ambiguity.
- Check declared instruction requirements and their load order. Detect missing targets and cycles using the project's actual dependency convention, not assumed native harness behavior.
- Verify selected skill metadata and complete supporting files when applicable.
- Preserve target-owned safety rules, approval gates, validation requirements, and publication authority. Record approval for consequential instruction changes.
- Distinguish static reference checks from observed live harness loading.

{{HARNESS_CHECKS}}

## Validation limits

{{VALIDATION_LIMITATIONS}}

Do not install or reconfigure tools, suppress failures, lower thresholds, or replace a missing gate with a no-op without the applicable approval. A passing build does not establish example correctness, reader comprehension, live service behavior, or production compatibility.

## Completion and handoff

{{COMPLETION_RULES}}

Report changed files, checks and their results, unresolved gaps, and remaining owner actions. If a required check cannot run, identify the blocker and obtain an explicit owner decision before treating the work as complete. Validation does not authorize publication.
