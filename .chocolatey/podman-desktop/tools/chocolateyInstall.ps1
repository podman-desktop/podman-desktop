$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.29.1/podman-desktop-1.29.1-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '275641480fa3982f661f78cc879e4b4dfcd312ee4f969e223a87f1012a3fbb56'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
