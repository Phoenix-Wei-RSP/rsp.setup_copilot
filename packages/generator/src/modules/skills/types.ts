export type Category = "Frontend" | "Backend" | "QualityAssurance";

export interface BaseSkill {
  skillName: string;
  categories: Category[];
}

export interface BuiltInSkill extends BaseSkill {
  repo: string;
}

export type CustomSkill = BaseSkill;

export interface LockEntry {
  source: string;
  sha256: string;
  categories: Category[];
  repo?: string;
}

export interface LockFile {
  skills: Record<string, LockEntry>;
}
