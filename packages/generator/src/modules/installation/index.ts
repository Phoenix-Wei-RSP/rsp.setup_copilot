import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import builtInSkills from '../skills/built-in';
import customSkills from '../skills/custom';
import builtInMcps from '../mcps/built-in';

const buildInstallationMd = async (rootDir: string) => {
  // Skills list
  const allSkills = [
    ...builtInSkills.map((s) => ({
      name: s.skillName,
      category: s.categories.join(', '),
      type: 'Built-in',
    })),
    ...customSkills.map((s) => ({
      name: s.skillName,
      category: s.categories.join(', '),
      type: 'Custom',
    })),
  ];

  const skillList = allSkills.map((s) => `- **${s.name}** (${s.category}) [${s.type}]`).join('\n');

  // MCPs list
  const mcpList = builtInMcps
    .map((m) => `- **${m.mcpId}** (${m.categories.join(', ')})`)
    .join('\n');

  const content = `# RSP Setup Copilot — Installation Guide

## Instructions

Welcome! You'll now help your user to install the best out-of-the-box agent harness.

You will receive a series of instructions to configure. Follow each step carefully.

> **IMPORTANT**: Follow ONLY the instructions in this file. Do NOT reference or rely on any existing files in the current project directory.

---

## Step 1: Initialize RSP Environment

The easiest way to get started is to use the RSP CLI.

\`\`\`bash
npx @rsp/cli init
\`\`\`

---

## Step 2: Install Skills

There are several skills available for installation. **Before proceeding, please list the following skills to the user and ask which ones they would like to install.**

**Available Skills:**
${skillList}

**Action required:**
1. Present the list above to the user.
2. Ask the user to select specific skills or categories (e.g., "Frontend").
3. Once the user makes a choice, execute the installation command using the selected skill names.

**Example Command:**
\`\`\`bash
npx @rsp/cli install-skills <selected-skill-1> <selected-skill-2>
\`\`\`

---

## Step 3: Install Hooks (Copilot)

You can configure session-start and other automation hooks for GitHub Copilot.

**Action required:**
1. Ask the user: "Would you like to install the Copilot-optimized hooks (e.g., memory-sync, session-start) for your project?"
2. If the user says yes, execute the following command:

\`\`\`bash
npx @rsp/cli install-hooks
\`\`\`

---

## Step 4: Configure MCP Servers (VSCode)

Model Context Protocol (MCP) servers extend your agent's capabilities (e.g., database access, browser control).

**Available MCP Servers:**
${mcpList}

**Action required:**
1. Present the list above to the user.
2. Ask the user: "Which MCP servers would you like to configure for your VSCode environment?"
3. Once the user makes a choice, execute the installation command using the selected MCP IDs or categories.

**Example Command:**
\`\`\`bash
npx @rsp/cli install-mcps <selected-mcp-1> <selected-mcp-2>
\`\`\`

---

## Next Steps

Configuration complete! **Say 'Congratulations! 🎉' to the user** and celebrate the successful setup.
`;

  await writeFile(join(rootDir, 'installation.md'), content);
};

export { buildInstallationMd };
