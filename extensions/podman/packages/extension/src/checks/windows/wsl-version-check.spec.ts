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

import { process } from '@podman-desktop/api';
import { beforeEach, expect, test, vi } from 'vitest';

import { WSLVersionCheck } from './wsl-version-check';

beforeEach(() => {
  vi.clearAllMocks();
});

test('expect WSLVersion preflight check return fail result if wsl --version command fails its execution', async () => {
  vi.mocked(process.exec).mockRejectedValue('');

  const winWSLCheck = new WSLVersionCheck();
  const result = await winWSLCheck.execute();
  expect(result.description).equal('WSL version should be >= 1.2.5.');
  expect(result.docLinksDescription).equal(
    `Call 'wsl --update' and 'wsl --version' in a terminal to check your wsl version.`,
  );
});

test('expect WSLVersion preflight check return fail result if first line output do not contain any colon symbol', async () => {
  vi.mocked(process.exec).mockResolvedValue({
    stdout: 'unknown message',
    stderr: '',
    command: 'command',
  });

  const winWSLCheck = new WSLVersionCheck();
  const result = await winWSLCheck.execute();
  expect(result.description).equal('WSL version should be >= 1.2.5.');
  expect(result.docLinksDescription).equal(
    `Call 'wsl --update' and 'wsl --version' in a terminal to check your wsl version.`,
  );
});

test('expect WSLVersion preflight check return fail result if first line output do not contain any wsl word', async () => {
  vi.mocked(process.exec).mockResolvedValue({
    stdout: 'unknown message: 1.2.5.0',
    stderr: '',
    command: 'command',
  });

  const winWSLCheck = new WSLVersionCheck();
  const result = await winWSLCheck.execute();
  expect(result.description).equal('WSL version should be >= 1.2.5.');
  expect(result.docLinksDescription).equal(
    `Call 'wsl --update' and 'wsl --version' in a terminal to check your wsl version.`,
  );
});

test('expect WSLVersion preflight check return fail result if first line output contain an invalid version', async () => {
  vi.mocked(process.exec).mockResolvedValue({
    stdout: 'WSL version: 1.1.3',
    stderr: '',
    command: 'command',
  });

  const winWSLCheck = new WSLVersionCheck();
  const result = await winWSLCheck.execute();
  expect(result.description).equal('Your WSL version is 1.1.3 but it should be >= 1.2.5.');
  expect(result.docLinksDescription).equal(
    `Call 'wsl --update' to update your WSL installation. If you do not have access to the Windows store you can run 'wsl --update --web-download'. If you still receive an error please contact your IT administator as 'Windows Store Applications' may have been disabled.`,
  );
});

test('expect WSLVersion preflight check return successful result if first line output contain a version equal to the minimum supported version', async () => {
  vi.mocked(process.exec).mockResolvedValue({
    stdout: 'WSL version: 1.2.5.0',
    stderr: '',
    command: 'command',
  });

  const winWSLCheck = new WSLVersionCheck();
  const result = await winWSLCheck.execute();
  expect(result.successful).toBeTruthy();
});

test('expect WSLVersion preflight check return successful result if first line output contain a version greater than the minimum supported version', async () => {
  vi.mocked(process.exec).mockResolvedValue({
    stdout: 'WSL version: 2.4.0',
    stderr: '',
    command: 'command',
  });

  const winWSLCheck = new WSLVersionCheck();
  const result = await winWSLCheck.execute();
  expect(result.successful).toBeTruthy();
});

test('expect WSLVersion to be memoized', async () => {
  vi.mocked(process.exec).mockResolvedValue({
    stdout: 'WSL version: 1.2.5.0',
    stderr: '',
    command: 'command',
  });

  const winWSLCheck = new WSLVersionCheck();
  await winWSLCheck.execute();
  await winWSLCheck.execute();

  expect(process.exec).toHaveBeenCalledTimes(1);
});
