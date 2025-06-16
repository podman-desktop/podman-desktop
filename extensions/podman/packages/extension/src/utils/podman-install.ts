/**********************************************************************
 * Copyright (C) 2022-2024 Red Hat, Inc.
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
import { promisify } from 'node:util';

import * as extensionApi from '@podman-desktop/api';
import { compare } from 'compare-versions';

import { OrCheck, SequenceCheck } from '../checks/base-check';
import { getDetectionChecks } from '../checks/detection-checks';
import { HyperVCheck } from '../checks/hyperv-check';
import { MacCPUCheck, MacMemoryCheck, MacPodmanInstallCheck, MacVersionCheck } from '../checks/macos-checks';
import { VirtualMachinePlatformCheck } from '../checks/virtual-machine-platform-check';
import { WinBitCheck } from '../checks/win-bit-check';
import { WinMemoryCheck } from '../checks/win-memory-check';
import { WinVersionCheck } from '../checks/win-version-check';
import { WSLVersionCheck } from '../checks/wsl-version-check';
import { WSL2Check } from '../checks/wsl2-check';
import { PodmanCleanupMacOS } from '../cleanup/podman-cleanup-macos';
import { PodmanCleanupWindows } from '../cleanup/podman-cleanup-windows';
import type { MachineJSON } from '../extension';
import {
  calcPodmanMachineSetting,
  getJSONMachineList,
  isLibkrunSupported,
  isRootfulMachineInitSupported,
  isStartNowAtMachineInitSupported,
  isUserModeNetworkingSupported,
  PODMAN_PROVIDER_LIBKRUN_SUPPORTED_KEY,
  ROOTFUL_MACHINE_INIT_SUPPORTED_KEY,
  START_NOW_MACHINE_INIT_SUPPORTED_KEY,
  USER_MODE_NETWORKING_SUPPORTED_KEY,
} from '../extension';
import { BaseInstaller } from '../installer/base-installer';
import * as podman5JSON from '../podman5.json';
import type { InstalledPodman } from './podman-cli';
import { getPodmanCli, getPodmanInstallation } from './podman-cli';
import { getAssetsFolder } from './util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export function getBundledPodmanVersion(): string {
  return podman5JSON.version;
}

export interface PodmanInfo {
  podmanVersion?: string;
  lastUpdateCheck: number;
  ignoreVersionUpdate?: string;
}

export class PodmanInfoImpl implements PodmanInfo {
  private podmanInfo: PodmanInfo;
  constructor(
    podmanInfoValue: PodmanInfo | undefined,
    private readonly storagePath: string,
  ) {
    if (!podmanInfoValue) {
      this.podmanInfo = { lastUpdateCheck: 0 } as PodmanInfo;
    } else {
      this.podmanInfo = podmanInfoValue;
    }
  }

  set podmanVersion(version: string) {
    if (this.podmanInfo.podmanVersion !== version) {
      this.podmanInfo.podmanVersion = version;
      this.writeInfo().catch((err: unknown) => console.error('Unable to write Podman Version', err));
    }
  }

  get podmanVersion(): string | undefined {
    return this.podmanInfo.podmanVersion;
  }

  set lastUpdateCheck(lastCheck: number) {
    if (this.podmanInfo.lastUpdateCheck !== lastCheck) {
      this.podmanInfo.lastUpdateCheck = lastCheck;
      this.writeInfo().catch((err: unknown) => console.error('Unable to write Podman Version', err));
    }
  }

  get lastUpdateCheck(): number {
    return this.podmanInfo.lastUpdateCheck;
  }

  get ignoreVersionUpdate(): string | undefined {
    return this.podmanInfo.ignoreVersionUpdate;
  }

  set ignoreVersionUpdate(version: string) {
    if (this.podmanInfo.ignoreVersionUpdate !== version) {
      this.podmanInfo.ignoreVersionUpdate = version;
      this.writeInfo().catch((err: unknown) => console.error('Unable to write Podman Version', err));
    }
  }

  private async writeInfo(): Promise<void> {
    try {
      const podmanInfoPath = path.resolve(this.storagePath, 'podman-ext.json');
      await writeFile(podmanInfoPath, JSON.stringify(this.podmanInfo));
    } catch (err) {
      console.error(err);
    }
  }
}

export interface Installer {
  getPreflightChecks(): extensionApi.InstallCheck[] | undefined;
  getUpdatePreflightChecks(): extensionApi.InstallCheck[] | undefined;
  install(): Promise<boolean>;
  requireUpdate(installedVersion: string): boolean;
  update(): Promise<boolean>;
}
export interface UpdateCheck {
  hasUpdate: boolean;
  installedVersion?: string;
  bundledVersion?: string;
}

export class PodmanInstall {
  private podmanInfo: PodmanInfo | undefined;

  private installers = new Map<NodeJS.Platform, Installer>();

  private readonly storagePath: string;

  protected providerCleanup: extensionApi.ProviderCleanup | undefined;

  constructor(readonly extensionContext: extensionApi.ExtensionContext) {
    this.storagePath = extensionContext.storagePath;
    this.installers.set('win32', new WinInstaller(extensionContext));
    this.installers.set('darwin', new MacOSInstaller());
    if (extensionApi.env.isMac) {
      this.providerCleanup = new PodmanCleanupMacOS();
    } else if (extensionApi.env.isWindows) {
      this.providerCleanup = new PodmanCleanupWindows();
    }
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
      const newInstalledPodman = await getPodmanInstallation();
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
            await extensionApi.process.exec(getPodmanCli(), ['machine', 'stop', machine.Name]);
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
    return this.installers.has(os.platform());
  }

  protected getInstaller(): Installer | undefined {
    return this.installers.get(os.platform());
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
      await promisify(fs.mkdir)(this.storagePath);
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

export class WinInstaller extends BaseInstaller {
  constructor(private extensionContext: extensionApi.ExtensionContext) {
    super();
  }

  getUpdatePreflightChecks(): extensionApi.InstallCheck[] {
    return [];
  }

  getPreflightChecks(): extensionApi.InstallCheck[] {
    return [
      new WinBitCheck(),
      new WinVersionCheck(),
      new WinMemoryCheck(),
      new OrCheck(
        'Windows virtualization',
        new SequenceCheck('WSL platform', [
          new VirtualMachinePlatformCheck(),
          new WSLVersionCheck(),
          new WSL2Check(this.extensionContext),
        ]),
        new HyperVCheck(true),
      ),
    ];
  }

  update(): Promise<boolean> {
    return this.install();
  }

  install(): Promise<boolean> {
    return extensionApi.window.withProgress({ location: extensionApi.ProgressLocation.APP_ICON }, async progress => {
      progress.report({ increment: 5 });
      const setupPath = path.resolve(getAssetsFolder(), `podman-${getBundledPodmanVersion()}-setup.exe`);
      try {
        if (fs.existsSync(setupPath)) {
          try {
            await extensionApi.process.exec(setupPath, ['/install', '/norestart']);
            progress.report({ increment: 80 });
            extensionApi.window.showNotification({ body: 'Podman is successfully installed.' });
          } catch (err) {
            //check if user cancelled installation see https://learn.microsoft.com/en-us/previous-versions//aa368542(v=vs.85)
            const runError = err as extensionApi.RunError;
            if (runError && runError.exitCode !== 1602 && runError.exitCode !== 0) {
              throw new Error(runError.message);
            }
          }
          return true;
        } else {
          throw new Error(`Can't find Podman setup package! Path: ${setupPath} doesn't exists.`);
        }
      } catch (err) {
        console.error('Error during install!');
        console.error(err);
        await extensionApi.window.showErrorMessage('Unexpected error, during Podman installation: ' + err, 'OK');
        return false;
      } finally {
        progress.report({ increment: -1 });
      }
    });
  }
}

class MacOSInstaller extends BaseInstaller {
  install(): Promise<boolean> {
    return extensionApi.window.withProgress({ location: extensionApi.ProgressLocation.APP_ICON }, async progress => {
      progress.report({ increment: 5 });
      const pkgArch = process.arch === 'arm64' ? 'aarch64' : 'amd64';

      const pkgPath = path.resolve(
        getAssetsFolder(),
        `podman-installer-macos-${pkgArch}-v${getBundledPodmanVersion()}.pkg`,
      );
      const existsPkg = fs.existsSync(pkgPath);

      const pkgUniversalPath = path.resolve(
        getAssetsFolder(),
        `podman-installer-macos-universal-v${getBundledPodmanVersion()}.pkg`,
      );
      const existsUniversalPkg = fs.existsSync(pkgUniversalPath);

      let pkgToInstall;
      if (existsPkg) {
        pkgToInstall = pkgPath;
      } else if (existsUniversalPkg) {
        pkgToInstall = pkgUniversalPath;
      } else {
        throw new Error(`Can't find Podman package! Path: ${pkgPath} or ${pkgUniversalPath} doesn't exists.`);
      }

      try {
        try {
          await extensionApi.process.exec('open', [pkgToInstall, '-W']);
        } catch (err) {
          throw new Error((err as extensionApi.RunError).stderr);
        }
        progress.report({ increment: 80 });
        // we cannot rely on exit code, as installer could be closed and it return '0' exit code
        // so just check that podman bin file exist.
        if (fs.existsSync('/opt/podman/bin/podman')) {
          extensionApi.window.showNotification({ body: 'Podman is successfully installed.' });
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.error('Error during install!');
        console.error(err);
        await extensionApi.window.showErrorMessage('Unexpected error, during Podman installation: ' + err, 'OK');
        return false;
      }
    });
  }
  update(): Promise<boolean> {
    return this.install();
  }

  getPreflightChecks(): extensionApi.InstallCheck[] {
    return [new MacCPUCheck(), new MacMemoryCheck(), new MacVersionCheck()];
  }

  getUpdatePreflightChecks(): extensionApi.InstallCheck[] {
    return [new MacPodmanInstallCheck()];
  }
}
