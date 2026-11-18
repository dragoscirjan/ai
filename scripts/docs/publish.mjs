import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, readFileSync, realpathSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { verifySite } from "./verify.mjs";

export const destinationRepository = "dragoscirjan/dragoscirjan.github.io";
export const publicationBase = "/projects/ai-skills/";
export function publicationContext(env) {
  if (
    env.GITHUB_ACTIONS !== "true" ||
    !["push", "workflow_dispatch"].includes(env.GITHUB_EVENT_NAME) ||
    env.GITHUB_REF !== "refs/heads/main"
  )
    throw new Error("Publication requires a push or manual dispatch on trusted main");
  if (!env.GH_TOKEN) throw new Error("The owner must supply the destination GH_TOKEN secret");
  if (
    !/^\d+$/.test(env.GITHUB_RUN_ID ?? "") ||
    !/^\d+$/.test(env.GITHUB_RUN_ATTEMPT ?? "") ||
    !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(env.GITHUB_REPOSITORY ?? "")
  )
    throw new Error("Invalid workflow source identity");
  return {
    branch: `docs-publish/ai-skills/${env.GITHUB_RUN_ID}-${env.GITHUB_RUN_ATTEMPT}`,
    source: `https://github.com/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`,
  };
}
export function publicationTarget(checkout) {
  const directory = resolve(checkout);
  if (realpathSync(directory) !== directory || lstatSync(directory).isSymbolicLink())
    throw new Error("Destination checkout must be a real directory");
  for (const path of [join(directory, "projects"), join(directory, "projects/ai-skills")])
    if (existsSync(path) && (!lstatSync(path).isDirectory() || lstatSync(path).isSymbolicLink()))
      throw new Error("Destination path is not a real project directory");
  return join(directory, "projects/ai-skills");
}
function command(executable, args, cwd, env) {
  const result = spawnSync(executable, args, {
    cwd,
    env,
    encoding: "utf8",
    timeout: 120000,
    maxBuffer: 1024 * 1024,
  });
  if (result.status !== 0)
    throw new Error(`${executable} failed: ${result.stderr || result.error || result.status}`);
  return result.stdout.trim();
}
export function publishSite(artifact, checkout, env = process.env) {
  const context = publicationContext(env);
  const directory = resolve(checkout);
  const target = publicationTarget(directory);
  const source = realpathSync(resolve(artifact));
  if (
    source === directory ||
    source.startsWith(directory + sep) ||
    directory.startsWith(source + sep)
  )
    throw new Error("Artifact and destination must be disjoint");
  verifySite(source);
  const index = readFileSync(join(source, "index.html"), "utf8");
  if (!index.includes(`${publicationBase}assets/`) || /(?:href|src)=["']\/assets\//.test(index))
    throw new Error("Refusing an artifact built with the wrong publication base");
  const git = (args) =>
    command(
      "git",
      ["-c", "core.hooksPath=/dev/null", "-c", "core.fsmonitor=false", ...args],
      directory,
      env,
    );
  const origin = git(["remote", "get-url", "origin"]);
  if (
    !new RegExp(
      `^https://github\\.com/${destinationRepository.replaceAll(".", "\\.")}(?:\\.git)?$`,
    ).test(origin)
  )
    throw new Error("Wrong destination repository");
  if (git(["branch", "--show-current"]) !== "main" || git(["status", "--porcelain"]))
    throw new Error("Destination checkout must be clean main");
  git(["switch", "--create", context.branch]);
  mkdirSync(dirname(target), { recursive: true });
  mkdirSync(target, { recursive: true });
  command("rsync", ["-a", "--delete", source + "/", target + "/"], directory, env);
  git(["add", "--", "projects/ai-skills"]);
  if (!git(["diff", "--cached", "--name-only"]))
    return "Output unchanged; no destination commit or PR.";
  const paths = git(["diff", "--cached", "--name-only"]).split("\n");
  if (paths.some((path) => !path.startsWith("projects/ai-skills/")))
    throw new Error("Publication escaped its approved directory");
  git(["config", "user.name", "github-actions[bot]"]);
  git(["config", "user.email", "github-actions[bot]@users.noreply.github.com"]);
  git(["commit", "-m", "docs(ai-skills): update documentation site"]);
  git(["push", "--set-upstream", "origin", context.branch]);
  return command(
    "gh",
    [
      "pr",
      "create",
      "--repo",
      destinationRepository,
      "--base",
      "main",
      "--head",
      context.branch,
      "--title",
      "docs(ai-skills): update documentation site",
      "--body",
      `Documentation artifact from ${context.source}.\n\nReview and merge separately; this publisher does not merge or deploy.`,
    ],
    directory,
    env,
  );
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.length !== 4)
    throw new Error("Usage: node scripts/docs/publish.mjs <built-artifact> <destination-checkout>");
  console.log(publishSite(process.argv[2], process.argv[3]));
}
