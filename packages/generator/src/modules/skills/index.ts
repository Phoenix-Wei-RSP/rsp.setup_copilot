import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
} from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { type SkillManifestEntry, type SkillsManifest, type BaseSkill } from "@rsp/shared";
import builtInSkills from "./built-in";
import customSkills from "./custom";

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
  const hash = createHash("sha256");
  const files = collectFiles(skillDir).sort();
  for (const file of files) {
    hash.update(relative(skillDir, file));
    hash.update(readFileSync(file));
  }
  return hash.digest("hex");
}

const buildSkills = async (distDir: string) => {
  mkdirSync(distDir, { recursive: true });
  const manifest: SkillsManifest = { skills: {} };

  // 1. Process built-in skills directly from declarations
  for (const decl of builtInSkills) {
    manifest.skills[decl.skillName] = {
      source: "built-in",
      sha256: "",
      categories: decl.categories,
      repo: decl.repo,
    };
    console.log(`✓ recorded built-in skill: ${decl.skillName}`);
  }

  // 2. Process custom skills from the filesystem
  const customTierDir = join(SKILLS_DIR, "custom");
  if (existsSync(customTierDir)) {
    for (const skillDirName of readdirSync(customTierDir)) {
      const skillDir = join(customTierDir, skillDirName);
      const destDir = join(distDir, "skills", skillDirName);
      const decl = customSkills.find((d) => d.skillName === skillDirName);

      manifest.skills[skillDirName] = {
        source: "custom",
        sha256: sha256Dir(skillDir),
        categories: decl?.categories ?? [],
      };
      rmSync(destDir, { recursive: true, force: true });
      cpSync(skillDir, destDir, { recursive: true });
      console.log(`✓ dist/skills/${skillDirName}/`);
    }
  }

  await writeFile(
    join(distDir, "skills-manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n",
    "utf-8",
  );
};

export { buildSkills };
