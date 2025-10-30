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
import { docLinksHyperV } from '/@/checks/windows/constants';
import { TelemetryLoggerSymbol } from '/@/inject/symbols';
import { getPowerShellClient } from '/@/utils/powershell';

@injectable()
export class UserAdminCheck extends MemoizedBaseCheck {
  title = 'User is Administrator';

  constructor(
    @inject(TelemetryLoggerSymbol)
    private telemetryLogger: extensionApi.TelemetryLogger,
  ) {
    super();
  }

  protected async checkUserAdmin(): Promise<boolean> {
    const client = await getPowerShellClient(this.telemetryLogger);
    return client.isUserAdmin();
  }

  async executeImpl(): Promise<extensionApi.CheckResult> {
    const result = await this.checkUserAdmin();
    if (result) {
      return this.createSuccessfulResult();
    }
    return this.createFailureResult({
      description: 'You must have administrative rights to run Hyper-V Podman machines',
      docLinksDescription: 'Contact your Administrator to setup Hyper-V.',
      docLinks: docLinksHyperV,
    });
  }
}
