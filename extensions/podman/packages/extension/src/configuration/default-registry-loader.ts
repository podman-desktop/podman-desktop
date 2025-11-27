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

import type { Configuration, ConfigurationScope, DefaultRegistry, DefaultRegistryMirror } from '@podman-desktop/api';
import { configuration as apiConfiguration } from '@podman-desktop/api';

import { REGISTRY_MIRROR } from '/@/constants';

import type { RegistryConfigurationEntry } from './registry-configuration';

export interface ConfigurationRegistry {
  getConfiguration(section?: string, scope?: ConfigurationScope): Configuration;
}

// Handles loading and merging user default registries from podman desktop configuration (settings.json)
export class DefaultRegistryLoader {
  #configurationRegistry: ConfigurationRegistry;

  constructor(configurationRegistry: ConfigurationRegistry = apiConfiguration) {
    this.#configurationRegistry = configurationRegistry;
  }

  // Get the registry entries from the config
  loadFromConfiguration(): RegistryConfigurationEntry[] {
    const defaultRegistries: RegistryConfigurationEntry[] = [];
    const userDefaultRegistries = this.#configurationRegistry.getConfiguration('registries').get('defaults') as (
      | DefaultRegistry
      | DefaultRegistryMirror
    )[];

    userDefaultRegistries?.forEach(registry => {
      if ('registry' in registry) {
        defaultRegistries.push({ ...registry.registry });
      } else if (defaultRegistries.length > 0) {
        // mirror registries come after the registry to which they belong
        defaultRegistries[defaultRegistries.length - 1].mirror ??= [];
        defaultRegistries[defaultRegistries.length - 1].mirror?.push({ ...registry[REGISTRY_MIRROR] });
      }
    });

    return defaultRegistries;
  }

  // Resolve any conflicts between the default registries and existing registries
  resolveConflicts(
    defaultRegistries: RegistryConfigurationEntry[],
    existingRegistries: RegistryConfigurationEntry[],
  ): RegistryConfigurationEntry[] {
    defaultRegistries.forEach(defaultRegistry => {
      const duplicateRegistry = existingRegistries.find(
        existingRegistry => existingRegistry.prefix === defaultRegistry.prefix,
      );
      if (defaultRegistry.prefix && duplicateRegistry) {
        const hasDiff = this.checkForDifference(duplicateRegistry, defaultRegistry);
        if (!hasDiff) {
          defaultRegistry.mirror?.forEach(mirror => {
            duplicateRegistry.mirror ??= [];
            if (!duplicateRegistry.mirror?.map(dupMirror => dupMirror.location).includes(mirror.location)) {
              duplicateRegistry.mirror.push(mirror);
            }
          });
        }
      } else {
        existingRegistries.push(defaultRegistry);
      }
    });
    return existingRegistries;
  }

  // Check all the nested differences between two registry entries
  private checkForDifference(
    duplicateRegistry: RegistryConfigurationEntry,
    defaultRegistry: RegistryConfigurationEntry,
  ): boolean {
    if (
      duplicateRegistry.blocked !== defaultRegistry.blocked ||
      duplicateRegistry.insecure !== defaultRegistry.insecure ||
      duplicateRegistry.location !== defaultRegistry.location
    ) {
      const diff = [];
      if (duplicateRegistry.blocked !== defaultRegistry.blocked) {
        diff.push('blocked');
      }

      if (duplicateRegistry.insecure !== defaultRegistry.insecure) {
        diff.push('insecure');
      }

      if (duplicateRegistry.location !== defaultRegistry.location) {
        diff.push('location');
      }

      console.warn(
        `Default user registry ${defaultRegistry.prefix} already exists in the registries.conf.d file, but some of its properties do not match: ${diff.join(', ')}. Please update this registry`,
      );
      return true;
    } else {
      return false;
    }
  }
}
