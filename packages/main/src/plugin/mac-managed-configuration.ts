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

import { execFile } from 'node:child_process';
import { access } from 'node:fs/promises';
import { userInfo } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';

import { CONFIGURATION_LOCKED_KEY } from '@desktop-framework/api/configuration';
import { inject, injectable } from 'inversify';

import product from '/@product.json' with { type: 'json' };

import { Directories } from './directories.js';
import type { ManagedSettings } from './managed-settings.js';

/**
 * Device plists use default-settings.json keys plus the locked.json array.
 * Per-user plists use settings.json keys and cannot add locks.
 */
@injectable()
export class MacManagedConfiguration {
  private readonly plutilPath = '/usr/bin/plutil';
  private readonly fileNotFoundCode = 'ENOENT';
  private readonly execFileAsync = promisify(execFile);

  constructor(
    @inject(Directories)
    private readonly directories: Directories,
  ) {}

  async getContent(): Promise<ManagedSettings> {
    const directory = this.directories.getManagedPreferencesDir();
    if (!directory) {
      return { defaults: {}, user: {}, locked: [] };
    }

    const filename = `${product.appId}.plist`;
    const defaults = await this.readPreferences(join(directory, filename));
    let user: Record<string, unknown> = {};

    // Account lookup failures must not discard the device policy or stop startup.
    try {
      const userDirectory = this.directories.getManagedPreferencesDir(userInfo().username);
      if (userDirectory) {
        user = await this.readPreferences(join(userDirectory, filename));
      }
    } catch (error) {
      console.error('[Managed-by]: Failed to read per-user managed preferences:', error);
    }

    const locked = defaults[CONFIGURATION_LOCKED_KEY] as string[] | undefined;

    // Locks belong to the device policy, never to user settings.
    delete defaults[CONFIGURATION_LOCKED_KEY];
    delete user[CONFIGURATION_LOCKED_KEY];

    return { defaults, user, locked: locked ?? [] };
  }

  private async readPreferences(filename: string): Promise<Record<string, unknown>> {
    try {
      await access(filename);

      // The native converter supports XML and binary plists.
      const { stdout } = await this.execFileAsync(this.plutilPath, ['-convert', 'json', '-o', '-', filename]);
      const content: unknown = JSON.parse(stdout);
      if (!content || typeof content !== 'object' || Array.isArray(content)) {
        throw new Error('Managed preferences must contain a dictionary');
      }

      const preferences = content as Record<string, unknown>;
      const locked = preferences[CONFIGURATION_LOCKED_KEY];
      if (locked !== undefined && (!Array.isArray(locked) || !locked.every(key => typeof key === 'string'))) {
        throw new Error('Managed preference locks must contain an array of strings');
      }

      console.log(`[Managed-by]: Loaded managed preferences from: ${filename}`);
      return preferences;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === this.fileNotFoundCode) {
        return {};
      }

      console.error(`[Managed-by]: Failed to read managed preferences from ${filename}:`, error);
      return {};
    }
  }
}
