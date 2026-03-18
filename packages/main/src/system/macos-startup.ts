/**********************************************************************
 * Copyright (C) 2022-2026 Red Hat, Inc.
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
import { unlink } from 'node:fs/promises';
import path from 'node:path';

import { app } from 'electron';

/**
 * On macOS, startup on login is done via app.setLoginItemSettings().
 * This uses the macOS SMAppService API, which properly registers
 * the app bundle so that "Podman Desktop" is displayed in
 * Login Items & Extensions (rather than "bash").
 *
 * Legacy installs used a LaunchAgent plist file — this class
 * cleans it up when enabling or disabling.
 */
export class MacosStartup {
  private podmanDesktopBinaryPath: string;
  private legacyPlistFile: string;

  constructor() {
    // grab current path of the binary
    this.podmanDesktopBinaryPath = app.getPath('exe');

    // legacy plist file path (used before switching to app.setLoginItemSettings)
    this.legacyPlistFile = path.resolve(
      app.getPath('home'),
      'Library/LaunchAgents/io.podman_desktop.PodmanDesktop.plist',
    );
  }

  shouldEnable(): boolean {
    // if it's not in applications, do not enable it
    if (
      !this.podmanDesktopBinaryPath.startsWith('/Applications/') &&
      !this.podmanDesktopBinaryPath.startsWith(app.getPath('home') + '/Applications/')
    ) {
      console.warn('Skipping Start on Login option as the app is not starting from an Applications folder');
      return false;
    }

    return true;
  }

  async enable(): Promise<void> {
    // comes from a volume ? do nothing
    if (this.podmanDesktopBinaryPath.startsWith('/Volumes/')) {
      console.warn(`Cannot enable the start on login, running from a volume ${this.podmanDesktopBinaryPath}`);
      return;
    }

    // clean up legacy LaunchAgent plist file if it exists
    await this.removeLegacyPlist();

    app.setLoginItemSettings({
      openAtLogin: true,
    });

    console.info(`Registered Podman Desktop as a login item using ${this.podmanDesktopBinaryPath} location.`);
  }

  async disable(): Promise<void> {
    // clean up legacy LaunchAgent plist file if it exists
    await this.removeLegacyPlist();

    app.setLoginItemSettings({
      openAtLogin: false,
    });
  }

  private async removeLegacyPlist(): Promise<void> {
    if (existsSync(this.legacyPlistFile)) {
      await unlink(this.legacyPlistFile);
    }
  }
}
