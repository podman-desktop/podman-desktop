/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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
import * as os from 'node:os';
import * as path from 'node:path';

import { injectable } from 'inversify';

// handle the different directories for the different OSes for Podman Desktop
@injectable()
export class Directories {
  static readonly XDG_DATA_DIRECTORY = `.local${path.sep}share${path.sep}containers${path.sep}podman-desktop`;

  public static readonly PODMAN_DESKTOP_HOME_DIR = 'PODMAN_DESKTOP_HOME_DIR';

  private readonly configurationDirectory: string;
  private readonly pluginsDirectory: string;
  private readonly pluginsScanDirectory: string;
  private readonly extensionsStorageDirectory: string;
  private readonly contributionStorageDirectory: string;
  private readonly safeStorageDirectory: string;
  private readonly dataDirectory: string;
  protected readonly desktopAppHomeDir: string;

  constructor() {
    // Check default home directory for backward compatibility
    const defaultHomeDir = process.env[Directories.PODMAN_DESKTOP_HOME_DIR];

    // Check if default configuration already exists to avoid breaking existing setups
    const defaultDataPath = path.resolve(os.homedir(), '.local', 'share', 'containers', 'podman-desktop');
    const defaultConfigExists = fs.existsSync(path.resolve(defaultDataPath, 'configuration'));

    if (process.platform === 'linux' && !defaultHomeDir && !defaultConfigExists) {
      // XDG_DATA_HOME: user-specific data files (plugins, extensions data)
      // biome-ignore lint/complexity/useLiteralKeys: XDG_DATA_HOME comes from an index signature, so it must be accessed with ['XDG_DATA_HOME']
      const xdgDataHome = process.env['XDG_DATA_HOME'] ?? path.resolve(os.homedir(), '.local', 'share');
      this.dataDirectory = path.resolve(xdgDataHome, 'containers', 'podman-desktop');

      // XDG_CONFIG_HOME: user-specific configuration files
      // biome-ignore lint/complexity/useLiteralKeys: XDG_CONFIG_HOME comes from an index signature, so it must be accessed with ['XDG_CONFIG_HOME']
      const xdgConfigHome = process.env['XDG_CONFIG_HOME'] ?? path.resolve(os.homedir(), '.config');
      this.configurationDirectory = path.resolve(xdgConfigHome, 'containers', 'podman-desktop');

      // Data directories (relative to dataDirectory)
      this.pluginsDirectory = path.resolve(this.dataDirectory, 'plugins');
      this.pluginsScanDirectory = path.resolve(this.dataDirectory, 'plugins-scanning');
      this.extensionsStorageDirectory = path.resolve(this.dataDirectory, 'extensions-storage');
      this.contributionStorageDirectory = path.resolve(this.dataDirectory, 'contributions');
      this.safeStorageDirectory = path.resolve(this.dataDirectory, 'safe-storage');

      // For backward compatibility and testing, set desktopAppHomeDir to data directory
      this.desktopAppHomeDir = this.dataDirectory;
    } else {
      // read ENV VAR to override the Desktop App Home Dir
      this.desktopAppHomeDir =
        process.env[Directories.PODMAN_DESKTOP_HOME_DIR] ?? path.resolve(os.homedir(), Directories.XDG_DATA_DIRECTORY);

      // create the Desktop App Home Dir if it does not exist
      if (!fs.existsSync(this.desktopAppHomeDir)) {
        fs.mkdirSync(this.desktopAppHomeDir, { recursive: true });
      }

      this.dataDirectory = this.desktopAppHomeDir;
      this.configurationDirectory = path.resolve(this.desktopAppHomeDir, 'configuration');
      this.pluginsDirectory = path.resolve(this.desktopAppHomeDir, 'plugins');
      this.pluginsScanDirectory = path.resolve(this.desktopAppHomeDir, 'plugins-scanning');
      this.extensionsStorageDirectory = path.resolve(this.desktopAppHomeDir, 'extensions-storage');
      this.contributionStorageDirectory = path.resolve(this.desktopAppHomeDir, 'contributions');
      this.safeStorageDirectory = path.resolve(this.desktopAppHomeDir, 'safe-storage');
    }
  }

  getConfigurationDirectory(): string {
    return this.configurationDirectory;
  }

  getPluginsDirectory(): string {
    return this.pluginsDirectory;
  }

  getPluginsScanDirectory(): string {
    return this.pluginsScanDirectory;
  }

  getExtensionsStorageDirectory(): string {
    return this.extensionsStorageDirectory;
  }

  public getContributionStorageDir(): string {
    return this.contributionStorageDirectory;
  }

  public getSafeStorageDirectory(): string {
    return this.safeStorageDirectory;
  }

  public getDataDirectory(): string {
    return this.dataDirectory;
  }
}
