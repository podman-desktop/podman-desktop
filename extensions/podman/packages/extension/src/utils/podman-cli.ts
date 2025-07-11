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
import * as fs from 'node:fs';

import * as extensionApi from '@podman-desktop/api';

const macosExtraPath = '/opt/podman/bin:/usr/local/bin:/opt/homebrew/bin:/opt/local/bin';

export function getInstallationPath(): string | undefined {
  const env = process.env;
  if (extensionApi.env.isWindows) {
    return `c:\\Program Files\\RedHat\\Podman;${env.PATH}`;
  }
  if (extensionApi.env.isMac) {
    if (!env.PATH) {
      return macosExtraPath;
    }
    return env.PATH.concat(':').concat(macosExtraPath);
  }
  return env.PATH;
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

// Checks if there ara more than one version of podman installed in macos
export async function isMultiplePodmanInstalledinMacos(): Promise<boolean> {
  let isBrewInstalled = false;
  let isDmgInstalled = false;

  // Checks if custom binary path is set. If so, we don't need to check for multiple installations.
  const customPath = getCustomBinaryPath();
  console.log('customPath', customPath);
  if (customPath) {
    return false;
  }

  // Check if Podman is installed via Homebrew
  try {
    await extensionApi.process.exec('brew', ['list', '--verbose', 'podman'], {
      env: { HOMEBREW_NO_AUTO_UPDATE: '1', HOMEBREW_NO_ANALYTICS: '1' },
    });
    isBrewInstalled = true;
  } catch (err) {
    // podman is not installed with brew
    return false;
  }
  // Check each non-Homebrew path
  if (fs.existsSync('/opt/podman/bin/podman') || fs.existsSync('/opt/local/bin/podman')) {
    isDmgInstalled = true;
  }
  // Return true if we found more than one installation
  return isBrewInstalled && isDmgInstalled;
}
