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

import { inject, injectable } from 'inversify';

import { Directories } from './directories.js';
import { SYSTEM_LOCKED_FILENAME } from './managed-by-constants.js';

@injectable()
export class LockedConfiguration {
  constructor(
    @inject(Directories)
    private directories: Directories,
  ) {}

  public async getContent(): Promise<{ [key: string]: unknown }> {
    // Get the managed locked file path from directories
    const managedLockedFile = path.join(this.directories.getManagedDefaultsDirectory(), SYSTEM_LOCKED_FILENAME);
    let managedLockedData = {};

    // It's important that we at least log to console what is happening here, as it's common for logs
    // to be shared when there are issues loading "managed-by" locked, so having this information in the logs is useful.
    try {
      const managedLockedContent = await fs.promises.readFile(managedLockedFile, 'utf-8');
      managedLockedData = JSON.parse(managedLockedContent);
      console.log(`[Managed-by]: Loaded managed locked from: ${managedLockedFile}`);
    } catch (error: unknown) {
      // Handle file-not-found errors gracefully - this is expected when no managed config exists
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        console.debug(`[Managed-by]: No managed locked file found at ${managedLockedFile}`);
      } else {
        // For other errors (like JSON parse errors), log as error
        console.error(`[Managed-by]: Failed to parse managed locked from ${managedLockedFile}:`, error);
      }
    }

    return managedLockedData;
  }
}
