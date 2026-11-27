// Reader guidance keyed by catalog IDs. Sources, requirements, and runtime metadata stay in the catalog.
export const notes = {
  "sync-my-agents": {
    when: "You explicitly want to review AGENTS.md and its referenced instruction documents.",
    result:
      "Necessary instruction diffs, applied only after approval and checked against the existing project policy.",
    prompt:
      "Use sync-my-agents to review AGENTS.md and its referenced instruction documents. Inspect project evidence, clarify unresolved decisions, and show exact diffs before editing. Do not install skills or impose a template bundle.",
    stop: "Instruction dependencies mean documents, not skill installation prerequisites. Missing required skills stop the affected phase. Do not install skills, tools, or dependencies, register commands, or publish changes.",
  },
  "init-project": {
    when: "You explicitly want a new project foundation or to adopt the supported TypeScript or Godot GDScript tooling.",
    result:
      "An approved, project-specific foundation and the checks appropriate to that selected baseline.",
    prompt:
      "Use init-project to propose the smallest foundation for this project. Show the tools, files, and installation effects before making changes.",
    stop: "An inspection or coding request does not authorize initialization. Stop for baseline and installation approval; do not turn a documentation-only project into an application.",
  },
  "isolated-workspace": {
    when: "A modifying task needs a dedicated branch or bookmark and a choice between the current checkout and a separate workspace.",
    result:
      "A verified task branch or bookmark, explicit VCS, resolved base, selected working directory, and status. A separate workspace is optional.",
    prompt:
      "Use isolated-workspace to plan a new Git task branch change/example from main. Recommend the current checkout or a separate worktree, and ask if unclear. Show the selected setup before creating anything.",
    stop: "Create a task ref before edits in either location. Preserve unrelated work and existing refs. An isolated setup still needs its exact plan approval; a failed setup does not authorize switching locations.",
  },
  research: {
    when: "A decision depends on facts, alternatives, feasibility, or evidence that you do not yet have.",
    result:
      "A bounded research answer with sources, uncertainty, limits, and a recommendation when the evidence supports one.",
    prompt:
      "Use research to compare these approaches for our constraints. Clarify the decision first, distinguish verified facts from assumptions, and do not implement anything.",
    stop: "Research does not grant installation or implementation authority. Resolve the declared grilling requirement before using this composition.",
  },
  initiative: {
    when: "An idea needs an agreed problem, outcome, scope, constraints, and success measures before solution work.",
    result:
      "An outcome-level brief that separates the problem from a prematurely selected implementation.",
    prompt:
      "Use initiative to turn this idea into a brief. Interview me about outcomes and constraints; keep solution choices open until the brief is agreed.",
    stop: "A brief is not a specification, task plan, or implementation authorization. Resolve grilling first and stop when the outcome-level agreement is complete.",
  },
  specify: {
    when: "The direction is agreed but observable behavior, acceptance criteria, constraints, or test boundaries remain unclear.",
    result: "A compact specification with decisions and acceptance criteria that can be checked.",
    prompt:
      "Use specify for this agreed direction. Resolve ambiguous behavior with me, record acceptance criteria and exclusions, and stop before implementation.",
    stop: "Do not invent unresolved decisions or imply approval for implementation. The declared grilling requirement must be available.",
  },
  "plan-tasks": {
    when: "The scope or specification is clear enough to divide into bounded pieces of work.",
    result:
      "Verifiable tasks with real dependencies, completion evidence, and an explicit execution boundary.",
    prompt:
      "Use plan-tasks on this approved specification. Make tasks independently verifiable, show genuine dependencies, and do not start executing them.",
    stop: "A task list does not authorize execution or delegation. Do not manufacture dependencies merely to make the list linear.",
  },
  "grill-me": {
    when: "You want to explicitly start the grilling interview through the unchanged upstream wrapper.",
    result: "An interview that pressures unresolved decisions until the direction is clearer.",
    prompt:
      "Use grill-me to start an explicit interview about this plan before I commit to it. Work through the uncertain decisions with me.",
    stop: "This unchanged upstream entry is explicitly invoked. It calls the Skill tool for the separately installed grilling instructions; the wrapper does not contain the interview itself. A compatible skill-invocation mechanism is required, and live harness invocation remains unverified.",
  },
  grilling: {
    when: "A plan or design needs a focused interview rather than another polished document built on assumptions.",
    result: "Sharper decisions and surfaced gaps from the upstream interview workflow.",
    prompt:
      "Use grilling to pressure-test this design. Ask about unresolved decisions, use repository evidence when available, and do not implement the plan.",
    stop: "This is an upstream-only entry, not a local vendored skill. Install the catalog-pinned source through an approved setup before relying on it.",
  },
  "wait-what": {
    when: "The last answer is hard to understand or omits context needed to follow the current proposal.",
    result:
      "A clearer explanation with the missing context, plain technical language, and project vocabulary or the bundled default.",
    prompt:
      "Use wait-what to explain your last answer again. Start with the missing context, use plain technical language and existing glossary terms, and ask about unavailable context. Do not edit files.",
    stop: "This explicitly invoked skill requests clarification, not adversarial design review. Prefer the project's root GLOSSARY.md, accept GLOSARY.md when absent, and follow GLOSSARY-MAP.md when needed. Use the bundled generic glossary only when no project glossary is available. Ask about missing context rather than inventing it. Do not create a project glossary or implement changes as a side effect.",
  },
  coding: {
    when: "You are designing, implementing, refactoring, reviewing, or testing source code under project conventions.",
    result:
      "A small, behavior-preserving or explicitly approved change with risk-appropriate tests and accounted-for quality gates.",
    prompt:
      "Use coding for this approved change. Inspect project conventions, choose the smallest correct design, add behavior-focused checks, and report unrun gates honestly.",
    stop: "Tool installation, baseline changes, unsafe scope expansion, and owner-controlled operations still need approval. This base workflow is language-neutral; follow the target project's language-specific standards.",
  },
  "coding-with-rules": {
    when: "Code or toolchain work needs the base coding workflow plus rules for its actual languages and extensions.",
    result:
      "The coding workflow with the relevant language references loaded in their declared order.",
    prompt:
      "Use coding-with-rules for this change. Identify affected languages from runtime and file evidence, resolve coding first, and load only the applicable references.",
    stop: "Missing or conflicting required references block the affected phase. Do not recreate removed language skills or load every language merely because it exists somewhere in the repository.",
  },
  scaffold: {
    when: "An approved feature needs reviewable source skeletons before its behavior is implemented.",
    result:
      "Structurally valid source files with explicit fail-fast placeholders and structure checks.",
    prompt:
      "Use scaffold for this approved feature. Create the source skeleton and fail-fast placeholders, check its structure, and stop before implementing behavior.",
    stop: "Scaffolding ends before behavioral implementation. Do not silently convert the request into a completed feature or hide placeholder failures behind success-shaped defaults.",
  },
  tdd: {
    when: "You explicitly want test-first feature or bug work, or integration-test slices through public behavior.",
    result:
      "One observed failing behavior test and the smallest change that passes it at a user-confirmed seam. Refactoring is a later review-stage handoff, not part of this implementation loop.",
    prompt:
      "Use tdd for this agreed behavior. Start with one public-interface integration slice, demonstrate the expected failure, then implement only enough to pass it.",
    stop: "Confirm the public seams with the user before writing tests. Do not write a large speculative test batch or claim an unobserved red phase. Stop the implementation loop at green; refactoring belongs to a later authorized review stage.",
  },
  debloat: {
    when: "A design risks unnecessary machinery or existing code and configuration have complexity that no longer earns its cost.",
    result:
      "A justified simpler design or scoped simplification that preserves required behavior, security, contracts, and operational needs.",
    prompt:
      "Use debloat on this design. Identify unnecessary mechanisms, explain what must remain, and propose the smallest simplification before editing.",
    stop: "Simplicity is not permission to remove requirements, security controls, compatibility, or useful operational behavior. Keep unrelated cleanup outside the change.",
  },
  "code-review": {
    when: "You want changes since a fixed commit, branch, tag, or merge-base checked against both standards and the originating specification.",
    result:
      "Separate standards and specification findings from two read-only review agents, integrated into one report.",
    prompt:
      "Use code-review for the diff since main against this issue. Keep both review agents read-only, report evidence and severity, and do not fix or merge anything.",
    stop: "The workflow needs the harness's authorized subagent capability. A review is not permission to fix findings, spawn writers, merge, or release.",
  },
  "systematic-debugging": {
    when: "A bug, regression, failing test, flaky result, or unexpected behavior needs a root cause rather than a guessed patch.",
    result:
      "An evidence-backed diagnosis from controlled, single-hypothesis experiments, followed by a separately authorized fix and verification when appropriate.",
    prompt:
      "Use systematic-debugging on this failure. Reproduce and trace the root cause, test one hypothesis at a time, and stop before changing production code unless I approve the fix.",
    stop: "Do not stack speculative fixes or treat a symptom disappearing as a proven cause. Preserve meaningful tests and disclose reproduction or environment limits.",
  },
  "document-project": {
    when: "Implementation changes how readers use the project, or existing documentation blocks a real developer task.",
    result:
      "Task-first documentation with prerequisites, executable steps, expected results, and an appropriate maintenance path.",
    prompt:
      "Use document-project to improve this first-use task. Follow existing documentation conventions, show prerequisites and expected results, and propose new tooling separately.",
    stop: "A documentation request does not implicitly authorize a website, migration, plugin, new toolchain, or deployment. Approve that baseline before creating it.",
  },
  "asd-ste100-technical": {
    when: "Technical instructions or explanations need plain language without losing conditions, risks, or precise identifiers.",
    result:
      "Direct, usable prose with stable terminology, explicit actors, exact commands, and honest uncertainty.",
    prompt:
      "Use asd-ste100-technical to revise this procedure. Put prerequisites before actions, keep commands exact, and preserve every safety condition and uncertainty.",
    stop: "Plain language is not a license to simplify away technical meaning. This is STE-inspired guidance, not a claim of certification or a fixed approved-word list.",
  },
  caveman: {
    when: "You explicitly want terse technical fragments and your project policy permits that style.",
    result:
      "A fragment-style answer that preserves technical substance. The mode stays active until you explicitly disable it.",
    prompt:
      "Use caveman mode for this summary where project policy permits fragments. Preserve commands, evidence, constraints, risks, and uncertainty. Expand when safety or ordered instructions need it.",
    stop: "This mode drops articles and uses fragments. It is an alternative to ASD and Unslop whole-sentence guidance, not a finishing pass after them. Disable Caveman before returning to a whole-sentence route. Never use style to override project policy or omit safety details.",
  },
  unslop: {
    when: "A draft contains generic phrasing, repetitive structure, filler, or claims that do not help the reader act.",
    result:
      "Cleaner, more specific writing that retains the original facts and necessary constraints.",
    prompt:
      "Use unslop on this draft. Remove generic framing and repetition, retain necessary detail, and flag unsupported claims instead of polishing them into facts.",
    stop: "This upstream-only entry is marked for explicit invocation. Do not assume automatic model selection, or confuse an editing pass with factual verification or authorization to change project policy.",
  },
  "writing-for-agents": {
    when: "The reader is an agent: you are authoring or revising skills, prompts, agent instructions, or their reference documents.",
    result:
      "Usable agent-facing instructions with clear triggers, actions, conditional references, and completion boundaries.",
    prompt:
      "Use writing-for-agents to review this instruction draft. Keep rules beside the action they constrain and distinguish required instructions from optional handoffs.",
    stop: "Writing mechanics do not authorize policy changes. Existing instruction edits still need the project's audit, exact proposal, approval, and task-branch/workspace rules.",
  },
  archify: {
    when: "A supported native diagram, structured explanation, local repository Code Analysis workbench, or story/video export is needed.",
    result:
      "A retained native candidate, explainer, or analysis workbench with the delivery and browser checks required by its mode.",
    prompt:
      "Use archify for a source-backed diagram of this workflow. Keep required dependencies separate from suggested handoffs, retain the candidate, and run the required finalize gates.",
    stop: "The external package and runtime/browser setup need approval. Upstream 3.3 may produce explainer pages for complex work by default; honor the user's selected mode and existing project rules. Do not change global agent rules during setup. A rendered HTML file alone is not proof that delivery and browser gates passed; visual inspection is a separate claim.",
  },
  excalidraw: {
    when: "You want an editable Excalidraw scene with a PNG or SVG for a project structure, workflow, or component explanation.",
    result:
      "A rendered image, retained scene JSON, and the checks required by the local rendering workflow.",
    prompt:
      "Use excalidraw to explain these components. Deliver the image first, retain the editable scene, and propose any missing local renderer or browser setup before installing it.",
    stop: "The local rendering toolchain is a separate setup requirement. Do not deliver only diagram source when the requested artifact is an image, or silently substitute a remote renderer.",
  },
  "background-agents": {
    when: "You authorize background workers for substantial work while keeping the main conversation available.",
    result:
      "Task-scoped workers, a durable task record, supported progress inspection, and concise results assessed by the parent.",
    prompt:
      "Use background-agents for this task. Delegate implementation and verification to general-purpose background workers, keep this conversation available, and show me how to follow their progress.",
    stop: "Delegation needs task or project authority and asynchronous runtime support. Installation grants neither. Preserve worker limits, isolated write ownership, and final acceptance by the parent. Report unsupported inspection or steering; do not silently switch to foreground execution.",
  },
  "cleanup-workspaces": {
    when: "You want to audit integrated workspaces, stale registrations, or explicitly authorized temporary lanes.",
    result:
      "An evidence-based cleanup plan, followed only by the exact approved removals and a post-cleanup audit.",
    prompt:
      "Use cleanup-workspaces to audit this repository. Show eligible and retained workspaces, exact paths and tips, and the plan ID. Do not remove anything yet.",
    stop: "Resolve isolated-workspace first. Dirty, uncertain, or unproven lanes remain protected; audit permission is not removal permission. Never infer integration from a similar or squash-shaped diff alone.",
  },
  "instruction-maintenance": {
    when: "Instruction routing, dependencies, metadata, or policy documents appear missing, stale, conflicting, or unsuitable.",
    result:
      "A read-only audit and exact evidence-backed proposal, followed by only the human-approved instruction changes.",
    prompt:
      "Use instruction-maintenance to audit these routes. Give me the exact current and proposed changes, protected rules, and validation plan; wait for approval before editing.",
    stop: "An audit does not authorize its own proposal. Changed scope or protected rules require renewed approval; never weaken security or owner-authority gates to unblock the work.",
  },
  retro: {
    when: "A bounded completed work period has enough evidence to review what helped, failed, or should change.",
    result:
      "A small set of evidence-backed process improvements with clear next actions and appropriate ownership.",
    prompt:
      "Use retro for this completed issue. Separate evidence from impressions, identify a few useful improvements, and propose any instruction or tool changes rather than applying them.",
    stop: "A retrospective does not grant permission to rewrite policy, replace tools, or clean workspaces. Route each proposed change through its own approval boundary.",
  },
};
