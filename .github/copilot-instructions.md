Welcome — RSP Yes.

**Purpose**: Provide the essential instructions an AI agent needs to be immediately productive in this repository.

**Quick Start**
- **Initialize `.rsp/`**: This project uses an `.rsp/` layout for agent artifacts. Preferred locations: `.rsp/skills/`, `.rsp/hooks/`, `.rsp/mcps/`.
- **Symlinks**: The generator and installation guide create symlinks so tools read from `.rsp/` (see `packages/generator/src/modules/common/50-symlink.ts` and [installation.md](installation.md)).

**Build / Test**
- **Build workspace**: `pnpm run build` (root runs `pnpm -r run build`).
- **Generator**: `pnpm --filter @rsp/generator run generate` or `pnpm --filter @rsp/generator run build`.

**Key Files & Conventions**
- **Main instructions**: `.github/copilot-instructions.md` (this file) — canonical agent guidance.
- **Installation & layout**: [installation.md](installation.md) — step-by-step `.rsp/` structure and symlink examples.
- **Generator templates**: [packages/generator/src/modules/common](packages/generator/src/modules/common) — templates used to scaffold `.rsp/` content.

**Agent Guidance (short)**
- Greet the user, confirm intent: respond with `RSP Yes` to indicate readiness.
- When creating or moving skills/hooks, prefer writing into `.rsp/` and preserve any existing symlinks' targets.
- If `.vscode/mcp.json` exists, merge MCP entries into `.rsp/mcps/` rather than overwriting.

**Example Prompts**
- "Bootstrap my `.rsp/` directory and create an example skill called `rsp-update`."
- "List build commands and where to run them for this repo."

**Next Customizations**
- Create an `.rsp/skills/` example (`.rsp/skills/example-skill/SKILL.md`).
- Add a hook (`.rsp/hooks/demo-format.json` + script) to demonstrate PostToolUse formatting.
- Add applyTo-scoped instructions if parts of the repo need special handling (generator, web).

If you'd like, I can create the example skill and hook now, or update an AGENTS.md variant instead.
