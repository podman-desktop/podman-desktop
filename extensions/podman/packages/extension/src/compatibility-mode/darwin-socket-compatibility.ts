/**********************************************************************
 * Copyright (C) 2023-2026 Red Hat, Inc.
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
import os from 'node:os';

import extensionApi from '@podman-desktop/api';

import { SocketCompatibility } from '/@/compatibility-mode/socket-compatibility';
import { findRunningMachine } from '/@/extension';
import { getPodmanCli } from '/@/utils/podman-cli';

export class DarwinSocketCompatibility extends SocketCompatibility {
  // Shows the details of the compatibility mode on what we do.
  details =
    'The podman-mac-helper binary will be run, linking the Docker socket to Podman. This requires administrative privileges.';

  // This will show the "opposite" of what the current state is
  // "Enable" if it's currently disabled, "Disable" if it's currently enabled
  // for tooltip text
  tooltipText(): string {
    const text = 'macOS Docker socket compatibility for Podman.';
    return this.isEnabled() ? `Disable ${text}` : `Enable ${text}`;
  }

  // Find the podman-mac-helper binary which should only be located in either
  // brew or podman's install location
  findPodmanHelper(): string {
    const podmanPath = '/opt/podman/bin/podman-mac-helper';
    const homebrewPath = '/opt/homebrew/bin/podman-mac-helper';
    const userBinaryPath = '/usr/local/bin/podman-mac-helper';

    if (fs.existsSync(podmanPath)) {
      return podmanPath;
    } else if (fs.existsSync(homebrewPath)) {
      return homebrewPath;
    } else if (fs.existsSync(userBinaryPath)) {
      return userBinaryPath;
    } else {
      return '';
    }
  }

  // Check to see if com.github.containers.podman.helper-<username>.plist exists
  isEnabled(): boolean {
    const username = os.userInfo().username;
    const filename = `/Library/LaunchDaemons/com.github.containers.podman.helper-${username}.plist`;
    return fs.existsSync(filename);
  }

  // Run command for podman mac helper in admin mode
  async runMacHelperCommandWithAdminPriv(command: string, args: string[]): Promise<void> {
    try {
      // Have to run with admin mode
      const result = await extensionApi.process.exec(command, args, { isAdmin: true });
      if (result.stderr?.includes('Error:')) {
        throw new Error(result.stderr);
      }
    } catch (error) {
      throw new Error(`Unable to run command: ${String(error)}`);
    }
  }

  async runCommand(command: string, description: string): Promise<void> {
    // Find the podman-mac-helper binary
    const podmanHelperBinary = this.findPodmanHelper();
    if (podmanHelperBinary === '') {
      await extensionApi.window.showErrorMessage('podman-mac-helper binary not found.', 'OK');
      return;
    }

    try {
      await this.runMacHelperCommandWithAdminPriv(podmanHelperBinary, [command]);
      await extensionApi.window.showInformationMessage(
        `Docker socket compatibility mode for Podman has been ${description}.`,
      );
    } catch (error) {
      console.error(`Error running podman-mac-helper: ${error}`);
      await extensionApi.window.showErrorMessage(`Error running podman-mac-helper: ${error}`, 'OK');
    }
  }

  // Prompt the user that you need to restart the current podman machine for the changes to take effect
  async promptRestart(machine: string): Promise<void> {
    if (machine) {
      const result = await extensionApi.window.showInformationMessage(
        `Restarting your Podman machine is required to apply the changes. Would you like to restart the Podman machine '${machine}' now?`,
        'Yes',
        'Cancel',
      );
      if (result === 'Yes') {
        // Await since we must wait for the machine to stop before starting it again
        await extensionApi.process.exec(getPodmanCli(), ['machine', 'stop', machine]);
        await extensionApi.process.exec(getPodmanCli(), ['machine', 'start', machine]);
      }
    }
  }

  // Enable the compatibility mode by running podman-mac-helper install
  // Run the command with admin privileges and output the result to the user
  async enable(): Promise<void> {
    await this.runCommand('install', 'enabled');

    // Prompt the user to restart the podman machine if it's running
    return findRunningMachine().then(isRunning => {
      if (isRunning) {
        this.promptRestart(isRunning).catch((e: unknown) =>
          console.error(`Failed at restarting podman machine ${isRunning}. Error: ${String(e)}`),
        );
      }
    });
  }

  async disable(): Promise<void> {
    await this.runCommand('uninstall', 'disabled');

    // Prompt the user to restart the podman machine if it's running
    return findRunningMachine().then(isRunning => {
      if (isRunning) {
        this.promptRestart(isRunning).catch((e: unknown) =>
          console.error(`Failed at restarting podman machine ${isRunning}. Error: ${String(e)}`),
        );
      }
    });
  }
}
