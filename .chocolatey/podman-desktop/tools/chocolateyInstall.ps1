$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.22.0/podman-desktop-1.22.0-setup.exe'
  checksumType   = 'sha256'
  checksum64     = 'f1d32c6268d6fd4c5fffe7eff048da1fe7489fb51247b9310922ceb40321a6b7'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
