/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ***********************************************************************/

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

  public async getMetadata(): Promise<GitHubMetadata> {
    try {
      const repoInfo = {
        owner: this.owner,
        repo: this.repo,
      };
      const { data: releaseData } = await this.octokit.rest.repos.getLatestRelease(repoInfo);

      const { tag_name, assets } = releaseData;

      if (!tag_name) {
        throw new Error(
          `Failed to retrieve tag name for the latest ${this.repo} release from GitHub. The 'tag_name' field was missing in the release data.`,
        );
      }

      const findAssetOrThrow = (predicate: (asset: (typeof assets)[0]) => boolean, assetName: string): string => {
        const asset = assets.find(predicate);
        if (!asset) {
          throw new Error(`Required asset not found: ${assetName}`);
        }
        return asset.browser_download_url;
      };

      const macosArm64Url = findAssetOrThrow(
        a => a.name.endsWith('-arm64.dmg') && !a.name.includes('airgap'),
        'macOS ARM64 DMG',
      );
      const macosX64Url = findAssetOrThrow(
        a => a.name.endsWith('-x64.dmg') && !a.name.includes('airgap'),
        'macOS x64 DMG',
      );

      const {
        data: { stargazers_count },
      } = await this.octokit.rest.repos.get(repoInfo);

      if (!stargazers_count) {
        throw new Error(
          `Failed to retrieve stargazers count name for ${this.repo} repo from GitHub. The 'stargazers_count' field was missing in the data.`,
        );
      }

      return {
        stargazersCount: stargazers_count,
        latestRelease: {
          version: tag_name,
          linux: {
            flatpak: findAssetOrThrow(a => a.name.endsWith('.flatpak'), 'Linux Flatpak'),
            arm64: findAssetOrThrow(a => a.name.endsWith('-arm64.tar.gz'), 'Linux ARM64 .tar.gz'),
            amd64: findAssetOrThrow(
              a => (a.name.endsWith('-x64.tar.gz') || a.name.endsWith('.tar.gz')) && !a.name.includes('arm64'),
              'Linux AMD64 .tar.gz',
            ),
          },
          macos: {
            universal: findAssetOrThrow(
              a =>
                a.name.endsWith('.dmg') &&
                !a.name.includes('airgap') &&
                a.name !== macosArm64Url.split('/').pop() &&
                a.name !== macosX64Url.split('/').pop(),
              'macOS Universal DMG',
            ),
            x64: macosX64Url,
            arm64: macosArm64Url,
            airgapsetupX64: findAssetOrThrow(
              a => a.name.endsWith('-x64.dmg') && a.name.includes('airgap'),
              'macOS Airgap x64 DMG',
            ),
            airgapsetupArm64: findAssetOrThrow(
              a => a.name.endsWith('-arm64.dmg') && a.name.includes('airgap'),
              'macOS Airgap ARM64 DMG',
            ),
          },
          windows: {
            setupX64: findAssetOrThrow(
              a => a.name.endsWith('-setup-x64.exe') && !a.name.includes('airgap'),
              'Windows Setup x64 EXE',
            ),
            setupArm64: findAssetOrThrow(
              a => a.name.endsWith('-setup-arm64.exe') && !a.name.includes('airgap'),
              'Windows Setup ARM64 EXE',
            ),
            binaryX64: findAssetOrThrow(
              a => a.name.endsWith('-x64.exe') && !a.name.includes('setup') && !a.name.includes('airgap'),
              'Windows Portable x64 EXE',
            ),
            binaryArm64: findAssetOrThrow(
              a => a.name.endsWith('-arm64.exe') && !a.name.includes('setup') && !a.name.includes('airgap'),
              'Windows Portable ARM64 EXE',
            ),
            airgapsetupX64: findAssetOrThrow(
              a => a.name.endsWith('-setup-x64.exe') && a.name.includes('airgap'),
              'Windows Airgap Setup x64 EXE',
            ),
            airgapsetupArm64: findAssetOrThrow(
              a => a.name.endsWith('-setup-arm64.exe') && a.name.includes('airgap'),
              'Windows Airgap Setup ARM64 EXE',
            ),
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
