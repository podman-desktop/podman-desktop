import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import type { GitHubMetadata } from './github-metadata';
import { GitHubService } from './github-service';
import { mockReleaseData } from './test-resourcecs/mock-release-data';

const URL = 'https://api.github.com/repos/podman-desktop/podman-desktop/releases/latest';

const server = setupServer(
  http.get(URL, () => {
    return HttpResponse.json(mockReleaseData);
  }),
);

describe('GitHubService', () => {
  const owner = 'podman-desktop';
  const repo = 'podman-desktop';
  let service: GitHubService;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  beforeEach(() => {
    service = new GitHubService(owner, repo);
  });

  it('should fetch and correctly map the latest release metadata on success', async () => {
    const expectedMetadata: GitHubMetadata = {
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

    const metadata = await service.getLatestReleaseMetadata();
    expect(metadata).toEqual(expectedMetadata);
  });

  it('should throw an error if tag_name is missing', async () => {
    // Override the default handler for this specific test
    server.use(
      http.get(URL, () => {
        return HttpResponse.json({ ...mockReleaseData, tag_name: '' });
      }),
    );

    await expect(service.getLatestReleaseMetadata()).rejects.toThrow(
      `Failed to retrieve tag name for the latest ${repo} release from GitHub. The 'tag_name' field was missing in the release data.`,
    );
  });

  it('should throw an error if a required asset is missing', async () => {
    // Simulate a response where the flatpak asset is missing
    const incompleteAssets = mockReleaseData.assets.filter(a => !a.name.endsWith('.flatpak'));
    server.use(
      http.get(URL, () => {
        return HttpResponse.json({ ...mockReleaseData, assets: incompleteAssets });
      }),
    );

    await expect(service.getLatestReleaseMetadata()).rejects.toThrow('Required asset not found: Linux Flatpak');
  });

  it('should throw an error if a different required asset is missing', async () => {
    // Simulate a response where the macOS ARM64 DMG is missing
    const incompleteAssets = mockReleaseData.assets.filter(a => !a.name.endsWith('-arm64.dmg'));
    server.use(
      http.get(URL, () => {
        return HttpResponse.json({ ...mockReleaseData, assets: incompleteAssets });
      }),
    );

    await expect(service.getLatestReleaseMetadata()).rejects.toThrow('Required asset not found: macOS ARM64 DMG');
  });

  it('should re-throw an error if the GitHub API call fails', async () => {
    // Simulate a server error from the GitHub API
    server.use(
      http.get(URL, () => {
        return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
      }),
    );

    await expect(service.getLatestReleaseMetadata()).rejects.toThrow();
  });
});
