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

import { inject, injectable, postConstruct } from 'inversify';

import { AnalyzedExtension, ExtensionAnalyzer } from '/@/plugin/extension/extension-analyzer.js';

const EXTENSION_OPTION = '--extension-folder';

@injectable()
export class ExtensionsExternal {
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
    // Get the external foldr extensions
    const externalExtensions = await this.readExternalFolders();
    this.#extensions = await Promise.all(
      externalExtensions.map(folder =>
        this.extensionAnalyzer.analyzeExtension({
          extensionPath: folder,
          removable: false,
          devMode: true,
        }),
      ),
    );
  }

  async readExternalFolders(): Promise<string[]> {
    const pathes = [];
    for (let index = 0; index < process.argv.length; index++) {
      if (process.argv[index] === EXTENSION_OPTION && index < process.argv.length - 1) {
        pathes.push(process.argv[++index]);
      }
    }
    // filter all undefined values
    return pathes.filter(path => path !== undefined);
  }
}
