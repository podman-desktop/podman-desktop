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
import type extensionApi from '@podman-desktop/api';
import { compareVersions } from 'compare-versions';

import { getPodmanInstallation } from '../utils/podman-cli';
import { getPowerShellClient } from '../utils/powershell';
import { BaseCheck } from './base-check';

export class HyperVCheck extends BaseCheck {
  title = 'Hyper-V installed';
  static readonly PODMAN_MINIMUM_VERSION_FOR_HYPERV = '5.2.0';

  constructor(
    private telemetryLogger: extensionApi.TelemetryLogger,
    private installationPreflightMode: boolean = false,
  ) {
    super();
  }

  async isUserAdmin(): Promise<boolean> {
    const client = await getPowerShellClient(this.telemetryLogger);
    return client.isUserAdmin();
  }

  async isPodmanDesktopElevated(): Promise<boolean> {
    const client = await getPowerShellClient(this.telemetryLogger);
    return client.isRunningElevated();
  }

  async isHyperVInstalled(): Promise<boolean> {
    const client = await getPowerShellClient(this.telemetryLogger);
    return client.isHyperVInstalled();
  }

  async isHyperVRunning(): Promise<boolean> {
    const client = await getPowerShellClient(this.telemetryLogger);
    return client.isHyperVRunning();
  }

  async execute(): Promise<extensionApi.CheckResult> {
    // if the hyperv check is called as an installation preflight we skip the podman version check
    if (!this.installationPreflightMode && !(await this.isPodmanVersionSupported())) {
      return this.createFailureResult({
        description: `Hyper-V is only supported with podman version >= ${HyperVCheck.PODMAN_MINIMUM_VERSION_FOR_HYPERV}.`,
      });
    }
    if (!(await this.isUserAdmin())) {
      return this.createFailureResult({
        description: 'You must have administrative rights to run Hyper-V Podman machines',
        docLinksDescription: 'Contact your Administrator to setup Hyper-V.',
        docLinks: {
          url: 'https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v',
          title: 'Hyper-V Manual Installation Steps',
        },
      });
    }
    if (!(await this.isPodmanDesktopElevated())) {
      return this.createFailureResult({
        description: 'You must run Podman Desktop with administrative rights to run Hyper-V Podman machines.',
      });
    }
    if (!(await this.isHyperVInstalled())) {
      return this.createFailureResult({
        description: 'Hyper-V is not installed on your system.',
        docLinksDescription: 'call DISM /Online /Enable-Feature /All /FeatureName:Microsoft-Hyper-V in a terminal',
        docLinks: {
          url: 'https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v',
          title: 'Hyper-V Manual Installation Steps',
        },
      });
    }
    if (!(await this.isHyperVRunning())) {
      return this.createFailureResult({
        description: 'Hyper-V is not running on your system.',
        docLinksDescription: 'call sc start vmms in a terminal',
        docLinks: {
          url: 'https://learn.microsoft.com/en-us/virtualization/hyper-v-on-windows/quick-start/enable-hyper-v',
          title: 'Hyper-V Manual Installation Steps',
        },
      });
    }
    return this.createSuccessfulResult();
  }

  private async isPodmanVersionSupported(): Promise<boolean> {
    const installedPodman = await getPodmanInstallation();
    if (installedPodman?.version) {
      return compareVersions(installedPodman?.version, HyperVCheck.PODMAN_MINIMUM_VERSION_FOR_HYPERV) >= 0;
    }
    return false;
  }
}
