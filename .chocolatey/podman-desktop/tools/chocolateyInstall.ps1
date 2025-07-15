$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.20.1/podman-desktop-1.20.1-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '1b989dee9d1d121dc3b4d03f78e16c386542926ae829cdec5db0e768a0166b21'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
