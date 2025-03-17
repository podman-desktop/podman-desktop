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
import * as os from 'node:os';
import * as path from 'node:path';

import * as extensionApi from '@podman-desktop/api';

export const localBinDir = path.join('/', 'usr', 'local', 'bin');
export const localWindowsBinDir = path.join(os.homedir(), 'AppData', 'Local', 'Microsoft', 'WindowsApps');

export function getSystemBinaryPath(binaryName: string): string {
  switch (process.platform) {
    case 'win32':
      return path.join(localWindowsBinDir, binaryName.endsWith('.exe') ? binaryName : `${binaryName}.exe`);
    case 'darwin':
    case 'linux':
      return path.join(localBinDir, binaryName);
    default:
      throw new Error(`unsupported platform: ${process.platform}.`);
  }
}

// Takes a binary path (e.g. /tmp/docker-compose) and installs it to the system. Renames it based on binaryName
export async function installBinaryToSystem(binaryPath: string, binaryName: string): Promise<string | undefined> {
  const system = process.platform;

  // Before copying the file, make sure it's executable (chmod +x) for Linux and Mac
  if (system === 'linux' || system === 'darwin') {
    try {
      await extensionApi.process.exec('chmod', ['+x', binaryPath]);
      console.log(`Made ${binaryPath} executable`);
    } catch (error) {
      throw new Error(`Error making binary executable: ${error}`);
    }
  }

  // Create the appropriate destination path (Windows uses AppData/Local, Linux and Mac use /usr/local/bin)
  // and the appropriate command to move the binary to the destination path
  const destinationPath: string = getSystemBinaryPath(binaryName);
  let args: string[] = [];
  let command: string | undefined;
  if (system === 'win32') {
    // admin privileges are are not needed on Windows
    await fs.promises.copyFile(binaryPath, destinationPath);
    return destinationPath;
  } else if (system === 'darwin') {
    command = 'exec';
    args = ['cp', '-f', binaryPath, destinationPath];
  } else if (system === 'linux') {
    command = '/bin/sh';
    args = ['-c', `cp ${binaryPath} ${destinationPath}`];
  }

  // If on macOS or Linux, check to see if the /usr/local/bin directory exists,
  // if it does not, then add mkdir -p /usr/local/bin to the start of the command when moving the binary.
  const destinationFolder = path.dirname(destinationPath);
  if (!fs.existsSync(destinationFolder)) {
    if (system === 'darwin') {
      args.unshift('mkdir', '-p', destinationFolder, '&&');
    } else if (system === 'linux') {
      // add mkdir -p /usr/local/bin just after the first item or args array (so it'll be in the -c shell instruction)
      args[args.length - 1] = `mkdir -p /usr/local/bin && ${args[args.length - 1]}`;
    } else {
      args.unshift('mkdir', destinationFolder, '&&');
    }
  }

  try {
    if (!command) {
      throw new Error('No command defined');
    }
    // Use admin privileges / ask for password for copying to /usr/local/bin
    await extensionApi.process.exec(command, args, { isAdmin: true });
    console.log(`Successfully installed '${binaryName}' binary.`);
    if (!(system === 'darwin' || process.env.FLATPAK_ID) && !process.env.PATH?.includes(destinationFolder)) {
      await extensionApi.window.showWarningMessage(
        `The compose binary has been installed into ${destinationFolder} but it is not in the system path. You should add it manually if you want to use compose from cli.`,
        'OK',
      );
    }
    return destinationPath;
  } catch (error) {
    console.error(`Failed to install '${binaryName}' binary: ${error}`);
    throw error;
  }
}
