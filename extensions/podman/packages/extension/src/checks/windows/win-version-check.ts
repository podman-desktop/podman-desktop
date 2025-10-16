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

import os from 'node:os';

import type { CheckResult } from '@podman-desktop/api';
import { injectable } from 'inversify';

import { BaseCheck } from '/@/checks/base-check';

@injectable()
export class WinVersionCheck extends BaseCheck {
  title = 'Windows Version';

  private MIN_BUILD = 19043; //it represents version 21H1 windows 10
  async execute(): Promise<CheckResult> {
    const winRelease = os.release();
    if (winRelease.startsWith('10.0.')) {
      const splitRelease = winRelease.split('.');
      const winBuild = splitRelease[2];
      if (Number.parseInt(winBuild) >= this.MIN_BUILD) {
        return { successful: true };
      } else {
        return this.createFailureResult({
          description: `To be able to run WSL2 you need Windows 10 Build ${this.MIN_BUILD} or later.`,
          docLinksDescription: 'Learn about WSL requirements:',
          docLinks: {
            url: 'https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-2---check-requirements-for-running-wsl-2',
            title: 'WSL2 Manual Installation Steps',
          },
        });
      }
    } else {
      return this.createFailureResult({
        description: 'WSL2 works only on Windows 10 and newest OS',
        docLinksDescription: 'Learn about WSL requirements:',
        docLinks: {
          url: 'https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-2---check-requirements-for-running-wsl-2',
          title: 'WSL2 Manual Installation Steps',
        },
      });
    }
  }
}
