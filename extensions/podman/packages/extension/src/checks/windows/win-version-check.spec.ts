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

import os from 'node:os';

import { beforeEach, expect, test, vi } from 'vitest';

import { WinVersionCheck } from './win-version-check';

beforeEach(() => {
  vi.resetAllMocks();
});

test('expect winversion preflight check return successful result if the version is greater than min valid version', async () => {
  vi.spyOn(os, 'release').mockReturnValue('10.0.19043');

  const winVersionCheck = new WinVersionCheck();
  const result = await winVersionCheck.execute();
  expect(result.successful).toBeTruthy();
});

test('expect winversion preflight check return failure result if the version is greater than 9. and less than min build version', async () => {
  vi.spyOn(os, 'release').mockReturnValue('10.0.19042');

  const winVersionCheck = new WinVersionCheck();
  const result = await winVersionCheck.execute();
  expect(result.description).equal('To be able to run WSL2 you need Windows 10 Build 19043 or later.');
  expect(result.docLinksDescription).equal('Learn about WSL requirements:');
  expect(result.docLinks?.[0].url).equal(
    'https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-2---check-requirements-for-running-wsl-2',
  );
  expect(result.docLinks?.[0].title).equal('WSL2 Manual Installation Steps');
});

test('expect winversion preflight check return failure result if the version is less than 10.0.0', async () => {
  vi.spyOn(os, 'release').mockReturnValue('9.0.19000');

  const winVersionCheck = new WinVersionCheck();
  const result = await winVersionCheck.execute();
  expect(result.description).equal('WSL2 works only on Windows 10 and newest OS');
  expect(result.docLinksDescription).equal('Learn about WSL requirements:');
  expect(result.docLinks?.[0].url).equal(
    'https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-2---check-requirements-for-running-wsl-2',
  );
  expect(result.docLinks?.[0].title).equal('WSL2 Manual Installation Steps');
});
