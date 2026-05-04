---
name: mcp-testing
description: >-
  Interactive testing of Podman Desktop UI using the electron-test MCP server.
  Supports both production (installed app) and development (pnpm watch) modes.
  Use for manually testing UI workflows, debugging UI issues, exploring features,
  or quick acceptance testing.
---

# Podman Desktop MCP Testing

Interactively test and explore Podman Desktop through automated browser commands, connected via Chrome DevTools Protocol (CDP).

## When to use this skill

- Manually testing Podman Desktop UI changes during development
- Testing the production (installed) Podman Desktop app
- Debugging specific user workflows or UI issues
- Exploring new features interactively
- Verifying functionality without writing test code
- Quick acceptance testing

## Prerequisites

- MCP server `podman-desktop-mcp` configured via `.mcp.json` at the repo root (already done)
- For dev mode: Node.js 24+ and pnpm 10+ installed
- For production mode: Podman Desktop installed

## Workflow

### Phase 1: Detect Environment

> **Always run detection yourself. Never ask the user to run scripts manually.**

Detect the OS — run `uname -s` via the Bash tool:

- Returns `Darwin` → macOS
- Returns `Linux` → Linux
- Starts with `MINGW`, `MSYS`, or `CYGWIN` → Windows (Git Bash)
- Command unavailable or unrecognized → Windows (native PowerShell)

Run the probe script to detect what's running:

**Linux / macOS:**

```bash
bash .agents/skills/mcp-testing/probe.sh
```

**Windows:**

```bash
pwsh .agents/skills/mcp-testing/probe.ps1
```

Parse the key=value output. You will get eleven variables:

- `PROD_RUNNING` — whether a production (installed) Podman Desktop is running
- `PROD_CDP_PORT` — CDP port for production (`none` if CDP not available)
- `PROD_APP_TITLE` — window title of production app (`none` if not available)
- `DEV_RUNNING` — whether `pnpm watch` is running
- `DEV_CDP_PORT` — CDP port for dev (`none` if not available)
- `DEV_APP_TITLE` — window title of dev app (`none` if not available)
- `STALE_SESSION` — `true` if a previous session left a state file without cleaning up
- `PORT_9222_NAME` / `PORT_9222_PID` — process on port 9222 (`none` if free)
- `PORT_9223_NAME` / `PORT_9223_PID` — process on port 9223 (`none` if free)

**Stale session:** If `STALE_SESSION=true`, run the stop script immediately — no confirmation needed — then re-run the probe to get fresh state:

**Linux / macOS:**

```bash
bash .agents/skills/mcp-testing/stop.sh
```

**Windows:**

```powershell
pwsh .agents/skills/mcp-testing/stop.ps1
```

**Port conflict:** For each port where `PORT_<port>_NAME` is not `none`, `electron`, `node`, or `Podman Desktop`, use `AskUserQuestion`:

- **Question:** `Port {PORT} is in use by "{NAME}" (PID {PID}), which doesn't look like Podman Desktop. Kill it to free the port?`
- **Header:** `Port conflict`
- **Options:**
  1. `Kill it` — Stop the process and free the port
  2. `Skip` — Leave it running (choose a different mode or abort)

If the user chooses "Kill it", kill the process using the PID from the probe output:

**Linux / macOS:** `kill <PID>`
**Windows:** `Stop-Process -Id <PID> -Force`

If the user chooses Skip and neither port is usable, report the conflict and stop — do not run the start script.

### Phase 2: Choose Mode

**Always ask the user which mode to use.** Use `AskUserQuestion` with options based on the probe results. Annotate each option with its current status.

**Build the options based on probe output:**

**Production mode option:**

- If `PROD_RUNNING=true` and `PROD_CDP_PORT` is not `none`:
  Label: `Production mode`
  Description: `Connect to installed Podman Desktop on port {PROD_CDP_PORT} — changes affect your real environment`

- If `PROD_RUNNING=true` and `PROD_CDP_PORT=none`:
  Label: `Production mode`
  Description: `Will relaunch Podman Desktop with CDP enabled — changes affect your real environment`

- If `PROD_RUNNING=false`:
  Label: `Production mode`
  Description: `Will launch Podman Desktop with CDP enabled — changes affect your real environment`

**Dev mode option:**

- If `DEV_RUNNING=true` and `DEV_CDP_PORT` is not `none`:
  Label: `Dev mode`
  Description: `pnpm watch already running on port {DEV_CDP_PORT} — instant connect`

- If `DEV_RUNNING=true` and `DEV_CDP_PORT=none`:
  Label: `Dev mode`
  Description: `pnpm watch is running but CDP is not responding — will restart pnpm watch`

- If `DEV_RUNNING=false` and `PROD_RUNNING=false`:
  Label: `Dev mode`
  Description: `Start pnpm watch for isolated development testing (2-4 minutes first run)`

- If `DEV_RUNNING=false` and `PROD_RUNNING=true`:
  Label: `Dev mode`
  Description: `Will close production app first, then start pnpm watch (2-4 minutes)`

