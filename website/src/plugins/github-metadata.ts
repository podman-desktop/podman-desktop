export interface GitHubMetadata {
  latestRelease: {
    version: string;
    linux: {
      flatpak: string;
      amd64: string;
      arm64: string;
    };
    macos: {
      universal: string;
      x64: string;
      arm64: string;
      airgapsetupX64: string;
      airgapsetupArm64: string;
    };
    windows: {
      binaryX64: string;
      binaryArm64: string;
      setupX64: string;
      setupArm64: string;
      airgapsetupX64: string;
      airgapsetupArm64: string;
    };
  };
}
