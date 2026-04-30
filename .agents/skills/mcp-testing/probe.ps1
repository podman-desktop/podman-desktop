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
    foreach ($p in @(9222, 9223)) {
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

# ── Output ────────────────────────────────────────────────────────────────────
Write-Output "PROD_RUNNING=$($prodRunning.ToString().ToLower())"
Write-Output "PROD_CDP_PORT=$prodCdpPort"
Write-Output "PROD_APP_TITLE=$prodAppTitle"
Write-Output "DEV_RUNNING=$($devRunning.ToString().ToLower())"
Write-Output "DEV_CDP_PORT=$devCdpPort"
Write-Output "DEV_APP_TITLE=$devAppTitle"
