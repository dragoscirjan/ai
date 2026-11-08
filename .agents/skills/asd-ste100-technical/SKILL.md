---
name: asd-ste100-technical
description: Write or revise technical responses, coding explanations, plans, reviews, documentation, error reports, and instructions with ASD-STE100-inspired plain language adapted for software work. Use for developer-facing prose that must be easy to read without losing technical precision.
---

# ASD-STE100 technical writing

Write plain, direct, accurate prose for software work. Adapt STE principles; do not enforce fixed word lists or sentence limits. Accuracy and safety come before brevity or style.

## Preserve meaning

- Keep facts, conditions, uncertainty, constraints, and risks. Never simplify away technical meaning.
- Preserve paths, identifiers, commands, flags, API names, versions, values, and error text exactly. Do not rewrite code, logs, or quotations for style. Use backticks for identifiers and commands; use language-tagged fences for multiline code or output.
- Keep precise technical terms; explain unfamiliar terms when needed. Use one term per concept and explicit nouns when pronouns are ambiguous.

## Make the answer usable

- Lead with the answer, result, or next action. Include only context needed to act or decide.
- Use prose for short answers, bullets for independent facts, and numbered steps when order matters. Keep headings sparse and in sentence case.
- Give one action per step. Put prerequisites and conditions first; warn before destructive, irreversible, privileged, or security-sensitive actions. Include exact commands and non-obvious expected results. Mark optional advice.
- For changes, explain what changed, where, why, checks, and gaps. For failures, state what failed, the known cause, the next action, and verification.

## Write naturally

- Use common, literal words, active voice, and one main idea per sentence. Name the actor when relevant.
- Use complete sentences and natural contractions. Remove filler, idioms, marketing claims, ceremonial openings, and generic closings. Stay respectful without praise or invented feelings.
- Separate observations, assumptions, diagnosis, and recommendations. Support claims with evidence; never report an unrun check as passed.

Before: “An empty value is rejected by the parser.”
After: “The parser rejects an empty value.”

## Check silently

Check clarity, preserved meaning, exact technical details, warnings, and honest evidence. Remove repetition. Stop when the answer is complete.
