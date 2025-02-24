/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';

import type { ExtensionContext } from '@podman-desktop/api';
import { env } from '@podman-desktop/api';
import mustache from 'mustache';

import playbookRegistryConfFileTemplate from './playbook-setup-registry-conf-file.mustache?raw';

export interface RegistryConfiguration {
  getRegistryConfFilePath(): string;
  getPathToRegistriesConfInsideVM(): string;
  getPlaybookScriptPath(): Promise<string>;
}

/**
 * Manages the registry configuration file (inside the Podman VM for macOS/Windows)
 */
export class RegistryConfigurationImpl implements RegistryConfiguration {
  constructor(private readonly context: ExtensionContext) {}

  // provides the path to the file being on the host
  // $HOME/.config/containers/registries.conf
  getRegistryConfFilePath(): string {
    return resolve(homedir(), '.config/containers/registries.conf');
  }

  // provide the path to the registries.conf file inside the VM when the home folder is mounted
  getPathToRegistriesConfInsideVM(): string {
    let hostPath = this.getRegistryConfFilePath();

    // on macOS it's the same as the host
    if (env.isMac || env.isLinux) {
      return hostPath;
    }

    // on Windows, the path is different
    // first extract drive letter and then replace the backslash
    // example C:\\Users\\Username\\Documents should be /c/Users/Username/Documents
    const driveLetterMatch = RegExp(/^([a-zA-Z]):\\/).exec(hostPath);
    if (driveLetterMatch) {
      const driveLetter = driveLetterMatch[1].toLowerCase();
      hostPath = hostPath.replace(/^([a-zA-Z]):\\/, `/mnt/${driveLetter}/`);
    }

    // replace backslashes with forward slashes
    return hostPath.replace(/\\/g, '/');
  }

  // write to a temp file the ansible playbook script
  // then return the path to this file
  async getPlaybookScriptPath(): Promise<string> {
    // create the content of the file

    const playbookScriptContent = mustache.render(playbookRegistryConfFileTemplate, {
      configurationFileInsideVmPath: this.getPathToRegistriesConfInsideVM(),
      configurationFileName: '999-podman-desktop-registries-from-host.conf',
    });

    // write the content to a temp file inside the storage folder of the extension
    const playbookFile = resolve(this.context.storagePath, 'podman-machine', 'playbook-setup-registry-conf-file.yml');
    // create the folder if it doesn't exist
    const parentFolder = dirname(playbookFile);
    await mkdir(parentFolder, { recursive: true });

    // write the content to the file
    await writeFile(playbookFile, playbookScriptContent, 'utf-8');

    // return the path to the file
    return playbookFile;
  }
}
