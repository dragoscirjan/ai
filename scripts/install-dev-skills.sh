#!/usr/bin/env bash
# Install this repository's external authoring skills for Pi. Run, do not source.
set -euo pipefail

root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
manager="$root/.agents/skills/agentic-work/sync-my-skills"

if [[ ${1:-} == --help && $# == 1 ]]; then
  printf '%s\n' \
    'Usage: bash scripts/install-dev-skills.sh' \
    'Installs pinned external skills for Pi in this repository, never globally.' \
    'Installs the manager parser with npm ci --ignore-scripts if missing.' \
    'Preserves existing skills; does not synchronize or publish project assets.'
  exit 0
fi
if (( $# != 0 )); then
  printf 'Unexpected arguments. Use --help.\n' >&2
  exit 2
fi

for command in node npm npx; do
  if ! command -v "$command" >/dev/null 2>&1; then
    printf 'Required command is missing: %s\n' "$command" >&2
    exit 1
  fi
done

cd -- "$root"
if [[ -L "$root/.agents" || -L "$root/.agents/skills" ]]; then
  printf 'Project skill directories must not be symlinks.\n' >&2
  exit 1
fi
if [[ ! -f "$manager/node_modules/yaml/package.json" ]]; then
  npm --prefix "$manager" ci --ignore-scripts
fi

# The catalog is the only source of revisions and upstream locations. Do not use
# --source-root: ignored local dependencies are not authored source inventory.
catalog=$(node "$manager/scripts/sync-my-skills.mjs" catalog \
  --catalog "$manager/assets/skill-catalog.yaml")
plan=$(printf '%s' "$catalog" | node --input-type=module -e '
  import { readFileSync } from "node:fs";
  const catalog = JSON.parse(readFileSync(0, "utf8"));
  const names = ["grilling", "unslop", "writing-for-agents", "code-review",
    "grill-me", "systematic-debugging", "tdd"];
  const lines = names.map((name) => {
    const entry = catalog.skills.find((skill) => skill.name === name);
    if (!entry) throw new Error("Required catalog entry is missing: " + name);
    const source = entry.upstream ?? entry.source;
    if (source.type !== "github" ||
        !/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(source.repository) ||
        !/^[a-f0-9]{40}$/.test(source.revision) ||
        !/^[A-Za-z0-9_.\/-]+$/.test(source.path) ||
        source.path.split("/").some((part) => !part || part === "." || part === "..")) {
      throw new Error("Invalid pinned upstream source: " + name);
    }
    const existing = entry.source.type === "local"
      ? entry.source.path + "/SKILL.md" : ".agents/skills/" + name + "/SKILL.md";
    if (existing.startsWith("/") || existing.split("/").some((part) =>
      !part || part === "." || part === ".." || /[\t\r\n]/.test(part))) {
      throw new Error("Invalid existing skill path: " + name);
    }
    const url = source.repository + "/tree/" + source.revision + "/" + source.path;
    return [name, url, existing].join("\t");
  });
  console.log(lines.join("\n"));
')

while IFS=$'\t' read -r name url existing; do
  if [[ -f "$root/$existing" || -f "$root/.agents/skills/$name/SKILL.md" ]]; then
    printf 'Already present; leaving unchanged: %s\n' "$name"
    continue
  fi
  printf 'Installing project-local skill: %s\n' "$name"
  npx -y skills@1.7.4 add "$url" --skill "$name" --agent pi --yes
  installed="$root/.agents/skills/$name"
  if [[ ! -f "$installed/SKILL.md" || -L "$installed" || -L "$installed/agents" ]]; then
    printf 'Expected a project-local skill directory: %s\n' "$installed" >&2
    exit 1
  fi
  # Provider configuration is not part of the installed authoring skill.
  rm -f -- "$installed/agents/openai.yaml"
done <<< "$plan"

printf 'Project-local authoring skills are ready. Run /reload in Pi.\n'
