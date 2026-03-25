---
name: mcp-testing
description: >-
  Guide for interactively testing Podman Desktop UI using the electron-test MCP
  server and Chrome DevTools Protocol (CDP). Use when manually testing UI
  workflows, debugging UI issues, exploring features interactively, or doing
  quick acceptance testing without writing Playwright test code.
---

# Podman Desktop MCP Testing

Use the electron-test MCP server to interactively test and interact with Podman Desktop through automated browser commands.

## When to use this skill

- Manually testing Podman Desktop UI changes during development
- Debugging specific user workflows or UI issues
- Exploring new features interactively
- Verifying functionality without writing test code
- Quick acceptance testing before release
- Learning the codebase through UI exploration

## Prerequisites

- MCP server `electron-test` configured via `.mcp.json` at the repo root (already done)
- Either:
  - Compiled binary at `dist/linux-unpacked/podman-desktop` (production testing)
  - OR ability to run `pnpm watch` (development testing)

## Important Notes

⚠️ **The application must be started in the FOREGROUND** (not background) for the window to be visible on your display. Even though MCP can connect to background processes, you won't see what's happening visually unless you launch it directly in a terminal.

⚠️ **File descriptor limits:** If `pnpm watch` fails with "EMFILE: too many open files", increase the limit:

```bash
ulimit -n 65536
```

## Workflow

### Step 0: First-Time Setup (fresh clone)

If you have just cloned the repository, run this once before anything else:

```bash
# Install all dependencies
pnpm install

# Then choose your mode (see Step 1 below):
#   Development (faster to start): ulimit -n 65536 && pnpm watch
#   Production binary:             pnpm compile:current
```

Skip this step if `node_modules/` already exists in the repo root.

---

### Step 1: Start Podman Desktop with CDP Enabled

Choose ONE of these methods:

#### Option A: Production Testing (Recommended for sub-agents)

**Prerequisites:** Dependencies installed and binary compiled

```bash
pnpm install          # Skip if node_modules already exists
pnpm compile:current  # Builds and packages the binary
```

**Start the app:**

_Linux/macOS:_

```bash
bash .agents/skills/mcp-testing/start-with-cdp.sh
```

_Windows (PowerShell):_

```powershell
powershell -ExecutionPolicy Bypass -File .agents\skills\mcp-testing\start-with-cdp.ps1
```

This will:

- Create isolated test directory at `/tmp/pd-mcp-test-{timestamp}` (Linux/macOS) or `%TEMP%\pd-mcp-test-{timestamp}` (Windows)
- Launch binary with CDP on port **9222**
- Show the window on your display
- Print connection instructions

**Advantages:**

- Tests actual production binary
- Isolated test environment (no data pollution)
- Clean state for reproducible tests
- No build watching overhead

#### Option B: Development Testing

**Prerequisites:** Dependencies installed

```bash
pnpm install    # Skip if node_modules already exists
ulimit -n 65536 # Increase file descriptor limit (Linux/macOS only, required)
pnpm watch
```

This will:

- Start development mode with hot reload
- Enable CDP on port **9223** (different from production port)
- Rebuild code on changes
- Show the window on your display

**Advantages:**

- Immediate hot reload of code changes
- Fast iteration during development
- Integrated with normal development workflow

**Disadvantages:**

- Development build (slower, more debug output)
- Requires higher file descriptor limits
- Not testing production binary

### Step 2: Check if App is Running and Close DevTools Targets

Before connecting, verify the app started successfully and close any open DevTools windows.
The `electron-test` MCP tool picks the first available CDP target — if a DevTools window is
open it will connect there instead of the app.

_Linux/macOS:_

```bash
# 1. Check CDP endpoint is available
curl -s http://localhost:9222/json/version  # For production
# OR
curl -s http://localhost:9223/json/version  # For development
```

```bash
# 2. Close all DevTools CDP targets (run for whichever port you are using)
PORT=9223  # or 9222 for production
curl -s http://localhost:$PORT/json | python3 -c "
import json, sys, urllib.request
for t in json.load(sys.stdin):
    if 'devtools' in t.get('url', ''):
        try:
            urllib.request.urlopen(f'http://localhost:$PORT/json/close/{t[\"id\"]}')
            print('Closed DevTools target:', t['id'])
        except Exception as e:
            print('Already gone:', e)
"
```

