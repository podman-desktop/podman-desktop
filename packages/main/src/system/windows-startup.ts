/* eslint-disable simple-import-sort/imports */
/**********************************************************************
 * Copyright (C) 2022 Red Hat, Inc.
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

import { existsSync, unlink } from 'node:fs';
import path from 'node:path';
import { app } from 'electron';
import type { IConfigurationRegistry } from '@podman-desktop/core-api/configuration';

/**
 * On Windows, launching program automatically on startup is done via %APPDATA%\Roaming\Microsoft\Windows\Start Menu\Programs\Startup folder
 * This class manages the creation and deletion of the startup file
 * It uses a vbs script as using a bat script displays a blank terminal window
 */
export class WindowsStartup {
  private podmanDesktopBinaryPath;
  private configurationRegistry: IConfigurationRegistry;

  constructor(configurationRegistry: IConfigurationRegistry) {
    // configuration settings
    this.configurationRegistry = configurationRegistry;

    // grab current path of the binary
    this.podmanDesktopBinaryPath = app.getPath('exe');
  }

  // enable only if we're not using a temporary path / portable mode
  shouldEnable(): boolean {
    if (!process.env['PORTABLE_EXECUTABLE_FILE'] && this.podmanDesktopBinaryPath.startsWith(app.getPath('temp'))) {
      console.warn('Skipping start on login option as the app is running from a temporary path');
      return false;
    }
    return true;
  }

  async enable(): Promise<void> {
    if (!this.shouldEnable()) {
      return;
    }
    const preferencesConfig = this.configurationRegistry.getConfiguration('preferences');
    const minimize = preferencesConfig.get<boolean>('login.minimize');

    // after https://github.com/podman-desktop/podman-desktop/pull/13056 there is a leftover startup file that we need to remove
    const windowsStartupFoler = path.resolve(app.getPath('appData'), 'Microsoft/Windows/Start Menu/Programs/Startup');
    const startupFile = path.resolve(windowsStartupFoler, 'podman-desktop.vbs');

    if (existsSync(startupFile)) {
      unlink(startupFile, (err: unknown) => {
        console.error(`Got error when removing ${startupFile} file: ${err}`);
      });
    }

    // We pass in "--minimize" so electron can read the flag on first startup.
    const args = minimize ? ['--minimized'] : [];
    // check if we are using the portable mode.
    // in that case we need to register the binary path to the portable file
    // and not where it is being expanded
    if (process.env['PORTABLE_EXECUTABLE_FILE']) {
      this.podmanDesktopBinaryPath = process.env['PORTABLE_EXECUTABLE_FILE'];
    }

    // do we have an updated version of the binary being installed in AppData/Local
    // if so, we need to update the startup file to point to the new binary
    // this is the case when we update the app
    const programsData = path.resolve(app.getPath('appData'), '..', 'local/Programs/podman-desktop');
    const podmanDesktopInPrograms = path.resolve(programsData, 'Podman Desktop.exe');
    if (existsSync(podmanDesktopInPrograms)) {
      this.podmanDesktopBinaryPath = podmanDesktopInPrograms;
    }

    app.setLoginItemSettings({
      openAtLogin: true,
      path: `"${this.podmanDesktopBinaryPath}"`,
      args,
    });
  }

  async disable(): Promise<void> {
    app.setLoginItemSettings({
      openAtLogin: false,
    });
  }
}
