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
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';

import * as extensionApi from '@podman-desktop/api';
import * as toml from 'smol-toml';

import type { RegistryConfigurationEntry, RegistryConfigurationFile } from '../configuration/registry-configuration';

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

  protected getRegistriesConfFileLocation(): string {
    // $HOME/.config/containers/registries.conf
    return path.resolve(os.homedir(), '.config/containers/registries.conf');
  }

  protected getSystemRegistriesConfFileLocation(): string {
    // System-level config path based on platform
    if (extensionApi.env.isLinux) {
      return '/etc/containers/registries.conf';
    } else if (extensionApi.env.isMac) {
      return '/opt/podman/etc/containers/registries.conf';
    } else if (extensionApi.env.isWindows) {
      const programFiles = process.env.PROGRAMFILES ?? 'C:\\Program Files';
      return path.join(programFiles, 'RedHat', 'Podman', 'etc', 'containers', 'registries.conf');
    }
    // Fallback
    return '/etc/containers/registries.conf';
  }

  protected async loadInsecureSettingsFromConfFile(): Promise<Map<string, boolean>> {
    const insecureMap = new Map<string, boolean>();
    const location = this.getSystemRegistriesConfFileLocation();

    try {
      if (!existsSync(location)) {
        return insecureMap;
      }

      const content = await readFile(location, 'utf-8');
      const tomlConfigFile = toml.parse(content);

      if (tomlConfigFile?.registry && Array.isArray(tomlConfigFile.registry)) {
        const registries = tomlConfigFile.registry as RegistryConfigurationEntry[];

        for (const registryEntry of registries) {
          if (registryEntry.location && registryEntry.insecure !== undefined) {
            console.log(`Loading insecure setting for ${registryEntry.location}: ${registryEntry.insecure}`);
            insecureMap.set(registryEntry.location, registryEntry.insecure);
          } else {
            console.log(`No insecure setting for ${registryEntry.location}`);
          }
        }
      }
    } catch (error: unknown) {
      console.error(`Could not read ${location}: ${error}`);
    }

    return insecureMap;
  }

  protected async updateRegistries(): Promise<void> {
    // read the file
    const authFile = await this.readAuthFile();
    const inFileRegistries: extensionApi.Registry[] = [];
    const source = 'podman';

    // Load insecure settings from system registries.conf
    const insecureSettings = await this.loadInsecureSettingsFromConfFile();

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
          // Add insecure flag from system registries.conf if present
          insecure: insecureSettings.get(serverUrl),
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

        // Also update registries.conf if the registry has insecure setting
        if (registry.insecure !== undefined) {
          await this.updateRegistryInConfFile(registry);
        }
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

        // Also remove from registries.conf
        await this.removeRegistryFromConfFile(registry.serverUrl);
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

        // Also update registries.conf if the registry has insecure setting
        if (registry.insecure !== undefined) {
          await this.updateRegistryInConfFile(registry);
        }
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

    return new Promise((resolve, reject) => {
      fs.readFile(this.getAuthFileLocation(), 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          let authFile: ContainersAuthConfigFile;
          try {
            authFile = JSON.parse(data);
          } catch (error) {
            console.error('Error parsing auth file', error);
            // return empty auth file
            resolve({});
            return;
          }
          resolve(authFile);
        }
      });
    });
  }

  protected writeAuthFile(data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.getAuthFileLocation(), data, 'utf8', err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  protected async readRegistriesConfFile(): Promise<RegistryConfigurationFile> {
    const EMPTY_CONFIG_FILE = { registry: [] };
    const registryConfFilePath = this.getRegistriesConfFileLocation();
    if (!existsSync(registryConfFilePath)) {
      return EMPTY_CONFIG_FILE;
    }

    try {
      const content = await readFile(registryConfFilePath, 'utf-8');
      const tomlConfigFile = toml.parse(content);

      if (!tomlConfigFile?.registry || !Array.isArray(tomlConfigFile?.registry)) {
        return EMPTY_CONFIG_FILE;
      }

      const registries: RegistryConfigurationEntry[] = tomlConfigFile.registry as RegistryConfigurationEntry[];
      return { registry: registries };
    } catch (error: unknown) {
      console.error(`Error reading registries.conf file: ${error}`);
      return EMPTY_CONFIG_FILE;
    }
  }

  protected async writeRegistriesConfFile(content: RegistryConfigurationFile): Promise<void> {
    const tomlContent = toml.stringify(content);
    await writeFile(this.getRegistriesConfFileLocation(), tomlContent, 'utf-8');
  }

  protected async updateRegistryInConfFile(registry: extensionApi.Registry): Promise<void> {
    const configFile = await this.readRegistriesConfFile();

    // Find existing registry entry
    const existingIndex = configFile.registry.findIndex(entry => entry.location === registry.serverUrl);

    if (existingIndex >= 0) {
      // Update existing entry
      configFile.registry[existingIndex] = {
        ...configFile.registry[existingIndex],
        insecure: registry.insecure,
      };
    } else {
      // Add new entry
      configFile.registry.push({
        location: registry.serverUrl,
        insecure: registry.insecure,
      });
    }

    await this.writeRegistriesConfFile(configFile);
  }

  protected async removeRegistryFromConfFile(serverUrl: string): Promise<void> {
    const configFile = await this.readRegistriesConfFile();
    configFile.registry = configFile.registry.filter(entry => entry.location !== serverUrl);
    await this.writeRegistriesConfFile(configFile);
  }
}
