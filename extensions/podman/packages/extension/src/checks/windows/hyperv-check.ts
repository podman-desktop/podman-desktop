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

import { BaseCheck, SequenceCheck } from '../base-check';
import { HyperVInstalledCheck } from './hyperv-installed-check';
import { HyperVRunningCheck } from './hyperv-running-check';
import { PodmanDesktopElevatedCheck } from './podman-desktop-elevated-check';
import { UserAdminCheck } from './user-admin-check';

@injectable()
export class HyperVCheck extends BaseCheck {
  title = 'Hyper-V checks';

  constructor(
    @inject(UserAdminCheck) private isUserAdminCheck: UserAdminCheck,
    @inject(PodmanDesktopElevatedCheck) private isPodmanDesktopElevatedCheck: PodmanDesktopElevatedCheck,
    @inject(HyperVInstalledCheck) private isHyperVInstalledCheck: HyperVInstalledCheck,
    @inject(HyperVRunningCheck) private isHyperVRunningCheck: HyperVRunningCheck,
  ) {
    super();
  }

  async execute(): Promise<CheckResult> {
    return new SequenceCheck(this.title, [
      this.isUserAdminCheck,
      this.isPodmanDesktopElevatedCheck,
      this.isHyperVInstalledCheck,
      this.isHyperVRunningCheck,
    ]).execute();
  }
}
