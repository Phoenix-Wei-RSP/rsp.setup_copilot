import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type Category, type LockFile, type BaseSkill } from './types.js';
import builtInSkills from './built-in.js';
import customSkills from './custom.js';

const SKILLS_DIR = dirname(fileURLToPath(import.meta.url));

function collectFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

function sha256Dir(skillDir: string): string {
  const hash = createHash('sha256');
  const files = collectFiles(skillDir).sort();
  for (const file of files) {
    hash.update(relative(skillDir, file));
    hash.update(readFileSync(file));
  }
  return hash.digest('hex');
}

const buildSkills = async (distDir: string) => {
  mkdirSync(distDir, { recursive: true });
  const lock: LockFile = { version: 1, skills: {} };

  for (const tier of ['built-in', 'custom'] as const) {
    const tierDir = join(SKILLS_DIR, tier);
    if (!existsSync(tierDir)) continue;

    const declarations: BaseSkill[] = tier === 'built-in' ? builtInSkills : customSkills;

    for (const skillDirName of readdirSync(tierDir)) {
      const skillDir = join(tierDir, skillDirName);
      const destDir = join(distDir, 'skills', skillDirName);
      const lockKey = tier === 'built-in' ? skillDirName : `rsp/${skillDirName}`;
      const decl = declarations.find(d => d.skillName === skillDirName);

      lock.skills[lockKey] = {
        source: tier,
        sha256: sha256Dir(skillDir),
        categories: decl?.categories ?? [],
      };

      rmSync(destDir, { recursive: true, force: true });
      cpSync(skillDir, destDir, { recursive: true });
      console.log(`✓ dist/skills/${skillDirName}/`);
    }
  }

  await writeFile(join(distDir, 'skills.lock.json'), JSON.stringify(lock, null, 2) + '\n', 'utf-8');
}

export { buildSkills }