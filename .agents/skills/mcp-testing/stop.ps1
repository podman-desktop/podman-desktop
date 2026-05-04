# stop.ps1 — Stop everything started by the mcp-testing skill.
# Reads $env:TEMP\mcp-testing-session to determine what to kill.
# Safe to run even if nothing is running.

param(
    [switch]$SessionOnly
)

if ($SessionOnly) {
    Remove-Item "$env:TEMP\mcp-testing-session" -ErrorAction SilentlyContinue
    Write-Host "Session file removed — app left running"
    exit 0
}

$StateFile = "$env:TEMP\mcp-testing-session"
$DevPort = 9223

$Mode = ""
if (Test-Path $StateFile) {
    $Mode = (Get-Content $StateFile -Raw).Trim()
}

switch ($Mode) {
    "dev" {
        Write-Host "Stopping dev session..."

        # Kill Electron app listening on the dev CDP port
        $conn = Get-NetTCPConnection -LocalPort $DevPort -State Listen -ErrorAction SilentlyContinue
        if ($conn) {
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
            Write-Host "  Killed Electron on port $DevPort"
        }

        # Kill pnpm watch processes (Get-CimInstance needed to access CommandLine)
        Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
            Where-Object { $_.CommandLine -match 'pnpm.*watch' } |
            ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
        Write-Host "  Killed pnpm watch processes"

        Remove-Item "$env:TEMP\pnpm-watch-out.log" -ErrorAction SilentlyContinue
        Remove-Item "$env:TEMP\pnpm-watch-err.log" -ErrorAction SilentlyContinue
    }

    "prod" {
        Write-Host "Stopping production session..."
        Stop-Process -Name "Podman Desktop" -Force -ErrorAction SilentlyContinue
        Write-Host "  Production app stopped"
    }

    "" {
        Write-Host "No active session found ($StateFile not present)"
    }

    default {
        Write-Host "Unknown mode '$Mode' in $StateFile — skipping process kill"
    }
}

if (Test-Path $StateFile) { Remove-Item $StateFile }
Write-Host "Cleanup complete"
