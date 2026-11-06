/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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
import { inject, injectable, optional } from 'inversify';

import { BaseCheck } from '/@/checks/base-check';
import { HyperVPrep } from '/@/platforms/windows/hyperv-prep';

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
    @inject(HyperVPrep) @optional() private hyperVPrep?: HyperVPrep,
  ) {
    super();
  }

  async execute(): Promise<CheckResult> {
    const userAdminResult = await this.userAdminCheck.execute();
    if (!userAdminResult.successful) {
      if (!(await this.isHyperVAdminGroupMember())) {
        return userAdminResult;
      }
    } else {
      const podmanDesktopElevatedResult = await this.isPodmanDesktopElevatedCheck.execute();
      if (!podmanDesktopElevatedResult.successful && !(await this.isHyperVAdminGroupMember())) {
        return podmanDesktopElevatedResult;
      }
    }

    return this.executeHyperVAvailabilityChecks();
  }

  private async isHyperVAdminGroupMember(): Promise<boolean> {
    return (await this.hyperVPrep?.isCurrentUserHyperVAdminGroupMember()) ?? false;
  }

  private async executeHyperVAvailabilityChecks(): Promise<CheckResult> {
    const hyperVInstalledResult = await this.isHyperVInstalledCheck.execute();
    if (!hyperVInstalledResult.successful) {
      return hyperVInstalledResult;
    }

    return this.isHyperVRunningCheck.execute();
  }
}
