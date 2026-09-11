#!/usr/bin/env bash
# stop.sh — Stop everything started by the mcp-testing skill.
# Reads the session file in this user's private state directory (see
# MCP_STATE_DIR below) to determine what to kill.
# Safe to run even if nothing is running.

set -euo pipefail

# Must match the private, per-user directory start.sh creates (0700, owned by
# this uid) — a fixed /tmp/mcp-testing-session path was world-writable, so a
# local attacker could pre-create it with a second line that ends up in the
# `rm -rf "$WATCH_DIR"` below.
MCP_STATE_DIR="${TMPDIR:-/tmp}/mcp-testing-$(id -u)"
STATE="$MCP_STATE_DIR/session"
DEV_PORT=9223

SESSION_ONLY=false
for arg in "$@"; do
  [ "$arg" = "--session-only" ] && SESSION_ONLY=true
done

if $SESSION_ONLY; then
  rm -f "$STATE"
  echo "Session file removed — app left running"
  exit 0
fi

# Only trust $STATE if the directory holding it is a real (non-symlinked)
# directory this user actually owns with the expected restrictive mode.
MODE=""
WATCH_DIR=""
if [ -d "$MCP_STATE_DIR" ] && [ ! -L "$MCP_STATE_DIR" ] && [ -f "$STATE" ]; then
  owner_uid=$(stat -c %u "$MCP_STATE_DIR" 2>/dev/null || stat -f %u "$MCP_STATE_DIR" 2>/dev/null || echo -1)
  perms=$(stat -c %a "$MCP_STATE_DIR" 2>/dev/null || stat -f %Lp "$MCP_STATE_DIR" 2>/dev/null || echo 000)
  if [ "$owner_uid" = "$(id -u)" ] && [ "$perms" = "700" ]; then
    MODE=$(sed -n '1p' "$STATE" | tr -d '[:space:]')
    WATCH_DIR=$(sed -n '2p' "$STATE")
  else
    echo "WARNING: $MCP_STATE_DIR is not a private directory you own — ignoring session state" >&2
  fi
fi

case "$MODE" in
  dev)
    echo "Stopping dev session…"

    # Kill pnpm watch process tree via the PID file in this session's private
    # watch directory (see start.sh — the directory's location is recorded as
    # the second line of $STATE)
    if [ -n "$WATCH_DIR" ] && [ -f "$WATCH_DIR/pnpm-watch.pid" ]; then
      PID=$(cat "$WATCH_DIR/pnpm-watch.pid")
      kill "$PID" 2>/dev/null || true
      echo "  Killed pnpm watch (pid $PID)"
    fi

    # Kill any remaining pnpm watch processes (catches children not in PID file)
    pkill -f 'pnpm.*watch' 2>/dev/null || true

    # Kill the Electron app listening on the dev CDP port
    if command -v lsof &>/dev/null; then
      ELECTRON_PIDS=$(lsof -ti :"$DEV_PORT" 2>/dev/null || true)
      if [ -n "$ELECTRON_PIDS" ]; then
        echo "$ELECTRON_PIDS" | xargs kill 2>/dev/null || true
        echo "  Killed Electron on port $DEV_PORT"
      fi
    fi

    [ -n "$WATCH_DIR" ] && [ -d "$WATCH_DIR" ] && rm -rf "$WATCH_DIR"
    ;;

  prod)
    echo "Stopping production session…"

    case "$(uname -s)" in
      Darwin)
        osascript -e 'quit app "Podman Desktop"' 2>/dev/null || true
        ;;
      Linux)
        flatpak kill io.podman_desktop.PodmanDesktop 2>/dev/null || true
        pkill -x podman-desktop 2>/dev/null || true
        ;;
    esac
    echo "  Production app stopped"
    ;;

  "")
    echo "No active session found ($STATE not present)"
    ;;

  *)
    echo "Unknown mode '$MODE' in $STATE — skipping process kill"
    ;;
esac

rm -f "$STATE"
echo "Cleanup complete"
