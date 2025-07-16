interface DownloadData {
  version: string;
}

export interface LinuxDownloadData extends DownloadData {
  flatpak: string;
  amd64: string;
  arm64: string;
}

export interface MacosDownloadData extends DownloadData {
  universal: string;
  x64: string;
  arm64: string;
  airgapsetupX64: string;
  airgapsetupArm64: string;
}

export interface WindowsDownloadData extends DownloadData {
  binaryX64: string;
  binaryArm64: string;
  setupX64: string;
  setupArm64: string;
  airgapsetupX64: string;
  airgapsetupArm64: string;
}

export interface GitHubMetadata {
  linuxDownloads: LinuxDownloadData;
  macosDownloads: MacosDownloadData;
  windowsDownloads: WindowsDownloadData;
}
