---
name: code-review
description: "Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes: Standards (does the code follow this repo's documented coding standards?) and Spec (does the code match what the originating issue/spec asked for?). Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to \"review since X\"."
license: MIT
compatibility: Requires Git and a harness that can run two read-only subagents in parallel.
metadata:
  author: Matt Pocock
  source: https://github.com/mattpocock/skills/tree/59db609eb1e18aaf59b63284d0e52255aff0c63c/skills/engineering/code-review
  upstream-commit: "59db609eb1e18aaf59b63284d0e52255aff0c63c"
---

Review the diff between HEAD and a user-supplied fixed point along two independent axes:

- **Standards:** conformance to documented repository standards.
- **Spec:** conformance to the originating issue or specification.

Use separate parallel, read-only subagents. They may inspect state and run non-mutating checks, but must not edit, commit, push, post comments, or delegate. Aggregate both reports without letting one axis mask the other.

## 1. Pin the comparison

Ask for a fixed point if none was supplied. Resolve it with `git rev-parse <fixed-point>` and confirm the diff is nonempty before launching reviewers. Stop on an invalid ref or empty diff.

Give both reviewers the same comparison:

```sh
git diff <fixed-point>...HEAD
git log <fixed-point>..HEAD --oneline
```

The three-dot diff uses the merge-base. Capture the diff command and commit list once.

## 2. Locate the specification

Use the repository's configured issue tracker. Find the spec in this order:

1. Issue references in commit messages, fetched through configured tracker tools.
2. A user-supplied path.
3. A matching file under docs/, specs/, or .scratch/.
4. Ask the user if none was found or the tracker is unavailable.

If the user confirms no spec exists, skip only the Spec reviewer and report “no spec available.” Never invent requirements.

## 3. Locate standards and carry the smell baseline

Find repository documents governing code, always including CODING_STANDARDS.md and CONTRIBUTING.md when present.

The Standards reviewer also receives the complete Fowler smell baseline below. Documented repository standards override these heuristics. Label smells as possible issues, not hard violations, and skip matters already enforced by tooling. Refactor only when the context justifies the suggested remedy.

- **Mysterious Name:** intent is unclear. Rename honestly; an impossible name may indicate unclear design.
- **Duplicated Code:** repeated logic represents the same concept. Consider a shared implementation.
- **Feature Envy:** behavior chiefly uses another object's data. Consider moving it to that owner.
- **Data Clumps:** fields repeatedly travel together. Consider a cohesive type.
- **Primitive Obsession:** primitives obscure a meaningful domain concept. Consider a small domain type.
- **Repeated Switches:** dispatch on the same type repeats. Consider one shared map or appropriate polymorphism.
- **Shotgun Surgery:** one logical change needs scattered edits. Consider gathering the responsibility.
- **Divergent Change:** one module changes for unrelated reasons. Consider splitting responsibilities.
- **Speculative Generality:** unsupported future needs caused abstractions, parameters, or hooks. Remove the unnecessary mechanism.
- **Message Chains:** callers navigate internal object structure. Consider hiding that navigation.
- **Middle Man:** a class/function mostly forwards calls. Consider calling the actual target.
- **Refused Bequest:** an inheritor rejects most inherited behavior. Consider composition instead.

## 4. Launch the independent reviewers together

Each receives the diff command, commit list, read-only boundary, and its own evidence sources. Keep their contexts and reports separate.

**Standards reviewer:** include the standards-file list and paste the full smell baseline. Ask for fewer than 400 words covering:

- Documented-standard violations by file/hunk, citing the source file and rule.
- Possible baseline smells, naming the smell and quoting the hunk.
- A clear distinction between hard documented breaches and contextual heuristics. Repository rules win; tooling-enforced issues are excluded.

**Spec reviewer:** include the spec path or fetched contents. Ask for fewer than 400 words covering:

- Missing or partial requirements.
- Unrequested behavior or scope creep.
- Apparently implemented requirements whose behavior is wrong.

Require a spec quotation for each finding. If the spec is unavailable under step 2, do not launch that reviewer.

## 5. Report each axis separately

Present the reports under **Standards** and **Spec**, verbatim or lightly cleaned. Do not merge, rerank, or choose an overall winning axis.

End with the finding count and worst issue within each axis, if any. One axis may pass while the other fails: correct implementation can violate standards, and standards-compliant code can implement the wrong requirement. State unverified checks and the skipped-spec condition explicitly.
