$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.28.3/podman-desktop-1.28.3-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '45f55afc30105114f11df57348ca1de9c262c35fcc6cc5fd5b8ac03107c69f44'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
