import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { type McpsManifest } from '@rsp/shared';

const __dirname = dirname(fileURLToPath(import.meta.url));
// CLI is bundled in `dist/cli.js`, so __dirname will be `dist/` at runtime.
const DIST_DIR = __dirname;
const VSCODE_DIR = join(process.cwd(), '.vscode');
const MCP_JSON_PATH = join(VSCODE_DIR, 'mcp.json');

interface InstallMcpsOptions {
  categories?: string;
}

export async function installMcpsAction(options: InstallMcpsOptions) {
  console.log(chalk.blue('🔗 Installing VSCode MCP configurations...\n'));

  const manifestPath = join(DIST_DIR, 'mcps', 'mcps-manifest.json');
  if (!existsSync(manifestPath)) {
    console.log(chalk.red(`❌ Cannot find mcps-manifest.json at ${manifestPath}`));
    process.exit(1);
  }

  const manifestContent = readFileSync(manifestPath, 'utf-8');
  let manifest: McpsManifest;
  try {
    manifest = JSON.parse(manifestContent);
  } catch {
    console.log(chalk.red('❌ Failed to parse mcps-manifest.json'));
    process.exit(1);
  }

  const requestedCategories = options.categories
    ? options.categories.split(',').map((c) => c.trim())
    : [];

  const mcpServers: Record<string, import('@rsp/shared').McpServerConfig> = {};

  for (const [mcpId, mcpInfo] of Object.entries(manifest.mcps)) {
    // Check if platform supports vscode
    if (!mcpInfo.configs['vscode']) {
      continue;
    }

    // Filter by category if requested
    if (requestedCategories.length > 0) {
      const match = mcpInfo.categories.some((cat) => requestedCategories.includes(cat));
      if (!match) continue;
    }

    mcpServers[mcpId] = mcpInfo.configs['vscode'];
    console.log(`  ✓ Prepared MCP: ${chalk.cyan(mcpId)}`);
  }

  if (Object.keys(mcpServers).length === 0) {
    console.log(chalk.yellow('⚠️ No MCPs matched the criteria.'));
    return;
  }

  if (!existsSync(VSCODE_DIR)) {
    mkdirSync(VSCODE_DIR, { recursive: true });
  }

  let finalConfig: Record<string, unknown> = { servers: {} };

  if (existsSync(MCP_JSON_PATH)) {
    try {
      const existingContent = readFileSync(MCP_JSON_PATH, 'utf-8');
      finalConfig = JSON.parse(existingContent) as Record<string, unknown>;
    } catch {
      console.log(chalk.yellow(`⚠️ Could not parse existing ${MCP_JSON_PATH}, overriding...`));
    }
  }

  // VSCode mcp.json uses the `servers` key per official documentation:
  // https://code.visualstudio.com/docs/copilot/customization/mcp-servers
  if (!finalConfig.servers) {
    finalConfig.servers = {};
  }

  finalConfig.servers = {
    ...(finalConfig.servers as Record<string, unknown>),
    ...mcpServers,
  };

  writeFileSync(MCP_JSON_PATH, JSON.stringify(finalConfig, null, 2) + '\n', 'utf-8');

  console.log(chalk.green(`\n✅ MCP configurations successfully installed to ${MCP_JSON_PATH}`));
}
