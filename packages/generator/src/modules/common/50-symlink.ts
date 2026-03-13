import type { InstallModule } from '../../types.js';

export default {
  order: 50,
  name: 'symlink',
  category: 'common',
  generate: () => `## Step 2: Migrate Existing Data

Before creating new symlinks, check if the project already has Agent configurations in other directories. **Be careful: these paths might already be symlinks pointing elsewhere!** You must find the true Single Source of Truth and migrate it to the new \`.rsp/\` structure.

1. **Check for existing skills directories (e.g., \`.github/skills/\`, \`.claude/skills/\`)**:
   - If they exist and are **real directories**, move all their contents to \`.rsp/skills/\` and remove the original directories.
   - If they exist and are **symlinks**, resolve them to find their true target directories (e.g., using \`readlink -f\` or \`ls -l\`). Move the contents of those *true target directories* to \`.rsp/skills/\`. Then, delete both the original true target directories and the old symlinks.
2. **Check \`.vscode/mcp.json\`**: If it exists, ensure its contents are preserved. (Note: MCP configurations typically stay in \`.vscode/mcp.json\`, but verify if any custom MCP server scripts need to be moved to \`.rsp/mcp/\`).

**Example Migration Logic for the Agent**:
- Always verify if a path is a directory or a symlink first.
- Move the actual source data to the \`.rsp/\` unified folder.
- Clean up any leftover legacy symlinks or empty target folders to avoid conflicts in Step 3.

## Step 3: Create Symlinks

Create symlinks so that various AI agents (like GitHub Copilot) can read configurations from the unified \`.rsp/\` directory.

### macOS / Linux

\`\`\`bash
mkdir -p .github
ln -s ../.rsp/copilot-instructions.md .github/copilot-instructions.md
ln -s ../.rsp/skills .github/skills
ln -s ../.rsp/hooks .github/hooks
ln -s ../.rsp/instructions .github/instructions
\`\`\`

### Windows (Git Bash)

\`\`\`bash
mkdir -p .github
MSYS=winsymlinks:nativestrict ln -s ../.rsp/copilot-instructions.md .github/copilot-instructions.md
MSYS=winsymlinks:nativestrict ln -s ../.rsp/skills .github/skills
MSYS=winsymlinks:nativestrict ln -s ../.rsp/hooks .github/hooks
MSYS=winsymlinks:nativestrict ln -s ../.rsp/instructions .github/instructions
\`\`\`

### Windows (PowerShell - Run as Administrator)

\`\`\`powershell
New-Item -ItemType Directory -Force -Path .github
New-Item -ItemType SymbolicLink -Path .github\\copilot-instructions.md -Target ../.rsp/copilot-instructions.md
New-Item -ItemType SymbolicLink -Path .github\\skills -Target ../.rsp/skills
New-Item -ItemType SymbolicLink -Path .github\\hooks -Target ../.rsp/hooks
New-Item -ItemType SymbolicLink -Path .github\\instructions -Target ../.rsp/instructions
\`\`\`

### Configure Git to Handle Symlinks

Add to your \`.gitattributes\` file (create if it doesn't exist):

\`\`\`
* text=auto
\`\`\``
} satisfies InstallModule;

