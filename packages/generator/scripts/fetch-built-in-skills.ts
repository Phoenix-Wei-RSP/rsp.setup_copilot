import { existsSync, cpSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import builtInSkills from '../src/modules/skills/built-in.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SKILLS_DIR = join(__dirname, '..', 'src', 'modules', 'skills');
const builtInDir = join(SKILLS_DIR, 'built-in');

console.log('🔍 Fetching built-in skills...\n');

for (const entry of builtInSkills) {
  console.log(`  Installing ${entry.skillName} from ${entry.repo}`);

  const result = spawnSync(
    'npx',
    ['skills', 'add', entry.repo, '--skill', entry.skillName, '--agent', 'claude-code', '-y'],
    { stdio: 'inherit', encoding: 'utf-8' }
  );

  if (result.status !== 0) {
    throw new Error(`npx skills add failed for ${entry.repo} (exit ${result.status ?? 'unknown'})`);
  }

  const installedSkillDir = join(process.cwd(), '.agents', 'skills', entry.skillName);
  if (!existsSync(installedSkillDir)) {
    throw new Error(`Expected skill directory not found at ${installedSkillDir} after install`);
  }

  const destDir = join(builtInDir, entry.skillName);
  rmSync(destDir, { recursive: true, force: true });
  cpSync(installedSkillDir, destDir, { recursive: true });
  console.log(`  ✓ built-in/${entry.skillName}`);
}

for (const name of ['.agents', '.claude', 'skills-lock.json']) {
  const target = join(process.cwd(), name);
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
  }
}

console.log('\n✅ Built-in skills fetched.');
