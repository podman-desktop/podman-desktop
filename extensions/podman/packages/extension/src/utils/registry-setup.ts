/**********************************************************************
 * Copyright (C) 2022-2023 Red Hat, Inc.
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
import { chmod, readFile, writeFile } from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import * as extensionApi from '@podman-desktop/api';

import type { RegistryConfiguration, RegistryConfigurationEntry } from '/@/configuration/registry-configuration';

export type ContainerAuthConfigEntry = {
  [key: string]: {
    auth: string;
    podmanDesktopAlias: string | undefined;
  };
};

export type ContainersAuthConfigFile = {
  auths?: ContainerAuthConfigEntry;
};

export class RegistrySetup {
  private localRegistries: Map<string, extensionApi.Registry> = new Map();
  private registryConfiguration: RegistryConfiguration;

  constructor(registryConfiguration: RegistryConfiguration) {
    this.registryConfiguration = registryConfiguration;
  }

  protected getAuthFileLocation(): string {
    let podmanConfigContainersPath = '';

    if (extensionApi.env.isMac || extensionApi.env.isWindows) {
      podmanConfigContainersPath = path.resolve(os.homedir(), '.config/containers');
    } else if (extensionApi.env.isLinux) {
      const xdgRuntimeDirectory = process.env['XDG_RUNTIME_DIR'] ?? '';
      podmanConfigContainersPath = path.resolve(xdgRuntimeDirectory, 'containers');
    }

    // resolve the auth.json file path
    return path.resolve(podmanConfigContainersPath, 'auth.json');
  }

  protected async updateRegistries(): Promise<void> {
    // read the file
    const authFile = await this.readAuthFile();
    const inFileRegistries: extensionApi.Registry[] = [];
    const source = 'podman';
    if (authFile.auths) {
      // loop over the auth entries
      for (const [key, value] of Object.entries(authFile.auths)) {
        const serverUrl = key;
        const decoded = Buffer.from(value.auth, 'base64').toString();

        // split the decoded string into username and password separated by :
        const [username, secret] = decoded.split(':');

        if (!secret) {
          console.warn(`Invalid auth value for ${serverUrl}`);
        }

        const registry = {
          source,
          serverUrl,
          username,
          secret,
          alias: value['podmanDesktopAlias'],
        };
        inFileRegistries.push(registry);
      }
    }

    // compare file and inMemory registries
    // For each registry in the file that is not in the inMemory, add it
    const toBeAdded = inFileRegistries.filter(fileRegistry => !this.localRegistries.has(fileRegistry.serverUrl));
    toBeAdded.forEach(registry => {
      // do not use the disposable from registerRegistry as we want to keep the registry after extension is stopped.
      extensionApi.registry.registerRegistry(registry);
      this.localRegistries.set(registry.serverUrl, registry);
    });
    // For each registry in the inMemory that is not in the file, remove it
    const toBeRemoved = Array.from(this.localRegistries.values()).filter(
      localRegistry =>
        !inFileRegistries.find(inFileLocalRegistry => inFileLocalRegistry.serverUrl === localRegistry.serverUrl),
    );
    toBeRemoved.forEach(registry => {
      this.localRegistries.delete(registry.serverUrl);
      extensionApi.registry.unregisterRegistry(registry);
    });
  }

  public async setup(): Promise<void> {
    extensionApi.registry.registerRegistryProvider({
      name: 'podman',
      create: function (registryCreateOptions: extensionApi.RegistryCreateOptions): extensionApi.Registry {
        const registry: extensionApi.Registry = {
          source: '',
          ...registryCreateOptions,
        };
        return registry;
      },
    });
    // handle addition of the registry in the file
    extensionApi.registry.onDidRegisterRegistry(async registry => {
      // external change, update the local registries
      if (!this.localRegistries.has(registry.serverUrl)) {
        let encode = true;
        this.localRegistries.set(registry.serverUrl, registry);
        // read the file
        const authFile = await this.readAuthFile();
        authFile.auths ??= {};

        // if the registry already exists in the file, check if it has the same value as the registered registry
        if (authFile.auths[registry.serverUrl]) {
          const decoded = Buffer.from(authFile.auths[registry.serverUrl].auth, 'base64').toString();

          // split the decoded string into username and password separated by :
          const [username, secret] = decoded.split(':');

          // only encode if values have changed from what's stored in the auth file
          encode = !(username === registry.username && secret === registry.secret);
        }

        if (encode) {
          authFile.auths[registry.serverUrl] = {
            auth: Buffer.from(`${registry.username}:${registry.secret}`).toString('base64'),
            podmanDesktopAlias: registry.alias,
          };

          await this.writeAuthFile(JSON.stringify(authFile, undefined, 8));
        }

        // Update registries.conf with the registry configuration
        await this.updateRegistriesConf(registry, true);
      }
    });

    // handle removal of the registry in the file
    extensionApi.registry.onDidUnregisterRegistry(async registry => {
      // external change, update the local registries
      if (this.localRegistries.has(registry.serverUrl)) {
        this.localRegistries.delete(registry.serverUrl);
        // update the file
        const authFile = await this.readAuthFile();
        if (authFile.auths) {
          delete authFile.auths[registry.serverUrl];
        }
        await this.writeAuthFile(JSON.stringify(authFile, undefined, 8));

        // Remove from registries.conf
        await this.removeFromRegistriesConf(registry);
      }
    });

    // handle update of the registry in the file
    extensionApi.registry.onDidUpdateRegistry(async registry => {
      // external change, update the local registries
      if (this.localRegistries.has(registry.serverUrl)) {
        this.localRegistries.set(registry.serverUrl, registry);
        // update the file
        const authFile = await this.readAuthFile();
        authFile.auths ??= {};
        authFile.auths[registry.serverUrl] = {
          auth: Buffer.from(`${registry.username}:${registry.secret}`).toString('base64'),
          podmanDesktopAlias: registry.alias,
        };

        await this.writeAuthFile(JSON.stringify(authFile, undefined, 8));

        // Update registries.conf with the updated registry configuration
        await this.updateRegistriesConf(registry, false);
      }
    });

    // check if the file exists
    if (!fs.existsSync(this.getAuthFileLocation())) {
      return;
    }

    // need to monitor this file
    fs.watchFile(this.getAuthFileLocation(), () => {
      this.updateRegistries().catch((error: unknown) => {
        console.error('Error updating registries', error);
      });
    });

    // else init with the content of this file
    await this.updateRegistries();
  }

  protected async readAuthFile(): Promise<ContainersAuthConfigFile> {
    // when we have a fresh installation of podman, auth file might not have been created
    if (!fs.existsSync(this.getAuthFileLocation())) {
      const emptyAuthFile = { auths: {} } as ContainersAuthConfigFile;
      await this.writeAuthFile(JSON.stringify(emptyAuthFile, undefined, 8));
    }

    try {
      const content = await readFile(this.getAuthFileLocation(), 'utf-8');
      return JSON.parse(content);
    } catch (error: unknown) {
      console.error('Error parsing auth file', error);
      return {};
    }
  }

  protected async writeAuthFile(data: string): Promise<void> {
    const path = this.getAuthFileLocation();
    await writeFile(path, data, {
      encoding: 'utf8',
      mode: 0o600,
    });
    // writeFile is not updating the mode if the file already exist
    await chmod(path, 0o600);
  }

  /**
   * Updates the registries.conf file to add or update a registry entry.
   *
   * For new registries (isNew=true):
   *   - If registry already exists in registries.conf, warns about conflict and does NOT modify the file
   *   - If registry doesn't exist, adds it to registries.conf
   *
   * For existing registries (isNew=false):
   *   - Updates the registry entry in registries.conf
   *
   */
  protected async updateRegistriesConf(registry: extensionApi.Registry, isNew = false): Promise<void> {
    try {
      // Read current registries.conf content
      const configFileContent = await this.registryConfiguration.readRegistriesConfContent();

      // Extract the location from serverUrl (remove protocol if present)
      const location = registry.serverUrl.replace(/^https?:\/\//, '');

      // Check if registry already exists in the configuration
      const existingIndex = configFileContent.registry.findIndex(
        (entry: RegistryConfigurationEntry) => entry.location === location,
      );

      const registryEntry: RegistryConfigurationEntry = {
        location,
        insecure: registry.insecure ?? false,
      };

      if (existingIndex >= 0) {
        // If this is a new registry and it already exists in the file, warn and don't modify
        if (isNew) {
          console.warn(
            `Registry ${location} already exists in registries.conf.\nSkipping to avoid conflicts. Please resolve manually by editing registries.conf.`,
          );
          return;
        }

        configFileContent.registry[existingIndex] = {
          ...configFileContent.registry[existingIndex],
          ...registryEntry,
        };
      } else {
        // Registry doesn't exist, add new entry
        configFileContent.registry.push(registryEntry);
      }

      // Save updated configuration
      await this.registryConfiguration.saveRegistriesConfContent(configFileContent);
    } catch (error: unknown) {
      console.error('Error updating registries.conf for registry', registry.serverUrl, error);
    }
  }

  /**
   * Removes a registry entry from the registries.conf file.
   */
  protected async removeFromRegistriesConf(registry: extensionApi.Registry): Promise<void> {
    try {
      // Read current registries.conf content
      const configFileContent = await this.registryConfiguration.readRegistriesConfContent();

      // Extract the location from serverUrl (remove protocol if present)
      const location = registry.serverUrl.replace(/^https?:\/\//, '');

      // Filter out the registry to remove
      configFileContent.registry = configFileContent.registry.filter(
        (entry: RegistryConfigurationEntry) => entry.location !== location,
      );

      // Save updated configuration
      await this.registryConfiguration.saveRegistriesConfContent(configFileContent);
    } catch (error: unknown) {
      console.error('Error removing registry from registries.conf', registry.serverUrl, error);
    }
  }
}
