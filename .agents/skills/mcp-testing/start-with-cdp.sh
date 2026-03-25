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
#   - On macOS, binary must be signed (see error output for the correct path based on your architecture)

set -euo pipefail

# Determine platform and binary path
PLATFORM="$(uname -s | tr '[:upper:]' '[:lower:]')"
BINARY_PATH=""

case "$PLATFORM" in
  linux)
    BINARY_PATH="dist/linux-unpacked/podman-desktop"
    ;;
  darwin)
    ARCH="$(uname -m)"
    if [[ "$ARCH" == "arm64" ]]; then
      BINARY_PATH="dist/mac-arm64/Podman Desktop.app/Contents/MacOS/Podman Desktop"
    else
      BINARY_PATH="dist/mac/Podman Desktop.app/Contents/MacOS/Podman Desktop"
    fi
    ;;
  *)
    echo "Error: Unsupported platform: $PLATFORM"
    exit 1
    ;;
esac

# Check if binary exists
if [[ ! -f "$BINARY_PATH" && ! -d "$BINARY_PATH" ]]; then
  echo "Error: Binary not found at: $BINARY_PATH"
  echo ""
  echo "Please compile the binary first:"
  echo "  pnpm compile:current"
  if [[ "$PLATFORM" == "darwin" ]]; then
    echo ""
    echo "On macOS, also sign the binary:"
    if [[ "$(uname -m)" == "arm64" ]]; then
      echo "  codesign --force --deep --sign - \"dist/mac-arm64/Podman Desktop.app\""
    else
      echo "  codesign --force --deep --sign - \"dist/mac/Podman Desktop.app\""
    fi
  fi
  exit 1
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
