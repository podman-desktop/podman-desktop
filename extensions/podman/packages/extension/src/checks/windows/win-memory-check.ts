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

import { BaseCheck } from '../base-check';

export class WinMemoryCheck extends BaseCheck {
  title = 'RAM';
  private REQUIRED_MEM = 5 * 1024 * 1024 * 1024; // 5Gb

  async execute(): Promise<CheckResult> {
    const totalMem = os.totalmem();
    if (this.REQUIRED_MEM <= totalMem) {
      return this.createSuccessfulResult();
    } else {
      return this.createFailureResult({
        description: 'You need at least 5GB to run Podman.',
      });
    }
  }
}
