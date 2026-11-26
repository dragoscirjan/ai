// Suggested human workflows, not additional requires edges or execution authority.
const work = (skill, label) => ({ skill, label, kind: "work" });
const gate = (skill, label) => ({ skill, label, kind: "approval" });

// Primary guides are authored Markdown. Recipe IDs preserve links to narrower procedures.
export const workflowGuides = [
  {
    id: "plan-a-project",
    title: "Plan a project or feature",
    when: "Define requirements, limitations, and implementation-ready tasks.",
    recipes: [
      "research-a-decision",
      "shape-an-initiative",
      "specify-observable-behavior",
      "plan-bounded-tasks",
      "challenge-a-design",
    ],
  },
  {
    id: "implement-a-task",
    title: "Implement a planned task",
    when: "Turn an agreed task into tested behavior and reviewed changes.",
    recipes: ["implement-a-small-change", "build-test-first", "scaffold-without-implementation"],
  },
  {
    id: "debug-a-problem",
    title: "Debug an application problem",
    when: "Find an evidence-backed cause, then fix and verify the failure.",
    recipes: ["diagnose-a-failure"],
  },
  {
    id: "document-a-project",
    title: "Document a project",
    when: "Create or improve a documentation website around reader tasks.",
    recipes: ["maintain-task-based-docs"],
  },
  {
    id: "debloat-a-project",
    title: "Debloat a project",
    when: "Reduce unnecessary complexity while preserving required behavior.",
    recipes: ["simplify-a-design"],
  },
];

