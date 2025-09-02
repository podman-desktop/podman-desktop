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

import { isLinux } from '../util.js';
import { LegacyDirectories } from './directories-legacy.js';
import { LinuxXDGDirectories } from './directories-linux-xdg.js';
import type { DirectoryProvider } from './directory-provider.js';

/**
 * Factory that decides which directory provider implementation to use
 */
@injectable()
export class DirectoryProviderFactory {
  /**
   * Creates the appropriate directory provider based on platform and existing configuration
   */
  create(): DirectoryProvider {
    if (this.shouldUseXDGDirectories()) {
      return new LinuxXDGDirectories();
    }

    return new LegacyDirectories();
  }

  /**
   * Determines if XDG directory structure should be used
   * XDG is used only on Linux when:
   * 1. No custom directory override is set (PODMAN_DESKTOP_HOME_DIR)
   * 2. No existing legacy configuration is detected
   */
  private shouldUseXDGDirectories(): boolean {
    // Only consider XDG on Linux
    if (!isLinux()) {
      return false;
    }

    // If user has set custom directory, (use legacy)
    if (process.env[LegacyDirectories.PODMAN_DESKTOP_HOME_DIR]) {
      return false;
    }

    // If legacy configuration already exists, keep using it to avoid breaking existing setups
    return !this.hasExistingLegacyConfiguration();
  }

  /**
   * Checks if there's an existing legacy configuration directory
   * This prevents breaking existing installations when introducing XDG support
   */
  private hasExistingLegacyConfiguration(): boolean {
    const defaultDataPath = path.resolve(os.homedir(), '.local', 'share', 'containers', 'podman-desktop');
    const configPath = path.resolve(defaultDataPath, 'configuration');
    return fs.existsSync(configPath);
  }
}
