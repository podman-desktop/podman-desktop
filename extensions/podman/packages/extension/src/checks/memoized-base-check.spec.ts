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

import type * as extensionApi from '@podman-desktop/api';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { MemoizedBaseCheck } from '/@/checks/memoized-base-check';

class PositiveCheck extends MemoizedBaseCheck {
  title = 'successful check';
  constructor(private executeFn: () => void) {
    super();
  }

  async executeImpl(): Promise<extensionApi.CheckResult> {
    this.executeFn();
    return this.createSuccessfulResult();
  }
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('MemoizedBaseCheck', () => {
  test('check PositiveCheck only calls execute once', async () => {
    const executeFn = vi.fn();
    const positiveCheck = new PositiveCheck(executeFn);
    expect(positiveCheck.title).toBe('successful check');

    const runCheck = async (): Promise<void> => {
      const result = await positiveCheck.execute();
      expect(executeFn).toHaveBeenCalledTimes(1);
      expect(result.successful).toBeTruthy();
    };

    await runCheck();
    await runCheck();
  });
});
