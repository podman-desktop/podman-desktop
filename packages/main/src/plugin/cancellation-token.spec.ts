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

import { beforeAll, beforeEach, expect, test, vi, vitest } from 'vitest';

import type { CancellationTokenSource } from './cancellation-token.js';
import { CancellationTokenImpl } from './cancellation-token.js';
import { CancellationTokenRegistry } from './cancellation-token-registry.js';

let cancellationTokenRegistry: CancellationTokenRegistry;

beforeEach(() => {
  vi.clearAllMocks();
});

/* eslint-disable @typescript-eslint/no-empty-function */
beforeAll(() => {
  cancellationTokenRegistry = new CancellationTokenRegistry();
});

test('Should return CancellationToken', async () => {
  const tokenSourceId = cancellationTokenRegistry.createCancellationTokenSource();
  const tokenSource = cancellationTokenRegistry.getCancellationTokenSource(tokenSourceId);
  const token = tokenSource?.token;
  expect(token).toBeDefined();
  expect(token instanceof CancellationTokenImpl).toBe(true);
});

test('Check if token cancel is triggered when tokenSource cancel', async () => {
  const tokenSourceId = cancellationTokenRegistry.createCancellationTokenSource();
  const tokenSource = cancellationTokenRegistry.getCancellationTokenSource(tokenSourceId);
  const token = tokenSource?.token;
  expect(token instanceof CancellationTokenImpl).toBe(true);
  const tokenCancelMock = vitest.spyOn(token as CancellationTokenImpl, 'cancel');
  tokenSource?.cancel();
  expect(tokenCancelMock).toBeCalled();
});

test('Check if tokenSource cancel is triggered if tokenSource is disposed', async () => {
  const tokenSourceId = cancellationTokenRegistry.createCancellationTokenSource();
  const tokenSource = cancellationTokenRegistry.getCancellationTokenSource(tokenSourceId);
  // assert the object is not undefined and then only of type CancellationTokenSource
  expect(tokenSource).toBeDefined();
  const token = tokenSource?.token;
  expect(token instanceof CancellationTokenImpl).toBe(true);
  const tokenSourceCancelMock = vitest.spyOn(tokenSource as CancellationTokenSource, 'cancel');
  const tokenDisposeMock = vitest.spyOn(token as CancellationTokenImpl, 'dispose');
  tokenSource?.dispose(true);
  expect(tokenSourceCancelMock).toBeCalled();
  expect(tokenDisposeMock).toBeCalled();
});

test('Check if tokenSource cancel is not triggered if tokenSource is disposed without cancel set', async () => {
  const tokenSourceId = cancellationTokenRegistry.createCancellationTokenSource();
  const tokenSource = cancellationTokenRegistry.getCancellationTokenSource(tokenSourceId);
  // assert the object is not undefined and then only of type CancellationTokenSource
  expect(tokenSource).toBeDefined();
  const token = tokenSource?.token;
  expect(token instanceof CancellationTokenImpl).toBe(true);
  const tokenSourceCancelMock = vitest.spyOn(tokenSource as CancellationTokenSource, 'cancel');
  const tokenDisposeMock = vitest.spyOn(token as CancellationTokenImpl, 'dispose');
  tokenSource?.dispose();
  expect(tokenSourceCancelMock).toBeCalledTimes(0);
  expect(tokenDisposeMock).toBeCalled();
});
