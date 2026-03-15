# @rsp/cli

CLI tool for RSP (agent Skills Protocol) setup and management.

## Installation

### NPM (Requires Node.js 18+)

```bash
npm install -g @rsp/cli
```

## Usage

### Initialize RSP Environment

```bash
rsp init
```

This command will:

1. **Create `.rsp/` directory structure:**

   ```
   .rsp/
   ├── AGENTS.md
   ├── shared/
   │   ├── skills/    # Single source of truth for skills
   │   ├── hooks/
   │   ├── mcps/
   │   └── memory/
   ├── github/
   └── claude/
   ```

2. **Migrate existing data:**
   - Skills from `.github/skills/` or `.claude/skills/` → `.rsp/shared/skills/`
   - AGENTS.md from `.claude/` or `.github/copilot-instructions.md` → `.rsp/AGENTS.md`
   - MCP config from `.vscode/mcp.json` → `.rsp/shared/mcps/mcp.json`

3. **Create symlinks:**
   - `.github` → `.rsp/github`
   - `.claude` → `.rsp/claude`
   - `.vscode/mcp.json` → `../.rsp/shared/mcps/mcp.json`
   - Inner symlinks for skills, hooks, and AGENTS.md

### Install Skills

```bash
# Install specific skills by name
rsp install-skills playwright-cli vercel-react-best-practices

# Install skills by category
rsp install-skills --categories Frontend,Backend
```

### Install Hooks

```bash
# Install Copilot-specific hooks into .github/hooks/
rsp install-hooks
```

### Install MCP Servers (VSCode)

```bash
# Install all supported MCP servers for VSCode
rsp install-mcps

# Install MCP servers by category
rsp install-mcps --categories QualityAssurance
```

### Features

- ✅ **Idempotent** - Safe to run multiple times
- ✅ **Collision detection** - Never overwrites existing data
- ✅ **Symlink resolution** - Follows existing symlinks to find true source
- ✅ **Cross-platform** - Works on macOS, Linux, and Windows
- ✅ **Zero external dependencies** - Single file ES module bundle

## Development

### Build TypeScript

```bash
pnpm build
```

### Watch Mode

```bash
pnpm dev
```

## License

MIT
