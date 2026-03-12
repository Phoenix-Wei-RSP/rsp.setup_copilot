/**
 * Main entry point for the generator package
 * Scans modules directory, sorts by order, generates installation.md
 */
import { readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Scans all module directories and collects .ts files
 * @returns Array of absolute file paths to module files
 */
function scanModuleFiles() {
    const modulesDir = join(__dirname, 'modules');
    const categories = ['common', 'skills', 'hooks', 'mcps'];
    const files = [];
    for (const category of categories) {
        const categoryPath = join(modulesDir, category);
        try {
            const entries = readdirSync(categoryPath);
            for (const entry of entries) {
                if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) {
                    files.push(join(categoryPath, entry));
                }
            }
        }
        catch (err) {
            // Category directory doesn't exist yet, skip
            continue;
        }
    }
    return files;
}
/**
 * Sorts module file paths by numeric prefix
 * Example: 01-header.ts < 02-footer.ts < 10-demo.ts
 */
function sortModuleFiles(files) {
    return files.sort((a, b) => {
        const aMatch = a.match(/(\d+)-/);
        const bMatch = b.match(/(\d+)-/);
        if (!aMatch || !bMatch) {
            return a.localeCompare(b);
        }
        const aNum = parseInt(aMatch[1], 10);
        const bNum = parseInt(bMatch[1], 10);
        return aNum - bNum;
    });
}
/**
 * Main generate function
 * Scans modules/, dynamically imports each, calls generate(), concatenates output
 * @param context - Generation context with version, URLs, etc.
 * @returns Generated markdown content
 */
export async function generate(context) {
    const moduleFiles = scanModuleFiles();
    const sortedFiles = sortModuleFiles(moduleFiles);
    const outputs = [];
    for (const filePath of sortedFiles) {
        const fileUrl = `file:///${filePath.replace(/\\/g, '/')}`;
        const module = await import(fileUrl);
        const installModule = module.default;
        const output = installModule.generate(context);
        outputs.push(output);
    }
    return outputs.join('\n\n---\n\n');
}
/**
 * Writes generated content to dist/installation.md
 */
export async function writeInstallationFile(content) {
    const distDir = join(__dirname, '..', 'dist');
    mkdirSync(distDir, { recursive: true });
    const outputPath = join(distDir, 'installation.md');
    writeFileSync(outputPath, content, 'utf-8');
}
/**
 * Generates and writes README.md
 */
export function writeReadme(context) {
    const distDir = join(__dirname, '..', 'dist');
    mkdirSync(distDir, { recursive: true });
    const readmeContent = `# RSP Setup Copilot

Version: ${context.version}

For installation instructions, see [installation.md](./installation.md)

Documentation: ${context.webUrl}
Repository: ${context.repoUrl}
`;
    const readmePath = join(distDir, 'README.md');
    writeFileSync(readmePath, readmeContent, 'utf-8');
}
