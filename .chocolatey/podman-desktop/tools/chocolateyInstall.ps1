$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.25.1/podman-desktop-1.25.1-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '394852a8fdcc9cd9a59d473028e7f662f9362e59d27d967eac1351f5f69f3432'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
