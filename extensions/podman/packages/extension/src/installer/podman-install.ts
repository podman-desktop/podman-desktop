/**********************************************************************
 * Copyright (C) 2022-2026 Red Hat, Inc.
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
import { mkdir, readFile } from 'node:fs/promises';
import * as path from 'node:path';

import * as extensionApi from '@podman-desktop/api';
import { compare } from 'compare-versions';
import { inject, injectable, optional } from 'inversify';

import { getDetectionChecks } from '/@/checks/detection-checks';
import {
  PODMAN_PROVIDER_LIBKRUN_SUPPORTED_KEY,
  ROOTFUL_MACHINE_INIT_SUPPORTED_KEY,
  START_NOW_MACHINE_INIT_SUPPORTED_KEY,
  USER_MODE_NETWORKING_SUPPORTED_KEY,
} from '/@/constants';
import {
  calcPodmanMachineSetting,
  getJSONMachineList,
  isLibkrunSupported,
  isRootfulMachineInitSupported,
  isStartNowAtMachineInitSupported,
  isUserModeNetworkingSupported,
} from '/@/extension';
import { ExtensionContextSymbol, ProviderCleanupSymbol, TelemetryLoggerSymbol } from '/@/inject/symbols';
import * as podman5JSON from '/@/podman5.json';
import { MachineJSON } from '/@/types';
import { InstalledPodman, PodmanBinary } from '/@/utils/podman-binary';
import { getBundledPodmanVersion } from '/@/utils/podman-bundled';
import type { PodmanInfo } from '/@/utils/podman-info';
import { PodmanInfoImpl } from '/@/utils/podman-info';
import { execPodman } from '/@/utils/util';

import { Installer } from './installer';

export interface UpdateCheck {
  hasUpdate: boolean;
  installedVersion?: string;
  bundledVersion?: string;
}

@injectable()
export class PodmanInstall {
  private podmanInfo: PodmanInfo | undefined;

  private readonly storagePath: string;

  constructor(
    @inject(ExtensionContextSymbol)
    readonly extensionContext: extensionApi.ExtensionContext,
    @inject(TelemetryLoggerSymbol)
    readonly telemetryLogger: extensionApi.TelemetryLogger,
    @inject(Installer)
    @optional()
    readonly installer: Installer | undefined,
    @inject(ProviderCleanupSymbol)
    @optional()
    readonly providerCleanup: extensionApi.ProviderCleanup | undefined,
    @inject(PodmanBinary)
    readonly podmanBinary: PodmanBinary,
  ) {
    this.storagePath = extensionContext.storagePath;
  }

  public async doInstallPodman(provider: extensionApi.Provider): Promise<void> {
    if (!this.podmanInfo) {
      console.error('The podman extension has not been successfully initialized');
      throw new Error('The podman extension has not been successfully initialized');
    }
    const dialogResult = await extensionApi.window.showInformationMessage(
      `Podman is not installed on this system, would you like to install Podman ${getBundledPodmanVersion()}?`,
      'Yes',
      'No',
    );
    if (dialogResult === 'Yes') {
      await this.installBundledPodman();
      const newInstalledPodman = await this.podmanBinary.getBinaryInfo();
      // write podman version
      if (newInstalledPodman) {
        this.podmanInfo.podmanVersion = newInstalledPodman.version;
        extensionApi.context.setValue(
          ROOTFUL_MACHINE_INIT_SUPPORTED_KEY,
          isRootfulMachineInitSupported(newInstalledPodman.version),
        );
        extensionApi.context.setValue(
          USER_MODE_NETWORKING_SUPPORTED_KEY,
          isUserModeNetworkingSupported(newInstalledPodman.version),
        );
        extensionApi.context.setValue(
          START_NOW_MACHINE_INIT_SUPPORTED_KEY,
          isStartNowAtMachineInitSupported(newInstalledPodman.version),
        );
        extensionApi.context.setValue(
          PODMAN_PROVIDER_LIBKRUN_SUPPORTED_KEY,
          isLibkrunSupported(newInstalledPodman.version),
        );
        await calcPodmanMachineSetting();
      }
      // update detections checks
      provider.updateDetectionChecks(getDetectionChecks(newInstalledPodman));
    } else {
      return; // exiting as without podman this extension is useless
    }
  }

  public async checkForUpdate(installedPodman: InstalledPodman | undefined): Promise<UpdateCheck> {
    const podmanInfoRaw = await this.getLastRunInfo();
    this.podmanInfo = new PodmanInfoImpl(podmanInfoRaw, this.storagePath);

    let installedVersion = this.podmanInfo.podmanVersion;
    if (!installedPodman) {
      return { installedVersion: undefined, hasUpdate: false, bundledVersion: undefined };
    } else if (this.podmanInfo.podmanVersion !== installedPodman.version) {
      installedVersion = installedPodman.version;
    }
    const installer = this.getInstaller();
    const bundledVersion = getBundledPodmanVersion();
    if (
      installedVersion &&
      installer?.requireUpdate(installedVersion) &&
      this.podmanInfo.ignoreVersionUpdate !== bundledVersion
    ) {
      return { installedVersion, hasUpdate: true, bundledVersion };
    }
    return { installedVersion, hasUpdate: false, bundledVersion };
  }

  protected async stopPodmanMachinesIfAnyBeforeUpdating(): Promise<boolean> {
    // check if machines, and if machines are running, stop them by prompting first the user
    const machinesRunning: MachineJSON[] = [];
    try {
      const machineListOutput = await getJSONMachineList();
      machinesRunning.push(...machineListOutput.list.filter(machine => machine.Running || machine.Starting));
    } catch (error) {
      console.debug('Unable to query machines before updating', error);
    }

    if (machinesRunning.length > 0) {
      let text;
      if (machinesRunning.length === 1) {
        const machineName = machinesRunning[0].Name;
        let subText = '';
        if (machineName === 'podman-machine-default') {
          subText = 'Podman machine';
        } else {
          subText = `Podman machine named "${machineName}"`;
        }
        text = `You have a ${subText} running. This machine needs to be stopped before proceeding with the update. Would you like to stop it now?`;
      } else {
        text = `You have ${machinesRunning.length} Podman machines running. These machines need to be stopped before proceeding with the update. Would you like to stop them now?`;
      }
      const answer = await extensionApi.window.showInformationMessage(text, 'Yes', 'No');
      if (answer === 'Yes') {
        for (const machine of machinesRunning) {
          try {
            await execPodman(['machine', 'stop', machine.Name]);
          } catch (error) {
            console.error('Error while stopping machine', error);
          }
          return true;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  // return true if data have been cleaned or if user skip it
  // return false if user cancel
  protected async wipeAllDataBeforeUpdatingToV5(
    installedPodman: InstalledPodman,
    updateInfo: UpdateCheck,
  ): Promise<boolean> {
    // if (v4 --> v5)
    if (
      installedPodman.version.startsWith('4.') &&
      updateInfo.bundledVersion?.startsWith('5.') &&
      this.providerCleanup
    ) {
      // prompt if user wants to wipe all data
      const answer = await extensionApi.window.showInformationMessage(
        `You are updating from Podman ${installedPodman.version} to ${updateInfo.bundledVersion}. It is recommended to delete all data (including containers, volumes, networks, podman machines, etc) for this update. DATA WILL BE DELETED PERMANENTLY. Do you want to proceed ?`,
        'Cancel',
        'Yes',
        'Skip',
      );

      if (answer === 'Yes') {
        // prompt confirmation
        const confirmation = await extensionApi.window.showInformationMessage(
          `Are you sure you want to delete all data? This operation is irreversible.`,
          'Yes',
          'No',
        );
        if (confirmation === 'No') {
          return false;
        }

        const actions = await this.providerCleanup.getActions();
        for (const action of actions) {
          await action.execute.apply(this.providerCleanup, [
            {
              logger: {
                log: (...msg: unknown[]): void => console.log(msg),
                error: (...msg: unknown[]): void => console.error(msg),
                warn: (...msg: unknown[]): void => console.warn(msg),
              },
            },
          ]);
        }
        return true;
      } else if (answer === 'Skip') {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  public async performUpdate(
    provider: extensionApi.Provider,
    installedPodman: InstalledPodman | undefined,
  ): Promise<void> {
    if (!this.podmanInfo) {
      console.error('The podman extension has not been successfully initialized');
      throw new Error('The podman extension has not been successfully initialized');
    }

    const updateInfo = await this.checkForUpdate(installedPodman);
    if (updateInfo.hasUpdate && updateInfo.installedVersion) {
      // before updating, podman machines need to be stopped if some of them are running
      const noRunningMachine = await this.stopPodmanMachinesIfAnyBeforeUpdating();
      if (!noRunningMachine) {
        await extensionApi.window.showWarningMessage('Podman update has been canceled.', 'OK');
        return;
      }

      // podman v4 -> v5 migration: ask to wipe all data before doing the update
      const wipeAllDataCompleted = await this.wipeAllDataBeforeUpdatingToV5(
        { version: updateInfo.installedVersion },
        updateInfo,
      );
      if (!wipeAllDataCompleted) {
        await extensionApi.window.showWarningMessage(
          'Podman update has been canceled. It is recommended to backup OCI images or containers before resuming the update procedure',
          'OK',
        );
        return;
      }

      // Podman github link with information that 5.3.1 cant update to 5.4.X
      // https://github.com/containers/podman/pull/25135
      // Podman Desktop link with proposed solution
      // https://github.com/podman-desktop/podman-desktop/issues/11720
      if (!updateInfo.bundledVersion) return;
      if (
        extensionApi.env.isWindows &&
        updateInfo.installedVersion === '5.3.1' &&
        compare(updateInfo.bundledVersion, '5.4.0', '>=')
      ) {
        // The updating from 5.3.1 -> 5.4.X have failed on Windows
        const result = await extensionApi.window.showInformationMessage(
          `Updating the podman from ${updateInfo.installedVersion} to ${updateInfo.bundledVersion} requires manual installation.\nDo you want to show instructions for this?`,
          'Yes',
          'No',
        );

        if (result === 'Yes') {
          const url = extensionApi.Uri.parse(
            'https://github.com/containers/podman/blob/main/docs/tutorials/podman-for-windows.md',
          );
          await extensionApi.env.openExternal(url);
        }
      } else {
        const answer = await extensionApi.window.showInformationMessage(
          `You have Podman ${updateInfo.installedVersion}.\nDo you want to update to ${updateInfo.bundledVersion}?`,
          'Yes',
          'No',
          'Ignore',
          'Open release notes',
        );
        if (answer === 'Yes') {
          await this.getInstaller()?.update();
          this.podmanInfo.podmanVersion = updateInfo.bundledVersion;
          provider.updateDetectionChecks(getDetectionChecks(installedPodman));
          provider.updateVersion(updateInfo.bundledVersion);
          this.podmanInfo.ignoreVersionUpdate = undefined;
          extensionApi.context.setValue(
            ROOTFUL_MACHINE_INIT_SUPPORTED_KEY,
            isRootfulMachineInitSupported(updateInfo.bundledVersion),
          );
          extensionApi.context.setValue(
            USER_MODE_NETWORKING_SUPPORTED_KEY,
            isUserModeNetworkingSupported(updateInfo.bundledVersion),
          );
          extensionApi.context.setValue(
            START_NOW_MACHINE_INIT_SUPPORTED_KEY,
            isStartNowAtMachineInitSupported(updateInfo.bundledVersion),
          );
          extensionApi.context.setValue(
            PODMAN_PROVIDER_LIBKRUN_SUPPORTED_KEY,
            isLibkrunSupported(updateInfo.bundledVersion),
          );
        } else if (answer === 'Ignore') {
          this.podmanInfo.ignoreVersionUpdate = updateInfo.bundledVersion;
        } else if (answer === 'Open release notes') {
          await extensionApi.env.openExternal(extensionApi.Uri.parse(podman5JSON.releaseNotes.href));
        }
      }
    }
  }

  getInstallChecks(): extensionApi.InstallCheck[] | undefined {
    const installer = this.getInstaller();
    if (installer) {
      return installer.getPreflightChecks();
    }
    return undefined;
  }

  getUpdatePreflightChecks(): extensionApi.InstallCheck[] | undefined {
    const installer = this.getInstaller();
    if (installer) {
      return installer.getUpdatePreflightChecks();
    }

    return undefined;
  }

  isAbleToInstall(): boolean {
    return !!this.installer;
  }

  protected getInstaller(): Installer | undefined {
    return this.installer;
  }

  private async installBundledPodman(): Promise<boolean> {
    const installer = this.getInstaller();
    if (installer) {
      return installer.install();
    }
    return false;
  }

  async getLastRunInfo(): Promise<PodmanInfo | undefined> {
    const podmanInfoPath = path.resolve(this.storagePath, 'podman-ext.json');
    if (!fs.existsSync(this.storagePath)) {
      await mkdir(this.storagePath);
    }

    if (!fs.existsSync(podmanInfoPath)) {
      return undefined;
    }

    try {
      const infoBuffer = await readFile(podmanInfoPath);
      return JSON.parse(infoBuffer.toString('utf8'));
    } catch (err) {
      console.error(err);
    }

    return undefined;
  }
}
