/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from 'node:fs';
import { readFile, realpath } from 'node:fs/promises';
import * as path from 'node:path';

import { assert, beforeEach, describe, expect, test, vi } from 'vitest';

import { ExtensionAnalyzer } from './extension-analyzer.js';
import type { ExtensionManifest } from './extension-manifest-schema.js';
import { ExtensionPlatformService } from './extension-platform.js';

let extensionAnalyzer: ExtensionAnalyzer;
let extensionPlatformService: ExtensionPlatformService;

vi.mock(import('node:fs'));
vi.mock(import('node:fs/promises'));
vi.mock(import('./extension-platform.js'));

beforeEach(() => {
  vi.resetAllMocks();
  extensionPlatformService = new ExtensionPlatformService();
  vi.mocked(extensionPlatformService.analyzeDeclaredPlatforms).mockReturnValue({ kind: 'unrestricted' });
  vi.mocked(extensionPlatformService.getUnsupportedReason).mockReturnValue(undefined);
  extensionAnalyzer = new ExtensionAnalyzer(extensionPlatformService);
});

describe('analyze extension and main', () => {
  test('check for extension with main entry', async () => {
    // mock fs.existsSync
    const fsExistsSyncMock = vi.mocked(fs.existsSync);
    fsExistsSyncMock.mockReturnValue(true);

    const readmeContent = 'This is my custom README';

    vi.mocked(realpath).mockResolvedValue('/fake/path');
    // mock readFile
    vi.mocked(readFile).mockResolvedValue(readmeContent);

    const fakeManifest = {
      publisher: 'fooPublisher',
      name: 'fooName',
      main: 'main-entry.js',
    } as unknown as ExtensionManifest;

    // mock loadManifest
    const loadManifestMock = vi.spyOn(extensionAnalyzer, 'loadManifest');
    loadManifestMock.mockResolvedValue(fakeManifest);

    const extension = await extensionAnalyzer.analyzeExtension({
      extensionPath: path.resolve('/', 'fake', 'path'),
      removable: false,
    });

    expect(extension).toBeDefined();
    expect(extension?.error).toBeDefined();
    expect(extension?.mainPath).toBe(path.resolve('/', 'fake', 'path', 'main-entry.js'));
    expect(extension.readme).toBe(readmeContent);
    expect(extension?.id).toBe('fooPublisher.fooName');
  });

  test('check for extension with linked folder', async () => {
    // mock fs.existsSync
    const fsExistsSyncMock = vi.mocked(fs.existsSync);
    fsExistsSyncMock.mockReturnValue(true);

    const readmeContent = 'This is my custom README';

    vi.mocked(realpath).mockResolvedValue('/fake/path');
    // mock readFile
    vi.mocked(readFile).mockResolvedValue(readmeContent);

    const fakeManifest = {
      publisher: 'fooPublisher',
      name: 'fooName',
      main: 'main-entry.js',
    } as unknown as ExtensionManifest;

    // mock loadManifest
    const loadManifestMock = vi.spyOn(extensionAnalyzer, 'loadManifest');
    loadManifestMock.mockResolvedValue(fakeManifest);

    const extension = await extensionAnalyzer.analyzeExtension({
      extensionPath: path.resolve('/', 'linked', 'path'),
      removable: false,
    });

    expect(extension).toBeDefined();
    expect(extension?.error).toBeDefined();
    expect(extension?.mainPath).toBe(path.resolve('/', 'fake', 'path', 'main-entry.js'));
    expect(extension.readme).toBe(readmeContent);
    expect(extension?.id).toBe('fooPublisher.fooName');
  });

  test('check for extension without main entry', async () => {
    // mock fs.existsSync
    const fsExistsSyncMock = vi.mocked(fs.existsSync);
    fsExistsSyncMock.mockReturnValue(true);

    vi.mocked(realpath).mockResolvedValue('/fake/path');
    vi.mocked(readFile).mockResolvedValue('empty');

    const fakeManifest = {
      publisher: 'fooPublisher',
      name: 'fooName',
      // no main entry
    } as unknown as ExtensionManifest;

    // mock loadManifest
    const loadManifestMock = vi.spyOn(extensionAnalyzer, 'loadManifest');
    loadManifestMock.mockResolvedValue(fakeManifest);

    const extension = await extensionAnalyzer.analyzeExtension({
      extensionPath: '/fake/path',
      removable: false,
    });

    expect(extension).toBeDefined();
    expect(extension?.error).toBeDefined();
    // not set
    expect(extension?.mainPath).toBeUndefined();
    expect(extension?.id).toBe('fooPublisher.fooName');
  });

  test('check for extension with devMode', async () => {
    // mock fs.existsSync
    const fsExistsSyncMock = vi.mocked(fs.existsSync);
    fsExistsSyncMock.mockReturnValue(true);

    vi.mocked(realpath).mockResolvedValue('/fake/path');
    vi.mocked(readFile).mockResolvedValue('empty');

    const fakeManifest = {
      publisher: 'fooPublisher',
      name: 'fooName',
      // no main entry
    } as unknown as ExtensionManifest;

    // mock loadManifest
    const loadManifestMock = vi.spyOn(extensionAnalyzer, 'loadManifest');
    loadManifestMock.mockResolvedValue(fakeManifest);

    const extension = await extensionAnalyzer.analyzeExtension({
      extensionPath: '/fake/path',
      removable: false,
      devMode: true,
    });

    expect(extension?.id).toBe('fooPublisher.fooName');
    expect(extension?.devMode).toBeTruthy();
  });

  test.each([
    { name: 'overrides is undefined by default', overrides: undefined },
    { name: 'overrides is forwarded', overrides: { id: 'podman-desktop.bundled', version: '1.0.0' } },
  ])('$name', async ({ overrides }) => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(realpath).mockResolvedValue('/fake/path');
    // package.json manifest
    vi.mocked(readFile).mockResolvedValue(
      JSON.stringify({
        publisher: 'fooPublisher',
        name: 'fooName',
        displayName: 'Foo',
        version: '1.0.0',
        description: 'Foo extension',
      }),
    );

    const extension = await extensionAnalyzer.analyzeExtension({
      extensionPath: '/fake/path',
      removable: true,
      overrides,
    });

    expect(extension.id).toBe('fooPublisher.fooName');
    expect(extension.error).toBeUndefined();
    expect(extension.overrides).toEqual(overrides);
  });

  test('overrides is forwarded when the extension has no package.json', async () => {
    // no package.json file
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(realpath).mockResolvedValue('/fake/path');

    const extension = await extensionAnalyzer.analyzeExtension({
      extensionPath: '/fake/path',
      removable: true,
      overrides: { id: 'podman-desktop.bundled', version: '1.0.0' },
    });

    assert(extension.error);
    expect(extension.overrides).toEqual({ id: 'podman-desktop.bundled', version: '1.0.0' });
  });
});

