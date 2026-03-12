## Task 3: README.md Output Evidence

### Generated README.md Content

**Test Context**:
- Version: 0.1.0 (from package.json)
- RepoUrl: https://github.com/your-org/rsp.setup_copilot
- WebUrl: https://your-org.github.io/rsp.setup_copilot

**Generated Output**:
```markdown
# RSP Setup Copilot

Version: 0.1.0

For installation instructions, see [installation.md](./installation.md)

Documentation: https://your-org.github.io/rsp.setup_copilot
Repository: https://github.com/your-org/rsp.setup_copilot
```

**Implementation Notes**:
- Version correctly extracted from package.json
- Context values properly interpolated
- Relative link to installation.md included
- Documentation and repository URLs from context

**Verification**: ✅ PASSED
- File created at dist/README.md
- All context values rendered
- Markdown format valid
