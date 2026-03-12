export default {
    order: 2,
    name: 'rsp-directory',
    category: 'common',
    generate: (ctx) => `## Step 1: Create .rsp/ Directory Structure

Create the following directory structure in your project root:

\`\`\`
.rsp/
├── copilot-instructions.md
├── skills/
├── hooks/
├── instructions/
└── mcp/
\`\`\`

**Command (Unix/macOS/Linux/Windows Git Bash)**:
\`\`\`bash
mkdir -p .rsp/skills .rsp/hooks .rsp/instructions .rsp/mcp
\`\`\`

**Command (Windows PowerShell)**:
\`\`\`powershell
New-Item -ItemType Directory -Force -Path .rsp\\skills,.rsp\\hooks,.rsp\\instructions,.rsp\\mcp
\`\`\``
};
