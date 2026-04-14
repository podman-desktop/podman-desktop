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
import { inject, injectable } from 'inversify';

import { MemoizedBaseCheck } from '/@/checks/memoized-base-check';
import { TelemetryLoggerSymbol } from '/@/inject/symbols';
import { getPowerShellClient } from '/@/utils/powershell';

@injectable()
export class VirtualMachinePlatformCheck extends MemoizedBaseCheck {
  title = 'Virtual Machine Platform Enabled';

  constructor(
    @inject(TelemetryLoggerSymbol)
    private telemetryLogger: extensionApi.TelemetryLogger,
  ) {
    super();
  }

  protected async isVirtualMachineAvailable(): Promise<boolean> {
    const client = await getPowerShellClient(this.telemetryLogger);
    return client.isVirtualMachineAvailable();
  }

  async executeImpl(): Promise<extensionApi.CheckResult> {
    try {
      const result = await this.isVirtualMachineAvailable();
      if (result) {
        return this.createSuccessfulResult();
      }
    } catch (err) {
      // ignore error, this means that VirtualMachinePlatform not enabled
    }
    return this.createFailureResult({
      description: 'Virtual Machine Platform should be enabled to be able to run Podman.',
      docLinksDescription: 'Learn about how to enable the Virtual Machine Platform feature:',
      docLinks: {
        url: 'https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-3---enable-virtual-machine-feature',
        title: 'Enable Virtual Machine Platform',
      },
    });
  }
}
