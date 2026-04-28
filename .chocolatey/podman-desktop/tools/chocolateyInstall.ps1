$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.27.1/podman-desktop-1.27.1-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '581f0f1c5513c7ee5e9ccb0d5cbbffae19c177e353f60172816e9b4a5f0cee1f'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
