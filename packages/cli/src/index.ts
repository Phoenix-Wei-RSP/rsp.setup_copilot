import { Command } from 'commander';
import { initAction } from './commands/init.js';
import { installSkillsAction } from './commands/install-skills.js';

const program = new Command();

program
  .name('rsp')
  .description('CLI for RSP (agent Skills Protocol) setup and management')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize RSP environment and migrate existing configuration')
  .action(initAction);

program
  .command('install-skills [names...]')
  .description('Install skills by name or category')
  .option('-c, --categories <categories>', 'Comma-separated list of categories to install')
  .action(installSkillsAction);

program.parse();
