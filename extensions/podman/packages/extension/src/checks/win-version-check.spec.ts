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

test('should return successful if Windows version is 10.0 with build >= 19043', async () => {
  const winVersionCheck = new WinVersionCheck();
  // Mock the os.release method to return a valid build number
  vi.spyOn(os, 'release').mockReturnValue('10.0.19044');

  const result = await winVersionCheck.execute();

  expect(result.successful).toBeTruthy();
});

test('should fail if Windows version is 10.0 with build < 19043', async () => {
  const winVersionCheck = new WinVersionCheck();

  // Mock the os.release method to return an older build number
  vi.spyOn(os, 'release').mockReturnValue('10.0.19000');

  const result = await winVersionCheck.execute();

  expect(result).toEqual({
    successful: false,
    description: 'To be able to run WSL2 you need Windows 10 Build 19043 or later.',
    docLinksDescription: 'Learn about WSL requirements:',
    docLinks: [
      {
        url: 'https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-2---check-requirements-for-running-wsl-2',
        title: 'WSL2 Manual Installation Steps',
      },
    ],
  });
});

test('should fail if Windows version is not 10.0', async () => {
  const winVersionCheck = new WinVersionCheck();

  // Mock the os.release method to return a non-Windows 10 version
  vi.spyOn(os, 'release').mockReturnValue('6.3.9600'); // Example: Windows 8.1

  const result = await winVersionCheck.execute();

  expect(result).toEqual({
    successful: false,
    description: 'WSL2 works only on Windows 10 and newest OS',
    docLinksDescription: 'Learn about WSL requirements:',
    docLinks: [
      {
        url: 'https://docs.microsoft.com/en-us/windows/wsl/install-manual#step-2---check-requirements-for-running-wsl-2',
        title: 'WSL2 Manual Installation Steps',
      },
    ],
  });
});
