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

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';

import { GITHUB_OWNER, GITHUB_REPOSITORY } from '/@api/repository-infos';

import type { GitHubMetadata } from './github-metadata';
import { GitHubService } from './github-service';
import { mockReleaseData } from './test/resources/mock-release-data';
import { mockRepositoryData } from './test/resources/mock-repository-data';

const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPOSITORY}`;
const latestReleaseUrl = `${url}/releases/latest`;

const server = setupServer(
  http.get(url, () => {
    return HttpResponse.json(mockRepositoryData);
  }),
  http.get(latestReleaseUrl, () => {
    return HttpResponse.json(mockReleaseData);
  }),
);

describe('GitHubService', () => {
  let service: GitHubService;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  beforeEach(() => {
    service = new GitHubService(GITHUB_OWNER, GITHUB_REPOSITORY);
  });

  test('should fetch and correctly map the latest release metadata on success', async () => {
    const expectedMetadata: GitHubMetadata = {
      stargazersCount: 6140,
      latestRelease: {
        linux: {
          amd64:
            'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-1.19.2.tar.gz',
          arm64:
            'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-1.19.2-arm64.tar.gz',
          flatpak:
            'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-1.19.2.flatpak',
        },
        macos: {
          airgapsetupArm64:
            'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-airgap-1.19.2-arm64.dmg',
          airgapsetupX64:
            'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-airgap-1.19.2-x64.dmg',
          arm64:
            'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-1.19.2-arm64.dmg',
          universal:
            'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-1.19.2-universal.dmg',
          x64: 'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-1.19.2-x64.dmg',
        },
        version: 'v1.19.2',
        windows: {
          airgapsetupArm64:
            'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-airgap-1.19.2-setup-arm64.exe',
          airgapsetupX64:
            'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-airgap-1.19.2-setup-x64.exe',
          binaryArm64:
            'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-1.19.2-arm64.exe',
          binaryX64:
            'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-1.19.2-x64.exe',
          setupArm64:
            'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-1.19.2-setup-arm64.exe',
          setupX64:
            'https://github.com/podman-desktop/podman-desktop/releases/download/v1.19.2/podman-desktop-1.19.2-setup-x64.exe',
        },
      },
    };

    const metadata = await service.getMetadata();
    expect(metadata).toEqual(expectedMetadata);
  });

  test('should throw an error if tag_name is missing', async () => {
    // Override the default handler for this specific test
    server.use(
      http.get(latestReleaseUrl, () => {
        return HttpResponse.json({ ...mockReleaseData, tag_name: '' });
      }),
    );

    await expect(service.getMetadata()).rejects.toThrow(
      `Failed to retrieve tag name for the latest ${GITHUB_REPOSITORY} release from GitHub. The 'tag_name' field was missing in the release data.`,
    );
  });

  test('should throw an error if a required asset is missing', async () => {
    // Simulate a response where the flatpak asset is missing
    const incompleteAssets = mockReleaseData.assets.filter(a => !a.name.endsWith('.flatpak'));
    server.use(
      http.get(latestReleaseUrl, () => {
        return HttpResponse.json({ ...mockReleaseData, assets: incompleteAssets });
      }),
    );

    await expect(service.getMetadata()).rejects.toThrow('Required asset not found: Linux Flatpak');
  });

  test('should throw an error if a different required asset is missing', async () => {
    // Simulate a response where the macOS ARM64 DMG is missing
    const incompleteAssets = mockReleaseData.assets.filter(a => !a.name.endsWith('-arm64.dmg'));
    server.use(
      http.get(latestReleaseUrl, () => {
        return HttpResponse.json({ ...mockReleaseData, assets: incompleteAssets });
      }),
    );

    await expect(service.getMetadata()).rejects.toThrow('Required asset not found: macOS ARM64 DMG');
  });

  test('should re-throw an error if the GitHub API call fails', async () => {
    // Simulate a server error from the GitHub API
    server.use(
      http.get(latestReleaseUrl, () => {
        return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
      }),
    );

    await expect(service.getMetadata()).rejects.toThrow();
  });
});
