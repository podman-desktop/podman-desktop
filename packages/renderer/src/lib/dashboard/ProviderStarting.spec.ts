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

import '@testing-library/jest-dom/vitest';

import { beforeAll, test } from 'vitest';

import ProviderStarting from '/@/lib/dashboard/ProviderStarting.svelte';

import { verifyStatus } from './ProviderStatusTestHelper.spec';

beforeAll(() => {
  (window.events as unknown) = {
    receive: (_channel: string, func: unknown): void => {
      (func as () => void)();
    },
  };
});

test('Expect starting provider shows disabled update button', async () => {
  await verifyStatus(ProviderStarting, 'starting', false, true);
});

test('Expect starting provider does not show update button if version same', async () => {
  await verifyStatus(ProviderStarting, 'starting', true);
});
