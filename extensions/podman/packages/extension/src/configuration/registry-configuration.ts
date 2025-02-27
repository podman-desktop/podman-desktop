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

import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';

import type { Disposable, QuickPickItem } from '@podman-desktop/api';
import { commands, env, window } from '@podman-desktop/api';
import mustache from 'mustache';
import * as toml from 'smol-toml';

import { getJSONMachineList } from '../extension';
import { execPodman } from '../util';
import playbookRegistryConfFileTemplate from './playbook-setup-registry-conf-file.mustache?raw';

interface RegistryEntryQuickPickItem extends QuickPickItem {
  entry: RegistryConfigurationEntry;
}

export enum ActionEnum {
  ADD_REGISTRY_ACTION = 'addRegistry',
  END_REGISTRY_ACTION = 'endConfiguringRegistry',
}

interface ActionQuickPickItem extends QuickPickItem {
  actionName: ActionEnum;
}

interface RegistryConfigurationEntry {
  prefix?: string;
  insecure?: boolean;
  blocked?: boolean;
  location?: string;
  mirror?: RegistryConfigurationMirrorEntry[];
}

interface RegistryConfigurationMirrorEntry {
  location?: string;
  insecure?: boolean;
}

export interface RegistryConfigurationFile {
  registry: RegistryConfigurationEntry[];
}

export interface RegistryConfiguration {
  init(): Promise<Disposable[]>;
  getPlaybookScriptPath(): Promise<string>;
}

/**
 * Manages the registry configuration file (inside the Podman VM for macOS/Windows)
 */
export class RegistryConfigurationImpl implements RegistryConfiguration {
  async init(): Promise<Disposable[]> {
    const disposables: Disposable[] = [];
    disposables.push(this.registerSetupRegistryCommand());
    return disposables;
  }

  registerSetupRegistryCommand(): Disposable {
    return commands.registerCommand('podman.setupRegistry', this.setupRegistryCommandCallback);
  }

  async checkRegistryConfFileExistsInVm(): Promise<boolean> {
    // check if the podman machine has the file being mounted inside the VM or then says it can't continue
    const machineList = await getJSONMachineList();

    // check if the machine is running
    if (!machineList || machineList.list.length === 0) {
      await window.showErrorMessage('No Podman machine running');
      return false;
    }

    // filter all machines that are running
    const runningMachines = machineList.list.filter(machine => machine.Running === true);

    // execute a command to check if the registries conf file is mounted inside the /etc/containers/registries.conf.d folder
    // if not, display an error
    const machineRegistriesConfPathOnHost = this.getPathToRegistriesConfInsideVM();

    // use podman machine ssh command
    for (const machine of runningMachines) {
      const commandLineArgs = [
        'machine',
        'ssh',
        machine.Name,
        `find /etc/containers/registries.conf.d/ -lname "${machineRegistriesConfPathOnHost}"`,
      ];

      // check if the file is mounted
      const result = await execPodman(commandLineArgs, machine.VMType);
      if (!result.stdout) {
        // display an error message if the link is not found
        await window.showErrorMessage(
          `The registries configuration file is not mounted in the Podman VM ${machine.Name} in /etc/containers/registries.conf.d/ folder. Cannot continue. Recreate the machine using Podman Desktop.`,
        );
        return false;
      }
    }
    return true;
  }

  async setupRegistryCommandCallback(): Promise<void> {
    // on Linux the file is accessible directly
    if (env.isMac || env.isWindows) {
      const checked = await this.checkRegistryConfFileExistsInVm();
      if (!checked) {
        return;
      }
    }

    // continue
    return this.displayRegistryQuickPick();
  }

  async displayRegistryQuickPick(): Promise<void> {
    let keepConfiguring = true;
    const configFileContent = await this.readRegistriesConfContent();

    while (keepConfiguring) {
      const quickPickItems = this.buildQuickPickItems(configFileContent);
      const response = await window.showQuickPick(quickPickItems, {
        title: 'Registry configuration',
        placeHolder: 'Select a registry to configure',
      });

      if (!response) break;

      if ('actionName' in response) {
        keepConfiguring = await this.handleAction(response, configFileContent);
      } else if (response.entry?.location) {
        await this.handleEditMirror(response.entry, configFileContent);
      }
    }
  }

