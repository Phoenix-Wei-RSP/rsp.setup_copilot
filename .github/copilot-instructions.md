<!-- Copilot workspace instructions: concise agent guide for this repo -->
# Repository agent instructions

Purpose
- Single-source agent guidance for contributors and AI assistants. Follow the `.rsp/` conventions when present: `.rsp/AGENTS.md` is the source of truth and may be symlinked to `.github/copilot-instructions.md`.

Quick start (developer)
- Install: `pnpm install` at repo root
- Build (all packages): `pnpm run build`
- Development:
  - CLI: `pnpm --filter packages/cli... dev` or `pnpm --filter @rsp/cli run dev`
  - Generator: `pnpm --filter packages/generator... dev` (see package.json)
  - Web: `pnpm --filter packages/web... dev`

Notes about this monorepo
- Monorepo uses `pnpm` workspaces (see `pnpm-workspace.yaml`). Use `pnpm` for installs and workspace-scoped scripts.
- Key packages: `packages/cli`, `packages/generator`, `packages/web`.
- Skills and hooks live under `packages/generator/src/modules/skills` and `packages/generator/src/modules/hooks/copilot`.
- Many skills include `SKILL.md` and `AGENTS.md` under their folders — treat those as authoritative for that skill.

Conventions and pitfalls
- Use the `.rsp/` layout if present: `.rsp/AGENTS.md` is the canonical agents file; repo `installation.md` documents symlink strategy.
- Ensure Node (recent LTS) and `pnpm` are installed; generator tooling may require `tsx` or similar runtimes.
- Choose correct hook scripts by OS (POSIX `.sh` vs `.bat`).
- Prefer edits to `.rsp/AGENTS.md` (or skill-level `AGENTS.md`) rather than scattered per-skill changes when you mean global behavior.

How to ask this agent (examples)
- "How do I run the generator locally? List the exact commands and env vars."
- "Create a short README for `packages/generator` with build and dev steps." 
- "Where are the skill markdown files that define agent behavior? List paths and recommend one for edits."

ApplyTo suggestions
- `packages/generator/**`: prefer more detailed instructions for skill authors and validation rules.
- `packages/web/**`: focus on Vite dev flow and local debugging.

If you modify these instructions
- Update `.rsp/AGENTS.md` when present and keep this file as a short, repo-root agent summary.

Contact / follow-up
- If unclear, ask: "Where should I make the change — skill-level or repo-level?" and reference the target package path.
