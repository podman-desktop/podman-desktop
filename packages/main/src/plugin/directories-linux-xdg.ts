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

import * as os from 'node:os';
import * as path from 'node:path';

import { injectable } from 'inversify';

import { product } from '/@/product.js';

import type { Directories } from './directories.js';

/**
 * Directory provider that follows XDG Base Directory Specification for Linux
 * This implementation separates configuration and data directories according to XDG standards
 */
@injectable()
export class LinuxXDGDirectories implements Directories {
  private readonly configurationDirectory: string;
  private readonly dataDirectory: string;
  private readonly pluginsDirectory: string;
  private readonly pluginsScanDirectory: string;
  private readonly extensionsStorageDirectory: string;
  private readonly contributionStorageDirectory: string;
  private readonly safeStorageDirectory: string;

  constructor() {
    // XDG_CONFIG_HOME: user-specific configuration files
    // biome-ignore lint/complexity/useLiteralKeys: XDG_CONFIG_HOME comes from an index signature
    const xdgConfigHome = process.env['XDG_CONFIG_HOME'] ?? path.resolve(os.homedir(), '.config');
    this.configurationDirectory = path.resolve(xdgConfigHome, product.paths.config);

    // XDG_DATA_HOME: user-specific data files (plugins, extensions data)
    // biome-ignore lint/complexity/useLiteralKeys: XDG_DATA_HOME comes from an index signature
    const xdgDataHome = process.env['XDG_DATA_HOME'] ?? path.resolve(os.homedir(), '.local', 'share');
    this.dataDirectory = path.resolve(xdgDataHome, product.paths.config);

    // All data-related directories go under dataDirectory
    this.pluginsDirectory = path.resolve(this.dataDirectory, 'plugins');
    this.pluginsScanDirectory = path.resolve(this.dataDirectory, 'plugins-scanning');
    this.extensionsStorageDirectory = path.resolve(this.dataDirectory, 'extensions-storage');
    this.contributionStorageDirectory = path.resolve(this.dataDirectory, 'contributions');
    this.safeStorageDirectory = path.resolve(this.dataDirectory, 'safe-storage');
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
    return product.paths.managed.linux;
  }
}
