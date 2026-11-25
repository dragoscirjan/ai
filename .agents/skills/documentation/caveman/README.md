# caveman

Communicate in concise technical fragments while preserving exact details, constraints, evidence, and uncertainty.

## Usage

Example request to an agent with the skill installed:

```text
Use caveman for concise technical replies in this conversation. Preserve exact commands, evidence, and uncertainty.
```

## Install

Run from the target project with Node.js 22.20 or newer, Git, and npm available. Replace the value of `ref` with a published tag or commit that contains this skill.

```sh
ref="<published-tag-or-commit>"
npx -y skills@1.7.4 add "https://github.com/dragoscirjan/ai/tree/$ref/.agents/skills/documentation/caveman" --skill caveman
```
