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

import { CONFIGURATION_DEFAULT_SCOPE } from '/@api/configuration/constants.js';
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

    // now look if we have this value
    const localView = this.getLocalView();
    if (localView[localKey] !== undefined) {
      return localView[localKey] as T;
    }
    return defaultValue as T;
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
        delete localView[section];
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
