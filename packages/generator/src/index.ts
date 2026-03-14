import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildSkills } from "./modules/skills/index.js";
import { buildHooks } from "./modules/hooks/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Output to the monorepo root dist/ directory
const ROOT_DIR = resolve(__dirname, "..", "..", "..");
const DIST_DIR = join(ROOT_DIR, "dist");

async function run() {
  await buildSkills(DIST_DIR);
  await buildHooks(DIST_DIR);
  console.log("Done!");
}

run().catch(console.error);
