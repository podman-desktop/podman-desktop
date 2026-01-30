/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import * as extensionApi from '@podman-desktop/api';

import { DarwinSocketCompatibility } from '/@/compatibility-mode/darwin-socket-compatibility';
import { SocketCompatibility } from '/@/compatibility-mode/socket-compatibility';

const podmanSystemdSocket = 'podman.socket';

export class LinuxSocketCompatibility extends SocketCompatibility {
  details =
    'Administrative privileges are required to enable or disable the systemd Podman socket for Docker compatibility.';

  // This will show the "opposite" of what the current state is
  // "Enable" if it's currently disabled, "Disable" if it's currently enabled
  // for tooltip text
  tooltipText(): string {
    const text = 'Linux Docker socket compatibility for Podman.';
    return this.isEnabled() ? `Disable ${text}` : `Enable ${text}`;
  }

  // isEnabled() checks to see if /etc/systemd/system/socket.target.wants/podman.socket exists
  isEnabled(): boolean {
    const filename = '/etc/systemd/system/socket.target.wants/podman.socket';
    return fs.existsSync(filename);
  }

  // Runs the systemd command either 'enable' or 'disable'
  async runSystemdCommand(command: string, description: string): Promise<void> {
    // Only allow enable or disable, throw error if anything else is inputted
    if (command !== 'enable' && command !== 'disable') {
      throw new Error('runSystemdCommand only accepts enable or disable as the command');
    }

    // Create the full command to run with --now as well as the podman socket name
    const fullCommand = [command, '--now', podmanSystemdSocket];

    try {
      // Have to run via sudo
      await extensionApi.process.exec('systemctl', fullCommand);
    } catch (error) {
      console.error(`Error running systemctl command: ${error}`);
      await extensionApi.window.showErrorMessage(`Error running systemctl command: ${error}`, 'OK');
      return;
    }

    // Show information message to the user that they may need to run
    // ln -s /run/podman/podman.sock /var/run/docker.sock to enable Docker compatibility
    if (command === 'enable') {
      // Show information and give the user an option of Yes or Cancel
      const result = await extensionApi.window.showInformationMessage(
        'Do you want to create a symlink from /run/podman/podman.sock to /var/run/docker.sock to enable Docker compatibility without having to set the DOCKER_HOST environment variable?',
        'Yes',
        'Cancel',
      );
      // If the user clicked Yes, run the ln command
      if (result === 'Yes') {
        try {
          await extensionApi.process.exec('pkexec', ['ln', '-s', '/run/podman/podman.sock', '/var/run/docker.sock']);
          await extensionApi.window.showInformationMessage(
            'Symlink created successfully. The Podman socket is now available at /var/run/docker.sock.',
          );
        } catch (error) {
          console.error(`Error creating symlink: ${error}`);
          await extensionApi.window.showErrorMessage(`Error creating symlink: ${error}`, 'OK');
          return;
        }
      }
    }
    await extensionApi.window.showInformationMessage(
      `Podman systemd socket has been ${description} for Docker compatibility.`,
    );
  }

  async enable(): Promise<void> {
    return this.runSystemdCommand('enable', 'enabled');
  }

  async disable(): Promise<void> {
    return this.runSystemdCommand('disable', 'disabled');
  }
}

// TODO: Windows
export function getSocketCompatibility(): SocketCompatibility {
  switch (process.platform) {
    case 'darwin':
      return new DarwinSocketCompatibility();
    case 'linux':
      return new LinuxSocketCompatibility();
    default:
      throw new Error(`Unsupported platform ${process.platform}`);
  }
}
