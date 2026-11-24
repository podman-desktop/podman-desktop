$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.30.7/podman-desktop-1.30.7-setup.exe'
  checksumType   = 'sha256'
  checksum64     = 'a3b24c2cc1df754bd98aabf78213d86352cc7297b9b2fb1042678ecda55cfb17'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
