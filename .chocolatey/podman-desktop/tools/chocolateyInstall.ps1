$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.17.2/podman-desktop-1.17.2-setup.exe'
  checksumType   = 'sha256'
  checksum64     = 'b1d3e4ca4fcfe2823762a366de109a95a5616edca2fa866aa418fb249b3140a0'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
