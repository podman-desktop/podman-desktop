/**********************************************************************
 * Copyright (C) 2022-2025 Red Hat, Inc.
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
import { injectable } from 'inversify';
import { coerce, compare } from 'semver';

import { MemoizedBaseCheck } from '/@/checks/memoized-base-check';
import { WslHelper } from '/@/helpers/wsl-helper';

@injectable()
export class WSLVersionCheck extends MemoizedBaseCheck {
  title = 'WSL Version';

  minVersion = '1.2.5';

  async executeImpl(): Promise<extensionApi.CheckResult> {
    try {
      const wslHelper = new WslHelper();
      const wslVersionData = await wslHelper.getWSLVersionData();
      if (wslVersionData.wslVersion) {
        const wslVersion = coerce(wslVersionData.wslVersion);
        if (wslVersion && compare(wslVersion, this.minVersion) >= 0) {
          return this.createSuccessfulResult();
        } else {
          return this.createFailureResult({
            description: `Your WSL version is ${wslVersionData.wslVersion} but it should be >= ${this.minVersion}.`,
            docLinksDescription: `Call 'wsl --update' to update your WSL installation. If you do not have access to the Windows store you can run 'wsl --update --web-download'. If you still receive an error please contact your IT administator as 'Windows Store Applications' may have been disabled.`,
          });
        }
      }
    } catch (err) {
      // ignore error
    }
    return this.createFailureResult({
      description: `WSL version should be >= ${this.minVersion}.`,
      docLinksDescription: `Call 'wsl --update' and 'wsl --version' in a terminal to check your wsl version.`,
    });
  }
}
