/**********************************************************************
 * Copyright (C) 2022-2025 Red Hat, Inc.
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

import * as fs from 'node:fs';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

import type * as containerDesktopAPI from '@podman-desktop/api';
import { injectable } from 'inversify';

export interface AnalyzedExtension {
  id: string;
  name: string;
  // root folder (where is package.json)
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  manifest: any;
  // main entry
  mainPath?: string;
  api?: typeof containerDesktopAPI;
  removable: boolean;

  // true if the extension is running in development mode
  // it means we're using a separate development folder
  devMode: boolean;

  readme: string;

  update?: {
    version: string;
    ociUri: string;
  };

  missingDependencies?: string[];
  circularDependencies?: string[];

  error?: string;

  readonly subscriptions: containerDesktopAPI.Disposable[];

  dispose(): void;
}

export interface ExtensionAnalyzerOptions {
  extensionPath: string;
  removable: boolean;
  devMode?: boolean;
}

@injectable()
export class ExtensionAnalyzer {
  async analyzeExtension({ extensionPath, removable, devMode }: ExtensionAnalyzerOptions): Promise<AnalyzedExtension> {
    const resolvedExtensionPath = await realpath(extensionPath);
    // do nothing if there is no package.json file
    let error = undefined;
    if (!fs.existsSync(path.resolve(resolvedExtensionPath, 'package.json'))) {
      error = `Ignoring extension ${resolvedExtensionPath} without package.json file`;
      console.warn(error);
      const analyzedExtension: AnalyzedExtension = {
        id: '<unknown>',
        name: '<unknown>',
        path: resolvedExtensionPath,
        manifest: undefined,
        readme: '',
        api: <typeof containerDesktopAPI>{},
        removable: removable,
        devMode: devMode ?? false,
        subscriptions: [],
        dispose(): void {},
        error,
      };
      return analyzedExtension;
    }

    // log error if the manifest is missing required entries
    const manifest = await this.loadManifest(resolvedExtensionPath);
    if (!manifest.name || !manifest.displayName || !manifest.version || !manifest.publisher || !manifest.description) {
      error = `Extension ${resolvedExtensionPath} missing required manifest entry in package.json (name, displayName, version, publisher, description)`;
      console.warn(error);
    }

    // create api object
    const disposables: containerDesktopAPI.Disposable[] = [];

    // is there a README.md file in the extension folder ?
    let readme = '';
    if (fs.existsSync(path.resolve(resolvedExtensionPath, 'README.md'))) {
      readme = await readFile(path.resolve(resolvedExtensionPath, 'README.md'), 'utf8');
    }

    const analyzedExtension: AnalyzedExtension = {
      id: `${manifest.publisher}.${manifest.name}`,
      name: manifest.name,
      manifest,
      path: resolvedExtensionPath,
      mainPath: manifest.main ? path.resolve(resolvedExtensionPath, manifest.main) : undefined,
      readme,
      removable,
      devMode: devMode ?? false,
      subscriptions: disposables,
      dispose(): void {
        for (const disposable of disposables) {
          disposable.dispose();
        }
      },
      error,
    };

    return analyzedExtension;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async loadManifest(extensionPath: string): Promise<any> {
    const manifestPath = path.join(extensionPath, 'package.json');
    return new Promise((resolve, reject) => {
      fs.readFile(manifestPath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }
}
