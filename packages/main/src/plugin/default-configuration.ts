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
import * as path from 'node:path';

import {
  SYSTEM_DEFAULTS_FILE_LINUX,
  SYSTEM_DEFAULTS_FILE_MAC,
  SYSTEM_DEFAULTS_FILE_WINDOWS_DIR,
  SYSTEM_DEFAULTS_FILE_WINDOWS_FILE,
} from '/@api/configuration/system-defaults.js';

import { isLinux, isMac, isWindows } from '../util.js';

export class DefaultConfiguration {
  // If all else fails, we will fallback to Linux-style path as it's the most "generic" and
  // likely to work in more environments where the OS isn't detected properly, such as "unix-like"
  // platforms like FreeBSD, etc.
  protected getManagedDefaultsFile(): string {
    if (isMac()) {
      return SYSTEM_DEFAULTS_FILE_MAC;
    } else if (isWindows()) {
      const programData = process.env['PROGRAMDATA'] ?? 'C:\\ProgramData';
      return path.join(programData, SYSTEM_DEFAULTS_FILE_WINDOWS_DIR, SYSTEM_DEFAULTS_FILE_WINDOWS_FILE);
    } else if (isLinux()) {
      return SYSTEM_DEFAULTS_FILE_LINUX;
    }
    // Fallback to Linux-style path
    return SYSTEM_DEFAULTS_FILE_LINUX;
  }

  public async getContent(): Promise<{ [key: string]: unknown }> {
    // "Create" the managed defaults file
    const managedDefaultsFile = this.getManagedDefaultsFile();
    let managedDefaultsData = {};

    // It's important that we at least log to console what is happening here, as it's common for logs
    // to be shared when there are issues loading "managed-by" defaults, so having this information in the logs is useful.
    try {
      const managedDefaultsContent = await fs.promises.readFile(managedDefaultsFile, 'utf-8');
      managedDefaultsData = JSON.parse(managedDefaultsContent);
      console.log(`[Managed-by]: Loaded managed defaults from: ${managedDefaultsFile}`);
    } catch (error) {
      console.error(`[Managed-by]: Failed to parse managed defaults from ${managedDefaultsFile}:`, error);
    }

    return managedDefaultsData;
  }
}
