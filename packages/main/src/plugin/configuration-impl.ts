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

import type * as containerDesktopAPI from '@podman-desktop/api';

import {
  CONFIGURATION_DEFAULT_SCOPE,
  CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE,
  CONFIGURATION_SYSTEM_MANAGED_LOCKED_SCOPE,
} from '/@api/configuration/constants.js';
import type { IConfigurationChangeEvent } from '/@api/configuration/models.js';

import type { ApiSenderType } from './api.js';

/**
 * Local view of the configuration values for a given scope
 */
export class ConfigurationImpl implements containerDesktopAPI.Configuration {
  [key: string]: unknown;

  private scope: containerDesktopAPI.ConfigurationScope;

  constructor(
    private apiSender: ApiSenderType,
    protected updateCallback: (sectionName: string, scope: containerDesktopAPI.ConfigurationScope) => void,
    private configurationValues: Map<string, { [key: string]: unknown }>,
    private globalSection?: string,
    paramScope?: containerDesktopAPI.ConfigurationScope,
  ) {
    if (!globalSection) {
      this.globalSection = '';
    }
    if (!paramScope) {
      this.scope = CONFIGURATION_DEFAULT_SCOPE;
    } else {
      this.scope = paramScope;
    }
  }

  get<T>(section: string, defaultValue?: unknown): T | undefined {
    const localKey = this.getLocalKey(section);

    // First thing!
    // Check if this config key is "locked" by a "managed-by" policy, and if so, return the "managed-by" value.
    //
    // Locked keys ignore user settings and force the managed default value instead, if there is a value there
    // in the first place, if not, we fall back to the user value.
    //
    // We retrieve the information from from a system file:
    // (ex macOS: /Library/Application Support/com.podman.desktop/locked.json, Linux: /usr/share/podman-desktop/locked.json)
    //
    // This only applies when we are getting values from the default scope, as getting them SPECIFICALLY
    // from managed defaults or locked scopes would be counter-intuitive... (or Onboarding scope, but that doesn't make sense either)
    if (this.scope === CONFIGURATION_DEFAULT_SCOPE) {
      // Pass in the key we are wanting to get and check locked config for the key
      const managedValue = this.getLockedConfigValue<T>(localKey);

      // Before we go ahead and return the value, we want to log to console
      // this information so that if users are confused why they can't change a setting, they know why,
      // however, this information should only stay in console.debug considering that it could be noisy (returning configuration values multiple times)
      //
      // FUTURE CHANGES:
      // In the future, we will be implementing a UI to show this "overridden" information, so this information to
      // console.debug will be temporary until we are able to store it in the UI (stores).
      if (managedValue !== undefined) {
        console.debug(
          `[Managed-by]: Configuration key '${localKey}' is locked. Returning managed default value instead of user value.`,
        );
        return managedValue;
      }
    }

    // If the above isn't applicable (no locked keys + managed by scope), we return the key as normal.
    const localView = this.getLocalView();
    if (localView[localKey] !== undefined) {
      return localView[localKey] as T;
    }

    // Last resort: Return the fallback default value
    return defaultValue as T;
  }

  // Helper to check if a config key is locked and return its managed value
  // Returns undefined if the key isn't locked or has no managed value
  private getLockedConfigValue<T>(localKey: string): T | undefined {
    const lockedConfig = this.configurationValues.get(CONFIGURATION_SYSTEM_MANAGED_LOCKED_SCOPE);

    // Bail early if there's no locked config or it's malformed
    if (!lockedConfig?.['locked'] || !Array.isArray(lockedConfig['locked'])) {
      return undefined;
    }

    const lockedKeys = lockedConfig['locked'] as string[];

    // Bail early if this key isn't in the locked list
    if (!lockedKeys.includes(localKey)) {
      return undefined;
    }

    // This key IS locked - grab the managed default value for it
    const managedDefaults = this.configurationValues.get(CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE);
    if (managedDefaults && managedDefaults[localKey] !== undefined) {
      return managedDefaults[localKey] as T;
    }

    return undefined;
  }

  has(section: string): boolean {
    const localKey = this.getLocalKey(section);

    // now look if we have this value
    const localView = this.getLocalView();
    return localView[localKey] !== undefined;
  }

  async update(section: string, value: unknown): Promise<void> {
    const localKey = this.getLocalKey(section);
    // now look if we have this value
    const localView = this.getLocalView();

    const configurationChangedEvent: Omit<IConfigurationChangeEvent, 'scope'> = {
      key: localKey,
      value,
    };

    // remove the value if undefined
    if (value === undefined) {
      if (localView[localKey]) {
        delete localView[localKey];
        delete this[localKey];
        this.apiSender.send('configuration-changed', configurationChangedEvent);
      }
    } else {
      localView[localKey] = value;
      this[section] = value;
      this.apiSender.send('configuration-changed', configurationChangedEvent);
    }
    // call only for default scope to save
    this.updateCallback(section, this.scope);
  }

  isContainerProviderConnection(obj: unknown): obj is containerDesktopAPI.ContainerProviderConnection {
    if (!obj) {
      return false;
    }
    if (typeof obj !== 'object') {
      return false;
    }
    if (!('endpoint' in obj)) {
      return false;
    }
    if (!obj.endpoint || typeof obj.endpoint !== 'object') {
      return false;
    }
    if (!('socketPath' in obj.endpoint)) {
      return false;
    }
    return typeof obj.endpoint?.socketPath === 'string';
  }

  isKubernetesProviderConnection(obj: unknown): obj is containerDesktopAPI.KubernetesProviderConnection {
    if (!obj) {
      return false;
    }
    if (typeof obj !== 'object') {
      return false;
    }
    if (!('endpoint' in obj)) {
      return false;
    }
    if (!obj.endpoint || typeof obj.endpoint !== 'object') {
      return false;
    }
    if (!('apiURL' in obj.endpoint)) {
      return false;
    }

    return typeof obj.endpoint?.apiURL === 'string';
  }

  getLocalKey(section?: string): string {
    // first we need to use the global section key
    let searchedKey = this.globalSection;
    if (!searchedKey || searchedKey === '') {
      if (section) {
        return section;
      } else {
        return '';
      }
    }
    if (section) {
      searchedKey = `${this.globalSection}.${section}`;
    }
    return searchedKey;
  }

  getConfigurationKey(): string {
    if (this.isContainerProviderConnection(this.scope)) {
      return `container-connection:${this.scope.name}.${this.scope.endpoint.socketPath}`;
    } else if (this.isKubernetesProviderConnection(this.scope)) {
      return `kubernetes-connection:${this.scope.endpoint.apiURL}`;
    } else if (this.scope === CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE) {
      return CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE;
    } else if (this.scope === CONFIGURATION_SYSTEM_MANAGED_LOCKED_SCOPE) {
      return CONFIGURATION_SYSTEM_MANAGED_LOCKED_SCOPE;
    } else {
      return CONFIGURATION_DEFAULT_SCOPE;
    }
  }

  getLocalView(): { [key: string]: unknown } {
    // first, grab values for the given scope
    // and initialize if not present
    const configurationKey = this.getConfigurationKey();
    let configurationValue = this.configurationValues.get(configurationKey);
    if (!configurationValue) {
      configurationValue = {};
      this.configurationValues.set(configurationKey, configurationValue);
    }
    return configurationValue;
  }
}
