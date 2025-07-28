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

import * as extensionApi from '@podman-desktop/api';

const macosExtraPath = '/opt/podman/bin:/usr/local/bin:/opt/homebrew/bin:/opt/local/bin';

/**
 * Finds all installations of podman in the system PATH (Windows, macOS, Linux)
 * @returns Array of unique podman installation paths found
 */
async function findPodmanInstallations(): Promise<string[]> {
  try {
    if (extensionApi.env.isWindows) {
      // Windows: Use 'where podman' command
      const result = await extensionApi.process.exec('where', ['podman']);
      const lines = result.stdout
        .trim()
        .split('\n')
        .filter(line => line.trim().length > 0);
      // Windows 'where' output format: direct paths
      return lines.map(line => line.trim()).filter(path => path.length > 0);
    }
    // Unix/macOS: Use 'type -a podman' command
    const result = await extensionApi.process.exec('sh', ['-c', 'type -a podman']);
    const lines = result.stdout
      .trim()
      .split('\n')
      .filter(line => line.trim().length > 0);

    // Extract paths and deduplicate
    const uniquePaths = new Set(
      lines.map(line => line.replace(/^podman is\s+/, '').trim()).filter(path => path.length > 0),
    );
    return Array.from(uniquePaths);
  } catch (error) {
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

// Checks if there are more than one version of podman installed (Windows, macOS, Linux)
export async function isMultiplePodmanInstalled(): Promise<boolean> {
  // Checks if custom binary path is set. If so, we don't need to check for multiple installations.
  if (getCustomBinaryPath()) {
    return false;
  }
  const installations = await findPodmanInstallations();
  // If there are 2 or more unique installations, return true
  return installations.length > 1;
}
