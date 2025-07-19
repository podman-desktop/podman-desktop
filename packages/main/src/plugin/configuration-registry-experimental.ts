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

import type * as containerDesktopAPI from '@podman-desktop/api';
import { inject, injectable } from 'inversify';

import type { IConfigurationRegistry } from '/@api/configuration/models.js';

import { ApiSenderType } from './api.js';
import { ConfigurationRegistry } from './configuration-registry.js';
import { Directories } from './directories.js';

export type ExperimentalFeatureConfiguration = undefined | unknown | Configuration;

interface Configuration {
  [key: string]: unknown;
}

@injectable()
export class ConfigurationRegistryExperimental extends ConfigurationRegistry implements IConfigurationRegistry {
  constructor(@inject(ApiSenderType) apiSender: ApiSenderType, @inject(Directories) directories: Directories) {
    super(apiSender, directories);
  }

  /**
   * Parse a configuration key into section and property
   * @param key - Full configuration key (e.g., 'kubernetes.statesExperimental')
   * @returns Object with section and property
   */
  parseKey(key: string): { section: string; property: string } {
    const dotIndex = key.indexOf('.');
    if (dotIndex === -1 || dotIndex === 0 || dotIndex === key.length - 1) {
      return { section: '', property: '' };
    }

    const section = key.substring(0, dotIndex);
    const property = key.substring(dotIndex + 1);

    return { section, property };
  }

  /**
   * Update an experimental configuration (enable or disable based on config)
   * @param key - Full configuration key (e.g., 'kubernetes.statesExperimental')
   * @param config - Configuration object for the feature. If undefined, disables the feature. If object (empty or with properties), enables the feature.
   * @param scope - Configuration scope
   */
  public async updateExperimentalConfigurationValue(
    key: string,
    config: ExperimentalFeatureConfiguration,
    scope?: containerDesktopAPI.ConfigurationScope | containerDesktopAPI.ConfigurationScope[],
  ): Promise<void> {
    // HACK: when setting `{}` as value we need to stringify and parse the svelte state
    let settings = config;
    if (typeof config === 'object') {
      settings = JSON.parse(JSON.stringify(config));
    }
    console.log('Experimental update of value', key, settings);
    await this.updateConfigurationValue(key, settings, scope);
  }

  /**
   * Toggle an experimental configuration based on enable property
   * @param key - Full configuration key (e.g., 'kubernetes.statesExperimental')
   * @param enable - flag for switching between enabling and disabling the configuration
   * @param scope - Configuration scope
   */
  public async toggleExperimentalConfiguration(
    key: string,
    enable: boolean,
    scope?: containerDesktopAPI.ConfigurationScope | containerDesktopAPI.ConfigurationScope[],
  ): Promise<void> {
    if (enable) {
      await this.enableExperimentalConfiguration(key, scope);
    } else {
      await this.disableExperimentalConfiguration(key, scope);
    }
  }

  /**
   * Enable an experimental configuration by setting it to an object
   * @param key - Full configuration key (e.g., 'kubernetes.statesExperimental')
   * @param scope - Configuration scope
   */
  async enableExperimentalConfiguration(
    key: string,
    scope?: containerDesktopAPI.ConfigurationScope | containerDesktopAPI.ConfigurationScope[],
  ): Promise<void> {
    // If there exists configuration, we dont need to enable it again
    if (this.isExperimentalConfigurationEnabled(key, scope)) {
      return;
    }

    // HACK: when setting `{}` as value we need to stringify and parse the svelte state
    const settings = JSON.parse(JSON.stringify({}));

    if (Array.isArray(scope)) {
      for (const scopeItem of scope) {
        await this.updateConfigurationValue(key, settings, scopeItem);
      }
    } else {
      await this.updateConfigurationValue(key, settings, scope);
    }
  }

  /**
   * Disable an experimental configuration by setting it to undefined
   * @param key - Full configuration key (e.g., 'kubernetes.statesExperimental')
   * @param scope - Configuration scope
   */
  async disableExperimentalConfiguration(
    key: string,
    scope?: containerDesktopAPI.ConfigurationScope | containerDesktopAPI.ConfigurationScope[],
  ): Promise<void> {
    if (Array.isArray(scope)) {
      for (const scopeItem of scope) {
        await this.updateConfigurationValue(key, undefined, scopeItem);
      }
    } else {
      await this.updateConfigurationValue(key, undefined, scope);
    }
  }

  /**
   * Check if an experimental configuration is enabled (has an object value)
   * @param key - Full configuration key (e.g., 'kubernetes.statesExperimental')
   * @param scope - Configuration scope
   * @returns true if feature is enabled (has object value), false otherwise
   */
  public isExperimentalConfigurationEnabled(
    key: string,
    scope?: containerDesktopAPI.ConfigurationScope | containerDesktopAPI.ConfigurationScope[],
  ): boolean {
    const { section, property } = this.parseKey(key);
    if (!section || !property) {
      return false;
    }

    if (Array.isArray(scope)) {
      for (const scopeItem of scope) {
        const config = this.getConfiguration(section, scopeItem).get<Configuration>(property);
        if (typeof config === 'object' && config !== null) return true;
      }
      return false;
    } else {
      const config = this.getConfiguration(section, scope).get<Configuration>(property);
      return typeof config === 'object' && config !== null;
    }
  }
}
