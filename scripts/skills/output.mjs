import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readlinkSync,
  renameSync,
  rmSync,
  symlinkSync,
} from "node:fs";
import { dirname, isAbsolute, join, parse, relative, resolve, sep } from "node:path";
import { check, noLinks, safeRelative } from "./catalog.mjs";

export function skillsDirectory(target, input) {
  if (input === undefined) return null;
  check(
    typeof input === "string" &&
      input.length > 0 &&
      [...input].every((character) => {
        const code = character.codePointAt(0);
        return code >= 32 && code !== 127 && character !== "\\";
      }),
    "Invalid skills directory",
  );
  if (!isAbsolute(input)) safeRelative(input, true);
  const directory = resolve(target, input),
    rel = relative(target, directory);
  check(
    rel && !isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`),
    "Skills directory must be a subdirectory of --target; point --target at its owning project",
  );
  check(!rel.split(sep).includes(".git"), "Do not write skills into Git metadata");
  noLinks(target, directory);
  if (existsSync(directory))
    check(lstatSync(directory).isDirectory(), "Skills directory is not a directory");
  return directory;
}

export function projectionTarget(source, destination) {
  const outside = (path) => isAbsolute(path) || path === ".." || path.startsWith(`..${sep}`);
  check(
    outside(relative(source, destination)) && outside(relative(destination, source)),
    "Skill projection overlaps its canonical folder",
  );
  const target = relative(dirname(destination), source);
  check(
    !isAbsolute(target),
    "Skill projection requires a relative path on the same filesystem root",
  );
  return target;
}
// Replace one explicitly selected skill only. Unselected siblings and plugin metadata stay untouched.
function replaceSkill(source, destination, { overwrite, rename = renameSync }, projection) {
  const parent = dirname(destination);
  const link = projection ? projectionTarget(source, destination) : null;
  const validate = () => {
    const root = parse(resolve(parent)).root;
    if (projection) {
      noLinks(root, source);
      check(
        resolve(source) !== resolve(destination) && lstatSync(source).isDirectory(),
        "Invalid canonical skill folder",
      );
    }
    const info = lstatSync(destination, { throwIfNoEntry: false });
    if (projection && info?.isSymbolicLink()) {
      noLinks(root, parent);
      const link = readlinkSync(destination);
      check(
        !isAbsolute(link) && resolve(parent, link) === resolve(source),
        "Unsafe skill projection",
      );
    } else noLinks(root, destination);
    if (info) {
      check(
        info.isDirectory() || (projection && info.isSymbolicLink()),
        "Existing skill destination is not a directory",
      );
      check(overwrite, "Existing skill destination requires --overwrite");
    }
  };
  validate();
  mkdirSync(parent, { recursive: true });
  validate();
  const temporary = mkdtempSync(join(dirname(parent), ".sync-skills-"));
  const ready = join(temporary, "ready"),
    previous = join(temporary, "previous");
  let backup = false,
    installed = false;
  try {
    if (projection) symlinkSync(link, ready, "dir");
    else
      cpSync(source, ready, {
        recursive: true,
        dereference: false,
        force: false,
        errorOnExist: true,
      });
    validate();
    if (existsSync(destination)) {
      rename(destination, previous);
      backup = true;
    }
    rename(ready, destination);
    installed = true;
  } catch (error) {
    if (backup) {
      try {
        noLinks(parse(resolve(parent)).root, destination);
        check(!existsSync(destination), "Destination appeared during replacement");
        rename(previous, destination);
        backup = false;
      } catch {
        throw new Error(
          `Replacement failed; original content is preserved at ${previous}. Restore it after inspecting the destination. ${error.message}`,
          { cause: error },
        );
      }
    }
    throw error;
  } finally {
    // Never discard a backup if an unexpected concurrent write prevents restoration.
    if (!backup || installed) rmSync(temporary, { recursive: true, force: true });
  }
}
export function copySkill(source, destination, options) {
  return replaceSkill(source, destination, options, false);
}
// The caller has already authorized/created this selected native output.
export function projectSkill(source, destination, options) {
  return replaceSkill(source, destination, options, true);
}
