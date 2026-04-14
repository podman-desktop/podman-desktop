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
import type { ExtensionContext } from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import { WinBitCheck } from './win-bit-check';

const extensionContext = {
  subscriptions: [],
} as unknown as ExtensionContext;

beforeEach(() => {
  vi.resetAllMocks();
  // reset array of subscriptions
  extensionContext.subscriptions.length = 0;
});

test('expect winbit preflight check return successful result if the arch is x64', async () => {
  Object.defineProperty(process, 'arch', {
    value: 'x64',
  });

  const winBitCheck = new WinBitCheck();
  const result = await winBitCheck.execute();
  expect(result.successful).toBeTruthy();
});

test('expect winbit preflight check return successful result if the arch is arm64', async () => {
  Object.defineProperty(process, 'arch', {
    value: 'arm64',
  });

  const winBitCheck = new WinBitCheck();
  const result = await winBitCheck.execute();
  expect(result.successful).toBeTruthy();
});

test('expect winbit preflight check return failure result if the arch is not supported', async () => {
  Object.defineProperty(process, 'arch', {
    value: 'x86',
  });

  const winBitCheck = new WinBitCheck();
  const result = await winBitCheck.execute();
  expect(result.description).equal('WSL2 works only on 64bit OS.');
  expect(result.docLinksDescription).equal('Learn about WSL requirements:');
  expect(result.docLinks?.[0].url).equal(
    'https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-2---check-requirements-for-running-wsl-2',
  );
  expect(result.docLinks?.[0].title).equal('WSL2 Manual Installation Steps');
});

test('expect winbit preflight check to be memoized', async () => {
  const archSpy = vi.spyOn(process, 'arch', 'get');
  archSpy.mockReturnValue('x64');

  const winBitCheck = new WinBitCheck();
  await winBitCheck.execute();
  expect(archSpy).toHaveBeenCalledOnce();

  await winBitCheck.execute();
  expect(archSpy).toHaveBeenCalledOnce();
});