describe('analyze extension and targetPlatforms', () => {
  test('reports an error for an extension which does not support the current platform', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(realpath).mockResolvedValue('/fake/path');
    // package.json manifest
    vi.mocked(readFile).mockResolvedValue(
      JSON.stringify({
        publisher: 'fooPublisher',
        name: 'fooName',
        displayName: 'Foo',
        version: '1.0.0',
        description: 'Foo extension',
        targetPlatforms: ['windows/amd64'],
      }),
    );

    vi.mocked(extensionPlatformService.analyzeDeclaredPlatforms).mockReturnValue({
      kind: 'restricted',
      platforms: ['windows/amd64'],
    });
    vi.mocked(extensionPlatformService.getUnsupportedReason).mockReturnValue(
      'supports windows/amd64 and cannot be loaded on darwin/arm64',
    );

    const extension = await extensionAnalyzer.analyzeExtension({
      extensionPath: '/fake/path',
      removable: false,
    });

    expect(extension.error).toBe('Extension /fake/path supports windows/amd64 and cannot be loaded on darwin/arm64');
    expect(vi.mocked(extensionPlatformService.getUnsupportedReason)).toHaveBeenCalledWith(
      { kind: 'restricted', platforms: ['windows/amd64'] },
      'loaded',
    );
  });

  test('reports an error for an extension declaring an invalid targetPlatforms list', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(realpath).mockResolvedValue('/fake/path');
    // package.json manifest
    vi.mocked(readFile).mockResolvedValue(
      JSON.stringify({
        publisher: 'fooPublisher',
        name: 'fooName',
        displayName: 'Foo',
        version: '1.0.0',
        description: 'Foo extension',
        targetPlatforms: ['darwin-arm64'],
      }),
    );

    vi.mocked(extensionPlatformService.analyzeDeclaredPlatforms).mockReturnValue({ kind: 'invalid' });
    vi.mocked(extensionPlatformService.getUnsupportedReason).mockReturnValue(
      'declares an invalid targetPlatforms list and cannot be loaded',
    );

    const extension = await extensionAnalyzer.analyzeExtension({
      extensionPath: '/fake/path',
      removable: false,
    });

    expect(extension.error).toBe('Extension /fake/path declares an invalid targetPlatforms list and cannot be loaded');
  });

  test('does not report an error for an extension supporting the current platform', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(realpath).mockResolvedValue('/fake/path');
    // package.json manifest
    vi.mocked(readFile).mockResolvedValue(
      JSON.stringify({
        publisher: 'fooPublisher',
        name: 'fooName',
        displayName: 'Foo',
        version: '1.0.0',
        description: 'Foo extension',
        targetPlatforms: ['darwin/arm64'],
      }),
    );

    vi.mocked(extensionPlatformService.analyzeDeclaredPlatforms).mockReturnValue({
      kind: 'restricted',
      platforms: ['darwin/arm64'],
    });
    vi.mocked(extensionPlatformService.getUnsupportedReason).mockReturnValue(undefined);

    const extension = await extensionAnalyzer.analyzeExtension({
      extensionPath: '/fake/path',
      removable: false,
      devMode: true,
    });

    expect(extension.error).toBeUndefined();
  });
});

