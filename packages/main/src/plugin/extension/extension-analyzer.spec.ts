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

import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { ExtensionManifest } from './extension-analyzer.js';
import { ExtensionAnalyzer } from './extension-analyzer.js';

let extensionAnalyzer: ExtensionAnalyzer;

vi.mock('node:fs');
vi.mock('node:fs/promises');

beforeEach(() => {
  vi.resetAllMocks();
  extensionAnalyzer = new ExtensionAnalyzer();
});

describe('analyze extension and main', () => {
  test('check for extension with main entry', async () => {
    // mock fs.existsSync
    const fsExistsSyncMock = vi.spyOn(fs, 'existsSync');
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
    vi.mock('node:fs');
    vi.mock('node:fs/promises');

    // mock fs.existsSync
    const fsExistsSyncMock = vi.spyOn(fs, 'existsSync');
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
    vi.mock('node:fs');

    // mock fs.existsSync
    const fsExistsSyncMock = vi.spyOn(fs, 'existsSync');
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
    vi.mock('node:fs');

    // mock fs.existsSync
    const fsExistsSyncMock = vi.spyOn(fs, 'existsSync');
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
});
