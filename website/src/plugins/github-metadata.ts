export interface LinuxDownloadData {
  flatpak: string;
  amd64: string;
  arm64: string;
}

export interface MacosDownloadData {
  universal: string;
  x64: string;
  arm64: string;
  airgapsetupX64: string;
  airgapsetupArm64: string;
}

export interface WindowsDownloadData {
  binaryX64: string;
  binaryArm64: string;
  setupX64: string;
  setupArm64: string;
  airgapsetupX64: string;
  airgapsetupArm64: string;
}

export interface GitHubMetadata {
  latestReleaseVersion: string;
  linuxDownloads: LinuxDownloadData;
  macosDownloads: MacosDownloadData;
  windowsDownloads: WindowsDownloadData;
}
