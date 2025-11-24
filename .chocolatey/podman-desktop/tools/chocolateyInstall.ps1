$ErrorActionPreference = 'Stop'

$packageArgs = @{
  packageName    = 'podman-desktop'
  fileType       = 'exe'
  softwareName   = 'PodmanDesktop'

  url64bit       = 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.23.1/podman-desktop-1.23.1-setup.exe'
  checksumType   = 'sha256'
  checksum64     = '072a526c0adde75846e23202df75bb35f0241f1c73353d1da3ee02b9802ae974'

  silentArgs     = '/S'
  validExitCodes = @(0)
}

Install-ChocolateyPackage @packageArgs
