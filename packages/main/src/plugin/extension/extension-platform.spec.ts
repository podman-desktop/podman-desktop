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

import { arch, platform } from 'node:os';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { ExtensionPlatformService } from './extension-platform.js';

let extensionPlatformService: ExtensionPlatformService;

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

describe('checkPlatform', () => {
  beforeEach(() => {
    vi.mocked(platform).mockReturnValue('darwin');
    vi.mocked(arch).mockReturnValue('arm64');
  });

  test('allows an extension which does not declare any platform', () => {
    expect(extensionPlatformService.checkPlatform({ name: 'apple-container' })).toBeUndefined();
  });

  test('allows an extension supporting the current platform', () => {
    expect(
      extensionPlatformService.checkPlatform({ targetPlatforms: ['darwin/amd64', 'darwin/arm64'] }),
    ).toBeUndefined();
  });

  test.each([['darwin/amd64'], ['windows/amd64'], ['linux/arm64'], ['freebsd/amd64']])(
    'rejects an extension supporting only %s',
    targetPlatform => {
      expect(extensionPlatformService.checkPlatform({ targetPlatforms: [targetPlatform] })).toBe(
        `supports ${targetPlatform} and cannot run on darwin/arm64`,
      );
    },
  );

  test('lists every declared platform when rejecting an extension', () => {
    expect(extensionPlatformService.checkPlatform({ targetPlatforms: ['windows/amd64', 'linux/amd64'] })).toBe(
      'supports windows/amd64, linux/amd64 and cannot run on darwin/arm64',
    );
  });

  test.each([
    { name: 'an empty list', targetPlatforms: [] },
    { name: 'an entry which is not an os/architecture value', targetPlatforms: ['darwin-arm64'] },
    { name: 'a known operating system with an unknown architecture', targetPlatforms: ['windows/x64'] },
    { name: 'a value which is not a list', targetPlatforms: 'darwin/arm64' },
  ])('rejects $name', ({ targetPlatforms }) => {
    expect(extensionPlatformService.checkPlatform({ targetPlatforms })).toBe(
      'declares an invalid targetPlatforms list',
    );
  });

  test('does not reject an unknown host platform', () => {
    vi.mocked(platform).mockReturnValue('freebsd');
    vi.mocked(arch).mockReturnValue('x64');

    expect(extensionPlatformService.checkPlatform({ targetPlatforms: ['darwin/arm64'] })).toBeUndefined();
  });
});
