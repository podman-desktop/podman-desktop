/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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
import { injectable } from 'inversify';

import { MemoizedBaseCheck } from '/@/checks/memoized-base-check';

@injectable()
export class WinBitCheck extends MemoizedBaseCheck {
  title = 'Windows 64bit';

  private ARCH_X64 = 'x64';
  private ARCH_ARM = 'arm64';

  async executeImpl(): Promise<CheckResult> {
    const currentArch = process.arch;
    if (this.ARCH_X64 === currentArch || this.ARCH_ARM === currentArch) {
      return this.createSuccessfulResult();
    } else {
      return this.createFailureResult({
        description: 'WSL2 works only on 64bit OS.',
        docLinksDescription: 'Learn about WSL requirements:',
        docLinks: {
          url: 'https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-2---check-requirements-for-running-wsl-2',
          title: 'WSL2 Manual Installation Steps',
        },
      });
    }
  }
}
