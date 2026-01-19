$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.24.2/podman-desktop-1.24.2-setup.exe'
  checksumType   = 'sha256'
  checksum64     = 'aa0b87e5e5920f56e72a531d78c20dfd0ca4b4c21764bdb7908b5e91c700065b'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
