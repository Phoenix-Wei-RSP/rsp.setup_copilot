import type { InstallModule } from '../../types.js';

export default {
  order: 10,
  name: 'demo-skill',
  category: 'skills',
  generate: () => {
    return `
## Example Skill

创建文件 \`.rsp/skills/example-skill/SKILL.md\`，内容如下:

\`\`\`markdown
---
name: example-skill
description: Example skill demonstrating the SKILL.md template structure
user-invocable: true
---

# Example Skill

This is a demonstration skill showing the basic structure of a SKILL.md file.

## When to Use

- Learning how to create custom skills
- Understanding the YAML frontmatter format
- Template for new skill development

## Implementation

TODO: Implement skill logic here

\`\`\`
`;
  }
} satisfies InstallModule;
