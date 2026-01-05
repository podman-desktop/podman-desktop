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

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { injectable } from 'inversify';

import product from '/@product.json' with { type: 'json' };

import { isLinux, isMac, isWindows } from '../util.js';
import type { Directories } from './directories.js';

/**
 * Directory provider that uses the traditional/legacy directory structure
 * All directories are placed under a single base directory
 * Used for Windows, macOS, and Linux systems with existing configurations
 */
@injectable()
export class LegacyDirectories implements Directories {
  static readonly XDG_DATA_DIRECTORY = `.local${path.sep}share${path.sep}${product.paths.config}`;
  static readonly PODMAN_DESKTOP_HOME_DIR = 'PODMAN_DESKTOP_HOME_DIR';

  private readonly configurationDirectory: string;
  private readonly dataDirectory: string;
  private readonly pluginsDirectory: string;
  private readonly pluginsScanDirectory: string;
  private readonly extensionsStorageDirectory: string;
  private readonly contributionStorageDirectory: string;
  private readonly safeStorageDirectory: string;
  private readonly desktopAppHomeDir: string;

  constructor() {
    // Check for custom directory override
    this.desktopAppHomeDir =
      process.env[LegacyDirectories.PODMAN_DESKTOP_HOME_DIR] ??
      path.resolve(os.homedir(), LegacyDirectories.XDG_DATA_DIRECTORY);

    // Create the base directory if it doesn't exist
    if (!fs.existsSync(this.desktopAppHomeDir)) {
      fs.mkdirSync(this.desktopAppHomeDir, { recursive: true });
    }

    // All directories are under the base directory (legacy structure)
    this.dataDirectory = this.desktopAppHomeDir;
    this.configurationDirectory = path.resolve(this.desktopAppHomeDir, 'configuration');
    this.pluginsDirectory = path.resolve(this.desktopAppHomeDir, 'plugins');
    this.pluginsScanDirectory = path.resolve(this.desktopAppHomeDir, 'plugins-scanning');
    this.extensionsStorageDirectory = path.resolve(this.desktopAppHomeDir, 'extensions-storage');
    this.contributionStorageDirectory = path.resolve(this.desktopAppHomeDir, 'contributions');
    this.safeStorageDirectory = path.resolve(this.desktopAppHomeDir, 'safe-storage');
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

  getContributionStorageDir(): string {
    return this.contributionStorageDirectory;
  }

  getSafeStorageDirectory(): string {
    return this.safeStorageDirectory;
  }

  getDataDirectory(): string {
    return this.dataDirectory;
  }

  getManagedDefaultsDirectory(): string {
    if (isMac()) {
      return product.paths.managed.macOS;
    } else if (isWindows()) {
      const programData = process.env['PROGRAMDATA'] ?? 'C:\\ProgramData';
      // replace %PROGRAMDATA% in the path
      return product.paths.managed.windows.replace('%PROGRAMDATA%', programData);
    } else if (isLinux()) {
      return product.paths.managed.linux;
    }
    // Fallback to Linux-style path
    return product.paths.managed.linux;
  }
}
