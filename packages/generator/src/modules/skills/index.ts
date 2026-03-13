import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILLS_DIR = dirname(fileURLToPath(import.meta.url));

type Category = 'Frontend' | 'Backend' | 'QualityAssurance';

interface LockEntry {
  source: string;
  sha256: string;
  categories: Category[];
}

interface LockFile {
  version: number;
  skills: Record<string, LockEntry>;
}


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

const buildLock = async (distDir: string) => {
  const lock: LockFile = { version: 1, skills: {} };

  for (const tier of ['built-in', 'custom'] as const) {
    const tierDir = join(SKILLS_DIR, tier);
    if (!existsSync(tierDir)) continue;

    const jsonPath = join(SKILLS_DIR, tier === 'built-in' ? 'built-in.json' : 'custom.json');
    const declarations = existsSync(jsonPath)
      ? (JSON.parse(readFileSync(jsonPath, 'utf-8')) as Array<{ skillName: string; categories: Category[] }>)
      : [];

    for (const skillDirName of readdirSync(tierDir)) {
      const skillDir = join(tierDir, skillDirName);
      const lockKey = tier === 'built-in' ? skillDirName : `rsp/${skillDirName}`;
      const decl = declarations.find(d => d.skillName === skillDirName);

      lock.skills[lockKey] = {
        source: tier,
        sha256: sha256Dir(skillDir),
        categories: decl?.categories ?? [],
      };
    }
  }

  await writeFile(join(distDir, 'skills.lock.json'), JSON.stringify(lock, null, 2) + '\n', 'utf-8');
}


const copySkills = (distDir: string): void => {
  for (const tier of ['built-in', 'custom'] as const) {
    const tierDir = join(SKILLS_DIR, tier);
    if (!existsSync(tierDir)) continue;

    for (const skillDirName of readdirSync(tierDir)) {
      const srcDir = join(tierDir, skillDirName);
      const destDir = join(distDir, 'skills', skillDirName);
      rmSync(destDir, { recursive: true, force: true });
      cpSync(srcDir, destDir, { recursive: true });
      console.log(`✓ dist/skills/${skillDirName}/`);
    }
  }
}

export async function buildSkills(distDir: string) {
  mkdirSync(distDir, { recursive: true });
  buildLock(distDir);
  copySkills(distDir);
}
