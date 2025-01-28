$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.16.0/podman-desktop-1.16.0-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '789eb0e0d2011f460b5d43c2e783ba53b88a5dc19a713ece2c43e81a723c1479'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
