import { existsSync, cpSync, mkdirSync, realpathSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));
// CLI is bundled in `dist/cli.js`, so __dirname will be `dist/` at runtime.
const DIST_DIR = __dirname;
const GITHUB_HOOKS_DIR = join(process.cwd(), '.github', 'hooks');

export async function installHooksAction() {
  console.log(chalk.blue('🔗 Installing Copilot hooks...\n'));

  const copilotHooksSrc = join(DIST_DIR, 'hooks', 'copilot');

  if (!existsSync(copilotHooksSrc)) {
    console.log(chalk.yellow(`⚠️  Source hooks directory not found at ${copilotHooksSrc}`));
    return;
  }

  // Ensure target exists and resolve symlinks to write to the real directory (SSOT)
  let targetDir = GITHUB_HOOKS_DIR;
  try {
    if (existsSync(GITHUB_HOOKS_DIR)) {
      targetDir = realpathSync(GITHUB_HOOKS_DIR);
    }
  } catch {
    // Fallback to original path if realpath fails
  }

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  try {
    // Copy contents of copilotHooksSrc into the resolved targetDir
    cpSync(copilotHooksSrc, targetDir, { recursive: true });
    console.log(chalk.green(`✅ Copilot hooks successfully installed to ${targetDir}`));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(chalk.red(`❌ Failed to copy hooks: ${msg}`));
  }
}
