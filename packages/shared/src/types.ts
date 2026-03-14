/** Supported skill categories */
export type Category = 'Frontend' | 'Backend' | 'QualityAssurance';

/** Base skill definition */
export interface BaseSkill {
  skillName: string;
  categories: Category[];
}

/** Built-in skill with a repo URL for runtime fetching */
export interface BuiltInSkill extends BaseSkill {
  repo: string;
}

/** Custom skill (same shape as BaseSkill) */
export type CustomSkill = BaseSkill;

/** A single entry in the skills manifest / lock file */
export interface SkillManifestEntry {
  source: 'built-in' | 'custom';
  sha256: string;
  categories: Category[];
  repo?: string;
}

/** The skills-manifest.json structure */
export interface SkillsManifest {
  skills: Record<string, SkillManifestEntry>;
}

/** A single MCP server configuration structure */
export interface McpServerConfig {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  type?: string;
  url?: string;
}

/** Built-in MCP Server declaration */
export interface BuiltInMcp {
  mcpId: string;
  categories: Category[];
  configs: Record<string, McpServerConfig>; // Key defines the platform: e.g. 'vscode', 'claude'
}

/** A single entry in the mcps manifest */
export interface McpManifestEntry {
  categories: Category[];
  configs: Record<string, McpServerConfig>;
}

/** The mcps-manifest.json structure */
export interface McpsManifest {
  mcps: Record<string, McpManifestEntry>;
}
