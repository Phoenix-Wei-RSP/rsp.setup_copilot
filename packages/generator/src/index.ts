import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSkills } from './modules/skills/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');

buildSkills(DIST_DIR);
console.log('Done!');
