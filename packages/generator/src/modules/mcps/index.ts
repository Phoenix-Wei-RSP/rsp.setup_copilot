import { mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { type McpsManifest } from '@rsp/shared';
import builtInMcps from './built-in.js';

const buildMcps = async (distDir: string) => {
  mkdirSync(distDir, { recursive: true });
  const manifest: McpsManifest = { mcps: {} };

  // Generate the manifest
  for (const mcp of builtInMcps) {
    manifest.mcps[mcp.mcpId] = {
      categories: mcp.categories,
      configs: mcp.configs,
    };
    console.log(`✓ recorded built-in MCP: ${mcp.mcpId}`);
  }

  // Pre-generate static outputs for platforms if needed
  // For vscode, we can generate a complete mcp.json of all mcps
  // But usually developers use CLI `install-mcps` to select categories.
  // We will let the CLI generate the final mcp.json into .vscode based on the manifest.

  const mcpsDir = join(distDir, 'mcps');
  mkdirSync(mcpsDir, { recursive: true });

  await writeFile(
    join(mcpsDir, 'mcps-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
    'utf-8',
  );
};

export { buildMcps };
