$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.18.0/podman-desktop-1.18.0-setup.exe'
  checksumType   = 'sha256'
  checksum64     = 'a053eb8bc16791534675c6a898cfdf34bb90ae3bf26f6ad716392b435c7c9387'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
