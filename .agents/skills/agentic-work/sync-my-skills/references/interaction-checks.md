# Check selection and discovery conversations

Read when validating a change to the manager's conversation. Use the current `SKILL.md`, [selection procedure](selection.md), and [project-instruction procedure](project-instructions.md). Static source checks and helper tests establish different facts from a live conversation.

## Choose a safe walkthrough

Use a disposable target with a trusted catalog, or a clearly identified conversational fixture. A conversational fixture supplies facts for a no-install exercise; it does not prove filesystem inspection, preparation, apply, or installed-state discovery. Obtain the participant's agreement before starting. Keep fixtures free of secrets and personal paths.

The following names and project are illustrative, not real catalog entries:

- Category `writing` contains `plain-language` and `reader-guide`.
- Category `coding` contains `small-functions`, `code-review`, `debugging`, `test-first`, and `refactoring`. This category must span pages when the tool offers at most four options including its page control.
- Category `workspace` contains only `task-isolation`.
- `reader-guide` requires `plain-language`. `test-first` requires `task-isolation` outside its category.
- `refactoring` was declined earlier. `small-functions` is installed with an owner edit. `custom-notes` is an unknown installation.
- The project holds public reader notes. An application runtime is absent. The intended audience and future automation policy need owner decisions.

Never install these illustrative names or present their supplied state as filesystem evidence. For integration checks, construct a real trusted fixture instead and record its actual catalog and target revisions.

## Exercise the branches

| Scenario | Observable result |
| --- | --- |
| First selection | The first selection question offers categories through native checkboxes, with recommendations and unchanged-category semantics. No generic bulk question or typed-name request precedes it. |
| Large category | Every member remains reachable through native pages sized from the tool schema. Page controls stay out of skill arrays. |
| Singleton and empty choice | A singleton has a valid leave-unchanged control. Empty-page choices leave that page unchanged. A conflicting page control and checked entry cause a correction before advancement. |
| Evidence and prior decline | Recommendations cite project facts. The prior decline is visible when its category is reviewed. Installed state is not described as an available update without comparison. |
| Skipped content | Skipped categories and unchecked installed skills are retained without updates. Unknown custom content remains outside the selection. Helper tests separately check filesystem retention. |
| Cross-category prerequisite | Selecting `test-first` triggers an explicit choice to accept `task-isolation` or drop the dependent skill. Nothing is silently added. Accepted prerequisites replace conflicting declined records. |
| Separate scopes | Instruction adoption, harnesses, and exact deprecated removals get separate decisions. The final summary includes skipped categories and waits for confirmation. |
| Project discovery | The agent uses supplied or inspected facts, asks only unresolved project-specific intent and policy, then reads back purpose, behaviour, non-goals, constraints, and development decisions. |
| Understanding correction | The participant corrects one material point. The agent revises the understanding and waits for confirmation before drafting. Understanding confirmation is not policy or apply approval. |
| Missing controls or unresolved intent | Missing native multi-select pauses selection. An unresolved material project decision pauses instruction drafting. Neither gap is replaced by guessed approval. |

Do not make up a deprecated installation to satisfy a scenario if the fixture has none. Test that branch separately with an explicit deprecated fixture entry. Test missing controls only in a client without them or clearly mark the branch as a scripted reasoning check.

## Record what actually happened

For each run, record the catalog/target or supplied fixture, skill revision, harness/client and exposed tool limits, participant choices, observed controls and replies, corrections, and untested branches. Check the actual return values rather than assuming the visual controls appeared because the request used `multiSelect`.

Report these evidence types separately:

1. Static checks of instructions, metadata, links, generated docs, and syntax.
2. Helper regression tests for decision coverage, prerequisite conflicts, and unchanged files.
3. An agent walkthrough against supplied facts or a real fixture, including where it stopped.
4. A live participant walkthrough through the current question controls, including confirmation/correction replies.
5. A complete target synchronization or installed-harness test, only if separately authorized and actually performed.

A live no-install fixture walkthrough establishes that the tested controls and conversational checkpoints worked for that run. It does not prove full synchronization or behaviour in other harnesses. Record a blocked or unrun scenario as a gap; static tests cannot close it.