  buildQuickPickItems(
    configFileContent: RegistryConfigurationFile,
  ): (RegistryEntryQuickPickItem | ActionQuickPickItem)[] {
    const items: (RegistryEntryQuickPickItem | ActionQuickPickItem)[] = configFileContent.registry
      .filter(entry => !!entry.location)
      .map(entry => {
        const description = entry.mirror ? `mirroring: [${entry.mirror.map(m => m.location).join(', ')}]` : '';
        return {
          label: entry.location ?? '',
          description,
          entry,
        } as RegistryEntryQuickPickItem;
      });
    items.push(
      { label: '⚙️ Add registry configuration', actionName: ActionEnum.ADD_REGISTRY_ACTION },
      { label: '↩ End configuring registries', actionName: ActionEnum.END_REGISTRY_ACTION },
    );
    return items;
  }

  async handleAction(response: ActionQuickPickItem, configFileContent: RegistryConfigurationFile): Promise<boolean> {
    if (response.actionName === ActionEnum.ADD_REGISTRY_ACTION) {
      const registryName = await window.showInputBox({
        title: 'Add location of the registry',
        placeHolder: 'Enter a registry location',
      });
      if (registryName) {
        configFileContent.registry.push({ location: registryName });
        await this.saveRegistriesConfContent(configFileContent);
      }
    } else if (response.actionName === ActionEnum.END_REGISTRY_ACTION) {
      return false; // end configuration
    }
    return true;
  }

  async handleEditMirror(
    entry: RegistryConfigurationEntry,
    configFileContent: RegistryConfigurationFile,
  ): Promise<void> {
    const initialValue = entry.mirror?.[0]?.location ?? '';
    const mirrorRegistry = await window.showInputBox({
      title: 'Define mirror location for the registry',
      placeHolder: `Enter the mirror for ${entry.location}`,
      value: initialValue,
    });
    const matchingRegistry = configFileContent.registry.find(e => e.location === entry.location);
    if (matchingRegistry) {
      matchingRegistry.mirror = mirrorRegistry ? [{ location: mirrorRegistry }] : undefined;
      await this.saveRegistriesConfContent(configFileContent);
    }
  }

  async saveRegistriesConfContent(content: RegistryConfigurationFile): Promise<void> {
    const tomlContent = toml.stringify(content);

    await writeFile(this.getRegistryConfFilePath(), tomlContent, 'utf-8');
  }

  async readRegistriesConfContent(): Promise<RegistryConfigurationFile> {
    const EMPTY_CONFIG_FILE = { registry: [] };
    const registryConfFilePath = this.getRegistryConfFilePath();
    if (!existsSync(registryConfFilePath)) {
      return EMPTY_CONFIG_FILE;
    }

    // get the content of the file
    const content = await readFile(registryConfFilePath, 'utf-8');
    const tomlConfigFile = toml.parse(content);

    // read all the '[[registry]]' entries
    const registry: RegistryConfigurationEntry[] = [];
    if (!tomlConfigFile?.registry || !Array.isArray(tomlConfigFile?.registry)) {
      return EMPTY_CONFIG_FILE;
    }
    const registries: RegistryConfigurationEntry[] = tomlConfigFile.registry as RegistryConfigurationEntry[];

    for (const registryEntry of registries) {
      registry.push(registryEntry);
    }

    const configurationFile = { registry };

    await this.saveRegistriesConfContent(configurationFile);
    return configurationFile;
  }

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
    const playbookFile = resolve(tmpdir(), 'podman-desktop', 'podman-machine', 'playbook-setup-registry-conf-file.yml');
    // create the folder if it doesn't exist
    const parentFolder = dirname(playbookFile);
    await mkdir(parentFolder, { recursive: true });

    // write the content to the file
    await writeFile(playbookFile, playbookScriptContent, 'utf-8');

    // return the path to the file
    return playbookFile;
  }
}
