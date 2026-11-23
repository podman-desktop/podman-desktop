$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.31.0/podman-desktop-1.31.0-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '6f4088d343cd23da4cfa928b7cefb628ed774e6ac1e62410e0869cc8d845d449'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
