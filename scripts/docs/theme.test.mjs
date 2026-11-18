import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import siteConfig from "../../docs/.vitepress/config.mjs";
import { root } from "./data.mjs";

const read = (path) => readFileSync(join(root, path), "utf8");

test("Catppuccin and its required peer use the approved exact versions", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.equal(pkg.devDependencies["@catppuccin/vitepress"], "0.1.4");
  assert.equal(pkg.devDependencies.typescript, "5.9.3");
  assert.equal(pkg.devDependencies.vitepress, "1.6.4");
  const theme = read("docs/.vitepress/theme/index.mjs");
  assert.match(theme, /vitepress\/theme-without-fonts/);
  assert.match(theme, /@catppuccin\/vitepress\/theme\/mocha\/mauve\.css/);
});

test("code highlighting follows Latte and Mocha rather than the previous default themes", () => {
  assert.deepEqual(siteConfig.markdown.theme, {
    light: "catppuccin-latte",
    dark: "catppuccin-mocha",
  });
});

test("local CSS preserves fonts and layout without overriding the official palette", () => {
  const css = read("docs/.vitepress/theme/custom.css");
  assert.match(css, /--vp-font-family-base:/);
  assert.match(css, /--vp-font-family-mono:/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /--vp-c-brand-soft:\s*var\(--vp-c-purple-soft\)/);
  assert.doesNotMatch(css, /--vp-c-(?:bg(?:-\w+)?|brand-[123]|text-[123]):/);
  assert.doesNotMatch(css, /--vp-button-brand-(?:bg|text|hover-bg|active-bg):/);
});

test("the generated notice download preserves both new package licenses", () => {
  const notices = read("docs/public/notices/site-dependencies.txt");
  assert.ok(notices.includes("===== @catppuccin/vitepress@0.1.4 =====\nDeclared license: MIT"));
  assert.ok(notices.includes("===== typescript@5.9.3 =====\nDeclared license: Apache-2.0"));
});
