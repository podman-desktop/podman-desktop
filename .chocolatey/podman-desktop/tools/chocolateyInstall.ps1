$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.17.1/podman-desktop-1.17.1-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '98b51d543e3f86fe02b2cb68675ff991e626b9e564df0c8b61c5db63e675b388'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
