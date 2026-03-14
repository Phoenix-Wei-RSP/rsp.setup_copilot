---
name: rsp-update
description: Automated upgrade framework for RSP Setup Copilot to latest version
user-invocable: true
---

# RSP Update

Automated skill for upgrading your RSP Setup Copilot configuration to the latest version.

## When to Use

- Upgrading to a new version of RSP Setup Copilot
- Applying configuration updates from upstream
- Synchronizing with the latest best practices

## Upgrade Process

### Step 1: Fetch Latest Version

TODO: Implement version fetching logic

- Query GitHub API for latest release
- Download installation.md from latest version
- Compare current version with latest

### Step 2: Compare Versions

TODO: Implement version comparison logic

- Parse current .rsp/ configuration
- Identify new skills, hooks, or MCPs
- Detect breaking changes or deprecated features
- Generate upgrade report

### Step 3: Apply Changes

TODO: Implement upgrade application logic

- Back up current configuration
- Apply new files and updates
- Migrate configuration settings
- Verify symlinks remain intact
- Run validation checks

## Safety Checks

- Always create backups before upgrading
- Preserve custom modifications in .rsp/
- Validate symlink integrity after upgrade
- Report conflicts requiring manual resolution
