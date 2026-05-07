#!/usr/bin/env pwsh
# start.ps1 — Start or connect to Podman Desktop for MCP testing (Windows).
# Requires -Mode flag. Detection is handled by probe.ps1; this script executes.
#
# Usage:
#   pwsh start.ps1 -Mode dev          # full startup (clean, install, pnpm watch)
#   pwsh start.ps1 -Mode dev-fast     # fast-path (pnpm watch already running)
#   pwsh start.ps1 -Mode prod             # launch/connect production app
#
# After exit 0, call mcp__podman-desktop-mcp__connect({ port: <PORT> }).

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("dev", "dev-fast", "prod")]
    [string]$Mode
)

$DEV_PORT = 9223
$REPO = (Resolve-Path "$PSScriptRoot\..\..\..\").Path.TrimEnd('\')

# VS Code (and other Electron-based editors) set ELECTRON_RUN_AS_NODE=1 in child
# processes. This makes the Electron binary run as plain Node.js, breaking the
# Electron API and Chromium flags like --remote-debugging-port. Remove it so that
# pnpm watch can spawn Electron properly.
if ($env:ELECTRON_RUN_AS_NODE) {
    Remove-Item Env:\ELECTRON_RUN_AS_NODE -ErrorAction SilentlyContinue
}

function Test-CdpReady {
    param([int]$CdpPort = $DEV_PORT)
    try {
        $null = Invoke-WebRequest -Uri "http://localhost:$CdpPort/json/version" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        return $true
    } catch { return $false }
}

function Get-HealthyAppTitle {
    param([int]$CdpPort = $DEV_PORT)
    try {
        $targets = (Invoke-WebRequest -Uri "http://localhost:$CdpPort/json" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop).Content | ConvertFrom-Json
        foreach ($t in $targets) {
            $url   = if ($t.url)   { $t.url.ToLower()   } else { "" }
            $title = if ($t.title) { $t.title.ToLower() } else { "" }
            $ttype = if ($t.type)  { $t.type.ToLower()  } else { "" }
            if ($url -notlike "*devtools*" -and $title -ne "devtools" -and $ttype -eq "page") {
                return $t.title
            }
        }
    } catch {}
    return $null
}

function Test-WatchRunning {
    $procs = Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
             Where-Object { $_.CommandLine -match 'pnpm.*watch' }
    return ($null -ne $procs -and @($procs).Count -gt 0)
}

function Close-DevToolsTargets {
    param([int]$CdpPort = $DEV_PORT)
    try {
        $targets = (Invoke-WebRequest -Uri "http://localhost:$CdpPort/json" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop).Content | ConvertFrom-Json
        $closed = 0
        foreach ($t in $targets) {
            $url   = if ($t.url)   { $t.url.ToLower()   } else { "" }
            $title = if ($t.title) { $t.title.ToLower() } else { "" }
            if ($url -like "*devtools*" -or $title -eq "devtools") {
                try {
                    Invoke-WebRequest -Uri "http://localhost:$CdpPort/json/close/$($t.id)" -UseBasicParsing -TimeoutSec 5 | Out-Null
                    $closed++
                } catch {}
            }
        }
        if ($closed -gt 0) {
            Write-Host "      Closed $closed DevTools target(s) — waiting 10s for rendering surface..."
            Start-Sleep -Seconds 10
        }
    } catch {}
}

function Test-ProductionPDRunning {
    $procs = Get-Process -Name "Podman Desktop" -ErrorAction SilentlyContinue |
             Where-Object { $_.Path -and $_.Path -notmatch 'node_modules' }
    return ($null -ne $procs -and @($procs).Count -gt 0)
}

# ── Mode: prod ────────────────────────────────────────────────────────────────
if ($Mode -eq "prod") {
    $PROD_PORT = 9222

    # 1. Already running with CDP on the production port? (9223 is exclusively dev — never check it here)
    foreach ($p in @(9222)) {
        if (Test-CdpReady -CdpPort $p) {
            $appTitle = $null
            for ($j = 1; $j -le 10; $j++) {
                $appTitle = Get-HealthyAppTitle -CdpPort $p
                if ($appTitle) { break }
                Start-Sleep -Seconds 1
            }
            if ($appTitle) {
                "prod" | Out-File -FilePath "$env:TEMP\mcp-testing-session" -Encoding utf8 -NoNewline
                Write-Host "Already running — $appTitle (port $p)"
                Write-Host "Ready — call mcp__podman-desktop-mcp__connect({ port: $p })"
                exit 0
            }
        }
    }

    # 2. Running but no CDP — relaunch with CDP flag
    if (Test-ProductionPDRunning) {
        Write-Host "Production Podman Desktop is running without CDP — relaunching with --remote-debugging-port=$PROD_PORT..."
        Stop-Process -Name "Podman Desktop" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 3
    }

    # 3. Kill dev instance if it holds the single-instance lock
    if (Test-WatchRunning) {
        Write-Host "      Dev instance (pnpm watch) running — stopping it to release the single-instance lock..."
        Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
            Where-Object { $_.CommandLine -match 'pnpm.*watch' } |
            ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
        $devConn = Get-NetTCPConnection -LocalPort $DEV_PORT -State Listen -ErrorAction SilentlyContinue
        if ($devConn) { Stop-Process -Id $devConn.OwningProcess -Force -ErrorAction SilentlyContinue }
        Start-Sleep -Seconds 3
        Write-Host "      Dev instance stopped"
    }

    # 4. Not running (or just closed) — launch with CDP
    Write-Host "Launching production Podman Desktop with --remote-debugging-port=$PROD_PORT..."
    Start-Process "$env:LOCALAPPDATA\Programs\Podman Desktop\Podman Desktop.exe" -ArgumentList "--remote-debugging-port=$PROD_PORT"

    Write-Host "      Waiting for CDP on port $PROD_PORT..."
    $ready = $false
    for ($i = 1; $i -le 30; $i++) {
        if (Test-CdpReady -CdpPort $PROD_PORT) {
            Write-Host "      CDP ready after ${i}s"
            $ready = $true
            break
        }
        Start-Sleep -Seconds 1
    }
    if (-not $ready) {
        Write-Host "ERROR: App did not expose CDP on port $PROD_PORT within 30s"
        exit 1
    }

    # Window title may not be set immediately — retry for up to 10s
    $appTitle = $null
    for ($i = 1; $i -le 10; $i++) {
        $appTitle = Get-HealthyAppTitle -CdpPort $PROD_PORT
        if ($appTitle) { break }
        Start-Sleep -Seconds 1
    }
    if (-not $appTitle) {
        Write-Host "ERROR: CDP on port $PROD_PORT has no healthy app window"
        exit 1
    }

    "prod" | Out-File -FilePath "$env:TEMP\mcp-testing-session" -Encoding utf8 -NoNewline
    Write-Host "Connected to production Podman Desktop — $appTitle (port $PROD_PORT)"
    Write-Host "Ready — call mcp__podman-desktop-mcp__connect({ port: $PROD_PORT })"
    exit 0
}

# ── Mode: dev-fast ────────────────────────────────────────────────────────────
if ($Mode -eq "dev-fast") {
    if (-not (Test-WatchRunning)) {
        Write-Host "ERROR: pnpm watch is not running"
        exit 1
    }

    if (-not (Test-CdpReady)) {
        Write-Host "ERROR: pnpm watch is running but CDP is not available on port $DEV_PORT"
        exit 1
    }

    $appTitle = Get-HealthyAppTitle
    if (-not $appTitle) {
        Write-Host "ERROR: CDP on port $DEV_PORT has no healthy app window — restart pnpm watch"
        exit 1
    }

    Close-DevToolsTargets

    "dev" | Out-File -FilePath "$env:TEMP\mcp-testing-session" -Encoding utf8 -NoNewline
    Write-Host "pnpm watch already running — $appTitle"
    Write-Host "Ready — call mcp__podman-desktop-mcp__connect({ port: $DEV_PORT })"
    exit 0
}

# ── Mode: dev (full startup) ─────────────────────────────────────────────────

# Close production Podman Desktop if it holds the single-instance lock
if (Test-ProductionPDRunning) {
    Write-Host "      Production Podman Desktop running — closing it to release the single-instance lock..."
    Stop-Process -Name "Podman Desktop" -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    Write-Host "      Production app stopped"
}

# Kill any existing pnpm watch (tree kill to catch vite/svelte-package/esbuild children)
Write-Host "[1/4] Stopping any running dev instance..."
$watchProcs = Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
              Where-Object { $_.CommandLine -match 'pnpm.*watch' }
foreach ($wp in $watchProcs) {
    & taskkill /F /T /PID $wp.ProcessId 2>$null
}
if ($watchProcs) {
    Write-Host "      Stopped pnpm watch tree"
    Start-Sleep -Seconds 3
}

# Also kill the Electron app if it is still listening on the dev CDP port
$conn = Get-NetTCPConnection -LocalPort $DEV_PORT -State Listen -ErrorAction SilentlyContinue
if ($conn) {
    $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
    $procName = if ($proc) { $proc.ProcessName } else { "unknown" }
    Write-Host "      Killing process on port $DEV_PORT ($procName)"
    & taskkill /F /T /PID $conn.OwningProcess 2>$null
    Write-Host "      Stopped process tree on port $DEV_PORT"
    Start-Sleep -Seconds 2
}

if (Test-CdpReady) {
    Write-Host "ERROR: Port $DEV_PORT is still in use (not by pnpm watch) — stop it manually:"
    Write-Host "  Get-NetTCPConnection -LocalPort $DEV_PORT -State Listen"
    exit 1
}
Write-Host "      Port $DEV_PORT is free"

# Clean stale artifacts
Write-Host "[2/4] Cleaning stale artifacts..."
if (Test-Path "$REPO\node_modules") {
    Remove-Item -Recurse -Force "$REPO\node_modules"
    Write-Host "      Removed node_modules/"
}
$distDirs = @()
$distDirs += Get-ChildItem -Path "$REPO\packages","$REPO\extensions" -Directory -Recurse -Filter "dist" -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\node_modules\\' }
foreach ($d in $distDirs) {
    Remove-Item -Recurse -Force $d.FullName
}
Write-Host "      Removed $($distDirs.Count) dist/ folder(s)"

if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: pnpm not found in PATH — install with: npm install -g pnpm"
    exit 1
}

