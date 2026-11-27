# background-agents

Keep the main conversation available while task-scoped, general-purpose workers do substantial work in the background. The parent coordinates assignments and assesses concise, evidence-backed results.

Requires a runtime with asynchronous child-agent execution and completion notification. Live inspection and steering depend on the runtime. Writable work also needs approved workspace and cleanup procedures. There are no required instruction packages.

## Origin

Created for [issue #98](https://github.com/dragoscirjan/ai/issues/98). The workflow retains the write-ownership safeguards of this repository's earlier orchestration skill. Separate worker contexts and structured handoffs also appear in [Obra's parallel-agent workflow](https://github.com/obra/superpowers/blob/main/skills/dispatching-parallel-agents/SKILL.md) and [Cursor's orchestration workflow](https://github.com/cursor/plugins/blob/main/orchestrate/skills/orchestrate/SKILL.md).

## Usage

```text
Use background-agents for this task. Delegate the implementation and verification to background workers, keep this conversation available, and show me how to follow their progress.
```

## Install

Run from the target project with Node.js 22.20 or newer, Git, and npm available. Replace the value of `ref` with a published tag or commit that contains this skill.

```sh
ref="<published-tag-or-commit>"
npx -y skills@1.7.4 add "https://github.com/dragoscirjan/ai/tree/$ref/.agents/skills/utility/background-agents" --skill background-agents
```
