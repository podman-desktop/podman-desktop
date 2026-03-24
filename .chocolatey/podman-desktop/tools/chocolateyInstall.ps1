$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.26.1/podman-desktop-1.26.1-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '508a5ed6f5ae8eb38f93bbf16f592662659fdc64cd52be71b772d192b558b45c'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
