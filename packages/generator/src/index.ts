import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSkills } from './modules/skills/index.js';
import { buildHooks } from './modules/hooks/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');

async function run() {
  await buildSkills(DIST_DIR);
  await buildHooks(DIST_DIR);
  console.log('Done!');
}

run().catch(console.error);