describe('loadManifest', () => {
  test('returns parsed manifest when schema validation succeeds', async () => {
    const validManifest = {
      name: 'my-ext',
      displayName: 'My Extension',
      version: '1.0.0',
      publisher: 'test',
      description: 'desc',
      main: 'index.js',
    };
    vi.mocked(readFile).mockResolvedValue(JSON.stringify(validManifest));

    const result = await extensionAnalyzer.loadManifest('/some/path');

    expect(result.name).toBe('my-ext');
    expect(result.version).toBe('1.0.0');
    expect(result.main).toBe('index.js');
  });

  test('returns raw manifest and logs error when schema validation fails', async () => {
    const invalidManifest = { name: 123 };
    vi.mocked(readFile).mockResolvedValue(JSON.stringify(invalidManifest));
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await extensionAnalyzer.loadManifest('/bad/extension');

    const expectedError =
      'Error while parsing manifest for extension /bad/extension. ' +
      '✖ Invalid input: expected string, received number\n  → at name\n' +
      '✖ Invalid input: expected string, received undefined\n  → at displayName\n' +
      '✖ Invalid input: expected string, received undefined\n  → at version\n' +
      '✖ Invalid input: expected string, received undefined\n  → at publisher\n' +
      '✖ Invalid input: expected string, received undefined\n  → at description';
    expect(consoleErrorMock).toHaveBeenCalledWith(expectedError);
    expect(result).toEqual(invalidManifest);
  });

  test('preserves unknown fields from the manifest', async () => {
    const manifestWithExtras = {
      name: 'my-ext',
      displayName: 'My Extension',
      version: '1.0.0',
      publisher: 'test',
      description: 'desc',
      scripts: { build: 'tsc' },
      license: 'MIT',
    };
    vi.mocked(readFile).mockResolvedValue(JSON.stringify(manifestWithExtras));

    const result = await extensionAnalyzer.loadManifest('/some/path');

    expect(result.name).toBe('my-ext');
    expect((result as Record<string, unknown>)['scripts']).toEqual({ build: 'tsc' });
    expect((result as Record<string, unknown>)['license']).toBe('MIT');
  });

  test('reads package.json from the given extension path', async () => {
    const validManifest = {
      name: 'my-ext',
      displayName: 'My Extension',
      version: '1.0.0',
      publisher: 'test',
      description: 'desc',
    };
    vi.mocked(readFile).mockResolvedValue(JSON.stringify(validManifest));

    await extensionAnalyzer.loadManifest('/extensions/my-ext');

    expect(readFile).toHaveBeenCalledWith(path.join('/extensions/my-ext', 'package.json'), 'utf8');
  });
});
