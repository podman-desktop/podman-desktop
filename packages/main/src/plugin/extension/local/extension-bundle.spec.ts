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

import { type Dirent, existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import path, { join } from 'node:path';

import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { ExtensionAnalyzer } from '/@/plugin/extension/extension-analyzer.js';
import { ExtensionsBundle } from '/@/plugin/extension/local/extensions-bundle.js';

vi.mock(import('node:fs'));
vi.mock(import('node:fs/promises'));

// mock fs.promises.readdir and use Dirent<string> as return type
const readdirMock = vi.mocked(
  readdir as (path: string, options?: { withFileTypes: true }) => Promise<Dirent<string>[]>,
);

const EXTENSION_ANALYZER = {
  analyzeExtension: vi.fn(),
} as unknown as ExtensionAnalyzer;

class ExtensionBundleTest extends ExtensionsBundle {
  public override async readDevelopmentFolders(folderPath: string): Promise<string[]> {
    return super.readDevelopmentFolders(folderPath);
  }

  public override async readProductionFolders(folderPath: string): Promise<string[]> {
    return super.readProductionFolders(folderPath);
  }
}

let extensionBundle: ExtensionBundleTest;

beforeEach(() => {
  vi.resetAllMocks();
  Object.defineProperty(process, 'resourcesPath', {
    value: '/resources',
  });

  extensionBundle = new ExtensionBundleTest(EXTENSION_ANALYZER);
});

test('should load extensions & extensions-extra', async () => {
  vi.stubEnv('PROD', true);

  const readProductionFoldersMock = vi.spyOn(extensionBundle, 'readProductionFolders');
  readProductionFoldersMock.mockResolvedValue([]);
  const readDevelopmentFoldersMock = vi.spyOn(extensionBundle, 'readDevelopmentFolders');
  readDevelopmentFoldersMock.mockResolvedValue([]);

  await extensionBundle.init();

  expect(readProductionFoldersMock).toHaveBeenCalledOnce();
  const prodFolder = readProductionFoldersMock.mock.calls[0]?.[0];
  expect(prodFolder?.endsWith('extensions')).toBeTruthy();

  expect(readDevelopmentFoldersMock).toHaveBeenCalledOnce();
  const devFolder = readDevelopmentFoldersMock.mock.calls[0]?.[0];
  expect(devFolder).toEqual(path.join(process.resourcesPath, 'extensions-extra'));
});

describe('loading extension folders', () => {
  const fileEntry = {
    isDirectory: () => false,
  } as unknown as Dirent<string>;
  const nodeModulesEntry = {
    isDirectory: () => true,
    name: 'node_modules',
  } as unknown as Dirent<string>;
  const dirEntry = {
    isDirectory: () => true,
    name: 'extension1',
  } as unknown as Dirent<string>;
  const dirEntry2 = {
    isDirectory: () => true,
    name: 'extension2',
  } as unknown as Dirent<string>;
  const dirEntry3 = {
    isDirectory: () => true,
    name: 'extension3',
  } as unknown as Dirent<string>;
  const dirEntry4 = {
    isDirectory: () => true,
    name: 'extension4',
  } as unknown as Dirent<string>;

  describe('in dev mode', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
      vi.resetAllMocks();
    });

    test('ignores files', async () => {
      readdirMock.mockResolvedValue([fileEntry]);

      const folders = await extensionBundle.readDevelopmentFolders('path');

      expect(folders).length(0);
    });
    test('if folder does not exists do not readdir', async () => {
      vi.mocked(existsSync).mockReturnValue(false);
      const folders = await extensionBundle.readDevelopmentFolders('path');

      expect(folders).length(0);
      expect(readdirMock).not.toHaveBeenCalled();
    });
    test('ignores node_modules folders', async () => {
      readdirMock.mockResolvedValue([nodeModulesEntry]);

      const folders = await extensionBundle.readDevelopmentFolders('path');

      expect(folders).length(0);
    });
    test('ignores folders without package.json', async () => {
      readdirMock.mockResolvedValue([dirEntry]);
      vi.mocked(existsSync)
        // existSync on the folder path => true
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      const folders = await extensionBundle.readDevelopmentFolders('path');

      expect(folders).length(0);
    });

    test('recognizes a plain extension when only ext/package.json is present', async () => {
      readdirMock.mockResolvedValue([dirEntry]);
      vi.mocked(existsSync)
        // existSync on the folder path => true
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);
      const folders = await extensionBundle.readDevelopmentFolders('path');

      expect(folders).length(1);
      expect(folders[0]).toBe(join('path', 'extension1'));
    });

    test('recognizes as an api extension when only ext/packages/extension/package.json is present', async () => {
      readdirMock.mockResolvedValue([dirEntry]);
      vi.mocked(existsSync)
        // existSync on the folder path => true
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true);
      const folders = await extensionBundle.readDevelopmentFolders('path');

      expect(folders).length(1);
      expect(folders[0]).toBe(join('path', 'extension1', 'packages', 'extension'));
    });

    test('recognizes as an api extension when ext/package.json and ext/packages/extension/package.json are present', async () => {
      readdirMock.mockResolvedValue([dirEntry]);
      vi.mocked(existsSync)
        // existSync on the folder path => true
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      const folders = await extensionBundle.readDevelopmentFolders('path');

      expect(folders).length(1);
      expect(folders[0]).toBe(join('path', 'extension1', 'packages', 'extension'));
    });

    test('works correctly for multiple different extensions, files and empty folders', async () => {
      readdirMock.mockResolvedValue([fileEntry, dirEntry, dirEntry2, dirEntry3, dirEntry4]);
      vi.mocked(existsSync)
        // existSync on the folder path => true
        .mockReturnValueOnce(true)
        // an api extension
        .mockReturnValueOnce(true)
        // an plain extension
        .mockReturnValueOnce(false) // plain extension
        // priority to an api extension
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true) // priority to api extension
        // ignore no package.json folders
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false);
      const folders = await extensionBundle.readDevelopmentFolders('path');

      expect(folders).length(3);
      expect(folders[0]).toBe(join('path', 'extension1', 'packages', 'extension'));
      expect(folders[1]).toBe(join('path', 'extension2'));
      expect(folders[2]).toBe(join('path', 'extension3', 'packages', 'extension'));
    });
  });

  describe('in prod mode', () => {
    test('ignores files', async () => {
      readdirMock.mockResolvedValue([fileEntry]);

      const folders = await extensionBundle.readProductionFolders('path');

      expect(folders).length(0);
    });
    test('ignores node_modules folders', async () => {
      readdirMock.mockResolvedValue([nodeModulesEntry]);

      const folders = await extensionBundle.readProductionFolders('path');

      expect(folders).length(0);
    });
    test('recognizes a plain extension when only ext/package.json is present', async () => {
      readdirMock.mockResolvedValue([dirEntry]);
      vi.mocked(existsSync)
        // existSync on the folder path => true
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true);
      const folders = await extensionBundle.readProductionFolders('path');

      expect(folders).length(1);
      expect(folders[0]).toBe(join('path', 'extension1', 'builtin', 'extension1.cdix'));
    });
    test('recognizes an api extension when ext/package.json is not present', async () => {
      readdirMock.mockResolvedValue([dirEntry]);
      vi.mocked(existsSync)
        // existSync on the folder path => true
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);
      const folders = await extensionBundle.readProductionFolders('path');

      expect(folders).length(1);
      expect(folders[0]).toBe(join('path', 'extension1', 'packages', 'extension', 'builtin', `extension1.cdix`));
    });
  });
});
