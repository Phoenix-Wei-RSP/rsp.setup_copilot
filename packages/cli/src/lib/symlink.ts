import {
  existsSync,
  lstatSync,
  realpathSync,
  symlinkSync,
  rmSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import chalk from 'chalk';
import { arePathsEquivalent } from './fs-utils.js';

export function isSymlinkPointingTo(linkPath: string, expectedTarget: string): boolean {
  if (!existsSync(linkPath)) return false;
  const stats = lstatSync(linkPath);
  if (!stats.isSymbolicLink()) return false;

  try {
    const actualTarget = realpathSync(linkPath);
    const resolvedExpected = resolve(expectedTarget);
    return actualTarget === resolvedExpected;
  } catch {
    return false;
  }
}

export function setupSymlink(target: string, linkPath: string, description: string): boolean {
  if (existsSync(linkPath)) {
    const stats = lstatSync(linkPath);
    if (stats.isSymbolicLink()) {
      const currentTarget = realpathSync(linkPath);
      const expectedTarget = resolve(target);
      if (currentTarget === expectedTarget) {
        console.log(chalk.dim(`  ✓ ${description} already correct`));
        return true;
      }
      rmSync(linkPath, { force: true });
    } else if (stats.isFile()) {
      rmSync(linkPath, { force: true });
    } else if (stats.isDirectory()) {
      try {
        const items = readdirSync(linkPath);
        if (items.length === 0) {
          rmSync(linkPath, { recursive: true, force: true });
        } else {
          const targetPath = resolve(linkPath, '..', target);
          if (existsSync(targetPath) && lstatSync(targetPath).isDirectory()) {
            let allMigrated = true;
            for (const item of items) {
              const itemPath = join(linkPath, item);
              const targetItemPath = join(targetPath, item);
              if (!existsSync(targetItemPath) || !arePathsEquivalent(itemPath, targetItemPath)) {
                allMigrated = false;
                break;
              }
            }

            if (allMigrated) {
              console.log(
                chalk.blue(`  🔄 Converting ${linkPath} to symlink (content already migrated)`),
              );
              rmSync(linkPath, { recursive: true, force: true });
            } else {
              console.log(
                chalk.red(
                  `  ❌ Cannot create symlink at ${linkPath}: directory not empty (${items.length} items)`,
                ),
              );
              return false;
            }
          } else {
            console.log(
              chalk.red(
                `  ❌ Cannot create symlink at ${linkPath}: directory not empty (${items.length} items)`,
              ),
            );
            return false;
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(chalk.yellow(`  ⚠️ Cannot check ${linkPath}: ${msg}`));
        return false;
      }
    }
  }

  try {
    const isWin = process.platform === 'win32';
    let symlinkType: 'dir' | 'file' | 'junction' = 'dir';

    if (isWin) {
      try {
        const targetPath = resolve(linkPath, '..', target);
        const targetStats = statSync(targetPath);
        symlinkType = targetStats.isDirectory() ? 'junction' : 'file';
      } catch {
        symlinkType = 'junction';
      }
    } else {
      try {
        const targetPath = resolve(linkPath, '..', target);
        const targetStats = statSync(targetPath);
        symlinkType = targetStats.isDirectory() ? 'dir' : 'file';
      } catch {
        symlinkType = 'dir';
      }
    }

    symlinkSync(target, linkPath, symlinkType);
    console.log(chalk.green(`  ✓ ${description}: ${linkPath} -> ${target}`));
    return true;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(chalk.red(`  ❌ Failed to link ${linkPath}: ${msg}`));
    if (process.platform === 'win32' && msg.includes('privilege')) {
      console.log(
        chalk.yellow(
          `     Windows requires Developer Mode or Administrator privileges for symlinks`,
        ),
      );
    }
    return false;
  }
}
