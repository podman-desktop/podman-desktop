$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.28.2/podman-desktop-1.28.2-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '95d16531e522622064506845a8bfc02e98d50ea00e722449464fe7ec356700e2'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
