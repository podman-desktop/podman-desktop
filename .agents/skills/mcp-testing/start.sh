#!/usr/bin/env bash
# start.sh — Start or connect to Podman Desktop for MCP testing.
# Requires --mode flag. Detection is handled by probe.sh; this script executes.
#
# Usage:
#   bash start.sh --mode dev          # full startup (clean, install, pnpm watch)
#   bash start.sh --mode dev-fast     # fast-path (pnpm watch already running)
#   bash start.sh --mode prod PORT    # connect to production CDP on PORT
#
# After exit 0, call mcp__podman-desktop-mcp__connect({ port: <PORT> }).

set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../" && pwd)"
DEV_PORT=9223

# VS Code (and other Electron-based editors) set ELECTRON_RUN_AS_NODE=1 in child
# processes. This makes the Electron binary run as plain Node.js, breaking the
# Electron API and Chromium flags like --remote-debugging-port. Unset it so that
# pnpm watch can spawn Electron properly.
unset ELECTRON_RUN_AS_NODE

cdp_ready() { curl -s "http://localhost:${1:-$DEV_PORT}/json/version" &>/dev/null; }
watch_running() { pgrep -f 'pnpm.*watch' &>/dev/null; }

cdp_healthy_title() {
  local port=${1:-$DEV_PORT}
  curl -s "http://localhost:$port/json" | node -e '
    const d = require("fs").readFileSync(0, "utf8");
    try {
      for (const t of JSON.parse(d)) {
        const u = (t.url || "").toLowerCase();
        const l = (t.title || "").toLowerCase();
        if (!u.includes("devtools") && l !== "devtools" && t.type === "page") {
          process.stdout.write(t.title || "unknown");
          process.exit(0);
        }
      }
    } catch {}
    process.exit(1);
  ' 2>/dev/null
}

close_devtools_targets() {
  local port=${1:-$DEV_PORT}
  local closed
  closed=$(curl -s "http://localhost:$port/json" | CDP_PORT=$port node -e '
    const d = require("fs").readFileSync(0, "utf8");
    const port = process.env.CDP_PORT;
    let closed = 0;
    (async () => {
      for (const t of JSON.parse(d)) {
        const u = (t.url || "").toLowerCase();
        const l = (t.title || "").toLowerCase();
        if (u.includes("devtools") || l === "devtools") {
          try { await fetch("http://localhost:" + port + "/json/close/" + t.id); closed++; } catch {}
        }
      }
      console.log(closed);
    })();
  ' 2>/dev/null || echo 0)
  if [[ "$closed" -gt 0 ]]; then
    echo "      Closed $closed DevTools target(s) — waiting 10s for rendering surface…"
    sleep 10
  fi
}

detect_production_pd() {
  case "$(uname -s)" in
    Darwin)
      pgrep -f "Podman Desktop.app/Contents" &>/dev/null
      ;;
    Linux)
      local found=false
      while IFS= read -r line; do
        if ! echo "$line" | grep -qE 'node_modules|pnpm|scripts/watch'; then
          found=true; break
        fi
      done < <(pgrep -af "podman-desktop" 2>/dev/null)
      $found
      ;;
    *)
      return 1
      ;;
  esac
}

