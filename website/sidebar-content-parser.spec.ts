import { writeFile } from 'node:fs/promises';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { extractNavigationFromSidebar, generateJsonOverviewFile } from './sidebar-content-parser';

// Mock the writeFile function
vi.mock('node:fs/promises', () => ({
  writeFile: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('extractNavigationFromSidebar', () => {
  test('should extract navigation items from simple doc items', () => {
    const sidebarItems = [
      {
        type: 'doc' as const,
        id: 'intro',
        label: 'Introduction',
      },
      {
        type: 'doc' as const,
        id: 'running-a-kubernetes-cluster',
        label: 'Running a Kubernetes cluster',
      },
    ];

    const result = extractNavigationFromSidebar(sidebarItems, 'https://podman-desktop.io', 'docs');

    expect(result).toEqual([
      {
        name: 'Introduction',
        url: 'https://podman-desktop.io/docs/intro',
      },
      {
        name: 'Running a kubernetes cluster',
        url: 'https://podman-desktop.io/docs/running-a-kubernetes-cluster',
      },
    ]);
  });

  test('should handle items without labels by using id and formatting it', () => {
    const sidebarItems = [
      {
        type: 'doc' as const,
        id: 'deploying-a-kubernetes-application',
      },
    ];

    const result = extractNavigationFromSidebar(sidebarItems, 'https://podman-desktop.io', 'docs');

    expect(result).toEqual([
      {
        name: 'Deploying a kubernetes application',
        url: 'https://podman-desktop.io/docs/deploying-a-kubernetes-application',
      },
    ]);
  });

  test('should handle tutorial index case correctly', () => {
    const sidebarItems = [
      {
        type: 'doc' as const,
        id: 'index',
        label: 'Introduction',
      },
    ];

    const result = extractNavigationFromSidebar(sidebarItems, 'https://podman-desktop.io', 'tutorial');

    expect(result).toEqual([
      {
        name: 'Introduction',
        url: 'https://podman-desktop.io/tutorial',
      },
    ]);
  });

  test('should handle category items recursively', () => {
    const sidebarItems = [
      {
        type: 'category' as const,
        label: 'Getting Started',
        items: [
          {
            type: 'doc' as const,
            id: 'intro',
            label: 'Introduction',
          },
          {
            type: 'doc' as const,
            id: 'installation',
            label: 'Installation',
          },
        ],
      },
    ];

    const result = extractNavigationFromSidebar(sidebarItems, 'https://podman-desktop.io', 'docs');

    expect(result).toEqual([
      {
        name: 'Introduction',
        url: 'https://podman-desktop.io/docs/intro',
      },
      {
        name: 'Installation',
        url: 'https://podman-desktop.io/docs/installation',
      },
    ]);
  });

  test('should format names correctly by replacing hyphens with spaces and capitalizing first letter', () => {
    const sidebarItems = [
      {
        type: 'doc' as const,
        id: 'getting-started-with-compose',
        label: 'Getting started with Compose',
      },
      {
        type: 'doc' as const,
        id: 'running-an-ai-application',
      },
    ];

    const result = extractNavigationFromSidebar(sidebarItems, 'https://podman-desktop.io', 'docs');

    expect(result).toEqual([
      {
        name: 'Getting started with compose',
        url: 'https://podman-desktop.io/docs/getting-started-with-compose',
      },
      {
        name: 'Running an AI application',
        url: 'https://podman-desktop.io/docs/running-an-ai-application',
      },
    ]);
  });

  test('should keep AI capitalized in names', () => {
    const sidebarItems = [
      {
        type: 'doc' as const,
        id: 'ai-lab-start-recipe',
        label: 'AI Lab Start Recipe',
      },
      {
        type: 'doc' as const,
        id: 'running-an-ai-application',
      },
      {
        type: 'doc' as const,
        id: 'ai-powered-tools',
      },
    ];

    const result = extractNavigationFromSidebar(sidebarItems, 'https://podman-desktop.io', 'docs');

    expect(result).toEqual([
      {
        name: 'AI lab start recipe',
        url: 'https://podman-desktop.io/docs/ai-lab-start-recipe',
      },
      {
        name: 'Running an AI application',
        url: 'https://podman-desktop.io/docs/running-an-ai-application',
      },
      {
        name: 'AI powered tools',
        url: 'https://podman-desktop.io/docs/ai-powered-tools',
      },
    ]);
  });

  test('should skip items with empty names', () => {
    const sidebarItems = [
      {
        type: 'doc' as const,
        id: '',
        label: '',
      },
      {
        type: 'doc' as const,
        id: 'valid-item',
        label: 'Valid Item',
      },
    ];

    const result = extractNavigationFromSidebar(sidebarItems, 'https://podman-desktop.io', 'docs');

    expect(result).toEqual([
      {
        name: 'Valid item',
        url: 'https://podman-desktop.io/docs/valid-item',
      },
    ]);
  });
});

describe('generateJsonOverviewFile', () => {
  test('should generate JSON file for docs section', async () => {
    const sidebarItems = [
      {
        type: 'doc' as const,
        id: 'intro',
        label: 'Introduction',
      },
    ];

    await generateJsonOverviewFile(sidebarItems, 'docs', 'https://podman-desktop.io', './static/docs.json');

    expect(writeFile).toHaveBeenCalledWith(
      './static/docs.json',
      JSON.stringify([
        {
          name: 'Introduction',
          url: 'https://podman-desktop.io/docs/intro',
        },
      ]),
    );
  });

  test('should generate JSON file for tutorial section', async () => {
    const sidebarItems = [
      {
        type: 'doc' as const,
        id: 'index',
        label: 'Introduction',
      },
    ];

    await generateJsonOverviewFile(sidebarItems, 'tutorial', 'https://podman-desktop.io', './static/tutorials.json');

    expect(writeFile).toHaveBeenCalledWith(
      './static/tutorials.json',
      JSON.stringify([
        {
          name: 'Introduction',
          url: 'https://podman-desktop.io/tutorial',
        },
      ]),
    );
  });

  test('should sort items alphabetically by name', async () => {
    const sidebarItems = [
      {
        type: 'doc' as const,
        id: 'zebra',
        label: 'Zebra',
      },
      {
        type: 'doc' as const,
        id: 'apple',
        label: 'Apple',
      },
      {
        type: 'doc' as const,
        id: 'banana',
        label: 'Banana',
      },
    ];

    await generateJsonOverviewFile(sidebarItems, 'docs', 'https://podman-desktop.io', './static/docs.json');

    const expectedContent = JSON.stringify([
      {
        name: 'Apple',
        url: 'https://podman-desktop.io/docs/apple',
      },
      {
        name: 'Banana',
        url: 'https://podman-desktop.io/docs/banana',
      },
      {
        name: 'Zebra',
        url: 'https://podman-desktop.io/docs/zebra',
      },
    ]);

    expect(writeFile).toHaveBeenCalledWith('./static/docs.json', expectedContent);
  });

  test('should propagate writeFile errors', async () => {
    const mockError = new Error('Write failed');
    vi.mocked(writeFile).mockRejectedValueOnce(mockError);

    const sidebarItems = [
      {
        type: 'doc' as const,
        id: 'intro',
        label: 'Introduction',
      },
    ];

    // Should throw the error
    await expect(
      generateJsonOverviewFile(sidebarItems, 'docs', 'https://podman-desktop.io', './static/docs.json'),
    ).rejects.toThrow('Write failed');
  });
});
