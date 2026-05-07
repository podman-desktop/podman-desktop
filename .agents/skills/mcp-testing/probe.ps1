#!/usr/bin/env pwsh
# probe.ps1 — Read-only environment detection for MCP testing (Windows).
# Never starts, kills, or modifies anything. Prints structured key=value output.
#
# Output:
#   PROD_RUNNING=true|false
#   PROD_CDP_PORT=<port>|none
#   PROD_APP_TITLE=<title>|none
#   DEV_RUNNING=true|false
#   DEV_CDP_PORT=<port>|none
#   DEV_APP_TITLE=<title>|none
#   STALE_SESSION=true|false
#   PORT_9222_NAME=<name>|none   PORT_9222_PID=<pid>|none
#   PORT_9223_NAME=<name>|none   PORT_9223_PID=<pid>|none

function Get-CdpHealthyTitle {
    param([int]$Port)
    try {
        $targets = (Invoke-WebRequest -Uri "http://localhost:$Port/json" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop).Content | ConvertFrom-Json
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

# ── Production detection ──────────────────────────────────────────────────────
$prodRunning = $false
$procs = Get-Process -Name "Podman Desktop" -ErrorAction SilentlyContinue |
         Where-Object { $_.Path -and $_.Path -notmatch 'node_modules' }
if ($null -ne $procs -and @($procs).Count -gt 0) {
    $prodRunning = $true
}

$prodCdpPort = "none"
$prodAppTitle = "none"
if ($prodRunning) {
    foreach ($p in @(9222)) {
        try {
            $null = Invoke-WebRequest -Uri "http://localhost:$p/json/version" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
            $title = Get-CdpHealthyTitle -Port $p
            if ($title) {
                $prodCdpPort = $p
                $prodAppTitle = $title
                break
            }
        } catch {}
    }
}

# ── Dev detection ─────────────────────────────────────────────────────────────
$devRunning = $false
$devProcs = Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
            Where-Object { $_.CommandLine -match 'pnpm.*watch' }
if ($null -ne $devProcs -and @($devProcs).Count -gt 0) {
    $devRunning = $true
}

$devCdpPort = "none"
$devAppTitle = "none"
if ($devRunning) {
    try {
        $null = Invoke-WebRequest -Uri "http://localhost:9223/json/version" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
        $title = Get-CdpHealthyTitle -Port 9223
        if ($title) {
            $devCdpPort = 9223
            $devAppTitle = $title
        }
    } catch {}
}

# ── Stale session check ───────────────────────────────────────────────────────
# Only stale if session file exists AND no healthy CDP is reachable.
# If the app is running and accessible, the file is from a "Leave running" exit — not an orphan.
$staleSession = $false
if (Test-Path "$env:TEMP\mcp-testing-session") {
    if ($prodCdpPort -eq "none" -and $devCdpPort -eq "none") {
        $staleSession = $true
    }
}

# ── Port conflict check ───────────────────────────────────────────────────────
$portNames = @{}
$portPids  = @{}
foreach ($port in @(9222, 9223)) {
    $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($conn) {
        $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
        $portNames[$port] = if ($proc) { $proc.ProcessName } else { "unknown" }
        $portPids[$port]  = $conn.OwningProcess
    } else {
        $portNames[$port] = "none"
        $portPids[$port]  = "none"
    }
}

# ── Output ────────────────────────────────────────────────────────────────────
Write-Output "PROD_RUNNING=$($prodRunning.ToString().ToLower())"
Write-Output "PROD_CDP_PORT=$prodCdpPort"
Write-Output "PROD_APP_TITLE=$prodAppTitle"
Write-Output "DEV_RUNNING=$($devRunning.ToString().ToLower())"
Write-Output "DEV_CDP_PORT=$devCdpPort"
Write-Output "DEV_APP_TITLE=$devAppTitle"
Write-Output "STALE_SESSION=$($staleSession.ToString().ToLower())"
Write-Output "PORT_9222_NAME=$($portNames[9222])"
Write-Output "PORT_9222_PID=$($portPids[9222])"
Write-Output "PORT_9223_NAME=$($portNames[9223])"
Write-Output "PORT_9223_PID=$($portPids[9223])"
