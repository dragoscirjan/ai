# Validation

Read before validating, committing, pushing, or publishing. Use configured checks for the changed files and behavior. Do not invent commands or thresholds.

## Every change

- Review status and the complete diff. Keep changes within approved scope and preserve unrelated work.
- Check documentation, examples, paths, and links against implemented behavior.
- Report each check as passed, failed, not run, or unsupported. An unexecuted check has not passed.

{{REVIEW_COMMANDS}}

## Checks by change type

{{PROJECT_CHECKS}}

## Documentation

Use `DOCUMENTATION.md` for the approved engine, configuration, sources, and canonical commands.

{{DOCUMENTATION_CHECKS}}

## Instruction and skill changes

- Check scope, phase routes, references, and required targets for missing files, conflicts, duplication, and ambiguity.
- Check requirement load order, missing targets, and cycles using the project's actual dependency convention.
- Verify selected skill metadata and complete support files.
- Preserve safety rules, approval gates, validation requirements, and publication authority. Record approval for consequential instruction changes.
- Distinguish static reference checks from observed live harness loading.

{{HARNESS_CHECKS}}

## Limits

{{VALIDATION_LIMITATIONS}}

Obtain approval before installing or reconfiguring tools, suppressing failures, lowering thresholds, or replacing a missing gate with a no-op. A passing build does not prove example correctness, reader comprehension, live service behavior, or production compatibility.

## Completion

{{COMPLETION_RULES}}

Report changed files, check results, gaps, and remaining owner actions. If a required check is blocked, obtain an explicit owner decision before calling the work complete. Validation does not authorize publication.
