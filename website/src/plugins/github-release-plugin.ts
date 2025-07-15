import type { Plugin } from '@docusaurus/types';

// Type definition for an asset from the GitHub API response
interface GitHubAsset {
  name: string;
  browser_download_url: string;
}

// Type definition for the relevant parts of the GitHub release API response
interface GitHubRelease {
  tag_name?: string;
  name: string;
  assets: GitHubAsset[];
}

interface DownloadData {
  version: string;
}

// --- Data type definitions for each OS ---

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

// --- Combined data types ---

export interface AllDownloadsData {
  linuxDownloads: LinuxDownloadData;
  macosDownloads: MacosDownloadData;
  windowsDownloads: WindowsDownloadData;
}

export interface GlobalData {
  linuxDownloads: LinuxDownloadData;
  macosDownloads: MacosDownloadData;
  windowsDownloads: WindowsDownloadData;
}

// Helper function to find an asset or throw an error
function findAssetOrThrow(
  assets: GitHubAsset[],
  predicate: (asset: GitHubAsset) => boolean,
  assetName: string,
): string {
  const asset = assets.find(predicate);
  if (!asset) {
    throw new Error(`Required asset not found: ${assetName}`);
  }
  return asset.browser_download_url;
}

// The main plugin function, now strongly typed
export default async function githubReleasePlugin(): Promise<Plugin<AllDownloadsData | null>> {
  return {
    name: 'docusaurus-plugin-github-release',

    async loadContent(): Promise<AllDownloadsData | null> {
      console.log('Fetching latest GitHub release for podman-desktop...');

      try {
        const response = await fetch('https://api.github.com/repos/containers/podman-desktop/releases/latest');
        if (!response.ok) {
          throw new Error(`Failed to fetch latest release: ${response.statusText}`);
        }
        const releaseData = (await response.json()) as GitHubRelease;
        const { tag_name, name: rawName, assets } = releaseData;
        const version = (tag_name ?? rawName).replace(/^v/, '');

        // --- Linux ---
        const flatpakUrl = findAssetOrThrow(assets, a => a.name.endsWith('.flatpak'), 'Linux Flatpak');
        const linuxArmUrl = findAssetOrThrow(assets, a => a.name.endsWith('-arm64.tar.gz'), 'Linux ARM64 .tar.gz');
        const linuxAmdUrl = findAssetOrThrow(
          assets,
          a => a.name.endsWith('.tar.gz') && !a.name.includes('arm64'),
          'Linux AMD64 .tar.gz',
        );

        const linuxDownloads: LinuxDownloadData = {
          version,
          flatpak: flatpakUrl,
          arm64: linuxArmUrl,
          amd64: linuxAmdUrl,
        };

        // --- macOS ---
        const macosArm64Url = findAssetOrThrow(
          assets,
          a => a.name.endsWith('-arm64.dmg') && !a.name.includes('airgap'),
          'macOS ARM64 DMG',
        );
        const macosX64Url = findAssetOrThrow(
          assets,
          a => a.name.endsWith('-x64.dmg') && !a.name.includes('airgap'),
          'macOS x64 DMG',
        );
        const macosUniversalUrl = findAssetOrThrow(
          assets,
          a =>
            a.name.endsWith('.dmg') &&
            !a.name.includes('airgap') &&
            a.name !== macosArm64Url.split('/').pop() &&
            a.name !== macosX64Url.split('/').pop(),
          'macOS Universal DMG',
        );
        const macosAirgapX64Url = findAssetOrThrow(
          assets,
          a => a.name.endsWith('-x64.dmg') && a.name.includes('airgap'),
          'macOS Airgap x64 DMG',
        );
        const macosAirgapArm64Url = findAssetOrThrow(
          assets,
          a => a.name.endsWith('-arm64.dmg') && a.name.includes('airgap'),
          'macOS Airgap ARM64 DMG',
        );

        const macosDownloads: MacosDownloadData = {
          version,
          universal: macosUniversalUrl,
          x64: macosX64Url,
          arm64: macosArm64Url,
          airgapsetupX64: macosAirgapX64Url,
          airgapsetupArm64: macosAirgapArm64Url,
        };

        // --- Windows ---
        const windowsSetupX64Url = findAssetOrThrow(
          assets,
          a => a.name.endsWith('-setup-x64.exe') && !a.name.includes('airgap'),
          'Windows Setup x64 EXE',
        );
        const windowsSetupArm64Url = findAssetOrThrow(
          assets,
          a => a.name.endsWith('-setup-arm64.exe') && !a.name.includes('airgap'),
          'Windows Setup ARM64 EXE',
        );
        const windowsPortableX64Url = findAssetOrThrow(
          assets,
          a => a.name.endsWith('-x64.exe') && !a.name.includes('setup') && !a.name.includes('airgap'),
          'Windows Portable x64 EXE',
        );
        const windowsPortableArm64Url = findAssetOrThrow(
          assets,
          a => a.name.endsWith('-arm64.exe') && !a.name.includes('setup') && !a.name.includes('airgap'),
          'Windows Portable ARM64 EXE',
        );
        const windowsAirgapSetupX64Url = findAssetOrThrow(
          assets,
          a => a.name.endsWith('-setup-x64.exe') && a.name.includes('airgap'),
          'Windows Airgap Setup x64 EXE',
        );
        const windowsAirgapSetupArm64Url = findAssetOrThrow(
          assets,
          a => a.name.endsWith('-setup-arm64.exe') && a.name.includes('airgap'),
          'Windows Airgap Setup ARM64 EXE',
        );

        const windowsDownloads: WindowsDownloadData = {
          version,
          setupX64: windowsSetupX64Url,
          setupArm64: windowsSetupArm64Url,
          binaryX64: windowsPortableX64Url,
          binaryArm64: windowsPortableArm64Url,
          airgapsetupX64: windowsAirgapSetupX64Url,
          airgapsetupArm64: windowsAirgapSetupArm64Url,
        };

        console.log(`Successfully fetched version ${version} for all platforms.`);

        return {
          linuxDownloads,
          macosDownloads,
          windowsDownloads,
        };
      } catch (err) {
        console.error('Error fetching GitHub release data:', err);
        // Re-throw the error to make the Docusaurus build fail
        throw err;
      }
    },

    async contentLoaded({ content, actions }): Promise<void> {
      const { setGlobalData } = actions;

      setGlobalData(content);
    },
  };
}
