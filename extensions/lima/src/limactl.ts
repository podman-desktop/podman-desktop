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
import * as extensionApi from '@podman-desktop/api';

const macosExtraPath = '/usr/local/bin:/opt/homebrew/bin:/opt/local/bin';

export function getInstallationPath(): string | undefined {
  const env = process.env;
  if (extensionApi.env.isMac) {
    if (!env.PATH) {
      return macosExtraPath;
    } else {
      return env.PATH.concat(':').concat(macosExtraPath);
    }
  } else {
    return env.PATH;
  }
}

export function getLimactl(): string {
  // If we have a custom binary path regardless if we are running Windows or not
  const customBinaryPath = getCustomBinaryPath();
  if (customBinaryPath) {
    return customBinaryPath;
  }

  if (extensionApi.env.isWindows) {
    return 'limactl.exe';
  }
  return 'limactl';
}

// Get the limactl binary path from configuration lima.binary.path
// return string or undefined
function getCustomBinaryPath(): string | undefined {
  return extensionApi.configuration.getConfiguration('lima').get('binary.path');
}

export interface InstalledLima {
  version: string;
}

export async function getLimaInstallation(): Promise<InstalledLima | undefined> {
  try {
    const { stdout: versionOut } = await extensionApi.process.exec(getLimactl(), ['--version']);
    const versionArr = versionOut.split(' ');
    const version = versionArr[versionArr.length - 1];
    return { version };
  } catch (err) {
    // no limactl binary
    return undefined;
  }
}

/*
NAME      STATUS     SSH            VMTYPE    ARCH      CPUS    MEMORY    DISK      DIR
podman    Stopped    127.0.0.1:0    qemu      x86_64    4       4GiB      100GiB    ~/.lima/podman
*/

export interface LimaInfo {
  name: string;
  vmType: string;
  arch: string;
  cpus: number;
  memory: number; // bytes
  disk: number; // bytes
  dir: string;

  sshAddress: string;
  sshLocalPort: number;
  configUserName?: string;
  identityFile?: string;
}

export async function getLimaInfo(name: string): Promise<LimaInfo | undefined> {
  try {
    const { stdout } = await extensionApi.process.exec(getLimactl(), ['list', '--json', name]);
    const limaInfo = JSON.parse(stdout);
    const instance: LimaInfo = {
      name: limaInfo.name,
      vmType: limaInfo.vmType,
      arch: limaInfo.arch,
      cpus: limaInfo.cpus,
      memory: limaInfo.memory,
      disk: limaInfo.disk,
      dir: limaInfo.dir,

      sshAddress: limaInfo.sshAddress,
      sshLocalPort: limaInfo.sshLocalPort,
      configUserName: limaInfo.config?.user?.name,
      identityFile: limaInfo?.IdentityFile,
    };
    if (!instance.identityFile) {
      // Starting with Lima 2.0, some host attributes have been deprecated in 'list'
      const { stdout } = await extensionApi.process.exec(getLimactl(), ['info']);
      const limaInfo = JSON.parse(stdout);
      instance.identityFile = limaInfo.identityFile;
    }
    return instance;
  } catch (err) {
    return undefined;
  }
}
