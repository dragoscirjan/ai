---
name: specify
description: Record agreed behavior as a compact specification for implementation and review. Use when requirements need durable acceptance criteria, constraints, and test boundaries.
requires: ["grilling"]
---

# Specify

Write down the behavior and decisions that implementation and review must agree on. Do not use the writing step to make new decisions.

1. Read the source requirements, including relevant issue comments and confirmed answers. Inspect relevant code, contracts, and tests when available. Use the project's vocabulary and respect recorded architectural decisions. A separate initiative document is not required.
2. If behavior, constraints, contract values, or test expectations are unclear, use the required interview to settle those choices before writing. Reuse confirmed answers and look up available facts yourself. Surface any change to the agreed initiative's scope for agreement. Skip the interview when requirements are clear, and return to clarification if later steps expose another decision.
3. Establish the intended behavior, scope, exclusions, and constraints. Give acceptance criteria stable identifiers. Cover success, relevant failures, and boundary cases with observable results.
4. Capture agreed module, interface, API, or schema decisions where they matter. Preserve exact agreed values. Prefer stable contracts over guessed file paths or unnecessary code snippets.
5. Identify where tests can observe each required behavior. Prefer existing test interfaces and examples. Settle new test boundaries with the user. Check that a fresh reader can tell what counts as correct without guessing. Report blocking questions instead of writing speculative requirements.
6. Once the requirements are clear, resolve where and in what form to save the specification. Use a destination and format already specified by the user or applicable `AGENTS.md` and `CONTRIBUTING.md`. If either is unclear, ask now. Confirm whether to create or update an issue, document, or existing section. Do not invent a target.
7. Write and save the agreed specification at the authorized destination. Include the source references, settled requirements and test boundaries, draft or agreed status with evidence, and the next authorized action. Verify the saved content and report its actual path or URL, format, and status. Say if a save cannot be verified.

Stop after saving and reporting the specification. If saving is blocked, provide the prepared content marked "not saved" and explain what is needed. Do not create tasks, implement the work, or publish beyond the agreed destination automatically. Follow project gates. Agreement on the specification does not authorize execution.
