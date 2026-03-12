# RSP Setup Copilot — 统一 AI 配置生成器

## TL;DR

> **快速概述**: 构建一个 pnpm monorepo 项目，通过模块化 TypeScript 生成器自动拼接出 `installation.md`（一个巨型 prompt），开发者粘贴到 Copilot agent 聊天后，agent 自动在其项目中配置统一的 `.rsp/` 目录（skills/hooks/MCP），并通过 symlink 映射到 `.github/`。项目同时包含一个 Vite + React 文档站部署到 GitHub Pages。
>
> **产出物**:
> - Monorepo 项目骨架（generator + web 两个 package）
> - 模块化 installation.md 生成器（TypeScript）
> - 3 个 demo 模块（1 skill + 1 hook + 1 MCP）
> - Vite + React 文档站框架
> - GitHub Actions CI/CD（构建 + Release + Pages 部署）
> - `rsp_update` 升级 skill 框架
>
> **预估工作量**: Medium
> **并行执行**: YES — 3 waves
> **关键路径**: Task 1 → Task 3 → Task 5 → Task 8 → Task 10 → F1-F4

---

## Context

### Original Request
作为架构师，需要给公司全部项目一个统一的 prompt，让每个开发者在 agent 聊天中输入后，agent 自动构建出统一的、符合最佳实践的、开箱即用的配置（skills/hooks/MCP 等）。基于 Node.js + TypeScript，集成 GitHub Actions，支持模块化扩展和版本升级。

### Interview Summary
**关键决策**:
- **包管理器**: pnpm workspaces
- **Web UI 部署**: GitHub Pages
- **`.rsp` 命名**: 自定义命名（非官方约定），作为 single source of truth
- **Demo 范围**: 最小 demo（1 skill + 1 hook + 1 MCP 模板）
- **Prompt 分发**: GitHub Release 中的 installation.md，开发者复制粘贴

**研究发现**:
- Copilot skills 使用 `SKILL.md`（Markdown + YAML frontmatter）格式
- Copilot hooks 使用 `.github/hooks/*.json`（8 种事件类型：SessionStart, PreToolUse 等）
- MCP 配置位置因工具而异: VS Code 用 `.vscode/mcp.json`
- Symlink 架构需跨平台支持（Windows: `MSYS=winsymlinks:nativestrict`）

### Metis Review
**Identified Gaps** (addressed):
- **mcp.json 位置歧义**: 默认使用 `.vscode/mcp.json`（VS Code 标准位置），在 prompt 中明确指出
- **Hook I/O 合约**: Demo hook 必须展示 JSON stdin/stdout 模式，不是简单 echo
- **Symlink 跨平台**: prompt 中必须包含 Windows/macOS/Linux 三套指令
- **.rsp 与 .github 的关系说明**: installation.md 需清晰解释为什么用 symlink 而不是直接写入 .github

---

## Work Objectives

### Core Objective
构建一个完整的 monorepo 框架项目，能够通过 `pnpm run generate` 输出 `installation.md`，并通过 GitHub Actions 自动发布。同时提供一个可访问的 Web UI 文档站。

### Concrete Deliverables
- `packages/generator/` — TypeScript 模块化 prompt 生成器
- `packages/web/` — Vite + React 文档站
- `.github/workflows/release.yml` — CI/CD 流水线
- `.github/workflows/pages.yml` — GitHub Pages 部署
- 3 个 demo 模块文件（skill / hook / mcp）
- `rsp_update` skill 框架

### Definition of Done
- [ ] `pnpm install` 成功
- [ ] `pnpm run build` 所有 package 构建成功
- [ ] `pnpm --filter generator run generate` 产出 `dist/installation.md` 和 `dist/README.md`
- [ ] `pnpm --filter web run dev` 启动本地开发服务器
- [ ] GitHub Actions workflow 语法正确（可通过 `actionlint` 验证）

### Must Have
- 模块化目录结构：`src/modules/{skills,hooks,mcps,common}/` 下按编号排序的 TS 文件
- 每个模块 TS 文件导出一个函数返回 markdown 字符串
- main index 自动扫描并拼接所有模块
- installation.md 包含：创建 `.rsp/` 目录、写入 skill/hook/mcp 文件、建立 symlink、跨平台指令
- Web UI 包含安装内容清单和使用说明的页面框架
- `rsp_update` skill 的 SKILL.md 框架（内容是 TODO placeholder）

### Must NOT Have (Guardrails)
- **不要实现真正的 skill 逻辑** — demo skill 只有 SKILL.md 框架 + TODO placeholder
- **不要实现真正的 hook 逻辑** — demo hook 只有 JSON 配置框架 + 示例脚本壳
- **不要实现真正的 MCP 服务器** — demo MCP 只有配置模板
- **不要填充 Web UI 完整内容** — 只有页面框架和路由，内容是 placeholder
- **不要处理 rsp_update 的升级逻辑细节** — 只有 SKILL.md 框架
- **不要写单元测试** — 框架级 demo 不需要
- **不要过度抽象** — 简单直接的代码，不需要 DI、plugin system 等
- **不要添加 linter/prettier 配置** — 保持最小化

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: NO（新建项目）
- **Automated tests**: NONE（框架级 demo，用户明确不需要）
- **Framework**: N/A

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Generator**: Use Bash — 运行 `pnpm --filter generator run generate`，验证输出文件存在且内容正确
- **Web UI**: Use Playwright — 启动 dev server，访问页面，验证渲染
- **GitHub Actions**: Use Bash — `actionlint` 验证 workflow 语法

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — 基础骨架):
├── Task 1: Monorepo 根配置（pnpm workspace + root package.json + tsconfig）[quick]
├── Task 2: Generator package 骨架 [quick]
├── Task 3: 模块化生成器核心引擎 [unspecified-high]
└── Task 4: Web UI package 骨架（Vite + React）[quick]

Wave 2 (After Wave 1 — 内容模块 + CI):
├── Task 5: Common 模块（header/footer/symlink 指令）[unspecified-high]
├── Task 6: Demo skill 模块 + rsp_update skill 模块 [unspecified-high]
├── Task 7: Demo hook 模块 + Demo MCP 模块 [unspecified-high]
├── Task 8: GitHub Actions — Release workflow [quick]
└── Task 9: GitHub Actions — Pages 部署 workflow [quick]

Wave 3 (After Wave 2 — 集成 + 完善):
├── Task 10: 端到端集成 — 生成完整 installation.md [deep]
└── Task 11: Web UI 页面内容框架 [visual-engineering]

