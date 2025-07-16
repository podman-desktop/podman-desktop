import { Octokit } from '@octokit/rest';

import type { GitHubMetadata } from './github-metadata';

export class GitHubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(owner: string, repo: string) {
    this.octokit = new Octokit();
    this.owner = owner;
    this.repo = repo;
  }

  public async getLatestReleaseMetadata(): Promise<GitHubMetadata> {
    try {
      const { data: releaseData } = await this.octokit.rest.repos.getLatestRelease({
        owner: this.owner,
        repo: this.repo,
      });

      const { tag_name, assets } = releaseData;

      if (!tag_name) {
        throw new Error(
          `Failed to retrieve tag name for the latest ${this.repo} release from GitHub. The 'tag_name' field was missing in the release data.`,
        );
      }

      // Helper function to find an asset or throw an error
      const findAssetOrThrow = (predicate: (asset: (typeof assets)[0]) => boolean, assetName: string): string => {
        const asset = assets.find(predicate);
        if (!asset) {
          throw new Error(`Required asset not found: ${assetName}`);
        }
        return asset.browser_download_url;
      };

      const flatpakUrl = findAssetOrThrow(a => a.name.endsWith('.flatpak'), 'Linux Flatpak');
      const linuxArmUrl = findAssetOrThrow(a => a.name.endsWith('-arm64.tar.gz'), 'Linux ARM64 .tar.gz');
      const linuxAmdUrl = findAssetOrThrow(
        a => a.name.endsWith('.tar.gz') && !a.name.includes('arm64'),
        'Linux AMD64 .tar.gz',
      );

      const macosArm64Url = findAssetOrThrow(
        a => a.name.endsWith('-arm64.dmg') && !a.name.includes('airgap'),
        'macOS ARM64 DMG',
      );
      const macosX64Url = findAssetOrThrow(
        a => a.name.endsWith('-x64.dmg') && !a.name.includes('airgap'),
        'macOS x64 DMG',
      );
      const macosUniversalUrl = findAssetOrThrow(
        a =>
          a.name.endsWith('.dmg') &&
          !a.name.includes('airgap') &&
          a.name !== macosArm64Url.split('/').pop() &&
          a.name !== macosX64Url.split('/').pop(),
        'macOS Universal DMG',
      );
      const macosAirgapX64Url = findAssetOrThrow(
        a => a.name.endsWith('-x64.dmg') && a.name.includes('airgap'),
        'macOS Airgap x64 DMG',
      );
      const macosAirgapArm64Url = findAssetOrThrow(
        a => a.name.endsWith('-arm64.dmg') && a.name.includes('airgap'),
        'macOS Airgap ARM64 DMG',
      );

      const windowsSetupX64Url = findAssetOrThrow(
        a => a.name.endsWith('-setup-x64.exe') && !a.name.includes('airgap'),
        'Windows Setup x64 EXE',
      );
      const windowsSetupArm64Url = findAssetOrThrow(
        a => a.name.endsWith('-setup-arm64.exe') && !a.name.includes('airgap'),
        'Windows Setup ARM64 EXE',
      );
      const windowsPortableX64Url = findAssetOrThrow(
        a => a.name.endsWith('-x64.exe') && !a.name.includes('setup') && !a.name.includes('airgap'),
        'Windows Portable x64 EXE',
      );
      const windowsPortableArm64Url = findAssetOrThrow(
        a => a.name.endsWith('-arm64.exe') && !a.name.includes('setup') && !a.name.includes('airgap'),
        'Windows Portable ARM64 EXE',
      );
      const windowsAirgapSetupX64Url = findAssetOrThrow(
        a => a.name.endsWith('-setup-x64.exe') && a.name.includes('airgap'),
        'Windows Airgap Setup x64 EXE',
      );
      const windowsAirgapSetupArm64Url = findAssetOrThrow(
        a => a.name.endsWith('-setup-arm64.exe') && a.name.includes('airgap'),
        'Windows Airgap Setup ARM64 EXE',
      );

      return {
        latestRelease: {
          version: tag_name.replace(/^v/, ''),
          linux: {
            flatpak: flatpakUrl,
            arm64: linuxArmUrl,
            amd64: linuxAmdUrl,
          },
          macos: {
            universal: macosUniversalUrl,
            x64: macosX64Url,
            arm64: macosArm64Url,
            airgapsetupX64: macosAirgapX64Url,
            airgapsetupArm64: macosAirgapArm64Url,
          },
          windows: {
            setupX64: windowsSetupX64Url,
            setupArm64: windowsSetupArm64Url,
            binaryX64: windowsPortableX64Url,
            binaryArm64: windowsPortableArm64Url,
            airgapsetupX64: windowsAirgapSetupX64Url,
            airgapsetupArm64: windowsAirgapSetupArm64Url,
          },
        },
      };
    } catch (err) {
      console.error('Error fetching GitHub release data:', err);
      // Re-throw the error to make the Docusaurus build fail
      throw err;
    }
  }
}
