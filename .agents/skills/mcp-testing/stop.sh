#!/usr/bin/env bash
# stop.sh — Stop everything started by the mcp-testing skill.
# Reads the session file in this user's private state directory (see
# MCP_STATE_DIR below) to determine what to kill.
# Safe to run even if nothing is running.

set -euo pipefail

# Must match the private, per-user directory start.sh creates (0700, owned by
# this uid) - a fixed /tmp/mcp-testing-session path was world-writable, so a
# local attacker could pre-create it with a second line that ends up in the
# `rm -rf "$WATCH_DIR"` below.
MCP_STATE_DIR="${XDG_RUNTIME_DIR:-${TMPDIR:-/tmp}}/mcp-testing-$(id -u)"
STATE="$MCP_STATE_DIR/session"
DEV_PORT=9223

# Print every descendant of PID $1, deepest first. Keep in sync with start.sh.
list_descendants() {
  local child
  for child in $(pgrep -P "$1" 2>/dev/null || true); do
    list_descendants "$child"
    echo "$child"
  done
}

# Stop PID $1 and everything it spawned, and nothing else. pnpm does not
# forward SIGTERM to the script it runs, and scripts/watch.mjs starts Electron
# and svelte-package detached, so neither name matching nor process groups
# reach them; parent PIDs do. Keep in sync with stop_pnpm_watch in start.sh.
stop_process_tree() {
  local pids p i alive
  pids="$(list_descendants "$1") $1"
  for p in $pids; do
    kill -TERM "$p" 2>/dev/null || true
  done
  for i in $(seq 1 10); do
    alive=false
    for p in $pids; do
      if kill -0 "$p" 2>/dev/null; then alive=true; fi
    done
    if [ "$alive" = false ]; then break; fi
    sleep 1
  done
  for p in $pids; do
    kill -0 "$p" 2>/dev/null && kill -KILL "$p" 2>/dev/null || true
  done
}

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
    echo "WARNING: $MCP_STATE_DIR is not a private directory you own - ignoring session state" >&2
  fi
fi

case "$MODE" in
  dev)
    echo "Stopping dev session…"

    # Stop the pnpm watch tree recorded in this session's private watch
    # directory (see start.sh - the directory's location is the second line of
    # $STATE). Only that tree is touched, never other pnpm watch processes.
    if [ -n "$WATCH_DIR" ] && [ -f "$WATCH_DIR/pnpm-watch.pid" ]; then
      PID=$(sed -n '1p' "$WATCH_DIR/pnpm-watch.pid")
      STARTED=$(sed -n '2p' "$WATCH_DIR/pnpm-watch.pid")
      # Only act on the recorded PID if it is still the process start.sh
      # launched: a PID can be reused by an unrelated process after the
      # watcher exits, and the whole tree below it would be stopped.
      if [[ "$PID" =~ ^[0-9]+$ ]] && [ -n "$STARTED" ] \
        && [ "$(ps -o lstart= -p "$PID" 2>/dev/null | sed 's/^ *//; s/ *$//')" = "$STARTED" ]; then
        stop_process_tree "$PID"
        echo "  Stopped pnpm watch (pid $PID)"
      else
        echo "  Recorded pnpm watch (pid $PID) is no longer the watcher start.sh launched, leaving it alone"
      fi
    fi

    # Kill the Electron app listening on the dev CDP port. This covers a
    # watcher start.sh did not launch (--mode dev-fast on one started by hand):
    # watch.mjs exits when its Electron does, and takes its children with it.
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
