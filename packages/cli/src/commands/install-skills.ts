import {
  existsSync,
  mkdirSync,
  rmSync,
  readFileSync,
  cpSync,
  lstatSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import chalk from "chalk";
import { type SkillsManifest, type SkillManifestEntry } from "@rsp/shared";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Note: CLI is bundled in `dist/cli.js`, so __dirname will be `dist/` at runtime.
const DIST_DIR = __dirname;
const RSP_DIR = ".rsp";
const SHARED_SKILLS_DIR = join(process.cwd(), RSP_DIR, "shared", "skills");

interface InstallSkillsOptions {
  categories?: string;
}

export async function installSkillsAction(
  names: string[],
  options: InstallSkillsOptions,
) {
  console.log(chalk.blue("📦 Installing skills...\n"));

  // Load manifest from adjacent file
  const manifestPath = join(DIST_DIR, "skills-manifest.json");
  if (!existsSync(manifestPath)) {
    console.log(
      chalk.red(`❌ Cannot find skills-manifest.json at ${manifestPath}`),
    );
    process.exit(1);
  }

  const manifestContent = readFileSync(manifestPath, "utf-8");
  let manifest: SkillsManifest;
  try {
    manifest = JSON.parse(manifestContent);
  } catch (e) {
    console.log(chalk.red("❌ Failed to parse skills-manifest.json"));
    process.exit(1);
  }

  const allSkills = manifest.skills;
  const targetSkills = new Map<string, SkillManifestEntry>();

  // Determine which skills to install
  const requestedCategories = options.categories
    ? options.categories.split(",").map((c) => c.trim())
    : [];

  for (const [skillKey, skillInfo] of Object.entries(allSkills)) {
    // Check if matched by Name
    if (names.includes(skillKey)) {
      targetSkills.set(skillKey, skillInfo);
      continue;
    }

    // Check if matched by Categories
    if (requestedCategories.length > 0) {
      const match = skillInfo.categories.some((cat: string) =>
        requestedCategories.includes(cat),
      );
      if (match) {
        targetSkills.set(skillKey, skillInfo);
      }
    }
  }

  if (targetSkills.size === 0) {
    console.log(chalk.yellow("⚠️ No skills matched the criteria."));
    return;
  }

  for (const [skillName, skillInfo] of targetSkills.entries()) {
    console.log(
      `\n⚙️ Processing skill: ${chalk.cyan(skillName)} [${skillInfo.source}]`,
    );

    const destDir = join(SHARED_SKILLS_DIR, skillName);

    if (skillInfo.source === "built-in") {
      await installBuiltInSkill(skillName, destDir, skillInfo.repo);
    } else {
      installCustomSkill(skillName, destDir);
    }
  }

  console.log(chalk.green("\n✅ Skill installation complete!"));
}

async function installBuiltInSkill(
  skillName: string,
  destDir: string,
  repo: string | undefined,
) {
  console.log(`  Downloading built-in skill: ${skillName}`);

  if (!repo) {
    console.log(
      chalk.red(
        `  ❌ Repository URL not found in manifest for built-in skill ${skillName}`,
      ),
    );
    return;
  }

  // `npx skills add --agent claude-code` installs to `.claude/skills/<skillName>`.
  // Since `rsp init` creates a symlink `.claude/skills → .rsp/shared/skills`,
  // the files land directly in our target directory.
  const result = spawnSync(
    "npx",
    [
      "skills",
      "add",
      repo,
      "--skill",
      skillName,
      "--agent",
      "claude-code",
      "--copy",
      "-y",
    ],
    { stdio: "pipe", encoding: "utf-8" },
  );

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status !== 0) {
    console.log(chalk.red(`  ❌ npx skills add failed for ${skillName}`));
    return;
  }

  if (existsSync(destDir)) {
    console.log(chalk.green(`  ✓ Installed to ${destDir}`));
  } else {
    // If init hasn't been run, .claude/skills is not a symlink to .rsp/shared/skills,
    // so npx installs to .claude/skills/ or .agents/skills/ as a real directory.
    // We need to find the installed skill and copy it to our target.
    const fallbackPaths = [
      join(process.cwd(), ".claude", "skills", skillName),
      join(process.cwd(), ".agents", "skills", skillName),
    ];

    let found = false;
    for (const src of fallbackPaths) {
      if (existsSync(src)) {
        mkdirSync(join(destDir, ".."), { recursive: true });
        cpSync(src, destDir, { recursive: true });
        console.log(chalk.green(`  ✓ Installed to ${destDir}`));
        found = true;
        break;
      }
    }

    if (!found) {
      console.log(
        chalk.red(
          `  ❌ Expected skill directory not found at ${destDir} after install.`,
        ),
      );
    }
  }

  // Clean up any temporary files/dirs created by npx skills add
  for (const name of [".agents", ".claude", "skills-lock.json"]) {
    const target = join(process.cwd(), name);
    // Only clean up if it's a real directory (not the symlink created by rsp init)
    if (existsSync(target)) {
      try {
        const stat = lstatSync(target);
        if (!stat.isSymbolicLink()) {
          rmSync(target, { recursive: true, force: true });
        }
      } catch {
        // ignore
      }
    }
  }
}

function installCustomSkill(skillName: string, destDir: string) {
  const sourceDir = join(DIST_DIR, "skills", skillName);

  if (!existsSync(sourceDir)) {
    console.log(
      chalk.red(`  ❌ Bundled skill directory not found: ${sourceDir}`),
    );
    return;
  }

  rmSync(destDir, { recursive: true, force: true });
  cpSync(sourceDir, destDir, { recursive: true });
  console.log(chalk.green(`  ✓ Copied to ${destDir}`));
}
