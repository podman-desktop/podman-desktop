$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.29.0/podman-desktop-1.29.0-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '98e7d6eb6b3b1b3eff39a0586ed2663dee0d3a8af45a16f42a785ddc797b5b27'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
