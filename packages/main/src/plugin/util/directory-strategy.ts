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

import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

import { isLinux } from '/@/util.js';

/**
 * Determines if XDG directory structure should be used
 * XDG is used only on Linux when:
 * 1. No custom directory override is set (PODMAN_DESKTOP_HOME_DIR)
 * 2. No existing legacy configuration is detected
 */
export class DirectoryStrategy {
  shouldUseXDGDirectories(): boolean {
    // Only consider XDG on Linux
    if (!isLinux()) {
      return false;
    }

    // If user has set custom directory, use legacy
    // biome-ignore lint/complexity/useLiteralKeys: <PODMAN_DESKTOP_HOME_DIR comes from an index signature>
    if (process.env['PODMAN_DESKTOP_HOME_DIR']) {
      return false;
    }

    // If legacy configuration already exists, keep using it to avoid breaking existing setups
    const defaultDataPath = resolve(homedir(), '.local', 'share', 'containers', 'podman-desktop');
    const configPath = resolve(defaultDataPath, 'configuration');
    return !existsSync(configPath);
  }
}
