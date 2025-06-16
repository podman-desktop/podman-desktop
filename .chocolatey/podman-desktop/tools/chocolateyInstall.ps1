$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-1.19.2-setup.exe'
  checksumType   = 'sha256'
  checksum64     = 'f06aba9abdb4d3fd93701a2d4a9adfa7d40379537a4cd36db1dbfbefabf47111'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
