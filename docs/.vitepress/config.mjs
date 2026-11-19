import { defineConfig } from "vitepress";
import { catalog, docsBase, groups } from "../../scripts/docs/data.mjs";
import { workflowGuides } from "../../scripts/docs/workflows.mjs";

// DOCS_BASE is the only site-specific environment input. Default / supports independent runs.
// Publish with DOCS_BASE=/projects/ai-skills/. Reject malformed paths rather than silently rewriting them.
const base = docsBase();
const c = catalog();
export default defineConfig({
  title: "AI skills",
  description: "Choose and combine agent skills for Pi, OpenCode, and Claude Code.",
  lang: "en-US",
  base,
  cleanUrls: false,
  lastUpdated: false,
  ignoreDeadLinks: false,
  srcExclude: ["public/**", "diagrams/**"],
  markdown: {
    theme: { light: "catppuccin-latte", dark: "catppuccin-mocha" },
  },
  themeConfig: {
    siteTitle: "AI skills",
    nav: [
      { text: "Start here", link: "/guide/start" },
      { text: "Skills", link: "/skills/" },
      { text: "Workflows", link: "/workflows/" },
      { text: "Reference", link: "/reference/relationships" },
    ],
    sidebar: [
      {
        text: "Start here",
        items: [
          { text: "Choose your starting point", link: "/guide/start" },
          { text: "Install a skill", link: "/guide/install" },
          { text: "Your first useful request", link: "/guide/first-use" },
        ],
      },
      {
        text: "Project workflows",
        link: "/workflows/",
        items: [
          ...workflowGuides.map((guide) => ({ text: guide.title, link: `/workflows/${guide.id}` })),
          { text: "Supporting tools and other workflows", link: "/workflows/supporting-tools" },
        ],
      },
      ...groups.map((group) => ({
        text: group.title,
        collapsed: true,
        link: `/groups/${group.id}`,
        items: group.skills.map((name) => ({ text: name, link: `/skills/${name}` })),
      })),
      {
        text: "Reference and maintenance",
        collapsed: true,
        items: [
          { text: "Arrow meanings and requirements", link: "/reference/relationships" },
          { text: "Catalog and availability", link: "/reference/catalog" },
          { text: "Maintain this site", link: "/maintenance/" },
          { text: "Regenerate diagrams", link: "/maintenance/diagrams" },
          { text: "Publication and URL paths", link: "/maintenance/publication" },
          { text: "Licenses and notices", link: "/reference/notices" },
        ],
      },
    ],
    outline: { level: [2, 3] },
    search: { provider: "local" },
    socialLinks: [{ icon: "github", link: c.repository }],
    footer: {
      message: `Skills guide the work; they do not grant permission. <a href="${base}reference/notices.html">Licenses and notices</a>.`,
    },
  },
});
