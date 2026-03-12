import type { InstallModule } from '../../types.js';

export default {
  order: 1,
  name: 'demo-hook',
  category: 'hooks',
  generate: (ctx) => `## Demo Hook

This example demonstrates the GitHub Copilot hook system with a JSON stdin/stdout pattern.

### What is a Hook?

Hooks allow you to intercept and process events during GitHub Copilot's execution lifecycle. This demo shows the **PostToolUse** event, which fires after any tool is invoked.

### Files to Create

Create two files in your \`.rsp/hooks/\` directory:

#### 1. Hook Configuration: \`.rsp/hooks/demo-format.json\`

\`\`\`json
{
  "name": "demo-format",
  "description": "Demo hook showing JSON stdin/stdout pattern for tool result formatting",
  "event": "PostToolUse",
  "script": "hooks/demo-format.sh",
  "timeout": 10000
}
\`\`\`

**Configuration Fields**:
- \`name\`: Unique identifier for the hook
- \`description\`: Human-readable purpose
- \`event\`: Lifecycle event to intercept (8 types available: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, PreCompact, SubagentStart, SubagentStop, Stop)
- \`script\`: Path to shell script (relative to \`.rsp/\`)
- \`timeout\`: Maximum execution time in milliseconds

#### 2. Hook Script: \`.rsp/hooks/demo-format.sh\`

\`\`\`bash
#!/bin/bash

# GitHub Copilot Hook: JSON stdin/stdout pattern
# Event: PostToolUse
# Purpose: Process tool execution results

# Read event data from stdin (JSON format)
INPUT=$(cat)

# TODO: Parse and process the event
# Example event structure:
# {
#   "event": "PostToolUse",
#   "toolName": "bash",
#   "result": "command output...",
#   "timestamp": "2026-03-12T10:30:00Z"
# }

# Output decision JSON to stdout
echo '{"proceed": true}'

# Hook Contract:
# - Input: JSON event data via stdin
# - Output: JSON decision object via stdout
# - Fields: {"proceed": true/false, "message": "optional"}
\`\`\`

**Make the script executable**:

\`\`\`bash
chmod +x .rsp/hooks/demo-format.sh
\`\`\`

### Hook I/O Contract

**Critical Pattern**: Hooks use JSON stdin/stdout, not simple echo commands.

1. **Read JSON from stdin**: \`INPUT=$(cat)\`
2. **Process event data**: Parse JSON, apply logic
3. **Output JSON to stdout**: \`echo '{"proceed": true}'\`

**Response Fields**:
- \`proceed\`: Boolean (true = continue, false = halt)
- \`message\`: Optional string (displayed to user if proceed=false)

### Available Hook Events

| Event | When Triggered | Use Cases |
|-------|----------------|-----------|
| SessionStart | New Copilot session begins | Initialize context, load preferences |
| UserPromptSubmit | User sends a prompt | Validate input, add context |
| PreToolUse | Before tool execution | Validate parameters, log actions |
| **PostToolUse** | After tool execution (demo) | Format output, log results, trigger workflows |
| PreCompact | Before context window compaction | Save important state |
| SubagentStart | Subagent spawned | Track delegation |
| SubagentStop | Subagent completes | Aggregate results |
| Stop | Session ends | Cleanup, save logs |

### Next Steps

1. Create both files in \`.rsp/hooks/\`
2. Make script executable (\`chmod +x\`)
3. Symlink to \`.github/hooks/\` (if using symlink architecture)
4. Test hook execution during Copilot session

**Documentation**: For more details, visit [GitHub Copilot Hooks Documentation](https://code.visualstudio.com/docs/copilot/customization/hooks)
`
} satisfies InstallModule;
