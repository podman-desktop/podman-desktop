$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.20.2/podman-desktop-1.20.2-setup.exe'
  checksumType   = 'sha256'
  checksum64     = 'f6a2e9a48a1685515fa6d401834afe2a535cd928999ccf9da07218c595a5926f'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
