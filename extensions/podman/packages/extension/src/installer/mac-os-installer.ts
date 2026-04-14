/*********************************************************************
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
 ********************************************************************/
import fs from 'node:fs';
import path from 'node:path';

import type { InstallCheck, RunError } from '@podman-desktop/api';
import { process as processAPI, ProgressLocation, window } from '@podman-desktop/api';
import { injectable } from 'inversify';

import { MacCPUCheck, MacMemoryCheck, MacPodmanInstallCheck, MacVersionCheck } from '/@/checks/macos-checks';
import { getBundledPodmanVersion } from '/@/utils/podman-bundled';
import { getAssetsFolder } from '/@/utils/util';

import { BaseInstaller } from './base-installer';

@injectable()
export class MacOSInstaller extends BaseInstaller {
  install(): Promise<boolean> {
    return window.withProgress({ location: ProgressLocation.APP_ICON }, async progress => {
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
          await processAPI.exec('open', [pkgToInstall, '-W']);
        } catch (err) {
          throw new Error((err as RunError).stderr);
        }
        progress.report({ increment: 80 });
        // we cannot rely on exit code, as installer could be closed and it return '0' exit code
        // so just check that podman bin file exist.
        if (fs.existsSync('/opt/podman/bin/podman')) {
          window.showNotification({ body: 'Podman is successfully installed.' });
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.error('Error during install!');
        console.error(err);
        await window.showErrorMessage('Unexpected error, during Podman installation: ' + err, 'OK');
        return false;
      }
    });
  }

  update(): Promise<boolean> {
    return this.install();
  }

  getPreflightChecks(): InstallCheck[] {
    return [new MacCPUCheck(), new MacMemoryCheck(), new MacVersionCheck()];
  }

  getUpdatePreflightChecks(): InstallCheck[] {
    return [new MacPodmanInstallCheck()];
  }
}
