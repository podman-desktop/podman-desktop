#!/usr/bin/env pwsh
# start.ps1 — Start or connect to Podman Desktop for MCP testing (Windows).
# Requires -Mode flag. Detection is handled by probe.ps1; this script executes.
#
# Usage:
#   pwsh start.ps1 -Mode dev          # full startup (clean, install, pnpm watch)
#   pwsh start.ps1 -Mode dev-fast     # fast-path (pnpm watch already running)
#   pwsh start.ps1 -Mode prod -Port 9222  # connect to production CDP
#
# After exit 0, call mcp__podman-desktop-mcp__connect({ port: <PORT> }).

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("dev", "dev-fast", "prod")]
    [string]$Mode,

    [int]$Port = 0
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
    if ($Port -eq 0) {
        Write-Host "ERROR: -Mode prod requires -Port argument"
        exit 1
    }

    if (-not (Test-CdpReady -CdpPort $Port)) {
        Write-Host "ERROR: No CDP response on port $Port"
        exit 1
    }

    $appTitle = Get-HealthyAppTitle -CdpPort $Port
    if (-not $appTitle) {
        Write-Host "ERROR: CDP on port $Port has no healthy app window"
        exit 1
    }

    Write-Host "Connected to production Podman Desktop — $appTitle (port $Port)"
    Write-Host "Ready — call mcp__podman-desktop-mcp__connect({ port: $Port })"
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

    Write-Host "pnpm watch already running — $appTitle"
    Write-Host "Ready — call mcp__podman-desktop-mcp__connect({ port: $DEV_PORT })"
    exit 0
}

# ── Mode: dev (full startup) ─────────────────────────────────────────────────

# Fail fast if a production Podman Desktop holds the single-instance lock
if (Test-ProductionPDRunning) {
    Write-Host "ERROR: A production Podman Desktop is running — it holds the"
    Write-Host "       single-instance lock, preventing the dev instance from starting."
    Write-Host "       Close it first, then re-run this script."
    exit 1
}

# Kill any existing pnpm watch
Write-Host "[1/4] Stopping any running pnpm watch..."
$killed = Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
          Where-Object { $_.CommandLine -match 'pnpm.*watch' }
if ($killed) {
    $killed | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
    Write-Host "      Stopped pnpm watch"
    Start-Sleep -Seconds 3
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

Write-Host "Ready — call mcp__podman-desktop-mcp__connect({ port: $DEV_PORT })"
