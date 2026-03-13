
import { generate, writeInstallationFile, writeReadme } from './index.js';


async function main() {
  // Generate markdown content
  const content = await generate();

  // Write installation.md
  await writeInstallationFile(content);
  console.log('✓ Generated dist/installation.md');

  // Write README.md
  writeReadme();
  console.log('✓ Generated dist/README.md');

  console.log('Done!');
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});

