import { BuiltInMcp } from '@rsp/shared';

const builtInMcps: BuiltInMcp[] = [
  {
    mcpId: 'playwright',
    categories: ['QualityAssurance'],
    configs: {
      vscode: {
        command: 'npx',
        args: ['-y', '@microsoft/mcp-server-playwright'],
      },
      claude: {
        command: 'npx',
        args: ['-y', '@microsoft/mcp-server-playwright'],
      },
      copilot: {
        command: 'npx',
        args: ['-y', '@microsoft/mcp-server-playwright'],
      },
    },
  },
  {
    mcpId: 'sqlite',
    categories: ['Backend'],
    configs: {
      vscode: {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-sqlite', '--db', 'file.db'],
      },
      claude: {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-sqlite', '--db', 'file.db'],
      },
      copilot: {
        command: 'npx',
        args: ['-y', '@modelcontextprotocol/server-sqlite', '--db', 'file.db'],
      },
    },
  },
  {
    mcpId: 'github',
    categories: ['Frontend', 'Backend', 'QualityAssurance'],
    configs: {
      vscode: {
        type: 'http',
        url: 'https://api.githubcopilot.com/mcp',
      },
    },
  },
];

export default builtInMcps;
