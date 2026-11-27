/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import { readFile } from 'node:fs/promises';
import { arch, platform } from 'node:os';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { ExtensionPlatformService } from './extension-platform.js';

const MANIFEST_PATH = '/fake/tmp/extension/package.json';

let extensionPlatformService: ExtensionPlatformService;

vi.mock(import('node:fs/promises'));
vi.mock(import('node:os'));

beforeEach(() => {
  vi.resetAllMocks();

  extensionPlatformService = new ExtensionPlatformService();
});

describe('toExtensionPlatform', () => {
  test.each([
    { platform: 'darwin', arch: 'arm64', expected: 'darwin/arm64' },
    { platform: 'darwin', arch: 'x64', expected: 'darwin/amd64' },
    { platform: 'linux', arch: 'x64', expected: 'linux/amd64' },
    { platform: 'linux', arch: 'arm64', expected: 'linux/arm64' },
    { platform: 'win32', arch: 'x64', expected: 'windows/amd64' },
    { platform: 'win32', arch: 'arm64', expected: 'windows/arm64' },
  ])('converts $platform/$arch to $expected', ({ platform, arch, expected }) => {
    expect(extensionPlatformService.toExtensionPlatform(platform, arch)).toBe(expected);
  });

  test.each([
    { platform: 'freebsd', arch: 'x64' },
    { platform: 'win32', arch: 'ia32' },
    { platform: 'linux', arch: 'ppc64' },
  ])('returns undefined for the unsupported pair $platform/$arch', ({ platform, arch }) => {
    expect(extensionPlatformService.toExtensionPlatform(platform, arch)).toBeUndefined();
  });
});

describe('getCurrentPlatform', () => {
  test('returns the platform of a macOS arm64 host', () => {
    vi.mocked(platform).mockReturnValue('darwin');
    vi.mocked(arch).mockReturnValue('arm64');

    expect(extensionPlatformService.getCurrentPlatform()).toBe('darwin/arm64');
  });

  test('returns the platform of a Windows x64 host', () => {
    vi.mocked(platform).mockReturnValue('win32');
    vi.mocked(arch).mockReturnValue('x64');

    expect(extensionPlatformService.getCurrentPlatform()).toBe('windows/amd64');
  });

  test('returns undefined for an unknown host', () => {
    vi.mocked(platform).mockReturnValue('freebsd');
    vi.mocked(arch).mockReturnValue('x64');

    expect(extensionPlatformService.getCurrentPlatform()).toBeUndefined();
  });
});

describe('isSupported', () => {
  test('supports the declared platform', () => {
    expect(extensionPlatformService.isSupported(['darwin/arm64'], 'darwin/arm64')).toBe(true);
    expect(extensionPlatformService.isSupported(['darwin/amd64', 'darwin/arm64'], 'darwin/arm64')).toBe(true);
  });

  test('rejects an undeclared platform', () => {
    expect(extensionPlatformService.isSupported(['darwin/arm64'], 'darwin/amd64')).toBe(false);
    expect(extensionPlatformService.isSupported(['darwin/arm64'], 'windows/amd64')).toBe(false);
    expect(extensionPlatformService.isSupported(['darwin/arm64'], 'linux/arm64')).toBe(false);
  });

  test('rejects every known host when only an unverified platform is declared', () => {
    for (const host of [
      'darwin/arm64',
      'darwin/amd64',
      'linux/amd64',
      'linux/arm64',
      'windows/amd64',
      'windows/arm64',
    ]) {
      expect(extensionPlatformService.isSupported(['freebsd/amd64'], host)).toBe(false);
    }
  });

  test('does not reject an unknown host platform', () => {
    expect(extensionPlatformService.isSupported(['darwin/arm64'], undefined)).toBe(true);
  });
});

