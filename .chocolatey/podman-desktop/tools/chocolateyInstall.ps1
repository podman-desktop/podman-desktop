$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.27.2/podman-desktop-1.27.2-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '7280fb2bde90ede3c1c45919883bcac6fca1d45f2f3a3134b55c9a21aaabd680'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
