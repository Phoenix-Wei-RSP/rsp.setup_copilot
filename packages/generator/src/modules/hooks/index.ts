import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOOKS_DIR = dirname(fileURLToPath(import.meta.url));

const buildHooks = async (distDir: string) => {
  const targetHooksDir = join(distDir, 'hooks');
  mkdirSync(targetHooksDir, { recursive: true });

  const agents = ['copilot', 'claude'];
  for (const agent of agents) {
    const agentDir = join(HOOKS_DIR, agent);
    if (existsSync(agentDir)) {
      cpSync(agentDir, join(targetHooksDir, agent), { recursive: true });
      console.log(`✓ dist/hooks/${agent}/ (${agent})`);
    }
  }
};

export { buildHooks };
