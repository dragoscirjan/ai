# Check background execution and inspection

The main skill defines authority, task limits, write ownership, and acceptance. This reference identifies runtime capabilities to inspect. Tool names and UI commands apply only when the installed version exposes them.

## Pi

Pi needs an extension for child-agent execution. The inspected `pi-subagents` 0.79.1 package documents asynchronous launches, completion notifications, durable run artifacts, status, steering, and cancellation. Verify the installed tool contract before use. A source skill cannot enable these capabilities by itself.

With a compatible `pi-subagents` runtime:

- Enable its tools through `subagents_enable` when delegation is authorized and the tools are not yet exposed. This enables existing tools, not package installation.
- Launch a bounded worker with `subagent`, using `async: true`. Use a workflow script only when branching, sequencing, or aggregation needs it.
- Yield after launch. Native completion notifications wake the parent. Do not call a blocking wait merely because a child is active.
- Use the documented `status`, `steer`, and `stop` actions for recorded run IDs. Check resumability before continuing a completed child. A resumed child can receive a new run ID.
- Keep detailed reports in runtime artifacts. Pass output references between dependent tasks instead of copying full reports into parent messages.

For live inspection, `/subagents-fleet` opens the documented fleet inspector. Expanded worker details show activity, recent tools/output, and usage. The fleet view also exposes steering and stop controls. Confirm these commands exist in the installed version before offering them.

Optional Herdr and Orca integrations provide additional views when already installed and configured. A raw inspector or observer mirrors activity; it does not attach a headless worker to an interactive terminal. Ask before installing or configuring these integrations. The fleet inspector is sufficient to start without them.

Pi processes new input at its documented turn and tool boundaries. Describe background workers as concurrent jobs, not as a guarantee of instant parent replies.

Sources: [Pi interactive usage](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/usage.md), [pi-subagents](https://github.com/nicobailon/pi-subagents). Inspect local runtime documentation for the installed version. These capabilities were documentation-inspected, not end-to-end tested for this skill.

## Claude Code

Claude Code documents native background subagents that run while the main conversation continues. Use its general-purpose worker with a task-specific assignment. Custom specialist definitions are not required. Confirm that the launch is background execution, since foreground subagents block the main conversation.

Read the installed version's task controls to identify the supported view for the worker's output, permissions, and cancellation. Surface permission requests without expanding the worker's authority. Ask the parent to route task changes when direct worker steering is unavailable.

Agent teams and agent view are separate features. Teams provide independent teammate conversations and optional split panes. Agent view monitors dispatched background sessions; spawned subagents are not separate rows there. Do not present either feature as a prerequisite for background subagents or promise that a subagent supports interactive attachment.

Sources: [background subagents](https://code.claude.com/docs/en/sub-agents#run-subagents-in-foreground-or-background), [built-in workers](https://code.claude.com/docs/en/sub-agents#built-in-subagents), [agent teams](https://code.claude.com/docs/en/agent-teams), [agent view](https://code.claude.com/docs/en/agent-view). Behavior depends on the installed version and organizational policy. These capabilities were documentation-inspected, not end-to-end tested for this skill.

## OpenCode and other runtimes

Inspect the available tools and current official documentation for asynchronous child execution, completion delivery, artifact storage, inspection, steering, and cancellation. A tool named `task`, `agent`, or `background` is not sufficient evidence. Verify whether its call returns before the child finishes and whether the parent can accept another user message afterward.

Do not invent commands or translate Pi arguments into another runtime. Report missing capabilities and ask for an approved execution mode or separate setup task. Portable instructions do not establish tested runtime compatibility.
