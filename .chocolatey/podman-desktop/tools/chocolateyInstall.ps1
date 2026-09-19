$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.29.3/podman-desktop-1.29.3-setup.exe'
  checksumType   = 'sha256'
  checksum64     = 'acdc4c8fa3128f3b491a52f03b9d5761e6d6ebc9cf06fbd74eabb8fc82e16ba2'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
