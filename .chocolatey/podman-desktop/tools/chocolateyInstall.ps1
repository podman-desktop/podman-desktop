$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.21.0/podman-desktop-1.21.0-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '294fce9b69fec8cd92a63fcff007b9ff15429e5813fe19410fff943fcc68ebe1'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
