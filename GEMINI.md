# RSP Setup Copilot

## Project Overview

**rsp-setup-copilot** is a pnpm monorepo designed to generate a unified `installation.md` file. This file acts as a massive prompt that developers can paste into the GitHub Copilot agent chat to automatically configure a standardized `.rsp/` directory structure across company projects, including setting up cross-platform symlinks to `.github/` for skills, hooks, and MCPs.

The monorepo contains two primary packages:
- **`@rsp/generator`** (`packages/generator/`): A modular TypeScript engine that auto-scans configuration modules and concatenates them into a single `installation.md` artifact.
- **`@rsp/web`** (`packages/web/`): A Vite + React application serving as a documentation site for users.

## Project Structure

- `packages/generator/`: The TypeScript generator module.
  - `src/generate.ts`: Main entry point for generating the markdown.
  - `src/modules/`: Contains the modular markdown segments (common headers, hooks, mcps, skills).
- `packages/web/`: The React (Vite) documentation frontend.
- `.github/workflows/`: Contains CI/CD configurations for GitHub Releases and Pages deployment.
- `.sisyphus/`: Project management records, containing execution plans, task evidence, and drafts.
- `PROJECT_COMPLETION_REPORT.md`: A detailed report outlining the successful implementation and architectural choices made during the project setup.

## Building and Running

Ensure you have [pnpm](https://pnpm.io/) installed.

### Global Commands (Root)
- **Install dependencies:** `pnpm install`
- **Build all packages:** `pnpm run build`

### Generator (`packages/generator/`)
- **Build:** `pnpm --filter @rsp/generator run build` (Note: Uses `composite: true` in `tsconfig.json`. If you need to force a clean build, delete `tsconfig.tsbuildinfo` first).
- **Run Generator:** `pnpm --filter @rsp/generator run generate` (Executes `src/generate.ts` via `tsx`). The output will be located in the `dist/` directory.

### Web Site (`packages/web/`)
- **Start Dev Server:** `pnpm --filter @rsp/web run dev`
- **Build for Production:** `pnpm --filter @rsp/web run build`
- **Preview Production Build:** `pnpm --filter @rsp/web run preview`

## Development Conventions

- **TypeScript:** The project strictly uses TypeScript across both frontend and backend tooling.
- **Monorepo Management:** Handled by `pnpm-workspace.yaml`. Ensure cross-package dependencies and script executions utilize `pnpm --filter <package_name>`.
- **Platform Agnostic:** The generator produces documentation that provides compatible symlink instructions across macOS/Linux, Windows Git Bash, and Windows PowerShell.
- **Strict Linting/Typing:** Maintain zero TypeScript errors and avoid `any` or `@ts-ignore` assertions where possible, as mandated by the project's quality standards.
