import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOOKS_DIR = dirname(fileURLToPath(import.meta.url));

const buildHooks = async (distDir: string) => {
  const targetHooksDir = join(distDir, 'hooks');
  mkdirSync(targetHooksDir, { recursive: true });

  const copilotDir = join(HOOKS_DIR, 'copilot');
  if (existsSync(copilotDir)) {
    // Copy all hook configs and scripts
    cpSync(copilotDir, targetHooksDir, { recursive: true });
    console.log('✓ dist/hooks/ (Copilot)');
  }
}

export { buildHooks };
