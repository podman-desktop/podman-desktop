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

import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';
import type { IConfigurationRegistry } from '/@api/configuration/models.js';
import { spawnSync } from 'node:child_process';

/**
 * On Windows, launching program automatically on startup is done via %APPDATA%\Roaming\Microsoft\Windows\Start Menu\Programs\Startup folder
 * This class manages the creation and deletion of the startup file
 * It uses a vbs script as using a bat script displays a blank terminal window
 */
export class WindowsStartup {
  private podmanDesktopBinaryPath;

  private startupFile;
  private windowsStartupFolder;
  private exeDirectory;
  private configurationRegistry: IConfigurationRegistry;

  constructor(configurationRegistry: IConfigurationRegistry) {
    // configuration settings
    this.configurationRegistry = configurationRegistry;

    // grab current path of the binary
    this.podmanDesktopBinaryPath = app.getPath('exe');

    // Folder of the binary path
    this.exeDirectory = path.dirname(this.podmanDesktopBinaryPath);

    // Path to the startup folder ?
    this.windowsStartupFolder = path.resolve(app.getPath('appData'), 'Microsoft/Windows/Start Menu/Programs/Startup');

    // Path to the startup folder ?
    this.startupFile = path.resolve(this.windowsStartupFolder, 'Podman Desktop.exec.lnk');
  }

  // enable only if we're not using a temporary path / portable mode
  shouldEnable(): boolean {
    if (!process.env['PORTABLE_EXECUTABLE_FILE'] && this.podmanDesktopBinaryPath.startsWith(app.getPath('temp'))) {
      console.warn('Skipping start on boot option as the app is running from a temporary path');
      return false;
    }
    return true;
  }

  async enable(): Promise<void> {
    // Check the preferences for login.minimize has been enabled
    // as this may change each time it's enabled (changed from true to false, etc.)
    // it's also to make sure that settings weren't changed while async function was running
    // so we check the configuration within the function
    const preferencesConfig = this.configurationRegistry.getConfiguration('preferences');
    const minimize = preferencesConfig.get<boolean>('login.minimize');

    // We pass in "--minimize" so electron can read the flag on first startup.
    const minimizeSettings = minimize ? ' --minimized' : '';

    // check if we are using the portable mode.
    // in that case we need to register the binary path to the portable file
    // and not where it is being expanded
    if (process.env['PORTABLE_EXECUTABLE_FILE'] && process.env['PORTABLE_EXECUTABLE_DIR']) {
      this.podmanDesktopBinaryPath = process.env['PORTABLE_EXECUTABLE_FILE'];
      this.exeDirectory = process.env['PORTABLE_EXECUTABLE_DIR'];
    } else if (this.podmanDesktopBinaryPath.startsWith(app.getPath('temp'))) {
      console.warn('Skipping startup installation as the app is running from a temporary path');
      return;
    }

    // do we have an updated version of the binary being installed in AppData/Local
    // if so, we need to update the startup file to point to the new binary
    // this is the case when we update the app
    const programsData = path.resolve(app.getPath('appData'), '..', 'local/Programs/podman-desktop');
    const podmanDesktopInPrograms = path.resolve(programsData, 'Podman Desktop.exe');
    if (fs.existsSync(podmanDesktopInPrograms)) {
      this.podmanDesktopBinaryPath = podmanDesktopInPrograms;
      this.exeDirectory = programsData;
    }

    if (!this.windowsStartupFolder) {
      console.warn(
        `Windows startup folder not found ${this.windowsStartupFolder}, cancelling the startup file creation`,
      );
      return;
    }

    const envVars = {
      PD: this.podmanDesktopBinaryPath,
      PD_WD: this.exeDirectory,
      ARGS: minimizeSettings,
      PD_SHORTCUT: this.startupFile,
      DESCRIPTION: 'Podman Desktop Autostart',
    };

    // PowerShell script as a string
    const psScript = `
      $ws = New-Object -ComObject WScript.Shell;
      $shortcut = $ws.CreateShortcut($env:PD_SHORTCUT);
      $shortcut.TargetPath = $env:PD;
      $shortcut.Arguments = $env:ARGS;
      $shortcut.WorkingDirectory = $env:PD_WD;
      $shortcut.Description = $env:DESCRIPTION;
      $shortcut.Save();
    `;

    const result = spawnSync(
      // eslint-disable-next-line sonarjs/no-os-command-from-path
      'powershell.exe',
      ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psScript],
      { env: { ...process.env, ...envVars } },
    );
    if (result.error) {
      console.log(
        'An error occurred when creating startup shortcut.',
        String(result.error),
        `stdout: ${result.stdout}`,
        `stderr:${result.stderr}`,
      );
    } else {
      console.log(`Startup shortcut created successfully at '${envVars.PD_SHORTCUT}'`);
    }
  }

  async disable(): Promise<void> {
    // remove the file at this.podmanDesktopBinaryPath only if it exists
    if (fs.existsSync(this.startupFile)) {
      await fs.promises.unlink(this.startupFile);
    }
  }
}
