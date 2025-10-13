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
import type { CheckResult } from '@podman-desktop/api';
import { compareVersions } from 'compare-versions';

import { getPodmanInstallation } from '../../utils/podman-cli';
import { BaseCheck } from '../base-check';

export class HyperVPodmanVersionCheck extends BaseCheck {
  title = 'Minimum Podman Version for Hyper-V';
  static readonly PODMAN_MINIMUM_VERSION_FOR_HYPERV = '5.2.0';

  async execute(): Promise<CheckResult> {
    const isPodmanVersionSupported = await this.isPodmanVersionSupported();
    if (!isPodmanVersionSupported) {
      return this.createFailureResult({
        description: `Hyper-V is only supported with podman version >= ${HyperVPodmanVersionCheck.PODMAN_MINIMUM_VERSION_FOR_HYPERV}.`,
      });
    }
    return this.createSuccessfulResult();
  }

  private async isPodmanVersionSupported(): Promise<boolean> {
    const installedPodman = await getPodmanInstallation();
    if (installedPodman?.version) {
      return compareVersions(installedPodman?.version, HyperVPodmanVersionCheck.PODMAN_MINIMUM_VERSION_FOR_HYPERV) >= 0;
    }
    return false;
  }
}
