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
import { z } from 'zod';

import { RawCommandSchema } from '/@/plugin/command-registry.js';
import { IConfigurationNodeSchema } from '/@api/configuration/models.js';
import { IconsContributionSchema } from '/@api/icon-info.js';
import { MenuRecordSchema } from '/@api/menu.js';
import { OnboardingSchema } from '/@api/onboarding.js';
import { RawThemeContributionSchema } from '/@api/theme-info.js';
import { ViewContributionRecordSchema } from '/@api/view-info.js';

export const ExtensionManifestSchema = z
  .object({
    name: z.string(),
    displayName: z.string(),
    version: z.string(),
    publisher: z.string(),
    description: z.string(),
    main: z.string().optional(),
    icon: z.union([z.string(), z.object({ light: z.string(), dark: z.string() })]).optional(),
    extensionDependencies: z.array(z.string()).optional(),
    extensionPack: z.array(z.string()).optional(),
    engines: z
      .object({
        'podman-desktop': z.string().optional(),
      })
      .optional(),
    contributes: z
      .object({
        configuration: IConfigurationNodeSchema.optional(),
        commands: z.array(RawCommandSchema).optional(),
        menus: MenuRecordSchema.optional(),
        icons: IconsContributionSchema.optional(),
        themes: z.array(RawThemeContributionSchema).optional(),
        views: ViewContributionRecordSchema.optional(),
        onboarding: OnboardingSchema.optional(),
        features: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .loose();

export type ExtensionManifest = z.infer<typeof ExtensionManifestSchema>;

export interface AnalyzedExtension {
  id: string;
  name: string;
  // root folder (where is package.json)
  path: string;
  manifest: ExtensionManifest;
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
        manifest: {} as unknown as ExtensionManifest,
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

  async loadManifest(extensionPath: string): Promise<ExtensionManifest> {
    const manifestPath = path.join(extensionPath, 'package.json');
    return new Promise((resolve, reject) => {
      fs.readFile(manifestPath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {
            const manifest = JSON.parse(data);
            // try to parse using zod
            const result = ExtensionManifestSchema.safeParse(manifest);
            if (result.success) {
              resolve(result.data);
            } else {
              console.error(
                `Error while parsing manifest for extension ${extensionPath}. ${result.error.issues
                  .map(issue => issue.message)
                  .join(', ')}`,
              );
              // return the manifest as it is, even if it is not valid
              resolve(manifest as ExtensionManifest);
            }
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  }
}
