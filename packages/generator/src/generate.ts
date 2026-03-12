/**
 * CLI entry point for generator
 * Reads package.json, constructs context, calls generate(), writes output
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generate, writeInstallationFile, writeReadme } from './index.js';
import type { GenerateContext } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  // Read package.json to get version
  const pkgPath = join(__dirname, '..', 'package.json');
  const pkgJson = JSON.parse(readFileSync(pkgPath, 'utf-8'));

  // Construct generation context
  const context: GenerateContext = {
    version: pkgJson.version,
    repoUrl: 'https://github.com/your-org/rsp.setup_copilot',
    webUrl: 'https://your-org.github.io/rsp.setup_copilot'
  };

  console.log(`Generating installation documentation v${context.version}...`);

  // Generate markdown content
  const content = await generate(context);

  // Write installation.md
  await writeInstallationFile(content);
  console.log('✓ Generated dist/installation.md');

  // Write README.md
  writeReadme(context);
  console.log('✓ Generated dist/README.md');

  console.log('Done!');
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
