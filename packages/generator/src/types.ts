/**
 * Core interfaces for the generator module system
 */

export interface GenerateContext {
  /** Current version number */
  version: string;
  /** GitHub repository URL */
  repoUrl: string;
  /** Web UI page URL */
  webUrl: string;
}

export interface InstallModule {
  /** Module sequence number for ordering */
  order: number;
  /** Module name */
  name: string;
  /** Module category */
  category: 'common' | 'skills' | 'hooks' | 'mcps';
  /** Function to generate markdown content */
  generate: (context: GenerateContext) => string;
}
