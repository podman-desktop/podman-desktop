# Podman Desktop MCP Testing Skill

This skill enables interactive manual testing of Podman Desktop through the electron-test-mcp MCP server.

## Files in This Directory

### Core Skill

- **`SKILL.md`** - Main skill file loaded by Claude Code. Contains complete workflow for starting app, connecting via MCP, and common testing patterns.

### Documentation

- **`TESTING-WITH-MCP.md`** - Comprehensive testing guide
  - Two testing modes: CDP and Launch
  - Selector strategy best practices
  - Common testing scenarios
  - Complete troubleshooting section

### Examples & Scripts

- **`mcp-test-examples.md`** - 500+ lines of ready-to-use MCP commands
  - Connection examples
  - Navigation workflows
  - Form interactions
  - Element inspection
  - Screenshot & debugging
  - Advanced multi-step scenarios
  - Continuous testing workflows

- **`start-with-cdp.sh`** - Bash script for Linux/macOS
  - Launches compiled Podman Desktop binary with CDP on port 9222
  - Creates isolated test environment in `/tmp/pd-mcp-test-{timestamp}`
  - Platform-aware (Linux/macOS)
  - Usage: `bash .agents/skills/mcp-testing/start-with-cdp.sh`

- **`start-with-cdp.ps1`** - PowerShell script for Windows
  - Equivalent of `start-with-cdp.sh` for Windows
  - Creates isolated test environment in `%TEMP%\pd-mcp-test-{timestamp}`
  - Usage: `powershell -ExecutionPolicy Bypass -File .agents\skills\mcp-testing\start-with-cdp.ps1`

## Quick Start

### For Sub-Agents

When invoking this skill, sub-agents will have access to:

1. **Complete workflow** for launching and connecting to Podman Desktop
2. **Navigation patterns** for all UI pages
3. **JavaScript evaluation examples** for reliable interactions
4. **Troubleshooting guide** for common issues

### For Manual Use

```bash
# 1. Compile binary (if not already done)
pnpm compile:current

# 2. Launch with CDP enabled
# Linux/macOS:
bash .agents/skills/mcp-testing/start-with-cdp.sh
# Windows (PowerShell):
powershell -ExecutionPolicy Bypass -File .agents\skills\mcp-testing\start-with-cdp.ps1

# 3. In Claude conversation, connect via MCP
"Connect to Podman Desktop using CDP at http://localhost:9222"
```

## File Locations Summary

All files are in: `.agents/skills/mcp-testing/`

```
mcp-testing/
├── README.md                  # This file
├── SKILL.md                   # Main skill (loaded by sub-agents)
├── TESTING-WITH-MCP.md        # Comprehensive testing guide
├── mcp-test-examples.md       # Ready-to-use command examples
├── start-with-cdp.sh          # CDP launcher script for Linux/macOS
└── start-with-cdp.ps1         # CDP launcher script for Windows
```

## Integration with Podman Desktop

Binary locations after `pnpm compile:current`:

- **Linux:** `dist/linux-unpacked/podman-desktop`
- **macOS (Apple Silicon):** `dist/mac-arm64/Podman Desktop.app`
- **macOS (Intel):** `dist/mac/Podman Desktop.app`
- **Windows:** `dist\win-unpacked\Podman Desktop.exe`

- **Development mode:** `pnpm watch` enables CDP on port 9223 automatically (all platforms)
- **Production mode:** `start-with-cdp.sh` (Linux/macOS) or `start-with-cdp.ps1` (Windows) enables CDP on port 9222

## Usage in Conversations

### Invoke Skill (slash command)

```
/mcp-test
```

### Direct Reference

```
Read .agents/skills/mcp-testing/mcp-test-examples.md for command examples
```

### For Sub-Agents

The skill is automatically loaded when invoked, providing complete context for testing Podman Desktop via MCP.
