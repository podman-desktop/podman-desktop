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

import type { Configuration, ConfigurationScope } from '@podman-desktop/api';
import { configuration as apiConfiguration } from '@podman-desktop/api';

import type { RegistryConfigurationEntry } from './registry-configuration';

export interface ConfigurationRegistry {
  getConfiguration(section?: string, scope?: ConfigurationScope): Configuration;
}

// Internal types for reading user default registries from settings.json
// These mirror the containers-registries.conf format but are internal to the Podman extension
// see: https://github.com/containers/image/blob/main/docs/containers-registries.conf.5.md#example
export interface UserDefaultRegistry {
  registry: {
    prefix: string;
    insecure?: boolean;
    blocked?: boolean;
    location: string;
  };
}
export interface UserDefaultRegistryMirror {
  'registry.mirror': {
    location: string;
    insecure?: boolean;
  };
}

// Handles loading and merging user default registries from podman desktop configuration (settings.json)
export class DefaultRegistryLoader {
  #configurationRegistry: ConfigurationRegistry;

  constructor(configurationRegistry: ConfigurationRegistry = apiConfiguration) {
    this.#configurationRegistry = configurationRegistry;
  }

  // Load registry entries from settings.json configuration.
  // The format intentionally mirrors registries.conf where mirrors must immediately
  // follow their parent registry (ex. [[registry]] followed by [[registry.mirror]]).
  // Orphan mirrors (those without a preceding registry) are ignored as they do not have context / do not make sense vs the spec.
  // See: https://github.com/containers/image/blob/main/docs/containers-registries.conf.5.md
  loadFromConfiguration(): RegistryConfigurationEntry[] {
    const userDefaultRegistries = this.#configurationRegistry.getConfiguration('registries').get('defaults') as (
      | UserDefaultRegistry
      | UserDefaultRegistryMirror
    )[];

    return (userDefaultRegistries ?? []).reduce<RegistryConfigurationEntry[]>((entries, item) => {
      if ('registry' in item) {
        entries.push({ ...item.registry });
      } else if (entries.length > 0) {
        // Attach mirror to the preceding registry (mimics registries.conf format)
        const lastEntry = entries[entries.length - 1];
        lastEntry.mirror ??= [];
        // It will always be 'registry.mirror' (check podman registries.conf link above)
        lastEntry.mirror.push({ ...item['registry.mirror'] });
      }
      return entries;
    }, []);
  }

  // Merge default registries into existing registries, resolving conflicts
  // Some private helpers for resolveConflicts are used try and make understanding a bit easier
  // since the logic in the podman spec is more complex, and must adhere to strict rules such as the mirror
  // always preceding the reigistry it belongs to.
  resolveConflicts(
    defaultRegistries: RegistryConfigurationEntry[],
    existingRegistries: RegistryConfigurationEntry[],
  ): RegistryConfigurationEntry[] {
    for (const defaultRegistry of defaultRegistries) {
      const existing = this.findByPrefix(existingRegistries, defaultRegistry.prefix);

      if (!existing) {
        existingRegistries.push(defaultRegistry);
        continue;
      }

      // Skip merging if properties differ (user settings take precedence)
      if (this.hasPropertyDifference(existing, defaultRegistry)) {
        continue;
      }

      this.mergeMirrors(existing, defaultRegistry.mirror ?? []);
    }
    return existingRegistries;
  }

  // Helper method to find the corresponding registry by prefix
  private findByPrefix(
    registries: RegistryConfigurationEntry[],
    prefix: string | undefined,
  ): RegistryConfigurationEntry | undefined {
    if (!prefix) return undefined;
    return registries.find(r => r.prefix === prefix);
  }

  // Helper method to merge mirrors into a target registry entry
  private mergeMirrors(target: RegistryConfigurationEntry, mirrors: RegistryConfigurationEntry['mirror']): void {
    if (!mirrors?.length) return;

    target.mirror ??= [];
    const existingLocations = new Set(target.mirror.map(m => m.location));

    for (const mirror of mirrors) {
      if (!existingLocations.has(mirror.location)) {
        target.mirror.push(mirror);
      }
    }
  }

  // Returns true if properties differ between existing and default registry (warns user)
  // we only compare the main properties, not mirrors, as those are merged separately
  // specifically we make sure to compare blocked, insecure, and location (hence the 3 if statements..)
  private hasPropertyDifference(
    existing: RegistryConfigurationEntry,
    defaultRegistry: RegistryConfigurationEntry,
  ): boolean {
    const diff: string[] = [];

    if (existing.blocked !== defaultRegistry.blocked) diff.push('blocked');
    if (existing.insecure !== defaultRegistry.insecure) diff.push('insecure');
    if (existing.location !== defaultRegistry.location) diff.push('location');

    if (diff.length > 0) {
      console.warn(
        `Default user registry ${defaultRegistry.prefix} already exists in registries.conf, but properties differ: ${diff.join(', ')}. User settings take precedence.`,
      );
      return true;
    }
    return false;
  }
}
