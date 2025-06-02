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

import { beforeEach, expect, test, vi } from 'vitest';

import { WinMemoryCheck } from './win-memory-check';

beforeEach(() => {
  vi.resetAllMocks();
});

test('expect winMemory preflight check return successful result if the machine has more than 5GB of memory', async () => {
  const SYSTEM_MEM = 7 * 1024 * 1024 * 1024;
  vi.spyOn(os, 'totalmem').mockReturnValue(SYSTEM_MEM);

  const winMemoryCheck = new WinMemoryCheck();
  const result = await winMemoryCheck.execute();
  expect(result.successful).toBeTruthy();
});

test('expect winMemory preflight check return failure result if the machine has less than 5GB of memory', async () => {
  const SYSTEM_MEM = 4 * 1024 * 1024 * 1024;
  vi.spyOn(os, 'totalmem').mockReturnValue(SYSTEM_MEM);

  const winMemoryCheck = new WinMemoryCheck();
  const result = await winMemoryCheck.execute();
  expect(result.description).equal('You need at least 5GB to run Podman.');
  expect(result.docLinksDescription).toBeUndefined();
  expect(result.docLinks).toBeUndefined();
  expect(result.fixCommand).toBeUndefined();
});