# Install deps (timeout after 5 minutes)
Write-Host "[3/4] Installing dependencies..."
$installJob = Start-Job -ScriptBlock {
    param($r)
    & pnpm --dir $r install
    if ($LASTEXITCODE -ne 0) { throw "pnpm install exited with code $LASTEXITCODE" }
} -ArgumentList $REPO
$finished = $installJob | Wait-Job -Timeout 300
if (-not $finished -or $installJob.State -eq 'Running') {
    $installJob | Stop-Job; $installJob | Remove-Job -Force
    Write-Host "ERROR: pnpm install timed out after 5 minutes"
    exit 1
}
try {
    $installJob | Receive-Job -ErrorAction Stop
} catch {
    $installJob | Remove-Job -Force
    Write-Host "ERROR: pnpm install failed: $_"
    exit 1
}
$installJob | Remove-Job
Write-Host "      Dependencies up to date"

# Launch pnpm watch and wait for CDP
$logOut = "$env:TEMP\pnpm-watch-out.log"
$logErr = "$env:TEMP\pnpm-watch-err.log"
Write-Host "[4/4] Launching pnpm watch..."
$null = Start-Process -FilePath "pnpm" `
    -ArgumentList "--dir", "`"$REPO`"", "watch" `
    -RedirectStandardOutput $logOut `
    -RedirectStandardError  $logErr `
    -NoNewWindow -PassThru

$ready = $false
for ($i = 1; $i -le 120; $i++) {
    if (Test-CdpReady) {
        Write-Host "      CDP ready after ${i}s"
        $ready = $true
        break
    }
    Start-Sleep -Seconds 1
}
if (-not $ready) {
    Write-Host "ERROR: App did not expose CDP within 120s"
    if (Test-ProductionPDRunning) {
        Write-Host "HINT: A production Podman Desktop is running — it holds the"
        Write-Host "      single-instance lock, preventing the dev instance from starting."
        Write-Host "      Either close it, or relaunch it with CDP:"
        Write-Host "        podman-desktop --remote-debugging-port=9222"
    }
    Get-Content $logOut, $logErr -Tail 20 -ErrorAction SilentlyContinue
    exit 1
}

Close-DevToolsTargets

"dev" | Out-File -FilePath "$env:TEMP\mcp-testing-session" -Encoding utf8 -NoNewline
Write-Host "Ready — call mcp__podman-desktop-mcp__connect({ port: $DEV_PORT })"
