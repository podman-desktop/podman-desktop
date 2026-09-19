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

import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { AnalyzedExtension, ExtensionAnalyzer } from '/@/plugin/extension/extension-analyzer.js';
import { ExtensionsExternal } from '/@/plugin/extension/local/extensions-external.js';

const EXTENSION_ANALYZER = {
  analyzeExtension: vi.fn(),
} as unknown as ExtensionAnalyzer;

let extensionsExternal: ExtensionsExternal;

beforeEach(() => {
  vi.resetAllMocks();
  extensionsExternal = new ExtensionsExternal(EXTENSION_ANALYZER);
});

describe('readExternalFolders', () => {
  test('should return empty array when no --extension-folder args', async () => {
    vi.stubGlobal('process', { argv: ['electron', 'main.js'] });

    const folders = await extensionsExternal.readExternalFolders();

    expect(folders).toEqual([]);
  });

  test('should return folder path when --extension-folder is provided', async () => {
    vi.stubGlobal('process', { argv: ['electron', 'main.js', '--extension-folder', '/path/to/ext'] });

    const folders = await extensionsExternal.readExternalFolders();

    expect(folders).toEqual(['/path/to/ext']);
  });

  test('should return multiple folder paths for multiple --extension-folder args', async () => {
    vi.stubGlobal('process', {
      argv: ['electron', 'main.js', '--extension-folder', '/ext1', '--extension-folder', '/ext2'],
    });

    const folders = await extensionsExternal.readExternalFolders();

    expect(folders).toEqual(['/ext1', '/ext2']);
  });

  test('should ignore --extension-folder at the end without a value', async () => {
    vi.stubGlobal('process', { argv: ['electron', 'main.js', '--extension-folder'] });

    const folders = await extensionsExternal.readExternalFolders();

    expect(folders).toEqual([]);
  });
});

describe('init', () => {
  test('should analyze each external folder extension', async () => {
    vi.stubGlobal('process', {
      argv: ['electron', 'main.js', '--extension-folder', '/ext1', '--extension-folder', '/ext2'],
    });

    const fakeExtension1 = { id: 'ext1' } as unknown as AnalyzedExtension;
    const fakeExtension2 = { id: 'ext2' } as unknown as AnalyzedExtension;

    vi.mocked(EXTENSION_ANALYZER.analyzeExtension)
      .mockResolvedValueOnce(fakeExtension1)
      .mockResolvedValueOnce(fakeExtension2);

    await extensionsExternal.init();

    expect(EXTENSION_ANALYZER.analyzeExtension).toHaveBeenCalledTimes(2);
    expect(EXTENSION_ANALYZER.analyzeExtension).toHaveBeenCalledWith({
      extensionPath: '/ext1',
      removable: false,
      devMode: true,
    });
    expect(EXTENSION_ANALYZER.analyzeExtension).toHaveBeenCalledWith({
      extensionPath: '/ext2',
      removable: false,
      devMode: true,
    });

    expect(extensionsExternal.all()).toEqual([fakeExtension1, fakeExtension2]);
  });

  test('should set empty extensions when no --extension-folder args', async () => {
    vi.stubGlobal('process', { argv: ['electron', 'main.js'] });

    await extensionsExternal.init();

    expect(EXTENSION_ANALYZER.analyzeExtension).not.toHaveBeenCalled();
    expect(extensionsExternal.all()).toEqual([]);
  });
});
