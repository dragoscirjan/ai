#!/usr/bin/env bash
set -euo pipefail

if [[ ${1:-} == --help && $# == 1 ]]; then
  printf 'Usage: bash scripts/install-dev-skills.sh\nInstalls missing skills for Pi and moves them into .agents/skills/external/.\n'
  exit 0
fi
if (($# != 0)); then
  printf 'Unexpected arguments. Use --help.\n' >&2
  exit 2
fi

cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."
skills=.agents/skills
external="$skills/external"
for directory in .agents "$skills" "$external"; do
  if [[ -L "$directory" ]]; then
    printf 'Skill directories must not be symlinks: %s\n' "$directory" >&2
    exit 1
  fi
done
mkdir -p -- "$external"

install_skill() {
  local name="$1" url="$2" existing
  if [[ -f "$external/$name/SKILL.md" && ! -L "$external/$name" ]]; then
    printf 'Already installed: %s\n' "$name"
    return
  fi
  if [[ -e "$external/$name" || -L "$external/$name" ]]; then
    printf 'Refusing to overwrite existing path: %s\n' "$external/$name" >&2
    exit 1
  fi
  for existing in "$skills"/*/"$name"/SKILL.md; do
    if [[ -f "$existing" ]]; then
      printf 'Keeping existing adaptation: %s\n' "$existing"
      return
    fi
  done
  if [[ ! -f "$skills/$name/SKILL.md" ]]; then
    npx -y skills@1.7.4 add "$url" --skill "$name" --agent pi --yes
  fi
  if [[ ! -f "$skills/$name/SKILL.md" || -L "$skills/$name" || -L "$skills/$name/agents" ]]; then
    printf 'Expected a project-local skill directory: %s\n' "$skills/$name" >&2
    exit 1
  fi
  rm -f -- "$skills/$name/agents/openai.yaml"
  mv -- "$skills/$name" "$external/$name"
}

# Matt Pocock
matt_skills=(grilling writing-for-agents code-review grill-me tdd)
for skill in "${matt_skills[@]}"; do
  install_skill "$skill" https://github.com/mattpocock/skills/tree/main/skills
done

# Cursor
cursor_skills=(unslop)
for skill in "${cursor_skills[@]}"; do
  install_skill "$skill" https://github.com/cursor/plugins/tree/main/pstack/skills
done

printf 'Project-local authoring skills are ready. Run /reload in Pi.\n'
