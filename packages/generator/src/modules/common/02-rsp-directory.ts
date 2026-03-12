import type { InstallModule } from "../../types.js";

export default {
  order: 2,
  name: "rsp-directory",
  category: "common",
  generate: (ctx) => `## Step 1: Create .rsp/ Directory Structure

Create the following directory structure in your project root:

\`\`\`
.rsp/
├── AGENTS.md
├── skills/
├── hooks/
├── instructions/
└── mcp/
\`\`\``,
} satisfies InstallModule;
