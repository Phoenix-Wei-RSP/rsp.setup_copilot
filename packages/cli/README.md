# @rsp/cli

CLI tool for RSP (agent Skills Protocol) setup and management.

## Installation

### Option 1: Standalone Binary (No Node.js Required) ⭐

Download pre-compiled binaries from [GitHub Releases](https://github.com/phoenix-wei-rsp/rsp.setup_copilot/releases):

**macOS:**
```bash
# Apple Silicon (M1/M2/M3)
curl -L -o rsp https://github.com/phoenix-wei-rsp/rsp.setup_copilot/releases/latest/download/rsp-macos-arm64
chmod +x rsp
sudo mv rsp /usr/local/bin/

# Intel
curl -L -o rsp https://github.com/phoenix-wei-rsp/rsp.setup_copilot/releases/latest/download/rsp-macos-x64
chmod +x rsp
sudo mv rsp /usr/local/bin/
```

**Linux:**
```bash
# x64
curl -L -o rsp https://github.com/phoenix-wei-rsp/rsp.setup_copilot/releases/latest/download/rsp-linux-x64
chmod +x rsp
sudo mv rsp /usr/local/bin/

# ARM64
curl -L -o rsp https://github.com/phoenix-wei-rsp/rsp.setup_copilot/releases/latest/download/rsp-linux-arm64
chmod +x rsp
sudo mv rsp /usr/local/bin/
```

**Windows:**
```powershell
# Download from browser or use curl
curl -L -o rsp.exe https://github.com/phoenix-wei-rsp/rsp.setup_copilot/releases/latest/download/rsp-windows-x64.exe
# Move to a directory in your PATH
```

### Option 2: NPM (Requires Node.js 18+)

```bash
npm install -g @rsp/cli
```

### Option 3: Build from Source (Requires Bun)

```bash
git clone https://github.com/phoenix-wei-rsp/rsp.setup_copilot.git
cd rsp.setup_copilot/packages/cli
bun install
bun run build:binary
# Binary will be in dist/rsp
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

### Features

- ✅ **Idempotent** - Safe to run multiple times
- ✅ **Collision detection** - Never overwrites existing data
- ✅ **Symlink resolution** - Follows existing symlinks to find true source
- ✅ **Cross-platform** - Works on macOS, Linux, and Windows
- ✅ **Zero dependencies** - Standalone binaries require no runtime

## Development

### Build TypeScript

```bash
pnpm build
```

### Build Single Binary

```bash
# Current platform only
bun run build:binary

# All platforms
bun run build:binary:all
```

### Watch Mode

```bash
pnpm dev
```

## Binary Compilation Details

Binaries are compiled using [Bun](https://bun.sh/) with `bun build --compile`:

- **Size:** ~58MB (includes Bun runtime + dependencies)
- **Platforms:** macOS (arm64/x64), Linux (x64/arm64), Windows (x64)
- **No runtime required:** Completely standalone executables

## License

MIT
