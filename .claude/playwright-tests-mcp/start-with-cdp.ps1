# Start Podman Desktop with Chrome DevTools Protocol (CDP) enabled for MCP testing
#
# This script launches the compiled Podman Desktop binary with:
# - CDP enabled on port 9222 (different from dev port 9223)
# - Isolated test environment in %TEMP% to prevent data pollution
#
# Usage (from repo root):
#   powershell -ExecutionPolicy Bypass -File .claude\playwright-tests-mcp\start-with-cdp.ps1
#
# Prerequisites:
#   - Compiled binary must exist (run: pnpm compile:current)

$BINARY_PATH = "dist\win-unpacked\Podman Desktop.exe"

# Check if binary exists
if (-not (Test-Path $BINARY_PATH)) {
    Write-Error "Binary not found at: $BINARY_PATH"
    Write-Host ""
    Write-Host "Please compile the binary first:"
    Write-Host "  pnpm compile:current"
    exit 1
}

# Create isolated test directory with timestamp
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$TEST_HOME = "$env:TEMP\pd-mcp-test-$timestamp"
New-Item -ItemType Directory -Force -Path $TEST_HOME | Out-Null

Write-Host "========================================"
Write-Host "Podman Desktop - MCP Testing Mode"
Write-Host "========================================"
Write-Host ""
Write-Host "Binary:    $BINARY_PATH"
Write-Host "Test Home: $TEST_HOME"
Write-Host "CDP Port:  9222"
Write-Host ""
Write-Host "To connect via MCP in Claude:"
Write-Host "  'Connect to Podman Desktop using CDP at http://localhost:9222'"
Write-Host ""
Write-Host "Press Ctrl+C to stop..."
Write-Host "========================================"
Write-Host ""

# Launch binary with CDP and isolated test directory
$env:PODMAN_DESKTOP_HOME_DIR = $TEST_HOME
& "$BINARY_PATH" --remote-debugging-port=9222
