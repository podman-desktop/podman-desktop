$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.26.2/podman-desktop-1.26.2-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '6542e94a998e66309951b2dc7bfb26e54c8a9c92666f3209a478d9933a8ad523'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
