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
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { inject, injectable, postConstruct } from 'inversify';

import { type AnalyzedExtension, ExtensionAnalyzer } from '/@/plugin/extension/extension-analyzer.js';

@injectable()
export class ExtensionsBundle {
  #extensions: Array<AnalyzedExtension> = [];

  constructor(
    @inject(ExtensionAnalyzer)
    private extensionAnalyzer: ExtensionAnalyzer,
  ) {}

  all(): ReadonlyArray<AnalyzedExtension> {
    return this.#extensions;
  }

  @postConstruct()
  async init(): Promise<void> {
    let folders: string[];
    // scan all extensions that we can find from the extensions folder
    if (import.meta.env.PROD) {
      // in production mode, use the extensions & extensions-extra locally
      const promises = await Promise.all([
        this.readProductionFolders(join(__dirname, '../../../extensions')),
        this.readDevelopmentFolders(join(process.resourcesPath, 'extensions-extra')),
      ]);

      folders = promises.flat();
    } else {
      // in development mode, use the extensions locally
      folders = await this.readDevelopmentFolders(join(__dirname, '../../../extensions'));
    }

    this.#extensions = await Promise.all(
      folders.map(folder =>
        this.extensionAnalyzer.analyzeExtension({
          extensionPath: folder,
          bundled: true,
          removable: false,
          devMode: false,
        }),
      ),
    );
  }

  protected async readDevelopmentFolders(folderPath: string): Promise<string[]> {
    // only readdir on existing folder
    if (!existsSync(folderPath)) return [];

    const entries = await readdir(folderPath, { withFileTypes: true });
    // filter only directories ignoring node_modules directory
    return entries
      .filter(entry => entry.isDirectory() && entry.name !== 'node_modules')
      .reduce((directories: string[], directory) => {
        const apiExtFolder = join(folderPath, directory.name, 'packages', 'extension');
        const plainExtFolder = join(folderPath, directory.name);
        if (existsSync(join(apiExtFolder, 'package.json'))) {
          directories.push(apiExtFolder);
        } else if (existsSync(join(plainExtFolder, 'package.json'))) {
          directories.push(plainExtFolder);
        }
        return directories;
      }, []);
  }

  protected async readProductionFolders(folderPath: string): Promise<string[]> {
    // only readdir on existing folder
    if (!existsSync(folderPath)) return [];

    const entries = await readdir(folderPath, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory() && entry.name !== 'node_modules')
      .map(directory => {
        const rootExtPath = join(folderPath, directory.name);
        const plainExtPath = join(rootExtPath, 'builtin', `${directory.name}.cdix`);
        return existsSync(plainExtPath)
          ? plainExtPath
          : join(rootExtPath, 'packages', 'extension', 'builtin', `${directory.name}.cdix`);
      });
  }
}