Use the `AskUserQuestion` tool with header `Mode` and these two options. The question should be: `Which mode would you like to use for testing?`

### Phase 3: Start and Connect

Based on the chosen mode and probe results, prepare the app and run the startup script.

#### Production mode

Run the startup script — it handles detecting the current state (including stopping any dev instance that holds the single-instance lock), relaunching with CDP if needed, waiting for the app, and verifying the connection:

**Linux / macOS:**

```bash
bash .agents/skills/mcp-testing/start.sh --mode prod
```

**Windows:**

```powershell
pwsh .agents/skills/mcp-testing/start.ps1 -Mode prod
```

#### Dev mode

**If `DEV_RUNNING=true` and `DEV_CDP_PORT` is not `none`** (already running):

```bash
bash .agents/skills/mcp-testing/start.sh --mode dev-fast
```

```powershell
pwsh .agents/skills/mcp-testing/start.ps1 -Mode dev-fast
```

**If `DEV_RUNNING=true` and `DEV_CDP_PORT=none`** (pnpm watch alive but CDP not responding — treat as full restart):

Use `--mode dev` (not `dev-fast`). The start script will kill the stale process and restart cleanly.

**If `DEV_RUNNING=false`** (full startup) — set Bash tool timeout to `600000` (10 minutes):

```bash
bash .agents/skills/mcp-testing/start.sh --mode dev
```

```powershell
pwsh .agents/skills/mcp-testing/start.ps1 -Mode dev
```

#### Error handling

If the start script exits with a non-zero code, report the error output to the user and refer to the **Troubleshooting** section below. Common failures:

- Port still in use → suggest killing the process manually
- `pnpm install` timeout → check network connectivity
- CDP not available within 120s → check for single-instance lock (see Troubleshooting)

Do not retry the script automatically — let the user decide after seeing the error.

#### Connect and verify (both modes)

When the start script prints `Ready — call mcp__podman-desktop-mcp__connect(...)`, extract the port number from that line and connect:

```text
mcp__podman-desktop-mcp__connect({ port: PORT })
```

After connecting, check the window title:

```text
mcp__podman-desktop-mcp__evaluate({ script: "document.title" })
```

The result should contain "Podman Desktop". If it contains "DevTools":

1. Disconnect immediately: `mcp__podman-desktop-mcp__disconnect()`
2. Re-run the startup script — it closes any DevTools targets automatically via `close_devtools_targets`, then reconnect.

### Phase 4: Initial Setup (automatic)

After connecting, perform these steps automatically without asking:

**1. Handle Onboarding Dialog** (appears on first launch — disable telemetry but do NOT close it):

```text
mcp__podman-desktop-mcp__evaluate({
  script: `
    const skipButton = Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.trim() === 'Skip');
    if (skipButton) {
      const telemetry = document.querySelector('input[aria-label="Enable telemetry"]');
      if (telemetry?.checked) telemetry.click();
      'Onboarding dialog present — telemetry disabled (dialog left open for testing)';
    } else {
      'No onboarding dialog found';
    }
  `
})
```

> **Do not close the onboarding dialog automatically.** Some test scenarios need to interact with it. The task in Phase 5 will decide whether to skip it or test it.

**2. Close Feedback Dialog** (appears after onboarding is completed — safe to run when absent):

```text
mcp__podman-desktop-mcp__evaluate({
  script: `
    const dialog = document.querySelector('[role="dialog"][aria-label="Share your feedback"]');
    if (dialog) {
      dialog.querySelector('button[aria-label="Close"]')?.click();
      'Closed feedback dialog';
    } else {
      'No feedback dialog';
    }
  `
})
```

**3. Take Initial Snapshot:**

```text
mcp__podman-desktop-mcp__snapshot()
```

Summarize what's visible on the current page to the user (including whether the onboarding dialog is showing).

### Phase 5: Execute Task

Execute the task provided when the skill was invoked. The task can be anything — exploring a page, testing a feature, verifying a workflow, checking UI state, etc. Work autonomously:

- Use MCP tools (`snapshot`, `screenshot`, `evaluate`, `click`, `getText`, etc.) as needed — don't ask permission for individual actions.
- Take screenshots and snapshots at your own judgment to verify state and gather information.
- If something fails or is unexpected, investigate and retry before giving up.
- When the task is complete, summarize what you found or did.

**After completing the task**, use `AskUserQuestion`:

- **Question:** `What would you like to do next?`
- **Header:** `Next`
- **Options:**
  1. `Continue testing` — Provide another task (user enters free text via "Other")
  2. `Done — finish testing` — Disconnect and clean up

If the user continues, execute the new task the same way and ask again when done. If done, proceed to Phase 6.

### Phase 6: Cleanup

**Step 1 — Disconnect from MCP:**

```text
mcp__podman-desktop-mcp__disconnect()
```

**Step 2 — Ask about the app:**

Use `AskUserQuestion`:

- **Question:** `Disconnected from MCP. What should I do with the app?`
- **Header:** `Cleanup`
- **Options:**
  1. `Leave running` — Keep the app alive so you can reconnect later
  2. `Close it` — Stop the app and free the port

