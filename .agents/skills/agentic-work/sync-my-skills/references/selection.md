# Category and skill selection

Read after inspection and before asking selection questions. Use the run's pinned catalog and inspected project evidence. This phase chooses scope; preparation and installation still need their later approvals.

## 1. Offer categories first

Build the menu from the active project entries' catalog `category` values. Keep every category reachable, including those without recommendations. For an entry without a category, use an `Uncategorized` group. Personal tooling stays outside this menu. Categories are selection groups, not installation directories.

The first selection question asks which categories to review through the harness's native multi-select controls. Explain that categories left unchecked stay unchanged, including installed skills. Recommend categories from project evidence with short reasons; recommendations are not selections. Use readable labels alongside the catalog keys and skill counts. Discoverable facts come from inspection, not an introductory questionnaire.

Inspect the available question tool's schema. Respect its option, question, header, and label limits, and batch independent pages into one form where supported. Keep all category pages in this round; skills depend on the answers and belong to the next round. Each page identifies its part of the menu. For tools without empty submissions, reserve an option for `Leave this page unchanged`. Use that control to fill a singleton page to the tool's minimum option count as well. Page controls are not categories or skills. If a page control conflicts with checked entries, resolve that page before advancing.

If native multi-select is unavailable, explain the missing capability and pause for supported controls or cancellation. A numbered prose list or a request to type catalog names does not satisfy the checkbox workflow. Reading a tool schema does not prove its controls render in the current client.

**Done:** the user submitted every category page, including explicit unchanged-page choices where needed. The selected and skipped category sets cover the whole project catalog.

## 2. Offer skills within each chosen category

For each selected category, present its actual skill names through native checkboxes. Keep categories distinct in the form. Page large categories using the same controls and tool limits; every member remains reachable. In a singleton category, offer its skill and an explicit leave-unchanged control.

For each skill, show its purpose, a short project-specific recommendation or reason not to recommend it, verified installed/not-installed state, earlier decline, and known compatibility/runtime limits. Use recommendation labels and ordering rather than silently checking options. Label an update as available only after a source comparison establishes it; an installed name alone is not evidence of an update. Keep incompatible entries visible and explain what blocks them.

An unchecked installed skill stays installed and is not updated by this run. Earlier declines are context, not permanent exclusion. Preserve unknown custom installations outside the managed menu. The tool's optional custom-answer row can remain available, but ordinary catalog selection requires no typed skill names.

**Done:** every member of each reviewed category has an explicit selected or leave-unchanged decision, with no unanswered pages.

## 3. Resolve prerequisites and the other scopes

Compute the proposed installation closure and explain each prerequisite, including those in skipped categories. Use native decision controls to ask whether to accept the named prerequisites or drop the dependent selection. Apply the user's answer before preparing sources. A computed closure is not approval. Recheck the closure after changes, and preserve separately selected skills when dropping another skill.

Offer the instruction bundle separately, with its pinned prerequisites. The user can retain skills-only scope. Required guidance must be explicitly selected or already installed and reviewed; a skipped category does not satisfy that requirement. Missing guidance blocks instruction adoption, not permission to weaken target rules.

Confirm desired harnesses using their actual supported names, then resolve any incompatible selections. Ask separately about exact deprecated names to remove; retention is the default. A replacement choice never authorizes removal. Unknown custom names stay intact.

**Done:** prerequisites, instruction scope, supported harnesses, and exact removals are explicit and compatible. Installation or tool setup has not been inferred from a recommendation.

## 4. Confirm and record scope

Read back selected skills, accepted prerequisites, reviewed categories, skipped categories, instruction scope, harnesses, and removals. Wait for the user's confirmation. A correction reopens the affected choices, not unrelated settled questions. This scope confirmation is not approval of content changes or an apply plan.

Record decisions using the existing [selection contract](data-model.md#investigation-and-decisions):

- Put selected skills and accepted prerequisites in `selectedSkills`.
- Put every other active project skill in `declinedSkills` with the actual reason. For a skipped category, record `Category <key> left unchanged in this run.` after scope confirmation. Replace an earlier declined record if that skill is later accepted as a prerequisite.
- Keep removals in `removeSkills` only after the separate exact-name decision.
- Keep page controls and category navigation out of skill-name arrays. No new category field or second inventory is needed.

The complete decision record accounts for every entry without asking the user to review skills inside skipped categories. Renew decisions when the catalog or target inventory changes.

**Done:** the user confirmed the summary, and the selection accounts for every active project entry without conflicting selected/declined records. Continue to project discovery only if instructions were selected; otherwise continue to skills-only preparation.
