import-module au

$version = $env:VERSION
$apiUrl = 'https://api.github.com/repos/containers/podman-desktop/releases/tags/' + 'v' + $version

function global:au_SearchReplace {
   @{
        ".\tools\chocolateyInstall.ps1" = @{
            "(?i)(^\s*url64bit\s*=\s*)('.*')"   = "`$1'$($Latest.URL64)'"
            "(?i)(^\s*checksum64\s*=\s*)('.*')" = "`$1'$($Latest.Checksum64)'"
        }
        ".\podman-desktop.nuspec" = @{
            "\<version\>.+" = "<version>$($Latest.Version)</version>"
            "\<releaseNotes\>.+" = "<releaseNotes>$($Latest.ReleaseNotes)</releaseNotes>"
    }
    }
}

function global:au_GetLatest {
    $release = Invoke-RestMethod -Uri $apiUrl -Headers @{ 'User-Agent' = 'PowerShell' }

    $asset = $release.assets | Where-Object { $_.name -match '-setup\.exe$' } | Select-Object -First 1

    if (-not $asset) {
        throw "no -setup.exe asset found for $version"
    }

    $url64 = $asset.browser_download_url
    $releaseNotes = $release.html_url

    @{
        URL64   = $url64
        Version = $version
        ReleaseNotes = $releaseNotes
    }
}

update -ChecksumFor 64
