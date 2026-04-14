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
import type { CheckResult } from '@podman-desktop/api';
import { inject, injectable } from 'inversify';

import { BaseCheck } from '/@/checks/base-check';

import { HyperVInstalledCheck } from './hyper-v-installed-check';
import { HyperVRunningCheck } from './hyper-v-running-check';
import { PodmanDesktopElevatedCheck } from './podman-desktop-elevated-check';
import { UserAdminCheck } from './user-admin-check';

@injectable()
export class HyperVCheck extends BaseCheck {
  title = 'Hyper-V installed';

  constructor(
    @inject(HyperVRunningCheck) private isHyperVRunningCheck: HyperVRunningCheck,
    @inject(HyperVInstalledCheck) private isHyperVInstalledCheck: HyperVInstalledCheck,
    @inject(PodmanDesktopElevatedCheck) private isPodmanDesktopElevatedCheck: PodmanDesktopElevatedCheck,
    @inject(UserAdminCheck) private userAdminCheck: UserAdminCheck,
  ) {
    super();
  }

  async execute(): Promise<CheckResult> {
    const userAdminResult = await this.userAdminCheck.execute();
    if (!userAdminResult.successful) {
      return userAdminResult;
    }

    const podmanDesktopElevatedResult = await this.isPodmanDesktopElevatedCheck.execute();
    if (!podmanDesktopElevatedResult.successful) {
      return podmanDesktopElevatedResult;
    }

    const hyperVInstalledResult = await this.isHyperVInstalledCheck.execute();
    if (!hyperVInstalledResult.successful) {
      return hyperVInstalledResult;
    }

    return this.isHyperVRunningCheck.execute();
  }
}
