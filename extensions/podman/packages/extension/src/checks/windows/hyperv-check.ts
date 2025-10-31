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
import type { CheckResult, TelemetryLogger } from '@podman-desktop/api';
import { inject, injectable } from 'inversify';

import { HYPER_V_DOC_LINKS } from '/@/checks/windows/constants';
import { HyperVRunningCheck } from '/@/checks/windows/hyperv-running-check';
import { TelemetryLoggerSymbol } from '/@/inject/symbols';

import { getPowerShellClient } from '../../utils/powershell';
import { BaseCheck } from '../base-check';

@injectable()
export class HyperVCheck extends BaseCheck {
  title = 'Hyper-V installed';

  constructor(
    @inject(TelemetryLoggerSymbol)
    private telemetryLogger: TelemetryLogger,
    @inject(HyperVRunningCheck) private isHyperVRunningCheck: HyperVRunningCheck,
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

  async execute(): Promise<CheckResult> {
    if (!(await this.isUserAdmin())) {
      return this.createFailureResult({
        description: 'You must have administrative rights to run Hyper-V Podman machines',
        docLinksDescription: 'Contact your Administrator to setup Hyper-V.',
        docLinks: HYPER_V_DOC_LINKS,
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
        docLinks: HYPER_V_DOC_LINKS,
      });
    }

    return this.isHyperVRunningCheck.execute();
  }
}