describe('getUnsupportedReason', () => {
  test('allows an extension which does not declare any platform', () => {
    vi.mocked(platform).mockReturnValue('darwin');
    vi.mocked(arch).mockReturnValue('arm64');

    expect(extensionPlatformService.getUnsupportedReason({ kind: 'unrestricted' }, 'installed')).toBeUndefined();
  });

  test('allows an extension supporting the current platform', () => {
    vi.mocked(platform).mockReturnValue('darwin');
    vi.mocked(arch).mockReturnValue('arm64');

    expect(
      extensionPlatformService.getUnsupportedReason({ kind: 'restricted', platforms: ['darwin/arm64'] }, 'installed'),
    ).toBeUndefined();
  });

  test('reports an extension which cannot be installed on the current platform', () => {
    vi.mocked(platform).mockReturnValue('darwin');
    vi.mocked(arch).mockReturnValue('arm64');

    expect(
      extensionPlatformService.getUnsupportedReason({ kind: 'restricted', platforms: ['windows/amd64'] }, 'installed'),
    ).toBe('supports windows/amd64 and cannot be installed on darwin/arm64');
  });

  test('reports an invalid declaration', () => {
    vi.mocked(platform).mockReturnValue('darwin');
    vi.mocked(arch).mockReturnValue('arm64');

    expect(extensionPlatformService.getUnsupportedReason({ kind: 'invalid' }, 'installed')).toBe(
      'declares an invalid targetPlatforms list and cannot be installed',
    );
  });

  test('does not reject an unknown host platform', () => {
    vi.mocked(platform).mockReturnValue('freebsd');
    vi.mocked(arch).mockReturnValue('x64');

    expect(
      extensionPlatformService.getUnsupportedReason({ kind: 'restricted', platforms: ['darwin/arm64'] }, 'installed'),
    ).toBeUndefined();
  });
});

describe('readDeclaredPlatforms', () => {
  test('reads the platforms of the extension manifest', async () => {
    vi.mocked(readFile).mockResolvedValue(
      JSON.stringify({ name: 'apple-container', targetPlatforms: ['darwin/arm64'] }),
    );

    await expect(extensionPlatformService.readDeclaredPlatforms(MANIFEST_PATH)).resolves.toStrictEqual({
      kind: 'restricted',
      platforms: ['darwin/arm64'],
    });
    expect(vi.mocked(readFile)).toHaveBeenCalledWith(MANIFEST_PATH, { encoding: 'utf-8' });
  });

  test('returns unrestricted when the extension does not declare any platform', async () => {
    vi.mocked(readFile).mockResolvedValue(JSON.stringify({ name: 'apple-container' }));

    await expect(extensionPlatformService.readDeclaredPlatforms(MANIFEST_PATH)).resolves.toStrictEqual({
      kind: 'unrestricted',
    });
  });

  test('returns invalid for an empty list', async () => {
    vi.mocked(readFile).mockResolvedValue(JSON.stringify({ targetPlatforms: [] }));

    await expect(extensionPlatformService.readDeclaredPlatforms(MANIFEST_PATH)).resolves.toStrictEqual({
      kind: 'invalid',
    });
  });

  test('returns invalid for an entry which is not an os/architecture value', async () => {
    vi.mocked(readFile).mockResolvedValue(JSON.stringify({ targetPlatforms: ['darwin-arm64'] }));

    await expect(extensionPlatformService.readDeclaredPlatforms(MANIFEST_PATH)).resolves.toStrictEqual({
      kind: 'invalid',
    });
  });

  test('returns invalid for a known operating system with an unknown architecture', async () => {
    vi.mocked(readFile).mockResolvedValue(JSON.stringify({ targetPlatforms: ['windows/x64'] }));

    await expect(extensionPlatformService.readDeclaredPlatforms(MANIFEST_PATH)).resolves.toStrictEqual({
      kind: 'invalid',
    });
  });

  test('returns restricted for an unverified platform', async () => {
    vi.mocked(readFile).mockResolvedValue(JSON.stringify({ targetPlatforms: ['freebsd/amd64'] }));

    await expect(extensionPlatformService.readDeclaredPlatforms(MANIFEST_PATH)).resolves.toStrictEqual({
      kind: 'restricted',
      platforms: ['freebsd/amd64'],
    });
  });

  test('returns unrestricted when the manifest cannot be read', async () => {
    vi.mocked(readFile).mockRejectedValue(new Error('ENOENT'));

    await expect(extensionPlatformService.readDeclaredPlatforms(MANIFEST_PATH)).resolves.toStrictEqual({
      kind: 'unrestricted',
    });
  });

  test('returns unrestricted when the manifest is not valid JSON', async () => {
    vi.mocked(readFile).mockResolvedValue('not a json file');

    await expect(extensionPlatformService.readDeclaredPlatforms(MANIFEST_PATH)).resolves.toStrictEqual({
      kind: 'unrestricted',
    });
  });

  test('returns unrestricted when the manifest is not an object', async () => {
    vi.mocked(readFile).mockResolvedValue(JSON.stringify(['darwin/arm64']));

    await expect(extensionPlatformService.readDeclaredPlatforms(MANIFEST_PATH)).resolves.toStrictEqual({
      kind: 'unrestricted',
    });
  });
});
