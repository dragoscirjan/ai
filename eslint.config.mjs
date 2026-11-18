import js from "@eslint/js";

export default [
  { ignores: ["docs/.vitepress/cache/**", "docs/.vitepress/dist/**", "docs/public/**"] },
  {
    ...js.configs.recommended,
    files: ["scripts/docs/**/*.mjs", "docs/.vitepress/**/*.mjs", "eslint.config.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
  },
];
