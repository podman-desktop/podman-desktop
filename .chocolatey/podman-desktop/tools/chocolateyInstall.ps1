$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.1/podman-desktop-1.19.1-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '1e38aabc2f9063f75c786e2d70c15439f8a9539d0806c00807dfacf8f9a39051'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