# ── Argument parsing ─────────────────────────────────────────────────────────
MODE=""
PROD_PORT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)
      MODE="$2"; shift 2
      if [[ "$MODE" == "prod" && $# -gt 0 && "$1" != --* ]]; then
        PROD_PORT="$1"; shift
      fi
      ;;
    *)
      echo "Unknown argument: $1"; exit 1
      ;;
  esac
done

if [[ -z "$MODE" ]]; then
  echo "Usage:"
  echo "  bash start.sh --mode dev          # full startup"
  echo "  bash start.sh --mode dev-fast     # fast-path (already running)"
  echo "  bash start.sh --mode prod PORT    # connect to production CDP"
  exit 1
fi

# ── Mode: prod ───────────────────────────────────────────────────────────────
if [[ "$MODE" == "prod" ]]; then
  if [[ -z "$PROD_PORT" ]]; then
    echo "ERROR: --mode prod requires a PORT argument"
    exit 1
  fi

  if ! cdp_ready "$PROD_PORT"; then
    echo "ERROR: No CDP response on port $PROD_PORT"
    exit 1
  fi

  app_title=$(cdp_healthy_title "$PROD_PORT") || {
    echo "ERROR: CDP on port $PROD_PORT has no healthy app window"
    exit 1
  }

  echo "Connected to production Podman Desktop — $app_title (port $PROD_PORT)"
  echo "Ready — call mcp__podman-desktop-mcp__connect({ port: $PROD_PORT })"
  exit 0
fi

# ── Mode: dev-fast ───────────────────────────────────────────────────────────
if [[ "$MODE" == "dev-fast" ]]; then
  if ! watch_running; then
    echo "ERROR: pnpm watch is not running"
    exit 1
  fi

  if ! cdp_ready; then
    echo "ERROR: pnpm watch is running but CDP is not available on port $DEV_PORT"
    exit 1
  fi

  app_title=$(cdp_healthy_title) || {
    echo "ERROR: CDP on port $DEV_PORT has no healthy app window — restart pnpm watch"
    exit 1
  }

  close_devtools_targets

  echo "pnpm watch already running — $app_title"
  echo "Ready — call mcp__podman-desktop-mcp__connect({ port: $DEV_PORT })"
  exit 0
fi

# ── Mode: dev (full startup) ────────────────────────────────────────────────
if [[ "$MODE" != "dev" ]]; then
  echo "ERROR: Unknown mode '$MODE'. Use: dev, dev-fast, or prod"
  exit 1
fi

# Kill any existing dev instance on the dev CDP port
echo "[1/4] Stopping any running dev instance…"
if lsof -ti :$DEV_PORT &>/dev/null; then
  kill $(lsof -ti :$DEV_PORT) 2>/dev/null || true
  echo "      Stopped process on port $DEV_PORT"
fi

# Wait up to 5s for port to drain
for i in $(seq 1 5); do
  cdp_ready || break
  sleep 1
done

if cdp_ready; then
  echo "ERROR: Port $DEV_PORT is still in use (not by pnpm watch) — stop it manually:"
  echo "  lsof -ti :$DEV_PORT | xargs kill"
  exit 1
fi
echo "      Port $DEV_PORT is free"

# Clean stale artifacts
echo "[2/4] Cleaning stale artifacts…"
rm -rf "$REPO/node_modules"
echo "      Removed node_modules/"
dist_count=0
while IFS= read -r d; do
  rm -rf "$d"
  dist_count=$((dist_count + 1))
done < <(find "$REPO/packages" "$REPO/extensions" -maxdepth 4 -name dist -type d 2>/dev/null)
echo "      Removed $dist_count dist/ folder(s)"

# Install deps (timeout after 5 minutes)
echo "[3/4] Installing dependencies…"
pnpm --dir "$REPO" install &
INSTALL_PID=$!
( sleep 300 && kill $INSTALL_PID 2>/dev/null ) &
TIMER_PID=$!
if wait $INSTALL_PID 2>/dev/null; then
  kill $TIMER_PID 2>/dev/null; wait $TIMER_PID 2>/dev/null
  echo "      Dependencies up to date"
else
  kill $TIMER_PID 2>/dev/null; wait $TIMER_PID 2>/dev/null
  echo "ERROR: pnpm install failed or timed out after 5 minutes"
  exit 1
fi

# Launch pnpm watch and wait for CDP
echo "[4/4] Launching pnpm watch (output → /tmp/pnpm-watch.log)…"
pnpm --dir "$REPO" watch &>/tmp/pnpm-watch.log &
echo "      pnpm watch started (pid $!)"

echo "      Waiting for CDP on port ${DEV_PORT}..."
for i in $(seq 1 120); do
  if cdp_ready; then
    echo "      CDP ready after ${i}s"
    break
  fi
  sleep 1
done
if ! cdp_ready; then
  echo "ERROR: App did not expose CDP within 120s"
  if detect_production_pd; then
    echo "HINT: A production Podman Desktop is running — it holds the"
    echo "      single-instance lock, preventing the dev instance from starting."
    echo "      Either close it, or relaunch it with CDP:"
    echo "        podman-desktop --remote-debugging-port=9222"
  fi
  tail -20 /tmp/pnpm-watch.log
  exit 1
fi

close_devtools_targets

echo "Ready — call mcp__podman-desktop-mcp__connect({ port: $DEV_PORT })"
