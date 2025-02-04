$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.16.1/podman-desktop-1.16.1-setup.exe'
  checksumType   = 'sha256'
  checksum64     = 'c35c10f4b98382af23a9702b09af84e19ecbce0aa3e4116559b5c3d94c5e924e'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
