$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.18.1/podman-desktop-1.18.1-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '3cfda40ce1bc1d5fa6a1f1368e890b4e9fdd0ee10e2731bac2f0de337e9ae982'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
