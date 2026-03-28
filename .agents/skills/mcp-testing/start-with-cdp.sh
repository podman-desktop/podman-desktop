#!/usr/bin/env bash
# Start Podman Desktop with Chrome DevTools Protocol (CDP) enabled for MCP testing
#
# This script launches the compiled Podman Desktop binary with:
# - CDP enabled on port 9222 (different from dev port 9223)
# - Isolated test environment in /tmp to prevent data pollution
#
# Usage (from repo root):
#   bash .agents/skills/mcp-testing/start-with-cdp.sh
#
# Prerequisites:
#   - Compiled binary must exist (run: pnpm compile:current)
#   - On macOS (arm64), binary must be signed (run: codesign --force --deep --sign - "dist/mac-arm64/Podman Desktop.app")

set -euo pipefail

# ── Preflight checks ─────────────────────────────────────────────────────────

# 1. pnpm must be available
if ! command -v pnpm &>/dev/null; then
  echo "Error: pnpm not found."
  echo ""
  echo "Install it with:"
  echo "  npm install -g pnpm"
  echo "  # or: curl -fsSL https://get.pnpm.io/install.sh | sh -"
  exit 1
fi

# 2. Dependencies must be installed (node_modules is the proxy for `pnpm install`)
if [[ ! -d "node_modules" ]]; then
  echo "Error: node_modules not found — run 'pnpm install' first."
  echo ""
  echo "  pnpm install"
  exit 1
fi

# ─────────────────────────────────────────────────────────────────────────────

# Determine platform and binary path
PLATFORM="$(uname -s | tr '[:upper:]' '[:lower:]')"
BINARY_PATH=""
RESOURCES_DIR=""

case "$PLATFORM" in
  linux)
    BINARY_PATH="dist/linux-unpacked/podman-desktop"
    RESOURCES_DIR="dist/linux-unpacked/resources"
    ;;
  darwin)
    ARCH="$(uname -m)"
    if [[ "$ARCH" == "arm64" ]]; then
      BINARY_PATH="dist/mac-arm64/Podman Desktop.app/Contents/MacOS/Podman Desktop"
      RESOURCES_DIR="dist/mac-arm64/Podman Desktop.app/Contents/Resources"
    else
      BINARY_PATH="dist/mac/Podman Desktop.app/Contents/MacOS/Podman Desktop"
      RESOURCES_DIR="dist/mac/Podman Desktop.app/Contents/Resources"
    fi
    ;;
  *)
    echo "Error: Unsupported platform: $PLATFORM"
    exit 1
    ;;
esac

# Check if binary exists and is executable
if [[ ! -f "$BINARY_PATH" && ! -d "$BINARY_PATH" ]]; then
  echo "Error: Binary not found at: $BINARY_PATH"
  echo ""
  echo "Build and compile the binary first:"
  echo "  pnpm compile:current"
  if [[ "$PLATFORM" == "darwin" ]]; then
    echo ""
    echo "On macOS, also sign the binary after compiling:"
    echo "  codesign --force --deep --sign - \"dist/mac-arm64/Podman Desktop.app\""
  fi
  echo ""
  echo "Alternatively, skip compilation and use development mode instead:"
  echo "  ulimit -n 65536 && pnpm watch"
  echo "  # Then connect with: mcp__electron-test__connect({ port: 9223 })"
  exit 1
fi

if [[ ! -x "$BINARY_PATH" ]]; then
  echo "Error: Binary is not executable: $BINARY_PATH"
  echo ""
  echo "Fix with:"
  echo "  chmod +x \"$BINARY_PATH\""
  exit 1
fi

# Detect dev vs production build by checking if the bundled app references localhost:5173.
# Dev builds load the renderer from the Vite dev server; production builds use bundled files.
ASAR_PATH="${RESOURCES_DIR}/app.asar"
IS_DEV_BUILD=false

if [[ -f "$ASAR_PATH" ]]; then
  if grep -qc "localhost:5173" "$ASAR_PATH" 2>/dev/null; then
    IS_DEV_BUILD=true
  fi
fi

if [[ "$IS_DEV_BUILD" == "true" ]]; then
  echo "========================================"
  echo "  WARNING: Dev build detected"
  echo "========================================"
  echo ""
  echo "The binary at '$BINARY_PATH' is a development build."
  echo "It loads the UI from the Vite dev server (localhost:5173)."
  echo ""
  echo "Is the Vite dev server running on port 5173?"
  if curl -s http://localhost:5173 --max-time 2 >/dev/null 2>&1; then
    echo "  YES — continuing (note: prefer 'pnpm watch' on port 9223 for dev testing)"
    echo ""
  else
    echo "  NO — the app window will be empty (ERR_CONNECTION_REFUSED)."
    echo ""
    echo "  Options:"
    echo "    1. Use 'pnpm watch' instead (starts Vite + Electron, CDP on port 9223)"
    echo "       ulimit -n 65536 && pnpm watch"
    echo ""
    echo "    2. Recompile as a production build, then re-run this script:"
    echo "       pnpm compile:current"
    echo ""
    exit 1
  fi
fi

# Create isolated test directory with timestamp
TEST_HOME="/tmp/pd-mcp-test-$(date +%s)"
mkdir -p "$TEST_HOME"

echo "========================================"
echo "Podman Desktop - MCP Testing Mode"
echo "========================================"
echo ""
echo "Binary:       $BINARY_PATH"
echo "Test Home:    $TEST_HOME"
echo "CDP Port:     9222"
echo ""
echo "To connect via MCP in Claude:"
echo "  'Connect to Podman Desktop using CDP at http://localhost:9222'"
echo ""
echo "Press Ctrl+C to stop..."
echo "========================================"
echo ""

# Launch binary with CDP and isolated test directory
PODMAN_DESKTOP_HOME_DIR="$TEST_HOME" \
  "$BINARY_PATH" --remote-debugging-port=9222
