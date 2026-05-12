/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { LegacyDirectories } from '/@/plugin/directories-legacy.js';
import { LinuxXDGDirectories } from '/@/plugin/directories-linux-xdg.js';
import { DirectoryStrategy } from '/@/plugin/util/directory-strategy.js';

export function readShowTrayIconSetting(): boolean {
  try {
    const strategy = new DirectoryStrategy();
    const directories = strategy.shouldUseXDGDirectories() ? new LinuxXDGDirectories() : new LegacyDirectories();
    const settingsFile = resolve(directories.getConfigurationDirectory(), 'settings.json');
    if (!existsSync(settingsFile)) return true;
    const settings = JSON.parse(readFileSync(settingsFile, 'utf-8'));
    return settings['preferences.ShowTrayIcon'] !== false;
  } catch {
    return true;
  }
}
