/**********************************************************************
 * Copyright (C) 2022-2025 Red Hat, Inc.
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

import * as extensionApi from '@podman-desktop/api';

const macosExtraPath = '/opt/podman/bin:/usr/local/bin:/opt/homebrew/bin:/opt/local/bin';

/**
 * Finds all installations of podman in the system PATH (Windows, macOS, Linux)
 * @returns Array of unique podman installation paths found
 */
export async function findPodmanInstallations(): Promise<string[]> {
  try {
    let result: extensionApi.RunResult;
    if (extensionApi.env.isWindows) {
      // Windows: Use 'where podman' command
      result = await extensionApi.process.exec('where', ['podman']);
    } else {
      // Unix/macOS: use 'which -a podman' command
      result = await extensionApi.process.exec('which', ['-a', 'podman']);
    }

    // Parse output for which and where combined
    const paths: string[] = result.stdout
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(path => {
        if (path.length === 0) {
          return false; // Skip empty paths
        }
        try {
          const stat = fs.lstatSync(path); // Try to get file status
          return stat.isFile() && !stat.isSymbolicLink(); // Ensure it's a file excluding symlinks
        } catch {
          return false; // If lstatSync fails, the path is invalid
        }
      });

    // Return unique paths only
    return paths.filter((path, index) => paths.indexOf(path) === index);
  } catch (error: unknown) {
    console.warn('Failed to detect podman installations:', error);
    return [];
  }
}

export function getInstallationPath(): string | undefined {
  const env = process.env;
  if (extensionApi.env.isWindows) {
    return `c:\\Program Files\\RedHat\\Podman;${env.PATH}`;
  } else if (extensionApi.env.isMac) {
    if (!env.PATH) {
      return macosExtraPath;
    } else {
      return env.PATH.concat(':').concat(macosExtraPath);
    }
  } else {
    return env.PATH;
  }
}

export function getPodmanCli(): string {
  // If we have a custom binary path regardless if we are running Windows or not
  const customBinaryPath = getCustomBinaryPath();
  if (customBinaryPath) {
    return customBinaryPath;
  }

  if (extensionApi.env.isWindows) {
    return 'podman.exe';
  }
  return 'podman';
}

// Get the Podman binary path from configuration podman.binary.path
// return string or undefined
export function getCustomBinaryPath(): string | undefined {
  return extensionApi.configuration.getConfiguration('podman').get('binary.path');
}

export interface InstalledPodman {
  version: string;
}

export async function getPodmanInstallation(): Promise<InstalledPodman | undefined> {
  try {
    const { stdout: versionOut } = await extensionApi.process.exec(getPodmanCli(), ['--version']);
    const versionArr = versionOut.split(' ');
    const version = versionArr[versionArr.length - 1];
    return { version };
  } catch (err) {
    // no podman binary
    return undefined;
  }
}