If the user chooses **"Leave running"** — remove the session file so the next invocation finds the app cleanly via probe (no process killing):

**Linux / macOS:** `bash .agents/skills/mcp-testing/stop.sh --session-only`
**Windows:** `pwsh .agents/skills/mcp-testing/stop.ps1 -SessionOnly`

If the user chooses **"Close it"** — run the stop script, which reads the session state and kills the right processes:

**Linux / macOS:**

```bash
bash .agents/skills/mcp-testing/stop.sh
```

**Windows:**

```powershell
pwsh .agents/skills/mcp-testing/stop.ps1
```

## Selector Strategy

When interacting with elements, prefer in this order:

1. **ARIA roles and accessible names** (most stable)

   ```javascript
   document.querySelector('button[aria-label="Create"]').click();
   ```

2. **Text content**

   ```javascript
   Array.from(document.querySelectorAll('button'))
     .find(b => b.textContent.includes('Pull'))
     .click();
   ```

3. **data-testid attributes**

   ```javascript
   document.querySelector('[data-testid="help-menu"]').click();
   ```

4. **CSS / href selectors** (last resort)

   ```javascript
   document.querySelector('a[href="/containers"]').click();
   ```

## Common Navigation URLs

- Dashboard: `/`
- Containers: `/containers`
- Pods: `/pods`
- Images: `/images`
- Volumes: `/volumes`
- Networks: `/networks`
- Kubernetes: `/kubernetes`
- Extensions: `/extensions`

Navigate using JavaScript evaluation:

```text
mcp__podman-desktop-mcp__evaluate({
  script: `document.querySelector('a[href="/containers"]').click(); 'Navigated to Containers';`
})
```

## Troubleshooting

### `pnpm: command not found`

```bash
npm install -g pnpm
```

Then re-open your terminal and verify with `pnpm --version`.

### Connected to DevTools Instead of App

**Symptom:** `connect` returns `Window title: DevTools`.

**Fix:**

1. `mcp__podman-desktop-mcp__disconnect()`
2. Re-run the startup script for your mode — it closes DevTools targets automatically via `close_devtools_targets`
3. `mcp__podman-desktop-mcp__connect({ port: PORT })`

### Production App Without CDP

**Symptom:** Probe shows `PROD_RUNNING=true` but `PROD_CDP_PORT=none`.

**Cause:** The production app was launched without the `--remote-debugging-port` flag.

**Fix:** Run `start.sh --mode prod` (or `start.ps1 -Mode prod`) — it detects this case automatically, closes the running app, and relaunches it with CDP enabled.

### Production Blocks Dev Instance

`start.sh --mode dev` (and `start.ps1 -Mode dev`) automatically detects and closes a running production Podman Desktop before starting the dev instance — no manual action is needed.

**If startup still times out after 120s:** the production app may have restarted in the gap between detection and the kill, or a non-Podman-Desktop process holds port 9222. Run the stop script, verify port 9222 is free (`lsof -ti :9222`), then re-run the start script.

### MCP Tools Become Unavailable Mid-Session

**Symptom:** `mcp__podman-desktop-mcp__*` tools return errors.

**Do not ask the user to restart the MCP server.** Try reconnecting:

```text
mcp__podman-desktop-mcp__connect({ port: PORT })
```

If the port is gone, re-run the startup script.

### Element Not Found

1. Use `snapshot()` to see current page structure
2. Wait for page load: `mcp__podman-desktop-mcp__wait({ selector: 'main', timeout: 5000 })`
3. Check if element is in a different frame or webview

### Test Isolation (dev mode)

Each `pnpm watch` session uses the same user data directory. For a clean state:

```bash
PODMAN_DESKTOP_HOME_DIR=/tmp/pd-dev-test pnpm watch
```

### "Too Many Open Files" Error (dev mode)

```bash
ulimit -n 65536
```

Add to `~/.bashrc` or `~/.zshrc` to make it permanent.

## Quick Reference

| Command                                                   | Purpose                                        |
| --------------------------------------------------------- | ---------------------------------------------- |
| `bash probe.sh`                                           | Detect environment (what's running, CDP ports) |
| `bash start.sh --mode dev`                                | Full dev startup                               |
| `bash start.sh --mode dev-fast`                           | Fast-path (dev already running)                |
| `bash start.sh --mode prod`                               | Launch/connect production app                  |
| `mcp__podman-desktop-mcp__connect({ port: PORT })`        | Connect to app                                 |
| `mcp__podman-desktop-mcp__disconnect()`                   | Disconnect from MCP                            |
| `mcp__podman-desktop-mcp__snapshot()`                     | Get accessibility tree                         |
| `mcp__podman-desktop-mcp__evaluate({ script: '...' })`    | Run JavaScript in renderer                     |
| `mcp__podman-desktop-mcp__screenshot({ fullPage: true })` | Capture screenshot                             |

## Additional Resources

- **Example commands and selectors:** `examples.md` — Ready-to-use MCP command examples and selectors reference derived from Playwright Page Object Models