```bash
# 3. Verify — should show only "Podman Desktop"
curl -s http://localhost:$PORT/json | python3 -c "import json,sys; [print('-', t['title']) for t in json.load(sys.stdin)]"
```

_Windows (PowerShell):_

```powershell
# 1. Check CDP endpoint is available
Invoke-WebRequest -Uri http://localhost:9222/json/version -UseBasicParsing  # For production
# OR
Invoke-WebRequest -Uri http://localhost:9223/json/version -UseBasicParsing  # For development
```

```powershell
# 2. Close all DevTools CDP targets
$port = 9223  # or 9222 for production
$targets = (Invoke-WebRequest -Uri "http://localhost:$port/json" -UseBasicParsing).Content | ConvertFrom-Json
foreach ($t in $targets) {
    if ($t.url -like "*devtools*") {
        try {
            Invoke-WebRequest -Uri "http://localhost:$port/json/close/$($t.id)" -UseBasicParsing | Out-Null
            Write-Host "Closed DevTools target: $($t.id)"
        } catch {
            Write-Host "Already gone: $($t.id)"
        }
    }
}
```

Expected output: JSON with browser version info, then only `- Podman Desktop` in the target list.

### Step 3: Connect via MCP

Use the MCP connect tool:

```text
// For production testing (port 9222)
mcp__electron-test__connect({ port: 9222 })

// For development testing (port 9223)
mcp__electron-test__connect({ port: 9223 })
```

Expected result: `Connected via CDP (port XXXX). Window title: Podman Desktop`

> **Verify the window title says "Podman Desktop"**, not "DevTools". If you see "DevTools",
> go back to Step 2 and close the DevTools targets before reconnecting.

### Step 4: Get Page Snapshot

Always start by understanding what's on the current page:

```text
mcp__electron-test__snapshot()
```

This returns the accessibility tree showing:

- All visible UI elements
- Navigation links
- Buttons and forms
- Current page content
- Element attributes

### Step 5: Navigate and Interact

#### Close Welcome Dialog (if present)

On first launch, a welcome dialog appears. Close it:

