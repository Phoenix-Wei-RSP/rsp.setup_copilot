import { existsSync, cpSync, mkdirSync } from 'node:fs';
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

  // Ensure target exists
  if (!existsSync(GITHUB_HOOKS_DIR)) {
    mkdirSync(GITHUB_HOOKS_DIR, { recursive: true });
  }

  try {
    // Copy contents of copilotHooksSrc into GITHUB_HOOKS_DIR
    cpSync(copilotHooksSrc, GITHUB_HOOKS_DIR, { recursive: true });
    console.log(chalk.green(`✅ Copilot hooks successfully installed to ${GITHUB_HOOKS_DIR}`));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(chalk.red(`❌ Failed to copy hooks: ${msg}`));
  }
}
