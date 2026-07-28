/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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
import { inject, injectable } from 'inversify';

import { MemoizedBaseCheck } from '/@/checks/memoized-base-check';
import { TelemetryLoggerSymbol } from '/@/inject/symbols';
import { getPowerShellClient } from '/@/utils/powershell';

import { VIRTUALIZATION_FIRMWARE_DOC_LINKS } from './constants';

@injectable()
export class VirtualizationFirmwareCheck extends MemoizedBaseCheck {
  title = 'BIOS Virtualization Enabled';

  constructor(
    @inject(TelemetryLoggerSymbol)
    private telemetryLogger: extensionApi.TelemetryLogger,
  ) {
    super();
  }

  async executeImpl(): Promise<extensionApi.CheckResult> {
    try {
      const client = await getPowerShellClient(this.telemetryLogger);
      const enabled = await client.isVirtualizationFirmwareEnabled();
      if (enabled) {
        return this.createSuccessfulResult();
      }
    } catch (err) {
      // ignore error, this means that firmware virtualization could not be detected
    }
    return this.createFailureResult({
      description:
        'CPU virtualization (Intel VT-x / AMD-V) is disabled in BIOS/UEFI. Enable it to run Podman machines with WSL2 or Hyper-V.',
      severity: 'warning',
      docLinksDescription:
        'Reboot into BIOS/UEFI settings, enable Virtualization Technology (Intel VT-x) or SVM Mode (AMD-V), save changes, reboot, then re-run checks.',
      docLinks: VIRTUALIZATION_FIRMWARE_DOC_LINKS,
    });
  }
}
