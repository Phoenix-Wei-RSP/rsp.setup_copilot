import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { InstallModule } from '../../types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  order: 90,
  name: 'web-guide',
  category: 'common',
  generate: () => {
    const configPath = join(__dirname, '../../../generator.config.json');
    const config = JSON.parse(readFileSync(configPath, 'utf-8'));
    return `## Next Steps

Configuration complete! Visit **${config.webUrl}** to view full usage documentation, examples, and best practices.`;
  }
} satisfies InstallModule;

