import { mkdirSync, existsSync, renameSync, rmSync, lstatSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import chalk from 'chalk';
import { moveAllFiles } from '../lib/migration.js';
import { isSymlinkPointingTo, setupSymlink } from '../lib/symlink.js';

const RSP_DIR = '.rsp';
const SHARED_DIR = join(RSP_DIR, 'shared');

export async function initAction() {
  console.log(chalk.blue('🚀 Initializing RSP environment...\n'));

  unstageFromGit();
  createDirectoryStructure();
  await migrateExistingData();
  moveRemainingFiles();
  establishSymlinks();

  console.log(chalk.green('\n✅ RSP Initialization complete!'));
}

function unstageFromGit() {
  const dirsToUnstage = ['.github', '.claude'].filter((dir) => {
    try {
      return existsSync(dir) && !lstatSync(dir).isSymbolicLink();
    } catch {
      return false;
    }
  });

  if (dirsToUnstage.length > 0) {
    try {
      // Pre-emptively remove these directories from the git index before they become symlinks.
      // This prevents the "fatal: pathspec is beyond a symbolic link" error if the user
      // tries to stage the old deleted files explicitly (e.g. via an IDE's "Stage All").
      execSync(`git rm -rf --cached ${dirsToUnstage.join(' ')}`, { stdio: 'ignore' });
    } catch {
      // Ignore git errors (e.g., if git is not installed or it's not a git repository)
    }
  }
}

function createDirectoryStructure() {
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
}

async function migrateExistingData() {
  console.log(chalk.blue('\n📦 Step 2: Migrating existing data...'));

  migrateSkills();
  migrateHooks();
  migrateMcpConfig();
  migrateAgentsMd();
}

function migrateSkills() {
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
    let sourceToMove: string;

    if (stats.isSymbolicLink()) {
      sourceToMove = realpathSync(from);
      console.log(chalk.blue(`  📍 Resolved symlink ${from} -> ${sourceToMove}`));
    } else if (stats.isDirectory()) {
      sourceToMove = from;
    } else {
      continue;
    }

    if (existsSync(to)) {
      rmSync(to, { recursive: true, force: true });
      console.log(chalk.dim(`  🗑️  Removed existing ${to}`));
    }

    renameSync(sourceToMove, to);
    console.log(chalk.green(`  ✓ Moved ${sourceToMove} -> ${to}`));

    if (stats.isSymbolicLink()) {
      rmSync(from, { force: true });
      console.log(chalk.dim(`  🗑️  Removed symlink ${from}`));
    }
  }
}

function migrateHooks() {
  const hooksMigrations = [
    { from: '.github/hooks', to: join(SHARED_DIR, 'hooks') },
    { from: '.claude/hooks', to: join(SHARED_DIR, 'hooks') },
  ];

  for (const { from, to } of hooksMigrations) {
    if (!existsSync(from)) continue;

    if (isSymlinkPointingTo(from, to)) {
      console.log(chalk.dim(`  ✓ ${from} already points to ${to}, skipping`));
      continue;
    }

    const stats = lstatSync(from);
    let sourceToMove: string;

    if (stats.isSymbolicLink()) {
      sourceToMove = realpathSync(from);
      console.log(chalk.blue(`  📍 Resolved symlink ${from} -> ${sourceToMove}`));
    } else if (stats.isDirectory()) {
      sourceToMove = from;
    } else {
      continue;
    }

    if (existsSync(to)) {
      rmSync(to, { recursive: true, force: true });
      console.log(chalk.dim(`  🗑️  Removed existing ${to}`));
    }

    renameSync(sourceToMove, to);
    console.log(chalk.green(`  ✓ Moved ${sourceToMove} -> ${to}`));

    if (stats.isSymbolicLink()) {
      rmSync(from, { force: true });
      console.log(chalk.dim(`  🗑️  Removed symlink ${from}`));
    }
  }
}

function migrateMcpConfig() {
  if (existsSync('.vscode/mcp.json')) {
    const mcpDest = join(SHARED_DIR, 'mcps/mcp.json');
    if (!existsSync(mcpDest)) {
      renameSync('.vscode/mcp.json', mcpDest);
      console.log(chalk.green(`  ✓ Migrated .vscode/mcp.json to ${mcpDest}`));
    } else {
      console.log(
        chalk.yellow(`  ⚠️ ${mcpDest} already exists, skipping .vscode/mcp.json migration`),
      );
    }
  }
}

function migrateAgentsMd() {
  const dest = join(RSP_DIR, 'AGENTS.md');
  const sources = ['.claude/AGENTS.md', '.github/copilot-instructions.md'];

  for (const file of sources) {
    if (existsSync(file)) {
      if (existsSync(dest)) rmSync(dest, { force: true });
      renameSync(file, dest);
      console.log(chalk.green(`  ✓ Moved ${file} -> ${dest}`));
    }
  }
}

function moveRemainingFiles() {
  console.log(chalk.blue('\n📦 Final sweep: moving remaining files...'));
  moveAllFiles('.github', join(RSP_DIR, 'github'));
  moveAllFiles('.claude', join(RSP_DIR, 'claude'));
}

function establishSymlinks() {
  console.log(chalk.blue('\n🔗 Step 3: Establishing symlinks...'));

  setupSymlink(join(RSP_DIR, 'github'), '.github', 'Top-level .github');
  setupSymlink(join(RSP_DIR, 'claude'), '.claude', 'Top-level .claude');

  setupSymlink(join('..', 'shared', 'skills'), join(RSP_DIR, 'github', 'skills'), 'GitHub skills');
  setupSymlink(join('..', 'shared', 'hooks'), join(RSP_DIR, 'github', 'hooks'), 'GitHub hooks');
  setupSymlink(
    join('..', 'AGENTS.md'),
    join(RSP_DIR, 'github', 'copilot-instructions.md'),
    'GitHub copilot-instructions',
  );

  setupSymlink(join('..', 'shared', 'skills'), join(RSP_DIR, 'claude', 'skills'), 'Claude skills');
  setupSymlink(join('..', 'AGENTS.md'), join(RSP_DIR, 'claude', 'AGENTS.md'), 'Claude AGENTS.md');

  if (existsSync(join(SHARED_DIR, 'mcps/mcp.json'))) {
    if (!existsSync('.vscode')) {
      mkdirSync('.vscode', { recursive: true });
    }
    setupSymlink(
      join('..', RSP_DIR, 'shared', 'mcps', 'mcp.json'),
      '.vscode/mcp.json',
      'VSCode mcp.json',
    );
  }
}