Wave FINAL (After ALL tasks — 验证):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real QA — 生成器输出验证 (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 1 → Task 3 → Task 5 → Task 10 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 5 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 2, 3, 4 | 1 |
| 2 | 1 | 3, 5, 6, 7 | 1 |
| 3 | 1, 2 | 5, 6, 7, 10 | 1 |
| 4 | 1 | 9, 11 | 1 |
| 5 | 3 | 10 | 2 |
| 6 | 3 | 10 | 2 |
| 7 | 3 | 10 | 2 |
| 8 | 1 | — | 2 |
| 9 | 4 | — | 2 |
| 10 | 5, 6, 7 | F1-F4 | 3 |
| 11 | 4 | F1-F4 | 3 |

### Agent Dispatch Summary

- **Wave 1**: **4 tasks** — T1 → `quick`, T2 → `quick`, T3 → `unspecified-high`, T4 → `quick`
- **Wave 2**: **5 tasks** — T5 → `unspecified-high`, T6 → `unspecified-high`, T7 → `unspecified-high`, T8 → `quick`, T9 → `quick`
- **Wave 3**: **2 tasks** — T10 → `deep`, T11 → `visual-engineering`
- **FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

> Implementation tasks below. EVERY task has: Agent Profile + Parallelization + QA Scenarios.

- [x] 1. Monorepo 根配置 — pnpm workspace + root package.json + tsconfig

  **What to do**:
  - 重写根目录 `package.json`：设置 `"private": true`, `"type": "module"`, pnpm workspace scripts
  - 创建 `pnpm-workspace.yaml`：`packages: ['packages/*']`
  - 创建根 `tsconfig.json`：base config (`target: ES2022`, `module: ESNext`, `moduleResolution: Bundler`, `strict: true`)
  - 创建 `.npmrc`：`shamefully-hoist=true`（如需要）
  - 保留 `symlink-manager/` 目录不动（已有的参考资料）
  - 运行 `pnpm install` 验证配置正确

  **Must NOT do**:
  - 不要安装任何 linter/prettier
  - 不要修改或删除 `symlink-manager/` 目录
  - 不要添加 husky 或 lint-staged

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 简单的配置文件创建，无复杂逻辑
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `git-master`: 不涉及 git 操作

  **Parallelization**:
  - **Can Run In Parallel**: NO（Wave 1 起点，但其他 Wave 1 任务依赖它）
  - **Parallel Group**: Wave 1 (先完成，解锁 T2, T3, T4)
  - **Blocks**: Tasks 2, 3, 4
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `package.json` — 现有的 root package.json，需要被重写
  - `symlink-manager/SKILL.md` — 参考已有项目结构约定

  **External References**:
  - pnpm workspace 配置: https://pnpm.io/workspaces
  - TypeScript base config 最佳实践: `target: ES2022, module: ESNext, moduleResolution: Bundler`

  **WHY Each Reference Matters**:
  - `package.json` 是需要被重写的文件，必须保留已有 name
  - `symlink-manager/` 不能被删除，它是已有的参考技能

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: pnpm install 成功
    Tool: Bash
    Preconditions: 项目根目录存在 package.json 和 pnpm-workspace.yaml
    Steps:
      1. 运行 `pnpm install`
      2. 检查退出码为 0
      3. 检查 `node_modules/` 目录已创建
    Expected Result: 安装成功，无 error 输出
    Failure Indicators: 非零退出码，或 "ERR_PNPM" 错误
    Evidence: .sisyphus/evidence/task-1-pnpm-install.txt

  Scenario: pnpm-workspace.yaml 正确配置
    Tool: Bash
    Preconditions: pnpm-workspace.yaml 存在
    Steps:
      1. 读取 `pnpm-workspace.yaml`
      2. 验证包含 `packages: ['packages/*']`
    Expected Result: 文件内容包含 workspace 配置
    Failure Indicators: 文件不存在或格式错误
    Evidence: .sisyphus/evidence/task-1-workspace-config.txt

  Scenario: symlink-manager 目录未被修改
    Tool: Bash
    Preconditions: symlink-manager/ 目录原始存在
    Steps:
      1. 运行 `ls symlink-manager/`
      2. 验证 `SKILL.md` 和 `references/` 仍然存在
    Expected Result: 目录结构与原始一致
    Failure Indicators: 文件缺失或内容被修改
    Evidence: .sisyphus/evidence/task-1-symlink-preserved.txt
  ```

  **Commit**: YES (group with T1)
  - Message: `chore: initialize pnpm monorepo with TypeScript`
  - Files: `package.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `.npmrc`
  - Pre-commit: `pnpm install`

- [x] 2. Generator package 骨架

  **What to do**:
  - 创建 `packages/generator/package.json`：name `@rsp/generator`, type `module`, scripts (`build`, `generate`)
  - 创建 `packages/generator/tsconfig.json`：extends root, `outDir: ./dist`, `rootDir: ./src`
  - 创建 `packages/generator/src/index.ts`：空的入口文件（导出 main generate 函数签名）
  - 创建目录结构骨架:
    ```
    packages/generator/
    ├── src/
    │   ├── index.ts            # 主入口
    │   ├── types.ts            # 模块接口定义
    │   └── modules/
    │       ├── common/         # 公共模块（header, footer, symlink）
    │       ├── skills/         # skill 安装模块
    │       ├── hooks/          # hook 安装模块
    │       └── mcps/           # MCP 安装模块
    ├── package.json
    └── tsconfig.json
    ```
  - 在 `types.ts` 中定义核心接口:
    ```typescript
    export interface InstallModule {
      /** 模块序号，用于排序 */
      order: number;
      /** 模块名称 */
      name: string;
      /** 模块分类 */
      category: 'common' | 'skills' | 'hooks' | 'mcps';
      /** 生成 markdown 内容的函数 */
      generate: (context: GenerateContext) => string;
    }
    
    export interface GenerateContext {
      /** 当前版本号 */
      version: string;
      /** GitHub 仓库 URL */
      repoUrl: string;
      /** Web UI 页面 URL */
      webUrl: string;
    }
    ```

  **Must NOT do**:
  - 不要实现 generate 逻辑（Task 3 负责）
  - 不要安装额外依赖（只用 Node.js 内置 + TypeScript）
  - 不要过度抽象接口

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 目录结构创建 + 简单 TS 接口定义
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES（与 T4 并行，但在 T1 之后）
  - **Parallel Group**: Wave 1 (with Task 4, after Task 1)
  - **Blocks**: Tasks 3, 5, 6, 7
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - 无（新建项目）

  **External References**:
  - TypeScript project config: `composite: true` for monorepo references

  **WHY Each Reference Matters**:
  - TypeScript composite 确保 monorepo 内跨包引用正确工作

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Generator package 目录结构完整
    Tool: Bash
    Preconditions: Task 1 完成
    Steps:
      1. 运行 `ls -R packages/generator/src/`
      2. 验证 `index.ts`, `types.ts` 存在
      3. 验证 `modules/common/`, `modules/skills/`, `modules/hooks/`, `modules/mcps/` 目录存在
    Expected Result: 所有目录和文件都存在
    Failure Indicators: 任何路径缺失
    Evidence: .sisyphus/evidence/task-2-dir-structure.txt

  Scenario: TypeScript 编译无错误
    Tool: Bash
    Preconditions: tsconfig.json 正确配置
    Steps:
      1. 运行 `pnpm --filter @rsp/generator exec tsc --noEmit`
      2. 检查退出码为 0
    Expected Result: 零 TypeScript 错误
    Failure Indicators: 非零退出码或 TS error 输出
    Evidence: .sisyphus/evidence/task-2-tsc-check.txt
  ```

  **Commit**: YES (group with T3)
  - Message: `feat(generator): add modular installation.md generator engine`
  - Files: `packages/generator/**`
  - Pre-commit: `pnpm --filter @rsp/generator exec tsc --noEmit`

- [x] 3. 模块化生成器核心引擎 — 自动扫描模块、排序、拼接输出

  **What to do**:
  - 实现 `packages/generator/src/index.ts` 中的核心 `generate()` 函数:
    1. 使用 `fs.readdirSync` + `path.join` 扫描 `src/modules/{common,skills,hooks,mcps}/` 下所有 `.ts` 文件
    2. 根据文件名前缀数字排序（如 `01-header.ts` < `02-symlink.ts`）
    3. 动态 `import()` 每个模块文件，调用其导出的 `generate(context)` 函数
    4. 按顺序拼接所有模块输出的 markdown 字符串，模块之间用 `\n\n---\n\n` 分隔
    5. 将拼接结果写入 `dist/installation.md`
    6. 生成简单的 `dist/README.md`（内容: 版本链接指引）
  - 创建 `packages/generator/src/generate.ts` 作为 CLI 入口（被 `package.json` 的 `generate` script 调用）:
    ```typescript
    // 读取 package.json 获取 version
    // 构造 GenerateContext { version, repoUrl, webUrl }
    // 调用 generate(context)
    // 写入 dist/
    ```
  - 每个模块 TS 文件的导出约定:
    ```typescript
    import type { InstallModule } from '../../types.js';
    export default {
      order: 1,
      name: 'header',
      category: 'common',
      generate: (ctx) => `# RSP Setup v${ctx.version}\n...`
    } satisfies InstallModule;
    ```
  - `package.json` scripts:
    - `"build": "tsc"`
    - `"generate": "node --import tsx src/generate.ts"`（使用 tsx 运行 TS）
  - 安装 `tsx` 作为 devDependency（用于直接运行 TypeScript）

  **Must NOT do**:
  - 不要实现复杂的 plugin system 或 DI 容器
  - 不要添加 CLI 参数解析（hardcode 配置即可）
  - 不要写任何实际的模块内容（Task 5-7 负责）

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 核心引擎逻辑，涉及文件扫描、动态导入、排序拼接，需要一定的工程判断
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `playwright`: 不涉及浏览器操作

  **Parallelization**:
  - **Can Run In Parallel**: YES（与 T4 并行，在 T1+T2 之后）
  - **Parallel Group**: Wave 1 (with Task 4, after Tasks 1+2)
  - **Blocks**: Tasks 5, 6, 7, 10
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `packages/generator/src/types.ts` (Task 2 产出) — `InstallModule` 和 `GenerateContext` 接口定义，generate 函数必须使用这些类型
  - `packages/generator/src/index.ts` (Task 2 产出) — 空入口文件，在此实现 generate 逻辑

  **External References**:
  - Node.js `fs.readdirSync` + `path.join`: 文件扫描标准 API
  - `tsx` package: https://tsx.is/ — 用于直接运行 TypeScript 文件（替代 ts-node）
  - 动态 import 语法: `const mod = await import(filePath)` — ESM 动态导入

  **WHY Each Reference Matters**:
  - `types.ts` 定义了模块必须遵循的接口契约，generate 引擎依赖此接口做类型检查
  - `index.ts` 是需要填充实现的空壳文件
  - `tsx` 让 generate script 可以直接运行 TS 而无需先编译

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: 生成引擎能扫描并排序模块
    Tool: Bash
    Preconditions: Task 2 完成，至少有一个占位模块文件存在（即使是空的默认导出）
    Steps:
      1. 在 `packages/generator/src/modules/common/` 下创建临时测试文件 `01-test.ts`，导出 `{ order: 1, name: 'test', category: 'common', generate: () => '# TEST HEADER' }`
      2. 运行 `pnpm --filter @rsp/generator run generate`
      3. 读取 `packages/generator/dist/installation.md`
      4. 验证内容包含 `# TEST HEADER`
      5. 删除临时测试文件
    Expected Result: installation.md 包含测试模块输出的内容
    Failure Indicators: 文件不存在、内容为空、或不包含 `# TEST HEADER`
    Evidence: .sisyphus/evidence/task-3-module-scan.txt

  Scenario: README.md 生成成功
    Tool: Bash
    Preconditions: generate 命令可运行
    Steps:
      1. 运行 `pnpm --filter @rsp/generator run generate`
      2. 读取 `packages/generator/dist/README.md`
      3. 验证包含版本号引用或链接格式
    Expected Result: README.md 存在且包含版本信息
    Failure Indicators: 文件不存在或内容为空
    Evidence: .sisyphus/evidence/task-3-readme-output.txt

  Scenario: 多模块按序号排序拼接
    Tool: Bash
    Preconditions: 存在多个编号不同的模块文件
    Steps:
      1. 创建 `02-second.ts`（output: `## SECOND`）和 `01-first.ts`（output: `## FIRST`）
      2. 运行 generate
      3. 验证 installation.md 中 `## FIRST` 出现在 `## SECOND` 之前
    Expected Result: 按文件名数字前缀排序
    Failure Indicators: 顺序颠倒
    Evidence: .sisyphus/evidence/task-3-module-order.txt
  ```

  **Commit**: YES (group with T2)
  - Message: `feat(generator): add modular installation.md generator engine`
  - Files: `packages/generator/src/index.ts`, `packages/generator/src/generate.ts`, `packages/generator/package.json`
  - Pre-commit: `pnpm --filter @rsp/generator run generate`

- [x] 4. Web UI package 骨架 — Vite + React scaffold

  **What to do**:
  - 创建 `packages/web/` 目录，使用 Vite + React + TypeScript 标准结构:
    ```
    packages/web/
    ├── index.html
    ├── package.json          # name: @rsp/web, scripts: dev/build/preview
    ├── tsconfig.json          # extends root
    ├── tsconfig.node.json     # Vite node config
    ├── vite.config.ts         # base: '/rsp.setup_copilot/' (GitHub Pages path)
    └── src/
        ├── main.tsx
        ├── App.tsx            # 简单路由框架 + placeholder 页面
        ├── App.css
        └── pages/
            ├── Home.tsx       # 首页 placeholder
            └── Guide.tsx      # 安装指南 placeholder
    ```
  - `package.json` 配置:
    - `name: "@rsp/web"`
    - `scripts: { "dev": "vite", "build": "tsc -b && vite build", "preview": "vite preview" }`
    - dependencies: `react`, `react-dom`
    - devDependencies: `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `vite`, `typescript`
  - `vite.config.ts`:
    - `base: '/rsp.setup_copilot/'`（GitHub Pages 子路径）
    - `plugins: [react()]`
  - 安装 `react-router-dom` 用于基础路由（Home + Guide 两个页面）
  - `App.tsx` 中设置简单的 `BrowserRouter` + `Routes`:
    - `/` → `Home.tsx`（欢迎页 placeholder）
    - `/guide` → `Guide.tsx`（安装指南 placeholder）
  - 页面内容都是 placeholder（标题 + "TODO: 内容待填充"）

  **Must NOT do**:
  - 不要添加 UI 组件库（no MUI, no Ant Design, no Tailwind）
  - 不要填充真实内容
  - 不要添加复杂状态管理
  - 不要设置 SSR

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准 Vite + React 脚手架，无自定义逻辑
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: 只是骨架 scaffold，不需要设计
    - `playwright`: 不需要浏览器测试

  **Parallelization**:
  - **Can Run In Parallel**: YES（与 T2, T3 并行，在 T1 之后）
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, after Task 1)
  - **Blocks**: Tasks 9, 11
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - 无（新建 package）

  **External References**:
  - Vite React 模板: `pnpm create vite web -- --template react-ts`
  - react-router-dom v6: `<BrowserRouter>`, `<Routes>`, `<Route>` 基础用法
  - GitHub Pages base path: Vite `base` 配置需匹配仓库名

  **WHY Each Reference Matters**:
  - Vite 模板确保标准结构和正确的 TypeScript 配置
  - `base` 配置错误会导致 GitHub Pages 上资源路径 404
  - react-router-dom 提供最简单的客户端路由

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Vite dev server 启动成功
    Tool: Bash
    Preconditions: Task 1 完成，packages/web/ 已创建
    Steps:
      1. 运行 `pnpm --filter @rsp/web run dev` (后台运行)
      2. 等待 3 秒
      3. 运行 `curl -s http://localhost:5173/rsp.setup_copilot/ | head -20`
      4. 验证返回 HTML 内容（包含 `<div id="root">`）
      5. 终止 dev server 进程
    Expected Result: 页面返回包含 root div 的 HTML
    Failure Indicators: 连接失败、404、或 HTML 不含 root
    Evidence: .sisyphus/evidence/task-4-dev-server.txt

  Scenario: TypeScript 编译无错误
    Tool: Bash
    Preconditions: tsconfig.json 正确配置
    Steps:
      1. 运行 `pnpm --filter @rsp/web exec tsc --noEmit`
      2. 检查退出码为 0
    Expected Result: 零 TypeScript 错误
    Failure Indicators: 非零退出码或 TS error 输出
    Evidence: .sisyphus/evidence/task-4-tsc-check.txt

  Scenario: Vite build 成功
    Tool: Bash
    Preconditions: 所有依赖已安装
    Steps:
      1. 运行 `pnpm --filter @rsp/web run build`
      2. 检查退出码为 0
      3. 验证 `packages/web/dist/index.html` 存在
    Expected Result: 构建成功，dist 目录包含 index.html
    Failure Indicators: 构建失败或 dist 为空
    Evidence: .sisyphus/evidence/task-4-vite-build.txt
  ```

  **Commit**: YES
  - Message: `feat(web): scaffold Vite + React documentation site`
  - Files: `packages/web/**`
  - Pre-commit: `pnpm --filter @rsp/web exec tsc --noEmit`

- [x] 5. Common 模块 — header / footer / symlink 跨平台指令

  **What to do**:
  - 创建 `packages/generator/src/modules/common/01-header.ts`:
    - 输出 installation.md 的顶部 prompt header
    - 包含: 版本号、生成日期、项目说明、使用说明（"将以下内容粘贴到 Copilot agent 聊天中"）
    - 指令开头明确告诉 agent: "你将收到一系列指令来配置 .rsp/ 目录并创建 symlink 到 .github/"
  - 创建 `packages/generator/src/modules/common/02-rsp-directory.ts`:
    - 输出创建 `.rsp/` 目录结构的指令:
      ```
      .rsp/
      ├── copilot-instructions.md
      ├── skills/
      ├── hooks/
      ├── instructions/
      └── mcp/
      ```
    - 包含 `mkdir -p` 命令模板
  - 创建 `packages/generator/src/modules/common/50-symlink.ts`:
    - 输出创建 symlink 的跨平台指令（3 套: macOS/Linux, Windows Git Bash, Windows PowerShell）
    - macOS/Linux: `ln -s ../.rsp/skills .github/skills`
    - Windows Git Bash: `MSYS=winsymlinks:nativestrict ln -s ../.rsp/skills .github/skills`
    - Windows PowerShell: `New-Item -ItemType SymbolicLink -Path .github\skills -Target ..\.rsp\skills`
    - 指令: 创建 `.github/` 到 `.rsp/` 的 symlink:
      - `.github/copilot-instructions.md` → `../.rsp/copilot-instructions.md`
      - `.github/skills` → `../.rsp/skills`
      - `.github/hooks` → `../.rsp/hooks`
      - `.github/instructions` → `../.rsp/instructions`
    - 包含 `.gitattributes` 中添加 `* text=auto` 的提示
  - 创建 `packages/generator/src/modules/common/90-web-guide.ts`:
    - 输出引导用户访问 Web UI 的尾部段落
    - 内容: "配置完成！访问 {webUrl} 查看完整使用文档"
  - 创建 `packages/generator/src/modules/common/99-footer.ts`:
    - 输出 installation.md 的结尾标记
    - 包含: 版本号、仓库链接、"此文件由 rsp-setup-copilot 自动生成"

  **Must NOT do**:
  - 不要实现真正的 symlink 执行逻辑（只是生成包含指令文本的 markdown）
  - 不要添加交互式选择（三个平台的指令都输出，由 agent 判断使用哪个）
  - 不要在 markdown 中添加过多解释性文本

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 涉及跨平台 symlink 知识和 prompt 工程，需要准确的命令格式
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `git-master`: 不涉及 git 操作

  **Parallelization**:
  - **Can Run In Parallel**: YES（与 T6, T7, T8, T9 并行）
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8, 9)
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `packages/generator/src/types.ts` — `InstallModule` 接口，每个模块文件必须默认导出符合此接口的对象
  - `symlink-manager/SKILL.md` — `.rsp/` 目录结构约定和 symlink 架构参考
  - `symlink-manager/references/windows.md` — Windows symlink 具体语法（MSYS 环境变量等）
  - `symlink-manager/references/git-symlinks.md` — Git 如何存储 symlink（mode 120000）

  **External References**:
  - Windows symlink: `MSYS=winsymlinks:nativestrict` 环境变量
  - PowerShell symlink: `New-Item -ItemType SymbolicLink`
  - `.gitattributes`: symlink 在跨平台 git 中的处理

  **WHY Each Reference Matters**:
  - `types.ts` 确保模块导出符合引擎期望的接口格式
  - `symlink-manager/` 包含经过验证的 symlink 指令模板，不需要重新发明
  - Windows symlink 语法容易出错，必须参考已有的正确指令

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Common 模块全部存在且可被引擎加载
    Tool: Bash
    Preconditions: Task 3 完成（生成引擎可用）
    Steps:
      1. 运行 `ls packages/generator/src/modules/common/`
      2. 验证存在: 01-header.ts, 02-rsp-directory.ts, 50-symlink.ts, 90-web-guide.ts, 99-footer.ts
      3. 运行 `pnpm --filter @rsp/generator run generate`
      4. 读取 `packages/generator/dist/installation.md`
      5. 验证包含 "rsp" 关键词（header）
      6. 验证包含 "mkdir" 或目录创建指令
      7. 验证包含 "ln -s" 或 "symlink" 关键词
      8. 验证包含 webUrl 占位或文档链接
    Expected Result: 所有 common 模块输出均出现在 installation.md 中
    Failure Indicators: 模块文件缺失或输出内容缺少关键段落
    Evidence: .sisyphus/evidence/task-5-common-modules.txt

  Scenario: Symlink 指令包含三个平台
    Tool: Bash
    Preconditions: installation.md 已生成
    Steps:
      1. 读取 `packages/generator/dist/installation.md`
      2. 搜索 "ln -s"（macOS/Linux）
      3. 搜索 "MSYS=winsymlinks" 或 "winsymlinks"（Windows Git Bash）
      4. 搜索 "New-Item" 或 "SymbolicLink"（Windows PowerShell）
    Expected Result: 三种平台的 symlink 指令都存在
    Failure Indicators: 任何平台的指令缺失
    Evidence: .sisyphus/evidence/task-5-cross-platform.txt
  ```

  **Commit**: YES (group with T6+T7)
  - Message: `feat(generator): add demo skill, hook, MCP, and common modules`
  - Files: `packages/generator/src/modules/common/**`
  - Pre-commit: `pnpm --filter @rsp/generator run generate`

- [x] 6. Demo skill 模块 + rsp_update skill 模块

  **What to do**:
  - 创建 `packages/generator/src/modules/skills/01-demo-skill.ts`:
    - 输出在 `.rsp/skills/example-skill/` 下创建 `SKILL.md` 的指令
    - SKILL.md 内容使用 YAML frontmatter 格式:
      ```yaml
      ---
      name: example-skill
      description: "A demo skill showing the RSP skill template structure"
      user-invocable: true
      ---
      # Example Skill
      
      TODO: Implement skill logic here.
      
      This is a placeholder demonstrating the RSP skill directory structure.
      ```
    - prompt 中的指令格式: "创建文件 `.rsp/skills/example-skill/SKILL.md`，内容如下: ..."
  - 创建 `packages/generator/src/modules/skills/02-rsp-update.ts`:
    - 输出在 `.rsp/skills/rsp-update/` 下创建 `SKILL.md` 的指令
    - SKILL.md 内容:
      ```yaml
      ---
      name: rsp-update
      description: "Update RSP configuration to the latest version"
      user-invocable: true
      ---
      # RSP Update Skill
      
      TODO: Implement update logic.
      
      This skill will check for newer versions of rsp-setup-copilot
      and apply configuration updates.
      
      ## Planned Behavior
      1. Fetch latest installation.md from GitHub Releases
      2. Compare with current installed version
      3. Apply changes
      ```

  **Must NOT do**:
  - 不要实现 skill 的实际功能逻辑
  - 不要添加 argument-hint 或复杂的 frontmatter 字段（保持最简）
  - 不要创建辅助脚本文件

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 需要正确理解 SKILL.md 格式和 prompt 工程
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES（与 T5, T7, T8, T9 并行）
  - **Parallel Group**: Wave 2 (with Tasks 5, 7, 8, 9)
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `packages/generator/src/types.ts` — `InstallModule` 接口
  - `symlink-manager/SKILL.md` — 真实的 SKILL.md 文件示例，展示 YAML frontmatter 格式和内容结构

  **External References**:
  - GitHub Copilot Skills 文档: https://code.visualstudio.com/docs/copilot/customization/agent-skills
  - SKILL.md 格式: YAML frontmatter（name, description, user-invocable）+ Markdown body

  **WHY Each Reference Matters**:
  - `symlink-manager/SKILL.md` 是项目中已有的真实 SKILL.md，是格式的最佳参考
  - Copilot Skills 文档确保 frontmatter 字段名正确

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Skill 模块输出包含正确的 SKILL.md 结构
    Tool: Bash
    Preconditions: Task 3 完成
    Steps:
      1. 运行 `pnpm --filter @rsp/generator run generate`
      2. 读取 `packages/generator/dist/installation.md`
      3. 搜索 "example-skill" — 验证 demo skill 段落存在
      4. 搜索 "rsp-update" — 验证 update skill 段落存在
      5. 搜索 "SKILL.md" — 验证文件创建指令存在
      6. 搜索 "---" (YAML frontmatter 分隔符) — 验证 frontmatter 格式
    Expected Result: 两个 skill 的安装指令都出现在 installation.md 中，包含正确的 YAML frontmatter
    Failure Indicators: skill 名称缺失、frontmatter 格式不正确
    Evidence: .sisyphus/evidence/task-6-skill-modules.txt

  Scenario: rsp-update skill 包含升级计划说明
    Tool: Bash
    Preconditions: installation.md 已生成
    Steps:
      1. 读取 `packages/generator/dist/installation.md`
      2. 搜索 "rsp-update" 段落
      3. 验证包含 "update" 或 "upgrade" 或 "版本" 相关文本
      4. 验证包含 TODO placeholder
    Expected Result: rsp-update skill 有清晰的占位说明
    Failure Indicators: 内容过于简陋或缺少升级计划描述
    Evidence: .sisyphus/evidence/task-6-rsp-update.txt
  ```

  **Commit**: YES (group with T5+T7)
  - Message: `feat(generator): add demo skill, hook, MCP, and common modules`
  - Files: `packages/generator/src/modules/skills/**`
  - Pre-commit: `pnpm --filter @rsp/generator run generate`

- [x] 7. Demo hook 模块 + Demo MCP 模块

  **What to do**:
  - 创建 `packages/generator/src/modules/hooks/01-demo-hook.ts`:
    - 输出在 `.rsp/hooks/` 下创建 `demo-format.json` 和 `demo-format.sh` 的指令
    - `demo-format.json` 内容（hook 配置）:
      ```json
      {
        "name": "demo-format",
        "description": "Demo hook that shows the hook event structure",
        "event": "PostToolUse",
        "script": "hooks/demo-format.sh",
        "timeout": 10000
      }
      ```
    - `demo-format.sh` 内容（shell 脚本框架，展示 JSON stdin/stdout 模式）:
      ```bash
      #!/bin/bash
      # RSP Demo Hook — PostToolUse event handler
      # Reads JSON from stdin, processes it, writes JSON to stdout
      
      # Read the event payload from stdin
      INPUT=$(cat)
      
      # TODO: Parse and process the event
      # Example: echo "$INPUT" | jq '.toolName'
      
      # Return response (must be valid JSON)
      echo '{"proceed": true}'
      ```
  - 创建 `packages/generator/src/modules/mcps/01-demo-mcp.ts`:
    - 输出在 `.vscode/mcp.json` 中添加 demo MCP server 配置的指令
    - MCP 配置模板:
      ```json
      {
        "servers": {
          "demo-mcp": {
            "type": "stdio",
            "command": "node",
            "args": ["path/to/demo-mcp-server.js"],
            "env": {}
          }
        }
      }
      ```
    - 明确说明: 这是一个配置模板，实际 MCP server 需要单独实现
    - 指令: "如果 `.vscode/mcp.json` 已存在，将 demo-mcp 配置合并到 servers 字段中"

  **Must NOT do**:
  - 不要实现 hook 的实际处理逻辑
  - 不要实现 MCP server
  - 不要添加 jq 或其他外部依赖
  - 不要创建复杂的 hook 链或多事件处理

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: 需要正确理解 hook JSON 结构和 MCP 配置格式
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES（与 T5, T6, T8, T9 并行）
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 8, 9)
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - `packages/generator/src/types.ts` — `InstallModule` 接口

  **External References**:
  - Copilot Hooks 文档: https://code.visualstudio.com/docs/copilot/customization/hooks — 8 种事件类型、JSON I/O 格式
  - MCP 配置格式: `.vscode/mcp.json` 中的 `servers` 对象结构
  - Hook 事件类型列表: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, PreCompact, SubagentStart, SubagentStop, Stop

  **WHY Each Reference Matters**:
  - Hooks 文档确保 JSON 配置字段名正确（name, event, script, timeout）
  - MCP 文档确保 server 配置格式正确（type, command, args）
  - 事件类型列表确保 demo 使用了有效的事件名

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Hook 模块输出包含 JSON 配置和 shell 脚本
    Tool: Bash
    Preconditions: Task 3 完成
    Steps:
      1. 运行 `pnpm --filter @rsp/generator run generate`
      2. 读取 `packages/generator/dist/installation.md`
      3. 搜索 "demo-format" — 验证 hook 名称存在
      4. 搜索 "PostToolUse" — 验证使用了有效的事件类型
      5. 搜索 "stdin" 或 "cat" — 验证 shell 脚本展示了 JSON I/O 模式
      6. 搜索 '"proceed"' — 验证响应格式
    Expected Result: hook 安装指令包含 JSON 配置文件和 shell 脚本框架
    Failure Indicators: 缺少 JSON 配置或 shell 脚本
    Evidence: .sisyphus/evidence/task-7-hook-module.txt

  Scenario: MCP 模块输出包含 .vscode/mcp.json 配置
    Tool: Bash
    Preconditions: installation.md 已生成
    Steps:
      1. 读取 `packages/generator/dist/installation.md`
      2. 搜索 "mcp.json" — 验证 MCP 配置文件引用
      3. 搜索 "servers" — 验证 server 配置结构
      4. 搜索 "stdio" — 验证使用了 stdio 传输类型
      5. 搜索 ".vscode" — 验证写入正确的路径
    Expected Result: MCP 配置模板完整，写入 .vscode/mcp.json
    Failure Indicators: 配置格式错误或路径不正确
    Evidence: .sisyphus/evidence/task-7-mcp-module.txt

  Scenario: Hook shell 脚本使用正确的 JSON I/O 模式
    Tool: Bash
    Preconditions: installation.md 已生成
    Steps:
      1. 读取 `packages/generator/dist/installation.md`
      2. 在 demo-format.sh 段落中搜索 stdin 读取模式
      3. 验证脚本以 JSON stdout 输出结束（echo '{...}'）
    Expected Result: Shell 脚本框架展示了从 stdin 读取 JSON、向 stdout 输出 JSON 的完整模式
    Failure Indicators: 脚本只是简单 echo，不展示 JSON I/O 模式
    Evidence: .sisyphus/evidence/task-7-hook-io-pattern.txt
  ```

  **Commit**: YES (group with T5+T6)
  - Message: `feat(generator): add demo skill, hook, MCP, and common modules`
  - Files: `packages/generator/src/modules/hooks/**`, `packages/generator/src/modules/mcps/**`
  - Pre-commit: `pnpm --filter @rsp/generator run generate`

- [x] 8. GitHub Actions — Release workflow

  **What to do**:
  - 创建 `.github/workflows/release.yml`:
    - Trigger: `push` to `main` branch
    - Jobs:
      1. **build**: 
         - `runs-on: ubuntu-latest`
         - Checkout code
         - Setup Node.js 20 + pnpm
         - `pnpm install`
         - `pnpm --filter @rsp/generator run generate`
         - Upload `packages/generator/dist/installation.md` 和 `packages/generator/dist/README.md` 作为 artifacts
      2. **release** (depends on build):
         - 使用 `softprops/action-gh-release@v2`
         - 从 `package.json` 读取版本号生成 tag（或使用 commit SHA 短号作为 pre-release tag）
         - 上传 `installation.md` 和 `README.md` 到 Release assets
    - 注意: 版本号策略 — 使用 root `package.json` 的 `version` 字段
    - 简单策略: 每次 push 创建一个以日期+短 SHA 命名的 draft release

  **Must NOT do**:
  - 不要实现复杂的版本管理（no semantic-release, no changesets）
  - 不要添加 test 步骤（项目无测试）
  - 不要添加 lint 步骤
  - 不要添加 Docker 或其他部署

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准 GitHub Actions workflow YAML，无复杂逻辑
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `git-master`: 不涉及本地 git 操作

  **Parallelization**:
  - **Can Run In Parallel**: YES（与 T5, T6, T7, T9 并行）
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 7, 9)
  - **Blocks**: None
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - 无（新建 workflow）

  **External References**:
  - `softprops/action-gh-release@v2`: https://github.com/softprops/action-gh-release — Release 创建 action
  - GitHub Actions pnpm setup: `pnpm/action-setup@v4` — 安装 pnpm
  - GitHub Actions Node.js setup: `actions/setup-node@v4` — 安装 Node.js

  **WHY Each Reference Matters**:
  - `softprops/action-gh-release` 是最常用的 Release 创建 action，需要正确配置 `files` 参数
  - pnpm 需要专门的 setup action，不是 Node.js 自带的

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Workflow YAML 语法正确
    Tool: Bash
    Preconditions: .github/workflows/release.yml 已创建
    Steps:
      1. 检查文件存在: `ls .github/workflows/release.yml`
      2. 验证 YAML 语法（读取文件，检查 on/jobs 顶级字段存在）
      3. 搜索关键配置: "softprops/action-gh-release", "pnpm", "generate"
    Expected Result: YAML 文件语法正确，包含 build 和 release jobs
    Failure Indicators: 文件不存在、YAML 格式错误、缺少关键 action 引用
    Evidence: .sisyphus/evidence/task-8-release-workflow.txt

  Scenario: Workflow 包含完整的构建步骤
    Tool: Bash
    Preconditions: release.yml 存在
    Steps:
      1. 读取 `.github/workflows/release.yml`
      2. 验证包含 `actions/checkout`
      3. 验证包含 `pnpm/action-setup` 或等效 pnpm 安装步骤
      4. 验证包含 `actions/setup-node`
      5. 验证包含 `pnpm install`
      6. 验证包含 `pnpm --filter` 和 `generate` 命令
      7. 验证包含 `installation.md` 在 release files 中
    Expected Result: 构建流程完整: checkout → setup → install → generate → release
    Failure Indicators: 任何步骤缺失
    Evidence: .sisyphus/evidence/task-8-build-steps.txt
  ```

  **Commit**: YES (group with T9)
  - Message: `ci: add release and GitHub Pages workflows`
  - Files: `.github/workflows/release.yml`
  - Pre-commit: 无

- [x] 9. GitHub Actions — Pages 部署 workflow

  **What to do**:
  - 创建 `.github/workflows/pages.yml`:
    - Trigger: `push` to `main` branch
    - Permissions: `pages: write`, `id-token: write`
    - Environment: `github-pages`
    - Jobs:
      1. **build**:
         - Checkout code
         - Setup Node.js 20 + pnpm
         - `pnpm install`
         - `pnpm --filter @rsp/web run build`
         - Upload `packages/web/dist/` 作为 Pages artifact（使用 `actions/upload-pages-artifact@v3`）
      2. **deploy** (depends on build):
         - 使用 `actions/deploy-pages@v4`
  - 确保 `vite.config.ts` 中的 `base` 路径与 GitHub Pages URL 匹配

  **Must NOT do**:
  - 不要使用 gh-pages 分支方式（使用 GitHub Actions Pages 部署方式）
  - 不要添加缓存优化
  - 不要混合 release 和 pages 在同一个 workflow

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 标准 GitHub Pages 部署 workflow YAML
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES（与 T5, T6, T7, T8 并行）
  - **Parallel Group**: Wave 2 (with Tasks 5, 6, 7, 8)
  - **Blocks**: None
  - **Blocked By**: Task 4

  **References**:

  **Pattern References**:
  - `packages/web/vite.config.ts` (Task 4 产出) — `base` 配置需与 Pages URL 一致

  **External References**:
  - GitHub Pages Actions 部署: `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`
  - Vite GitHub Pages 指南: https://vitejs.dev/guide/static-deploy#github-pages

  **WHY Each Reference Matters**:
  - Pages artifact action 有特定的路径参数要求
  - `base` 路径不匹配会导致 Pages 上所有资源 404

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Pages workflow YAML 语法正确
    Tool: Bash
    Preconditions: .github/workflows/pages.yml 已创建
    Steps:
      1. 检查文件存在: `ls .github/workflows/pages.yml`
      2. 验证包含 `actions/upload-pages-artifact`
      3. 验证包含 `actions/deploy-pages`
      4. 验证包含 `permissions:` 段（pages: write）
      5. 验证 build 步骤包含 `pnpm --filter @rsp/web run build`
    Expected Result: Workflow 包含完整的 Pages 构建和部署配置
    Failure Indicators: 文件不存在、缺少必要的 permissions 或 actions
    Evidence: .sisyphus/evidence/task-9-pages-workflow.txt

  Scenario: Workflow 使用正确的 artifact 路径
    Tool: Bash
    Preconditions: pages.yml 存在
    Steps:
      1. 读取 `.github/workflows/pages.yml`
      2. 搜索 upload-pages-artifact 的 path 参数
      3. 验证路径指向 `packages/web/dist` 或等效路径
    Expected Result: Artifact 上传路径与 Vite build 输出目录一致
    Failure Indicators: 路径不匹配（会导致部署空页面）
    Evidence: .sisyphus/evidence/task-9-artifact-path.txt
  ```

  **Commit**: YES (group with T8)
  - Message: `ci: add release and GitHub Pages workflows`
  - Files: `.github/workflows/pages.yml`
  - Pre-commit: 无

- [ ] 10. 端到端集成 — 生成完整 installation.md 并验证

  **What to do**:
  - 运行 `pnpm --filter @rsp/generator run generate` 生成完整的 `installation.md`
  - 验证 installation.md 的段落顺序和内容完整性:
    1. **Header** — 版本号、项目说明、使用说明
    2. **RSP 目录结构** — `.rsp/` 创建指令
    3. **Skills 安装** — demo-skill + rsp-update SKILL.md
    4. **Hooks 安装** — demo-format.json + demo-format.sh
    5. **MCP 配置** — `.vscode/mcp.json` 模板
    6. **Symlink 创建** — 三平台指令
    7. **Web UI 引导** — 访问文档站链接
    8. **Footer** — 版本信息、仓库链接
  - 如果段落缺失或顺序错误，修复对应模块文件的 `order` 值
  - 验证 `dist/README.md` 包含版本链接格式
  - 运行 `pnpm run build`（root script）确保整体构建通过
  - 如果发现跨模块的格式问题（如 markdown heading 层级不一致），统一修复

  **Must NOT do**:
  - 不要重写模块内容（只调整 order 或修复格式问题）
  - 不要添加新模块（只集成已有的）
  - 不要修改核心引擎逻辑

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: 集成验证需要理解所有模块的输出并确保整体连贯性
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES（与 T11 并行）
  - **Parallel Group**: Wave 3 (with Task 11)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 5, 6, 7

  **References**:

  **Pattern References**:
  - `packages/generator/src/modules/common/` (Task 5 产出) — header/footer/symlink 模块
  - `packages/generator/src/modules/skills/` (Task 6 产出) — skill 模块
  - `packages/generator/src/modules/hooks/` (Task 7 产出) — hook 模块
  - `packages/generator/src/modules/mcps/` (Task 7 产出) — MCP 模块
  - `packages/generator/src/index.ts` (Task 3 产出) — 生成引擎核心

  **External References**:
  - 无（纯集成任务）

  **WHY Each Reference Matters**:
  - 需要读取所有模块的 `order` 值来验证排序正确性
  - 需要检查引擎的拼接逻辑是否正确处理了所有 category 的模块

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: installation.md 包含所有必需段落且顺序正确
    Tool: Bash
    Preconditions: Tasks 3-7 完成，所有模块已就位
    Steps:
      1. 运行 `pnpm --filter @rsp/generator run generate`
      2. 读取 `packages/generator/dist/installation.md`
      3. 按顺序验证关键内容存在:
         a. 文件开头包含版本号或 "RSP"（header）
         b. 包含 "mkdir" 或 ".rsp/" 目录创建指令
         c. 包含 "example-skill" 和 "SKILL.md"
         d. 包含 "rsp-update"
         e. 包含 "demo-format" 和 "PostToolUse"
         f. 包含 "mcp.json" 和 "servers"
         g. 包含 "ln -s" 和 "symlink"
         h. 包含 Web UI URL 或文档链接
         i. 文件结尾包含版本或 "自动生成" 标记
      4. 验证 header 出现在 skill 之前，skill 出现在 symlink 之前
    Expected Result: 所有 9 个关键段落按正确顺序出现
    Failure Indicators: 任何段落缺失或顺序颠倒
    Evidence: .sisyphus/evidence/task-10-full-integration.txt

  Scenario: 全项目构建通过
    Tool: Bash
    Preconditions: 所有 package 已配置
    Steps:
      1. 运行 `pnpm run build`（root script，如果存在）或分别构建各 package
      2. 运行 `pnpm --filter @rsp/generator run generate`
      3. 运行 `pnpm --filter @rsp/web run build`
      4. 验证所有退出码为 0
    Expected Result: 全部构建和生成成功，零错误
    Failure Indicators: 任何命令非零退出码
    Evidence: .sisyphus/evidence/task-10-full-build.txt

  Scenario: README.md 内容正确
    Tool: Bash
    Preconditions: generate 已运行
    Steps:
      1. 读取 `packages/generator/dist/README.md`
      2. 验证包含版本链接或指引文字
      3. 验证不是空文件
    Expected Result: README.md 包含版本链接格式
    Failure Indicators: 文件为空或缺少链接
    Evidence: .sisyphus/evidence/task-10-readme.txt
  ```

  **Commit**: YES
  - Message: `feat(generator): integrate all modules for complete installation.md output`
  - Files: `packages/generator/dist/installation.md`, `packages/generator/dist/README.md`, 可能的 order 修复
  - Pre-commit: `pnpm --filter @rsp/generator run generate`

- [ ] 11. Web UI 页面内容框架

  **What to do**:
  - 完善 `packages/web/src/pages/Home.tsx`:
    - 项目标题: "RSP Setup Copilot"
    - 简要说明: "统一 AI 配置生成器 — 一键配置 .rsp/ 目录"
    - 快速开始区域: placeholder 文字说明如何获取 installation.md
    - 链接到 Guide 页面
  - 完善 `packages/web/src/pages/Guide.tsx`:
    - "安装指南" 标题
    - 安装步骤概要（placeholder 列表）:
      1. 从 GitHub Release 下载 installation.md
      2. 打开 Copilot agent 聊天
      3. 粘贴 installation.md 内容
      4. 等待 agent 完成配置
    - "包含内容" 清单（placeholder）:
      - Skills 列表
      - Hooks 列表
      - MCP 配置
      - Symlink 结构
  - 完善 `packages/web/src/App.tsx`:
    - 添加简单的导航栏（Home | Guide 两个链接）
    - 使用基础 CSS（App.css），不用组件库
  - 确保 `pnpm --filter @rsp/web run build` 成功

  **Must NOT do**:
  - 不要使用 UI 组件库（no MUI/Ant Design/Tailwind）
  - 不要填充真实的详细内容（都是 placeholder）
  - 不要添加状态管理
  - 不要添加 API 调用
  - 不要过度设计样式

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: 涉及 React 组件和基础 UI 布局
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: 只是 placeholder 内容，不需要设计精调
    - `playwright`: 不需要浏览器自动化测试

  **Parallelization**:
  - **Can Run In Parallel**: YES（与 T10 并行）
  - **Parallel Group**: Wave 3 (with Task 10)
  - **Blocks**: F1-F4
  - **Blocked By**: Task 4

  **References**:

  **Pattern References**:
  - `packages/web/src/App.tsx` (Task 4 产出) — 现有的 App 组件和路由框架
  - `packages/web/src/pages/Home.tsx` (Task 4 产出) — 现有的 placeholder 首页
  - `packages/web/src/pages/Guide.tsx` (Task 4 产出) — 现有的 placeholder 指南页

  **External References**:
  - react-router-dom v6: `<Link to="/">`, `<NavLink>` — 导航链接组件
  - 基础 React 组件模式: 函数组件 + JSX

  **WHY Each Reference Matters**:
  - Task 4 产出的文件是此任务的修改对象，需要在其基础上添加 placeholder 内容
  - react-router-dom 的 Link 组件用于导航栏链接

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Web UI 构建成功
    Tool: Bash
    Preconditions: Task 4 完成
    Steps:
      1. 运行 `pnpm --filter @rsp/web run build`
      2. 检查退出码为 0
      3. 验证 `packages/web/dist/index.html` 存在
    Expected Result: 构建成功
    Failure Indicators: 构建失败
    Evidence: .sisyphus/evidence/task-11-web-build.txt

  Scenario: 页面包含导航和内容
    Tool: Playwright (playwright skill)
    Preconditions: Dev server 可启动
    Steps:
      1. 启动 dev server: `pnpm --filter @rsp/web run dev`
      2. 导航到 `http://localhost:5173/rsp.setup_copilot/`
      3. 验证页面包含 "RSP" 或项目标题文字
      4. 查找导航链接（Home, Guide）
      5. 点击 "Guide" 链接
      6. 验证页面包含 "安装" 或 "installation" 相关文字
      7. 截图保存
      8. 终止 dev server
    Expected Result: 首页和指南页都可访问，包含 placeholder 内容和导航
    Failure Indicators: 页面空白、导航链接不工作、路由 404
    Evidence: .sisyphus/evidence/task-11-web-ui-screenshot.png

  Scenario: 无 UI 组件库依赖
    Tool: Bash
    Preconditions: packages/web/package.json 存在
    Steps:
      1. 读取 `packages/web/package.json`
      2. 验证 dependencies 中不包含 @mui、antd、tailwindcss
    Expected Result: 只有 react, react-dom, react-router-dom 作为 dependencies
    Failure Indicators: 存在未批准的 UI 库依赖
    Evidence: .sisyphus/evidence/task-11-no-ui-lib.txt
  ```

  **Commit**: YES
  - Message: `feat(web): add placeholder pages for installation guide`
  - Files: `packages/web/src/**`
  - Pre-commit: `pnpm --filter @rsp/web run build`

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in `.sisyphus/evidence/`. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `pnpm run build`. Review all files for: `as any`, empty catches, console.log in prod code, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real QA — 生成器输出验证** — `unspecified-high`
  Run `pnpm --filter generator run generate`. Read `dist/installation.md`. Verify: (1) 包含创建 .rsp/ 目录的指令 (2) 包含 demo skill SKILL.md 内容 (3) 包含 demo hook JSON 配置 (4) 包含 MCP 配置模板 (5) 包含 symlink 创建指令（3 平台）(6) 包含 rsp_update skill (7) 以引导用户打开 Web UI 页面结尾。Read `dist/README.md`. Verify: 包含版本链接格式。
  Output: `Sections [N/N present] | Cross-platform [3/3] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual files. Verify 1:1. Check "Must NOT do" compliance. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | VERDICT`

---

## Commit Strategy

| Group | Message | Files |
|-------|---------|-------|
| T1 | `chore: initialize pnpm monorepo with TypeScript` | root configs |
| T2+T3 | `feat(generator): add modular installation.md generator engine` | packages/generator/** |
| T4 | `feat(web): scaffold Vite + React documentation site` | packages/web/** |
| T5+T6+T7 | `feat(generator): add demo skill, hook, MCP, and common modules` | packages/generator/src/modules/** |
| T8+T9 | `ci: add release and GitHub Pages workflows` | .github/workflows/** |
| T10 | `feat(generator): integrate all modules for complete installation.md output` | packages/generator/src/index.ts, dist/** |
| T11 | `feat(web): add placeholder pages for installation guide` | packages/web/src/** |

---

## Success Criteria

### Verification Commands
```bash
pnpm install                              # Expected: success, no errors
pnpm run build                            # Expected: all packages build
pnpm --filter generator run generate      # Expected: dist/installation.md + dist/README.md created
pnpm --filter web run dev                 # Expected: dev server starts on localhost
cat dist/installation.md | head -20       # Expected: prompt header with version info
```

### Final Checklist
- [ ] `pnpm install && pnpm build` 无错误
- [ ] `dist/installation.md` 包含所有模块段落（common header → skills → hooks → mcps → symlink → rsp_update → web UI 引导 → footer）
- [ ] `dist/README.md` 包含版本链接格式
- [ ] `packages/web/` 可通过 `pnpm run dev` 启动
- [ ] GitHub Actions workflow 文件语法正确
- [ ] 新增模块只需在 `src/modules/{category}/` 下新增编号 TS 文件
- [ ] `.rsp/` 架构和 symlink 指令在 installation.md 中清晰描述
