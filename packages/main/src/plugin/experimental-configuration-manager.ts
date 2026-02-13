/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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

import { ConfigurationRegistry } from './configuration-registry.js';

@injectable()
export class ExperimentalConfigurationManager {
  constructor(@inject(ConfigurationRegistry) private configurationRegistry: ConfigurationRegistry) {}

  /**
   * Parse a configuration key into section and property
   * @param key - Full configuration key (e.g., 'kubernetes.statesExperimental')
   * @returns Object with section and property
   */
  parseKey(key: string): { section: string; property: string } {
    const dotIndex = key.indexOf('.');
    // If is the '.' not found
    // if is the key '.property'
    // If is the key 'section.'
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
  async updateExperimentalConfigurationValue(
    key: string,
    config: unknown,
    scope?: containerDesktopAPI.ConfigurationScope | containerDesktopAPI.ConfigurationScope[],
  ): Promise<void> {
    await this.configurationRegistry.updateConfigurationValue(key, config, scope);
  }

  /**
   * Enable an experimental configuration by setting enabled to true
   * @param key - Full configuration key (e.g., 'kubernetes.statesExperimental')
   * @param scope - Configuration scope
   */
  async enableExperimentalConfiguration(
    key: string,
    scope?: containerDesktopAPI.ConfigurationScope | containerDesktopAPI.ConfigurationScope[],
  ): Promise<void> {
    await this.updateExperimentalEnabled(key, true, scope);
  }

  /**
   * Helper method to update the enabled property of an experimental configuration
   * @param key - Full configuration key
   * @param enabled - New enabled value
   * @param scope - Configuration scope
   */
  private async updateExperimentalEnabled(
    key: string,
    enabled: boolean,
    scope?: containerDesktopAPI.ConfigurationScope | containerDesktopAPI.ConfigurationScope[],
  ): Promise<void> {
    const { section, property } = this.parseKey(key);
    if (!section || !property) {
      return;
    }

    const scopes = Array.isArray(scope) ? scope : [scope];
    for (const scopeItem of scopes) {
      const currentConfig = this.configurationRegistry.getConfiguration(section, scopeItem).get(property);
      const settings =
        typeof currentConfig === 'object' && currentConfig !== null ? { ...currentConfig, enabled } : { enabled };
      await this.configurationRegistry.updateConfigurationValue(key, settings, scopeItem);
    }
  }

  /**
   * Disable an experimental configuration by setting enabled to false
   * @param key - Full configuration key (e.g., 'kubernetes.statesExperimental')
   * @param scope - Configuration scope
   */
  async disableExperimentalConfiguration(
    key: string,
    scope?: containerDesktopAPI.ConfigurationScope | containerDesktopAPI.ConfigurationScope[],
  ): Promise<void> {
    await this.updateExperimentalEnabled(key, false, scope);
  }

  /**
   * Check if an experimental configuration is enabled (checks the enabled property)
   * @param key - Full configuration key (e.g., 'kubernetes.statesExperimental')
   * @param scope - Configuration scope
   * @returns true if feature is enabled, false otherwise
   */
  isExperimentalConfigurationEnabled(
    key: string,
    scope?: containerDesktopAPI.ConfigurationScope | containerDesktopAPI.ConfigurationScope[],
  ): boolean {
    const { section, property } = this.parseKey(key);
    if (!section || !property) {
      return false;
    }

    const scopes = Array.isArray(scope) ? scope : [scope];
    for (const scopeItem of scopes) {
      const config = this.configurationRegistry.getConfiguration(section, scopeItem).get(property);
      if (this.isConfigEnabled(config)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Helper method to check if a configuration value represents an enabled state
   * @param config - Configuration value to check
   * @returns true if enabled, false otherwise
   */
  private isConfigEnabled(config: unknown): boolean {
    if (typeof config === 'object' && config !== null && !Array.isArray(config)) {
      // Check enabled property if it exists, otherwise default to true for backward compatibility
      return 'enabled' in config ? Boolean(config.enabled) : true;
    }
    // Legacy: support boolean true
    return typeof config === 'boolean' && config;
  }
}
