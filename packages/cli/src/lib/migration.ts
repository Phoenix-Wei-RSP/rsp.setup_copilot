import { existsSync, mkdirSync, cpSync, rmSync, lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import chalk from 'chalk';
import { hasAnyFiles, arePathsEquivalent } from './fs-utils.js';

export interface MigrationResult {
  hadRealCollision: boolean;
  allEquivalent: boolean;
}

export function migrateDirectoryContents(
  sourceDir: string,
  destDir: string,
  deleteSource: boolean = true,
): MigrationResult {
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  const items = readdirSync(sourceDir);
  let hadRealCollision = false;
  let allEquivalent = true;

  for (const item of items) {
    const sourcePath = join(sourceDir, item);
    const destPath = join(destDir, item);

    if (!existsSync(destPath)) {
      cpSync(sourcePath, destPath, { recursive: true });
      console.log(chalk.dim(`    Copied ${sourcePath} -> ${destPath}`));
      if (deleteSource) {
        rmSync(sourcePath, { recursive: true, force: true });
      }
      allEquivalent = false;
    } else {
      const destStats = lstatSync(destPath);
      if (destStats.isDirectory() && !hasAnyFiles(destPath)) {
        console.log(chalk.dim(`    🧹 Cleaning empty directory: ${destPath}`));
        rmSync(destPath, { recursive: true, force: true });
        cpSync(sourcePath, destPath, { recursive: true });
        console.log(chalk.dim(`    Copied ${sourcePath} -> ${destPath}`));
        if (deleteSource) {
          rmSync(sourcePath, { recursive: true, force: true });
        }
        allEquivalent = false;
      } else if (arePathsEquivalent(sourcePath, destPath)) {
        console.log(chalk.dim(`    ℹ️  ${item} already migrated (content matches)`));
        if (deleteSource) {
          rmSync(sourcePath, { recursive: true, force: true });
        }
      } else {
        console.log(
          chalk.red(`    ❌ Collision: ${destPath} has different content than ${sourcePath}`),
        );
        hadRealCollision = true;
        allEquivalent = false;
      }
    }
  }

  return { hadRealCollision, allEquivalent };
}

export function moveAllFiles(source: string, dest: string): void {
  if (!existsSync(source)) return;

  const stats = lstatSync(source);
  if (stats.isSymbolicLink()) {
    console.log(chalk.dim(`  Skipping symlink ${source} in final sweep`));
    return;
  }

  const files = readdirSync(source);
  let hadCollision = false;

  for (const file of files) {
    const fromPath = join(source, file);
    const toPath = join(dest, file);

    if (!existsSync(toPath)) {
      cpSync(fromPath, toPath, { recursive: true });
      console.log(chalk.dim(`  Moved ${fromPath} -> ${toPath}`));
    } else {
      const toStats = lstatSync(toPath);
      if (toStats.isDirectory() && !hasAnyFiles(toPath)) {
        console.log(chalk.dim(`  🧹 Cleaning empty directory: ${toPath}`));
        rmSync(toPath, { recursive: true, force: true });
        cpSync(fromPath, toPath, { recursive: true });
        console.log(chalk.dim(`  Moved ${fromPath} -> ${toPath}`));
      } else {
        console.log(chalk.yellow(`  ⚠️ Collision: ${toPath} already exists. Skipping.`));
        hadCollision = true;
      }
    }
  }

  if (!hadCollision) {
    rmSync(source, { recursive: true, force: true });
    console.log(chalk.dim(`  Removed original ${source}`));
  } else {
    console.log(chalk.yellow(`  ⚠️ Could not remove ${source} due to collisions`));
  }
}
