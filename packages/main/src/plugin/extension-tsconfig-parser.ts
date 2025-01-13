/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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
import { resolve } from 'node:path';

import type { FileMatcher } from 'get-tsconfig';
import { createFilesMatcher, getTsconfig } from 'get-tsconfig';

/**
 * Responsible to parse all the tsconfig.json files from an extension
 * and provide a list of all pattern having source files
 */
export class ExtensionTypeScriptConfigParser {
  #rootPath: string;

  constructor(rootPath: string) {
    this.#rootPath = rootPath;
  }

  async analyze(): Promise<FileMatcher | undefined> {
    // read all tsconfig.json files not being in node_modules
    // and parse them to extract all the patterns

    // find all tsconfig.json files from rootPath folder
    // do we have a tsconfig.json file in the rootPath ?
    const tsConfigJsonPath = resolve(this.#rootPath, 'tsconfig.json');

    if (existsSync(tsConfigJsonPath)) {
      const tsConfig = getTsconfig(tsConfigJsonPath);
      if (tsConfig) {
        return createFilesMatcher(tsConfig);
      }
    }
    return undefined;
  }
}
