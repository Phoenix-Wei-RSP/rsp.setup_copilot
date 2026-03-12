import type { InstallModule } from '../../types.js';

export default {
  order: 50,
  name: 'symlink',
  category: 'common',
  generate: (ctx) => `## Step 2: Create Symlinks from .github/ to .rsp/

Create symlinks so that GitHub Copilot can read configurations from \`.rsp/\` via \`.github/\`.

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
