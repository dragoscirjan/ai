import { mkdirSync } from "node:fs";
import { join } from "node:path";

// Public rendering needs platform tools, not model/provider, GitHub, or personal credentials.
export function publicToolEnvironment(home, source = process.env) {
  const env = {};
  for (const key of [
    "PATH",
    "LANG",
    "LC_ALL",
    "TZ",
    "SystemRoot",
    "WINDIR",
    "COMSPEC",
    "PATHEXT",
    "LD_LIBRARY_PATH",
    "NIX_LD",
    "NIX_LD_LIBRARY_PATH",
    "ARCHIFY_CHROME",
  ])
    if (source[key]) env[key] = source[key];
  Object.assign(env, {
    HOME: home,
    XDG_CONFIG_HOME: join(home, "config"),
    XDG_CACHE_HOME: join(home, "cache"),
    XDG_DATA_HOME: join(home, "data"),
    TMPDIR: join(home, "tmp"),
    TEMP: join(home, "tmp"),
    TMP: join(home, "tmp"),
  });
  for (const path of new Set([
    home,
    env.XDG_CONFIG_HOME,
    env.XDG_CACHE_HOME,
    env.XDG_DATA_HOME,
    env.TMPDIR,
  ]))
    mkdirSync(path, { recursive: true });
  return env;
}