```text
mcp__electron-test__evaluate({
  script: `
    const skipButton = document.evaluate(
      "//button[contains(text(), 'Skip')]",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    if (skipButton) {
      skipButton.click();
      'Closed welcome dialog';
    } else {
      'No welcome dialog found';
    }
  `
})
```

#### Navigate to Pages

Use JavaScript evaluation for reliable navigation:

```text
// Navigate to Containers page
mcp__electron-test__evaluate({
  script: `
    document.querySelector('a[href="/containers"]').click();
    'Navigated to Containers';
  `
})

// Navigate to Images page
mcp__electron-test__evaluate({
  script: `
    document.querySelector('a[href="/images"]').click();
    'Navigated to Images';
  `
})

// Navigate to Settings
mcp__electron-test__evaluate({
  script: `
    const links = Array.from(document.querySelectorAll('a'));
    const settingsLink = links.find(link => link.textContent.includes('Settings'));
    if (settingsLink) {
      settingsLink.click();
      'Navigated to Settings';
    } else {
      'Settings link not found';
    }
  `
})

// Navigate to Extensions
mcp__electron-test__evaluate({
  script: `
    document.querySelector('a[href="/extensions"]').click();
    'Navigated to Extensions';
  `
})

// Navigate to Dashboard
mcp__electron-test__evaluate({
  script: `
    document.querySelector('a[href="/"]').click();
    'Navigated to Dashboard';
  `
})
```

#### Common Navigation URLs

Use these hrefs for direct navigation:

- Dashboard: `/`
- Containers: `/containers`
- Pods: `/pods`
- Images: `/images`
- Volumes: `/volumes`
- Networks: `/networks`
- Kubernetes: `/kubernetes`
- Extensions: `/extensions`

#### Check Page Content

```text
// Get current URL hash
mcp__electron-test__evaluate({
  script: `window.location.hash`
})

// Check for specific text
mcp__electron-test__evaluate({
  script: `
    document.body.innerText.includes('No Container Engine')
      ? 'No container engine configured'
      : 'Container engine available';
  `
})

// Count elements
mcp__electron-test__evaluate({
  script: `
    document.querySelectorAll('[data-testid*="container-card"]').length
  `
})
```

#### Take Screenshots

```text
// Full page screenshot
mcp__electron-test__screenshot({ fullPage: true })

// Viewport screenshot
mcp__electron-test__screenshot({ fullPage: false })
```

### Step 6: Clean Up

When finished testing, close the application and disconnect:

```text
// Close the Podman Desktop application window
mcp__electron-test__close()

// Disconnect from MCP
mcp__electron-test__disconnect()
```

> **Note (development mode):** In development mode (`pnpm watch`), `close()` shuts the Electron window but the watch process continues running. Stop it with Ctrl+C in the terminal when done.

## Selector Strategy

When interacting with elements, prefer in this order:

1. **ARIA roles and accessible names** (most stable — preferred for accessibility and test reliability)

   ```javascript
   document.querySelector('button[aria-label="Create"]').click()
   ```

2. **Text content / labels**

   ```javascript
   Array.from(document.querySelectorAll('button'))
     .find(b => b.textContent.includes('Pull')).click()
   ```

3. **data-testid attributes** (fallback when ARIA/text is insufficient)

   ```javascript
   document.querySelector('[data-testid="settings-button"]').click()
   ```

4. **JavaScript evaluation / generic CSS selectors** (last resort when nothing else works)

   ```javascript
   document.querySelector('a[href="/containers"]').click()
   ```

## Troubleshooting

### `pnpm: command not found`

pnpm is not installed. Install it:

```bash
npm install -g pnpm
# or via the official installer:
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Then re-open your terminal and verify with `pnpm --version`.

### `node_modules` Not Found / `pnpm install` Not Run

Symptoms: `pnpm watch` or `start-with-cdp.sh` exits immediately with a module resolution error.

```bash
pnpm install
```

This only needs to be done once after cloning (or after `package.json` changes).

### `pnpm compile:current` Fails with `flatpak-builder: command not found`

This error occurs at the very end of packaging (after the binary is already built) when
`flatpak-builder` is not installed. The usable binary is still produced:

```
dist/linux-unpacked/podman-desktop   ← this is built and works
```

You can safely ignore the error and proceed with `start-with-cdp.sh`.

### Connected to DevTools Instead of App

**Symptom:** `connect` returns `Window title: DevTools` instead of `Window title: Podman Desktop`.

**Cause:** The `electron-test` MCP tool picks the first available CDP target. Electron opens a
DevTools window alongside the app, and the tool consistently selects it first.

**Fix — close DevTools targets, then reconnect:**

1. Disconnect: `mcp__electron-test__disconnect()`
2. Run the close-DevTools command from Step 2 above
3. Reconnect: `mcp__electron-test__connect({ port: 9223 })` (or 9222 for production)

**If the app window is also broken** (empty/white — caused by launching a dev build without
a running Vite server): kill the process and restart properly.

- Kill: `pkill -f "podman-desktop --remote-debugging-port"`
- Restart with `pnpm watch` (port 9223) or via `start-with-cdp.sh` (port 9222)
- `start-with-cdp.sh` detects dev builds automatically and exits with clear instructions.

### Port Already in Use

_Linux/macOS:_

```bash
# Check what's using the port
lsof -i :9222
lsof -i :9223

# Kill the process
kill -9 <PID>
```

_Windows (PowerShell):_

```powershell
# Check what's using the port
netstat -ano | findstr :9222
netstat -ano | findstr :9223

# Kill the process by PID
Stop-Process -Id <PID> -Force
```

### Connection Timeout

1. Verify app is running: `ps aux | grep podman-desktop`
2. Check CDP endpoint: `curl http://localhost:9222/json/version`
3. Ensure firewall isn't blocking local ports
4. Try disconnecting and reconnecting

### App Running But Not Visible

This happens when the app is launched in background mode. You must launch it in the foreground:

```bash
# Linux/macOS — DON'T run with & or in background mode
bash .agents/skills/mcp-testing/start-with-cdp.sh
```

```powershell
# Windows — run directly in a PowerShell terminal
powershell -ExecutionPolicy Bypass -File .agents\skills\mcp-testing\start-with-cdp.ps1
```

### "Too Many Open Files" Error (Linux/macOS only)

Increase file descriptor limit:

```bash
# Temporary (current shell only)
ulimit -n 65536

# Permanent (add to ~/.bashrc or ~/.zshrc)
echo "ulimit -n 65536" >> ~/.bashrc
```

This issue does not occur on Windows.

### Welcome Dialog Won't Close

Use JavaScript evaluation instead of click:

```text
mcp__electron-test__evaluate({
  script: `
    document.evaluate("//button[contains(text(), 'Skip')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
      .singleNodeValue?.click();
  `
})
```

### MCP Tools Not Available

Check that `.mcp.json` exists at the repo root and restart Claude Code.

## Common Testing Patterns

### Full Navigation Test

```text
// 1. Connect
mcp__electron-test__connect({ port: 9222 })

// 2. Get initial state
mcp__electron-test__snapshot()

// 3. Close welcome dialog if present
mcp__electron-test__evaluate({
  script: `document.evaluate("//button[contains(text(), 'Skip')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue?.click()`
})

// 4. Navigate to each page
const pages = ['/containers', '/images', '/pods', '/volumes', '/extensions'];
for (const page of pages) {
  mcp__electron-test__evaluate({
    script: `document.querySelector('a[href="${page}"]').click(); 'Navigated to ${page}';`
  })

  // Wait a moment for page load
  mcp__electron-test__wait({ selector: 'main', timeout: 5000 })

  // Get snapshot
  mcp__electron-test__snapshot()
}

// 5. Close the app and disconnect
mcp__electron-test__close()
mcp__electron-test__disconnect()
```

### Verify Page Loaded

```text
// Wait for main content
mcp__electron-test__wait({ selector: 'main', state: 'visible', timeout: 5000 })

// Check heading matches expected page
mcp__electron-test__evaluate({
  script: `document.querySelector('h1')?.textContent || 'No heading found'`
})
```

### Check for Errors

```text
// Check for error messages in UI
mcp__electron-test__evaluate({
  script: `
    const errorElements = document.querySelectorAll('[role="alert"], .error, [class*="error"]');
    Array.from(errorElements).map(el => el.textContent).join(', ') || 'No errors found';
  `
})
```

## Quick Reference

### Essential MCP Commands

| Command                                              | Purpose                        |
| ---------------------------------------------------- | ------------------------------ |
| `mcp__electron-test__connect({ port: 9222 })`        | Connect to running app         |
| `mcp__electron-test__close()`                        | Close the application window   |
| `mcp__electron-test__disconnect()`                   | Disconnect from MCP            |
| `mcp__electron-test__snapshot()`                     | Get accessibility tree         |
| `mcp__electron-test__evaluate({ script: '...' })`    | Run JavaScript in renderer     |
| `mcp__electron-test__screenshot({ fullPage: true })` | Capture screenshot             |
| `mcp__electron-test__wait({ selector: 'main' })`     | Wait for element               |

### Common Scripts

```javascript
// Navigate
document.querySelector('a[href="/path"]').click()

// Get text
document.querySelector('h1')?.textContent

// Check visibility
document.querySelector('.element')?.offsetParent !== null

// Count elements
document.querySelectorAll('.item').length

// Find by text
Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Text'))?.click()
```

## Additional Resources

All MCP testing resources are in `.agents/skills/mcp-testing/`:

- **Full documentation:** `reference.md` - Comprehensive guide with selector strategies, common scenarios, and troubleshooting
- **Example commands:** `examples.md` - 500+ lines of ready-to-use MCP command examples for testing workflows
- **Helper scripts:** `start-with-cdp.sh` (Linux/macOS) and `start-with-cdp.ps1` (Windows) - Scripts to launch Podman Desktop with CDP enabled on port 9222
