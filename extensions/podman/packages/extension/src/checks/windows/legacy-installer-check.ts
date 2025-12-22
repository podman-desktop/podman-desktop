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
import { promisify } from 'node:util';

import type { CheckResult } from '@podman-desktop/api';
import { injectable } from 'inversify';
import type { Registry } from 'winreg';
import WinReg from 'winreg';

import { BaseCheck } from '/@/checks/base-check';
import { UNINSTALL_LEGACY_INSTALLER_COMMAND } from '/@/installer/win-installer';

// Registry key / item used by the legacy installer
export const LEGACY_PODMAN_REGISTRY_KEY = '\\SOFTWARE\\Red Hat\\Podman';
export const LEGACY_PODMAN_REGISTRY_ITEM_NAME = 'InstallDir';

@injectable()
export class LegacyInstallerCheck extends BaseCheck {
  title = 'Legacy Installer';
  #legacyRegistry: Registry;

  constructor() {
    super();

    this.#legacyRegistry = new WinReg({
      hive: WinReg.HKLM,
      key: LEGACY_PODMAN_REGISTRY_KEY,
    });
  }

  async execute(): Promise<CheckResult> {
    const legacyInstaller = await promisify(this.#legacyRegistry.valueExists).bind(this.#legacyRegistry)(
      LEGACY_PODMAN_REGISTRY_ITEM_NAME,
    );

    if (legacyInstaller) {
      const item = await promisify(this.#legacyRegistry.get).bind(this.#legacyRegistry)(
        LEGACY_PODMAN_REGISTRY_ITEM_NAME,
      );

      return this.createFailureResult({
        description: `Found an older version of Podman in "${item.value}" that is not compatible with this installer.`,
        fixCommand: {
          title: 'Uninstall legacy Podman',
          id: UNINSTALL_LEGACY_INSTALLER_COMMAND,
        },
      });
    }

    return this.createSuccessfulResult();
  }
}
