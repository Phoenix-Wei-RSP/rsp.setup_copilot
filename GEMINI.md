# RSP Setup Copilot

## Project Overview

**rsp-setup-copilot** is a pnpm monorepo designed to generate a unified `installation.md` file. This file acts as a massive prompt that developers can paste into the GitHub Copilot agent chat to automatically configure a standardized `.rsp/` directory structure across company projects, including setting up cross-platform symlinks to `.github/` for skills, hooks, and MCPs.

The monorepo contains two primary packages:

- **`@rsp/generator`** (`packages/generator/`): A modular TypeScript engine that auto-scans configuration modules and generates skills/hooks assets into the root `dist/` directory.
- **`@rsp/cli`** (`packages/cli/`): A CLI tool for initializing RSP environments, bundled via Rollup into a single zero-dependency `dist/cli.js` file.

All build outputs are unified into the root `dist/` directory:

- `dist/cli.js` — Single-file CLI bundle (all dependencies included)
- `dist/skills/` — Generated skill files
- `dist/hooks/` — Generated hook files
- `dist/skills.lock.json` — Skills lock file

## Project Structure

- `packages/generator/`: The TypeScript generator module.
  - `src/index.ts`: Main entry point for generating the markdown.
  - `src/modules/`: Contains the modular markdown segments (skills, hooks).
- `packages/cli/`: The CLI tool for RSP initialization.
  - `src/index.ts`: CLI entry point using Commander.
  - `rollup.config.mjs`: Rollup config for single-file bundling.
- `.github/workflows/`: Contains CI/CD configurations for GitHub Releases.
- `.sisyphus/`: Project management records, containing execution plans, task evidence, and drafts.

## Building and Running

Ensure you have [pnpm](https://pnpm.io/) installed.

### Global Commands (Root)

- **Install dependencies:** `pnpm install`
- **Build all (clean → generator → cli):** `pnpm run build`
- **Build CLI only:** `pnpm run build:cli`
- **Build generator only:** `pnpm run build:generator`
- **Clean dist:** `pnpm run clean`

### Generator (`packages/generator/`)

- **Build:** `pnpm --filter @rsp/generator run build` (fetches skills then generates assets into root `dist/`)
- **Generate only:** `pnpm --filter @rsp/generator run generate`

### CLI (`packages/cli/`)

- **Build:** `pnpm --filter @rsp/cli run build` (Rollup bundles into root `dist/cli.js`)
- **Build binary:** `pnpm --filter @rsp/cli run build:binary` (Bun compile to `dist/rsp`)

## Development Conventions

- **TypeScript:** The project strictly uses TypeScript across both packages.
- **Monorepo Management:** Handled by `pnpm-workspace.yaml`. Ensure cross-package dependencies and script executions utilize `pnpm --filter <package_name>`.
- **CLI Bundling:** Uses Rollup to produce a single-file ESM bundle with all npm dependencies (commander, chalk) inlined. Only Node.js built-ins are external.
- **Generator Output:** The generator executes its code and outputs the _results_ (not bundled source) into root `dist/`.
- **Platform Agnostic:** The CLI provides compatible symlink handling across macOS/Linux, Windows Git Bash, and Windows PowerShell.
- **Strict Linting/Typing:** Maintain zero TypeScript errors and avoid `any` or `@ts-ignore` assertions where possible.
