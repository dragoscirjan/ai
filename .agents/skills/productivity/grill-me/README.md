# grill-me

Challenge a plan or design through a focused interview that exposes assumptions and resolves missing decisions.

## Dependencies

Requires `grilling` for the interview process.

## Usage

Example request to an agent with the skill installed:

```text
Use grill-me to challenge this design and resolve its missing decisions before implementation.
```

## Install

Run from the target project with Node.js 22.20 or newer, Git, and npm available. Replace the value of `ref` with a published tag or commit that contains this skill. Install the dependencies listed above separately before using this skill.

```sh
ref="<published-tag-or-commit>"
npx -y skills@1.7.4 add "https://github.com/dragoscirjan/ai/tree/$ref/.agents/skills/productivity/grill-me" --skill grill-me
```

## Origin

Adapted from [grill-me](https://github.com/mattpocock/skills/tree/fcf0071560d32913c9d4f820e0d7ca467c881619/skills/productivity/grill-me) at revision `fcf0071560d32913c9d4f820e0d7ca467c881619`.
