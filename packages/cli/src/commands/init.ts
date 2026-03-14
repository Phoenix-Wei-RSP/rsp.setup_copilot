import { mkdirSync, existsSync, renameSync, symlinkSync, rmSync, lstatSync, readdirSync, writeFileSync, realpathSync, cpSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import chalk from 'chalk';

const RSP_DIR = '.rsp';
const SHARED_DIR = join(RSP_DIR, 'shared');

export async function initAction() {
  console.log(chalk.blue('🚀 Initializing RSP environment...\n'));

  const dirs = [
    join(SHARED_DIR, 'skills'),
    join(SHARED_DIR, 'hooks'),
    join(SHARED_DIR, 'mcps'),
    join(SHARED_DIR, 'memory'),
    join(RSP_DIR, 'github'),
    join(RSP_DIR, 'claude'),
  ];

  for (const dir of dirs) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      console.log(chalk.dim(`  Created ${dir}`));
    }
  }

  const migrateDirectoryContents = (sourceDir: string, destDir: string, deleteSource: boolean = true): boolean => {
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    
    const items = readdirSync(sourceDir);
    let hadCollision = false;
    
    for (const item of items) {
      const sourcePath = join(sourceDir, item);
      const destPath = join(destDir, item);
      
      if (!existsSync(destPath)) {
        cpSync(sourcePath, destPath, { recursive: true });
        console.log(chalk.dim(`    Copied ${sourcePath} -> ${destPath}`));
        if (deleteSource) {
          rmSync(sourcePath, { recursive: true, force: true });
        }
      } else {
        console.log(chalk.yellow(`    ⚠️ Collision: ${destPath} already exists. Skipping ${sourcePath}.`));
        hadCollision = true;
      }
    }
    
    return hadCollision;
  };

  const isSymlinkPointingTo = (linkPath: string, expectedTarget: string): boolean => {
    if (!existsSync(linkPath)) return false;
    const stats = lstatSync(linkPath);
    if (!stats.isSymbolicLink()) return false;
    
    try {
      const actualTarget = realpathSync(linkPath);
      const resolvedExpected = resolve(expectedTarget);
      return actualTarget === resolvedExpected;
    } catch {
      return false;
    }
  };

  console.log(chalk.blue('\n📦 Step 2: Migrating existing data...'));

  const skillsMigrations = [
    { from: '.github/skills', to: join(SHARED_DIR, 'skills') },
    { from: '.claude/skills', to: join(SHARED_DIR, 'skills') },
  ];

  for (const { from, to } of skillsMigrations) {
    if (!existsSync(from)) continue;
    
    if (isSymlinkPointingTo(from, to)) {
      console.log(chalk.dim(`  ✓ ${from} already points to ${to}, skipping`));
      continue;
    }
    
    const stats = lstatSync(from);
    
    if (stats.isSymbolicLink()) {
      try {
        const realPath = realpathSync(from);
        console.log(chalk.blue(`  📍 Resolved symlink ${from} -> ${realPath}`));
        
        if (existsSync(realPath) && lstatSync(realPath).isDirectory()) {
          const hadCollision = migrateDirectoryContents(realPath, to, true);
          if (!hadCollision) {
            try {
              const remainingItems = readdirSync(realPath);
              if (remainingItems.length === 0) {
                rmSync(realPath, { recursive: true, force: true });
                console.log(chalk.dim(`    Removed empty source directory ${realPath}`));
              }
            } catch (err: any) {
              console.log(chalk.yellow(`    ⚠️ Could not remove ${realPath}: ${err.message}`));
            }
          }
          rmSync(from, { force: true });
          console.log(chalk.green(`  ✓ Migrated contents from ${realPath} to ${to}`));
        }
      } catch (err: any) {
        console.error(chalk.red(`  ❌ Failed to resolve symlink ${from}: ${err.message}`));
      }
      continue;
    }
    
    if (stats.isDirectory()) {
      const hadCollision = migrateDirectoryContents(from, to, true);
      if (!hadCollision) {
        try {
          const remainingItems = readdirSync(from);
          if (remainingItems.length === 0) {
            rmSync(from, { recursive: true, force: true });
            console.log(chalk.green(`  ✓ Migrated ${from} to ${to}`));
          } else {
            console.log(chalk.yellow(`  ⚠️ ${from} not fully migrated (${remainingItems.length} items remain)`));
          }
        } catch (err: any) {
          console.log(chalk.yellow(`  ⚠️ Could not check ${from}: ${err.message}`));
        }
      } else {
        console.log(chalk.yellow(`  ⚠️ ${from} not fully migrated due to collisions`));
      }
    }
  }

  if (existsSync('.vscode/mcp.json')) {
    const mcpDest = join(SHARED_DIR, 'mcps/mcp.json');
    if (!existsSync(mcpDest)) {
      renameSync('.vscode/mcp.json', mcpDest);
      console.log(chalk.green(`  ✓ Migrated .vscode/mcp.json to ${mcpDest}`));
    } else {
      console.log(chalk.yellow(`  ⚠️ ${mcpDest} already exists, skipping .vscode/mcp.json migration`));
    }
  }

  const agentsMdPath = join(RSP_DIR, 'AGENTS.md');
  const agentsSources = [
    '.claude/AGENTS.md',
    '.github/copilot-instructions.md'
  ];

  let mergedContent = '';
  const migratedSources: string[] = [];

  for (const source of agentsSources) {
    if (existsSync(source) && lstatSync(source).isFile()) {
      const content = readFileSync(source, 'utf-8');
      if (content.trim()) {
        if (mergedContent && !mergedContent.endsWith('\n\n')) {
          mergedContent += '\n\n';
        }
        mergedContent += content;
        migratedSources.push(source);
      }
    }
  }

  if (mergedContent) {
    writeFileSync(agentsMdPath, mergedContent, 'utf-8');
    console.log(chalk.green(`  ✓ Created ${agentsMdPath} from ${migratedSources.join(', ')}`));
    for (const source of migratedSources) {
      try {
        if (existsSync(source)) {
          rmSync(source, { force: true });
          console.log(chalk.dim(`    Removed ${source}`));
        }
      } catch (err: any) {
        console.log(chalk.yellow(`    ⚠️ Could not remove ${source}: ${err.message}`));
      }
    }
  } else if (!existsSync(agentsMdPath)) {
    writeFileSync(agentsMdPath, '', 'utf-8');
    console.log(chalk.dim(`  Created empty ${agentsMdPath}`));
  }

  const moveAll = (source: string, dest: string) => {
    if (!existsSync(source)) return;
    
    const stats = lstatSync(source);
    if (stats.isSymbolicLink()) {
      console.log(chalk.dim(`  Skipping symlink ${source} in final sweep`));
      return;
    }
    
    const files = readdirSync(source);
    let hadCollision = false;
    
    for (const file of files) {
      const fromPath = join(source, file);
      const toPath = join(dest, file);
      
      if (!existsSync(toPath)) {
        cpSync(fromPath, toPath, { recursive: true });
        console.log(chalk.dim(`  Moved ${fromPath} -> ${toPath}`));
      } else {
        console.log(chalk.yellow(`  ⚠️ Collision: ${toPath} already exists. Skipping.`));
        hadCollision = true;
      }
    }
    
    if (!hadCollision) {
      rmSync(source, { recursive: true, force: true });
      console.log(chalk.dim(`  Removed original ${source}`));
    } else {
      console.log(chalk.yellow(`  ⚠️ Could not remove ${source} due to collisions`));
    }
  };

  console.log(chalk.blue('\n📦 Final sweep: moving remaining files...'));
  moveAll('.github', join(RSP_DIR, 'github'));
  moveAll('.claude', join(RSP_DIR, 'claude'));

  console.log(chalk.blue('\n🔗 Step 3: Establishing symlinks...'));
  
  const setupSymlink = (target: string, linkPath: string, description: string): boolean => {
    if (existsSync(linkPath)) {
      const stats = lstatSync(linkPath);
      if (stats.isSymbolicLink()) {
        const currentTarget = realpathSync(linkPath);
        const expectedTarget = resolve(target);
        if (currentTarget === expectedTarget) {
          console.log(chalk.dim(`  ✓ ${description} already correct`));
          return true;
        }
        rmSync(linkPath, { force: true });
      } else if (stats.isFile()) {
        rmSync(linkPath, { force: true });
      } else if (stats.isDirectory()) {
        try {
          const items = readdirSync(linkPath);
          if (items.length === 0) {
            rmSync(linkPath, { recursive: true, force: true });
          } else {
            console.log(chalk.red(`  ❌ Cannot create symlink at ${linkPath}: directory not empty (${items.length} items)`));
            return false;
          }
        } catch (err: any) {
          console.log(chalk.yellow(`  ⚠️ Cannot check ${linkPath}: ${err.message}`));
          return false;
        }
      }
    }
    
    try {
      const isWin = process.platform === 'win32';
      let symlinkType: 'dir' | 'file' | 'junction' = 'dir';
      
      if (isWin) {
        try {
          const targetPath = resolve(linkPath, '..', target);
          const targetStats = statSync(targetPath);
          symlinkType = targetStats.isDirectory() ? 'junction' : 'file';
        } catch {
          symlinkType = 'junction';
        }
      } else {
        try {
          const targetPath = resolve(linkPath, '..', target);
          const targetStats = statSync(targetPath);
          symlinkType = targetStats.isDirectory() ? 'dir' : 'file';
        } catch {
          symlinkType = 'dir';
        }
      }
      
      symlinkSync(target, linkPath, symlinkType);
      console.log(chalk.green(`  ✓ ${description}: ${linkPath} -> ${target}`));
      return true;
    } catch (err: any) {
      console.error(chalk.red(`  ❌ Failed to link ${linkPath}: ${err.message}`));
      if (process.platform === 'win32' && err.message.includes('privilege')) {
        console.log(chalk.yellow(`     Windows requires Developer Mode or Administrator privileges for symlinks`));
      }
      return false;
    }
  };

  setupSymlink(join(RSP_DIR, 'github'), '.github', 'Top-level .github');
  setupSymlink(join(RSP_DIR, 'claude'), '.claude', 'Top-level .claude');

  setupSymlink(join('..', 'shared', 'skills'), join(RSP_DIR, 'github', 'skills'), 'GitHub skills');
  setupSymlink(join('..', 'shared', 'hooks'), join(RSP_DIR, 'github', 'hooks'), 'GitHub hooks');
  setupSymlink(join('..', 'AGENTS.md'), join(RSP_DIR, 'github', 'copilot-instructions.md'), 'GitHub copilot-instructions');

  setupSymlink(join('..', 'shared', 'skills'), join(RSP_DIR, 'claude', 'skills'), 'Claude skills');
  setupSymlink(join('..', 'AGENTS.md'), join(RSP_DIR, 'claude', 'AGENTS.md'), 'Claude AGENTS.md');

  if (existsSync(join(SHARED_DIR, 'mcps/mcp.json'))) {
    if (!existsSync('.vscode')) {
      mkdirSync('.vscode', { recursive: true });
    }
    setupSymlink(join('..', RSP_DIR, 'shared', 'mcps', 'mcp.json'), '.vscode/mcp.json', 'VSCode mcp.json');
  }

  console.log(chalk.green('\n✅ RSP Initialization complete!'));
}
