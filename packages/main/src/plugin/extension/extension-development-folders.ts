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

import type { ConfigurationRegistry, IConfigurationNode } from '/@/plugin/configuration-registry.js';
import { Emitter } from '/@/plugin/events/emitter.js';
import type { ExtensionDevelopmentFolderInfo } from '/@api/extension-development-folders-info.js';
import { ExtensionDevelopmentFolderInfoSettings } from '/@api/extension-development-folders-info.js';

import type { ApiSenderType } from '../api.js';
import type { AnalyzedExtension, ExtensionAnalyzer } from './extension-analyzer.js';

// Handle the registration / track of all development folders used when developing extensions
export class ExtensionDevelopmentFolders {
  #configurationRegistry: ConfigurationRegistry;

  #apiSender: ApiSenderType;

  #firstLaunch = true;

  #developmentFolders: string[] = [];

  #extensionAnalyzer: ExtensionAnalyzer;

  // event that will be fired
  #onDidUpdateDevelopmentFolders: Emitter<ExtensionDevelopmentFolderInfo[]> = new Emitter<
    ExtensionDevelopmentFolderInfo[]
  >();
  onDidUpdateDevelopmentFolders = this.#onDidUpdateDevelopmentFolders.event;

  // event that will be fired when an extension needs to be loaded
  #onRequestLoadExension: Emitter<AnalyzedExtension> = new Emitter<AnalyzedExtension>();
  onNeedToLoadExension = this.#onRequestLoadExension.event;

  constructor(
    configurationRegistry: ConfigurationRegistry,
    extensionAnalyzer: ExtensionAnalyzer,
    apiSender: ApiSenderType,
  ) {
    this.#configurationRegistry = configurationRegistry;
    this.#extensionAnalyzer = extensionAnalyzer;
    this.#apiSender = apiSender;
  }

  protected refreshFolders(): void {
    const updatedFolders = this.#configurationRegistry
      .getConfiguration(ExtensionDevelopmentFolderInfoSettings.SectionName)
      .get<string[]>(ExtensionDevelopmentFolderInfoSettings.DevelopmentExtensionsFolders, []);

    // first launch ? send the initial value as well
    // or when value is being changed
    if (this.#firstLaunch || JSON.stringify(this.#developmentFolders) !== JSON.stringify(updatedFolders)) {
      this.#developmentFolders = updatedFolders;
      this.#onDidUpdateDevelopmentFolders.fire(this.getDevelopmentFolders());
    }
  }

  init(): void {
    const developmentExtensionsFoldersConfiguration: IConfigurationNode = {
      id: 'preferences.extensions',
      title: 'Extensions',
      type: 'object',
      properties: {
        [`${ExtensionDevelopmentFolderInfoSettings.SectionName}.${ExtensionDevelopmentFolderInfoSettings.DevelopmentExtensionsFolders}`]:
          {
            description: 'List of extension folders to monitor',
            type: 'array',
            default: [],
            hidden: true,
          },
      },
    };
    this.#configurationRegistry.registerConfigurations([developmentExtensionsFoldersConfiguration]);

    // refresh the value when the property is changed
    this.#configurationRegistry.onDidChangeConfiguration(event => {
      if (
        event.key ===
        `${ExtensionDevelopmentFolderInfoSettings.SectionName}.${ExtensionDevelopmentFolderInfoSettings.DevelopmentExtensionsFolders}`
      ) {
        this.refreshFolders();
      }
    });

    // initialize and track all development folders
    this.refreshFolders();

    this.#firstLaunch = false;
  }

  protected async saveToConfiguration(): Promise<void> {
    await this.#configurationRegistry
      .getConfiguration(ExtensionDevelopmentFolderInfoSettings.SectionName)
      .update(ExtensionDevelopmentFolderInfoSettings.DevelopmentExtensionsFolders, this.#developmentFolders);

    // send an event to refresh the value
    this.#apiSender.send('extensions-development-folders-changed');
  }

  async addDevelopmentFolder(path: string): Promise<void> {
    // check the path is not already in the list
    if (this.#developmentFolders.includes(path)) {
      throw new Error(`Path ${path} already exist in the list`);
    }

    // before adding the path, check it's a valid extension path
    const analyzedExtension = await this.#extensionAnalyzer.analyzeExtension(path, false);
    // if there is an error, abort
    if (analyzedExtension.error) {
      throw new Error(analyzedExtension.error);
    }

    this.#developmentFolders.push(path);

    // persist the changes
    await this.saveToConfiguration();
    this.#onDidUpdateDevelopmentFolders.fire(this.getDevelopmentFolders());

    // ask to load the extension
    this.#onRequestLoadExension.fire(analyzedExtension);
  }

  async removeDevelopmentFolder(path: string): Promise<void> {
    this.#developmentFolders = this.#developmentFolders.filter(folder => folder !== path);

    // persist the changes
    await this.saveToConfiguration();

    // dispatch
    this.#onDidUpdateDevelopmentFolders.fire(this.getDevelopmentFolders());
  }

  getDevelopmentFolders(): ExtensionDevelopmentFolderInfo[] {
    return this.#developmentFolders.map(path => ({ path }));
  }
}