export const workflows = [
  {
    id: "install-selected-skills",
    title: "Install a reviewed skill selection",
    group: "agentic-work",
    when: "An existing project needs useful skills, not an automatic copy of the entire collection.",
    outcome:
      "A verified installation of the approved skill selection, with project instructions unchanged.",
    steps: [
      { tool: "sync-skills", label: "Choose categories and agents", kind: "work" },
      { tool: "sync-skills", label: "Preview selected commands", kind: "work" },
      { tool: "sync-skills", label: "Approve selected paths", kind: "approval" },
      { tool: "sync-skills", label: "Install selected skills", kind: "work" },
      { tool: "sync-skills", label: "Verify files and notices", kind: "work" },
    ],
    optional: ["isolated-workspace", "sync-my-agents", "instruction-maintenance"],
    limit:
      "Use the Node.js CLI for installation. Existing destinations require explicit overwrite approval; unsupported semantic adaptations stop installation. Instruction review is a separate, explicitly requested sync-my-agents operation, not an installation step.",
  },
  {
    id: "initialize-a-project",
    title: "Initialize only the foundation you need",
    group: "utility",
    when: "You explicitly want a supported project foundation or tooling adoption.",
    outcome: "A checked baseline with setup instructions, without unrelated application machinery.",
    steps: [
      work("init-project", "Inspect the starting point"),
      gate("init-project", "Approve the baseline"),
      work("isolated-workspace", "Create task branch"),
      work("init-project", "Install approved foundation"),
      work("document-project", "Explain first use"),
    ],
    optional: ["coding-with-rules"],
    limit:
      "Stop if the baseline or installations are not approved. Do not infer initializer permission from a general coding or documentation request.",
  },
  {
    id: "protect-a-change",
    title: "Start a change on its own task branch",
    group: "utility",
    when: "A new task will change repository files, or an existing task needs verified continuation.",
    outcome:
      "A dedicated task ref and verified working directory, with or without a separate workspace.",
    steps: [
      work("isolated-workspace", "Inspect task and checkout"),
      work("isolated-workspace", "Choose ref, base, location"),
      work("isolated-workspace", "Check setup permissions"),
      work("isolated-workspace", "Create ref; verify directory"),
    ],
    optional: ["coding-with-rules", "document-project"],
    limit:
      "Ask when the location is unclear. Isolation needs the owner's exact plan approval; current-checkout setup follows the project's normal permissions. Stop after task-ref setup or verified same-task continuation. Setup does not approve source changes, cleanup, resets, stashes, or another owner's work.",
  },
  {
    id: "research-a-decision",
    title: "Research before choosing an approach",
    group: "productivity",
    when: "Missing facts could change a technical or product decision.",
    outcome: "An evidence-backed comparison with explicit unknowns and a decision boundary.",
    steps: [
      work("research", "Frame the decision"),
      work("grilling", "Resolve unclear constraints"),
      work("research", "Gather and compare evidence"),
      work("research", "Report findings and limits"),
    ],
    optional: ["wait-what", "initiative"],
    limit:
      "Stop at the research answer. Implementation, dependency installation, and policy changes are different requests.",
  },
  {
    id: "shape-an-initiative",
    title: "Turn an idea into an outcome-level brief",
    group: "productivity",
    when: "The problem and success measures are less clear than the proposed solution.",
    outcome: "An agreed problem, outcomes, scope, constraints, and success measures.",
    steps: [
      work("initiative", "Describe the problem"),
      work("grilling", "Interview about outcomes"),
      work("initiative", "Bound scope and measures"),
      work("initiative", "Record the agreed brief"),
    ],
    optional: ["research", "wait-what"],
    limit:
      "Use research only if facts are missing. A completed brief does not automatically start specification or implementation.",
  },
  {
    id: "specify-observable-behavior",
    title: "Agree on behavior before task execution",
    group: "productivity",
    when: "An agreed direction still leaves observable behavior or acceptance criteria open.",
    outcome: "A compact specification with testable criteria and explicit exclusions.",
    steps: [
      work("specify", "Inspect agreed decisions"),
      work("grilling", "Resolve behavior questions"),
      work("specify", "Define acceptance criteria"),
      work("specify", "Record scope and test limits"),
    ],
    optional: ["plan-tasks", "tdd"],
    limit:
      "Stop at the specification. Do not convert unresolved questions into invented requirements or treat the document as implementation authority.",
  },
  {
    id: "plan-bounded-tasks",
    title: "Divide agreed scope into verifiable tasks",
    group: "productivity",
    when: "The work is understood but too large to execute as one unbounded change.",
    outcome:
      "Tasks with completion evidence, genuine dependencies, and an explicit execution boundary.",
    steps: [
      work("plan-tasks", "Read agreed scope"),
      work("plan-tasks", "Define bounded outcomes"),
      work("plan-tasks", "Check dependencies"),
      work("plan-tasks", "Hand off the task plan"),
    ],
    optional: ["specify", "subagent-orchestration"],
    limit:
      "Planning stops before execution. Delegation is optional and needs separate authorization; a dependency diagram must not manufacture a fixed order.",
  },
  {
    id: "challenge-a-design",
    title: "Challenge a plan without implementing it",
    group: "productivity",
    when: "A confident proposal may conceal unresolved assumptions or decisions.",
    outcome: "Sharper decisions, unresolved risks, and evidence needed to choose the next step.",
    steps: [
      work("grill-me", "Request an interview"),
      work("grilling", "Pressure-test decisions"),
      work("grilling", "Check open assumptions"),
      work("grilling", "Summarize open decisions"),
    ],
    optional: ["research", "specify", "wait-what"],
    limit:
      "Stop after the interview when the decision is clear, or research a disputed fact. The optional wait-what branch asks for an unclear reply to be explained again; it is not a design critic.",
  },
  {
    id: "implement-a-small-change",
    title: "Implement a small approved change",
    group: "coding",
    when: "The requested behavior and authority to change it are already clear.",
    outcome: "A scoped implementation with behavior checks and affected documentation updated.",
    steps: [
      work("isolated-workspace", "Create task branch"),
      work("coding-with-rules", "Load applicable rules"),
      work("coding", "Implement and test behavior"),
      work("document-project", "Update affected guidance"),
      work("coding", "Account for quality gates"),
    ],
    optional: ["tdd", "code-review", "debloat"],
    limit:
      "Do not run initiative, research, and specification merely to fill a pipeline. Follow target policy for approval and documentation requirements.",
  },
  {
    id: "build-test-first",
    title: "Build one behavior slice test-first",
    group: "coding",
    when: "The owner explicitly wants test-first development and the behavior is agreed.",
    outcome: "An observed red test and the smallest green implementation at a user-confirmed seam.",
    steps: [
      work("isolated-workspace", "Create task branch"),
      work("coding-with-rules", "Resolve language guidance"),
      work("tdd", "Run one failing test"),
      work("tdd", "Make the slice pass"),
    ],
    optional: ["document-project", "code-review"],
    limit:
      "Confirm the test seams with the user before writing a test. Stop the red-to-green implementation loop at green; refactoring belongs to a separate authorized review-stage handoff, not this loop. Never claim an unobserved failure.",
  },
  {
    id: "diagnose-a-failure",
    title: "Find the root cause before proposing a fix",
    group: "coding",
    when: "A test, build, runtime result, or previously working behavior fails unexpectedly.",
    outcome: "A supported diagnosis and a separate proposed fix, not a stack of guesses.",
    steps: [
      work("systematic-debugging", "Reproduce with evidence"),
      work("systematic-debugging", "Trace the root cause"),
      work("systematic-debugging", "Test one hypothesis"),
      work("systematic-debugging", "Report cause and propose fix"),
    ],
    optional: ["coding-with-rules", "tdd"],
    limit:
      "Stop at diagnosis when the request is diagnostic. Mutating experiments still need the project's isolation and approval; implementation is a later authorized phase.",
  },
  {
    id: "scaffold-without-implementation",
    title: "Create a skeleton and stop",
    group: "coding",
    when: "A feature's source structure needs review before behavioral implementation.",
    outcome: "A checked skeleton with explicit fail-fast placeholders.",
    steps: [
      work("isolated-workspace", "Create task branch"),
      work("coding-with-rules", "Select language references"),
      work("scaffold", "Write source skeletons"),
      work("scaffold", "Check structure and stop"),
    ],
    optional: ["plan-tasks", "tdd"],
    limit:
      "Do not implement the placeholders. Any later coding or TDD phase needs its own agreed scope and authority.",
  },
  {
    id: "simplify-a-design",
    title: "Remove complexity without removing requirements",
    group: "coding",
    when: "Existing machinery or a proposed design is harder than the required behavior needs.",
    outcome: "A justified simplification that retains contracts, security, and operational needs.",
    steps: [
      work("debloat", "Find unnecessary parts"),
      gate("debloat", "Approve the change scope"),
      work("isolated-workspace", "Create task branch"),
      work("coding-with-rules", "Simplify and test behavior"),
    ],
    optional: ["code-review", "document-project"],
    limit:
      "A design-only debloat request can stop at the proposal. The implementation branch shown here is conditional on approval, not an automatic follow-up.",
  },
  {
    id: "review-against-standards-and-spec",
    title: "Review a fixed diff from two perspectives",
    group: "coding",
    when: "A branch or change needs standards and specification review against a clear baseline.",
    outcome: "An integrated report of two bounded read-only reviews.",
    steps: [
      work("code-review", "Freeze diff and spec"),
      work("code-review", "Run two read-only reviews"),
      work("code-review", "Integrate backed findings"),
      work("code-review", "Report without fixing"),
    ],
    optional: ["subagent-orchestration"],
    limit:
      "Confirm authorized subagent support before starting. Do not create writer lanes, edit findings away, merge, or release as part of review.",
  },
  {
    id: "maintain-task-based-docs",
    title: "Keep a developer task usable",
    group: "documentation",
    when: "Implementation changed first use, configuration, behavior, or maintenance instructions.",
    outcome:
      "A checked procedure with prerequisites, actions, expected results, and recovery guidance.",
    steps: [
      work("document-project", "Choose the reader's task"),
      work("document-project", "Update the procedure"),
      work("asd-ste100-technical", "Preserve precise meaning"),
      work("unslop", "Remove generic framing"),
      work("document-project", "Walk through; check links"),
    ],
    optional: ["archify", "excalidraw"],
    limit:
      "Use a diagram only when it answers a relationship question. A new site or toolchain is a separate approved baseline, not a routine documentation side effect.",
  },
  {
    id: "write-agent-facing-guidance",
    title: "Write guidance for an agent reader",
    group: "agentic-work",
    when: "A skill, prompt, or agent-facing document needs clearer triggers and actions.",
    outcome: "A reviewed instruction draft with co-located rules and clear completion boundaries.",
    steps: [
      work("writing-for-agents", "Identify the agent's task"),
      work("writing-for-agents", "Draft actions + references"),
      work("asd-ste100-technical", "Check clarity + conditions"),
      work("writing-for-agents", "Deliver the reviewed draft"),
    ],
    optional: ["instruction-maintenance", "unslop"],
    limit:
      "This route ends at a draft. Existing project-policy edits must go through instruction-maintenance and exact human approval before mutation.",
  },
  {
    id: "shorten-without-loss",
    title: "Shorten a technical answer without losing meaning",
    group: "documentation",
    when: "A useful answer is buried under repetition or generic framing.",
    outcome: "A concise explanation that retains decisions, commands, risks, and uncertainty.",
    steps: [
      work("asd-ste100-technical", "Find essential meaning"),
      work("asd-ste100-technical", "Keep terms/conditions exact"),
      work("unslop", "Remove filler + repetition"),
      work("asd-ste100-technical", "Check complete sentences"),
    ],
    optional: ["document-project", "caveman"],
    limit:
      "This route retains complete sentences. Caveman is a separate fragment-style alternative, not an extra pass: choose it only when project policy permits, and explicitly disable it before using ASD or Unslop whole-sentence guidance. Prefer one guide when enough; do not trade meaning for brevity.",
  },
  {
    id: "explain-with-archify",
    title: "Explain relationships with interactive HTML",
    group: "documentation",
    when: "The reader needs to explore a workflow, architecture, dependency map, state model, or other supported structure.",
    outcome: "A retained candidate, validated standalone HTML, and an honest verification claim.",
    steps: [
      work("archify", "Review source; choose mode"),
      gate("archify", "Approve missing tools"),
      work("archify", "Author complete candidate"),
      work("archify", "Run required finalize gates"),
      work("document-project", "Explain scope; link output"),
    ],
    optional: ["asd-ste100-technical"],
    limit:
      "The setup gate applies only when tools are missing; skip it when reviewed setup already exists. Browser checks are not the same as perceptual review or human user testing.",
  },
  {
    id: "draw-with-excalidraw",
    title: "Deliver an editable image diagram",
    group: "documentation",
    when: "A reader needs a PNG or SVG, with an editable scene for later changes.",
    outcome: "An image-first delivery with retained scene JSON and the local workflow's checks.",
    steps: [
      work("excalidraw", "Trace scoped relationships"),
      gate("excalidraw", "Approve missing renderer"),
      work("excalidraw", "Author and render the scene"),
      work("excalidraw", "Inspect image; keep source"),
    ],
    optional: ["document-project", "asd-ste100-technical"],
    limit:
      "Skip setup when the approved renderer is already available. Do not replace local rendering with a remote service or deliver source alone when an image was requested.",
  },
  {
    id: "delegate-bounded-work",
    title: "Delegate only the work that was authorized",
    group: "unpolished",
    when: "The operator explicitly asks for specialists, independent review, or parallel work.",
    outcome: "Bounded child results integrated and validated by the parent.",
    steps: [
      work("subagent-orchestration", "Confirm authority and lanes"),
      work("subagent-orchestration", "Bound child handoffs"),
      work("subagent-orchestration", "Run authorized child work"),
      work("subagent-orchestration", "Integrate and validate"),
    ],
    optional: ["isolated-workspace", "code-review"],
    limit:
      "Read-only children do not need write lanes. Authorized concurrent writers do, and temporary-lane cleanup has its own ownership and approval rules.",
  },
  {
    id: "coordinate-read-only-review",
    title: "Coordinate independent review without writers",
    group: "unpolished",
    when: "You want independent assessment but all changes must stay with the parent.",
    outcome: "Fresh-context read-only findings with evidence and an owner-controlled fix decision.",
    steps: [
      work("subagent-orchestration", "Assign read-only questions"),
      work("code-review", "Review standards + spec"),
      work("subagent-orchestration", "Verify + integrate findings"),
      work("subagent-orchestration", "Owner decides next step"),
    ],
    optional: ["coding-with-rules"],
    limit:
      "Do not silently promote reviewers to writers or substitute another launcher after a delegation failure. Fixing findings is separate from the review.",
  },
  {
    id: "clean-integrated-workspaces",
    title: "Clean only proven, approved workspaces",
    group: "utility",
    when: "Completed work may have left integrated workspaces or stale registrations.",
    outcome: "Exact approved removals, protected uncertain lanes, and a post-cleanup audit.",
    steps: [
      work("cleanup-workspaces", "Resolve workspace guidance"),
      work("cleanup-workspaces", "Audit tips/state/ownership"),
      gate("cleanup-workspaces", "Approve exact removal plan"),
      work("cleanup-workspaces", "Apply and audit again"),
    ],
    optional: ["retro"],
    limit:
      "Do not infer integration from a similar diff. Dirty, unknown, or unproven work stays; no force removal, branch deletion, or broad cache cleanup is implied.",
  },
  {
    id: "repair-instruction-routes",
    title: "Repair instruction drift through exact approval",
    group: "unpolished",
    when: "Routes, requirements, or policy instructions are missing, duplicated, stale, or conflicting.",
    outcome: "An approved targeted repair with preserved security and authority boundaries.",
    steps: [
      work("instruction-maintenance", "Audit without mutation"),
      work("writing-for-agents", "Prepare the exact proposal"),
      gate("instruction-maintenance", "Approve the proposed policy"),
      work("isolated-workspace", "Create task branch"),
      work("instruction-maintenance", "Apply + check the repair"),
    ],
    optional: ["asd-ste100-technical"],
    limit:
      "Changed protected rules or scope require renewed approval. An instruction draft cannot grant itself permission to be installed.",
  },
  {
    id: "learn-from-completed-work",
    title: "Turn a completed issue into a small improvement",
    group: "productivity",
    when: "A bounded work period has enough evidence to examine the process.",
    outcome:
      "A few actionable improvements, with follow-up authority separated from the retrospective.",
    steps: [
      work("retro", "Bound period + evidence"),
      work("retro", "Check causes vs impressions"),
      work("retro", "Check causal evidence"),
      work("retro", "Propose small follow-ups"),
    ],
    optional: ["instruction-maintenance", "document-project", "wait-what"],
    limit:
      "Stop at proposals; tool changes, instruction edits, cleanup, and publication need their own approval. Use the optional wait-what branch only when the retrospective's explanation needs more context or clearer terms.",
  },
  {
    id: "re-pitch-an-explanation",
    title: "Ask for a clearer explanation",
    group: "productivity",
    when: "The last proposal or explanation is unclear, lacks context, or does not use the project\u0027s shared vocabulary.",
    outcome:
      "A re-pitched explanation grounded in the missing context and existing project terminology.",
    steps: [
      work("wait-what", "Name the unclear answer"),
      work("wait-what", "Check glossary and context"),
      work("asd-ste100-technical", "Use precise language"),
      work("wait-what", "Re-pitch; check meaning"),
    ],
    optional: ["unslop"],
    limit:
      "This is an explicit clarification request, not an adversarial critique or a change request. Resolve project vocabulary through GLOSSARY.md and GLOSSARY-MAP.md as applicable; ask about missing inputs rather than inventing or creating a glossary. Stop after the explanation.",
  },
];
