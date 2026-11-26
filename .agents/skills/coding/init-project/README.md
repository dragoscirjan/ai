# init-project

Initialize or adopt project foundations, TypeScript tooling, or Godot GDScript tooling when explicitly requested.

## Usage

Example request to an agent with the skill installed:

```text
Use init-project to propose the project foundations and TypeScript tooling for this repository. Show the plan before applying changes.
```

## Install

Run from the target project with Node.js 22.20 or newer, Git, and npm available. Replace the value of `ref` with a published tag or commit that contains this skill.

```sh
ref="<published-tag-or-commit>"
npx -y skills@1.7.4 add "https://github.com/dragoscirjan/ai/tree/$ref/.agents/skills/coding/init-project" --skill init-project
```
