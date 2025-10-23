$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.22.1/podman-desktop-1.22.1-setup.exe'
  checksumType   = 'sha256'
  checksum64     = 'a043c9c5c9fab837e76a622d0c27d9d6077ed209bdc459ba5b6f8802effe4dc3'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
