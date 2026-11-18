import { setupTool } from "./archify-tool.mjs";
import { renderDiagrams } from "./render-diagrams.mjs";

const [command, ...extra] = process.argv.slice(2);
if (command === "setup" && !extra.length) console.log((await setupTool()).directory);
else if (command === "render") console.log(`${await renderDiagrams(extra)} diagrams regenerated.`);
else throw new Error("Usage: node scripts/docs/archify.mjs setup | render [known-diagram-id ...]");
