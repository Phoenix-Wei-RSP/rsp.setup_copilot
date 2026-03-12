export default {
    order: 1,
    name: 'demo-mcp',
    category: 'mcps',
    generate: (ctx) => `## Demo MCP Server Configuration

This example shows how to configure a Model Context Protocol (MCP) server in VS Code.

### What is MCP?

MCP (Model Context Protocol) enables VS Code extensions to provide additional context and capabilities to AI assistants. Servers can expose:
- **Tools**: Actions the AI can invoke (file operations, API calls, etc.)
- **Resources**: Data sources the AI can query (databases, APIs, documentation)
- **Prompts**: Pre-defined prompt templates

### Configuration File: \`.vscode/mcp.json\`

Create or update \`.vscode/mcp.json\` with the following configuration:

\`\`\`json
{
  "servers": {
    "demo-mcp": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/path/to/your/mcp-server/dist/index.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
\`\`\`

### Configuration Fields

| Field | Type | Description |
|-------|------|-------------|
| \`type\` | string | Communication protocol (\`stdio\` = standard input/output) |
| \`command\` | string | Executable to run (node, python, deno, etc.) |
| \`args\` | array | Command-line arguments (typically path to server script) |
| \`env\` | object | Environment variables passed to the server process |

### Important Notes

**⚠️ This is a Configuration Template**
- This template shows the **config format** only
- You need a **separate MCP server implementation** to provide actual functionality
- The server must implement the MCP protocol specification
- See [MCP SDK](https://github.com/modelcontextprotocol) for implementation libraries

**Merging with Existing Configuration**
- If \`.vscode/mcp.json\` already exists, merge the \`demo-mcp\` entry into the \`servers\` field
- Don't overwrite existing server configurations
- Each server needs a unique key in the \`servers\` object

### Example Server Implementation (Pseudocode)

\`\`\`typescript
// Example MCP server structure (not part of this config)
import { Server } from '@modelcontextprotocol/sdk';

const server = new Server({
  name: 'demo-mcp',
  version: '1.0.0'
});

// Register tools
server.setRequestHandler('tools/list', async () => ({
  tools: [
    { name: 'greet', description: 'Say hello', inputSchema: {} }
  ]
}));

server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'greet') {
    return { content: [{ type: 'text', text: 'Hello from MCP!' }] };
  }
});

// Start stdio transport
await server.connect(process.stdin, process.stdout);
\`\`\`

### MCP Server Types

**Common Server Implementations**:
- **Filesystem**: Read/write files, search code
- **Database**: Query SQL/NoSQL databases
- **API Gateway**: Call external APIs with authentication
- **Documentation**: Search and retrieve docs
- **Git**: Query repository history, branches, commits

### VS Code Integration

Once configured:
1. VS Code reads \`.vscode/mcp.json\` on startup
2. Spawns configured server processes
3. AI assistant can discover and use server capabilities
4. Tools appear in Copilot's available actions

### Troubleshooting

**Server Not Starting**:
- Check \`command\` path is valid (\`node\`, \`python3\`, etc.)
- Verify \`args\` paths are absolute or relative to workspace root
- Review VS Code's Output panel → MCP Logs

**Permission Issues**:
- Ensure server script has execute permissions
- Check environment variables in \`env\` are correct

**Protocol Errors**:
- Server must implement MCP spec correctly
- Use MCP SDK for protocol compliance
- Test server independently with \`stdio\` transport

### Next Steps

1. Create \`.vscode/mcp.json\` with demo configuration
2. Update \`args\` path to point to your MCP server implementation
3. Implement MCP server using [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol)
4. Restart VS Code to load the configuration
5. Test server discovery: Ask Copilot "What tools are available?"

**Documentation**: 
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [MCP SDK Examples](https://github.com/modelcontextprotocol/sdk)
`
};
