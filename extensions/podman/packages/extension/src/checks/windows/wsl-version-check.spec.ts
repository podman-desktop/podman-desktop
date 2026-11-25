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

import { Container } from 'inversify';
import { beforeEach, expect, test, vi } from 'vitest';

import { WslHelper } from '/@/helpers/wsl-helper';

import { WSLVersionCheck } from './wsl-version-check';

vi.mock(import('/@/helpers/wsl-helper'));

const GENERIC_DOC_LINKS_DESCRIPTION = `Call 'wsl --update' and 'wsl --version' in a terminal to check your wsl version.`;

beforeEach(() => {
  vi.resetAllMocks();
});

function createCheck(): WSLVersionCheck {
  const container = new Container();
  container.bind(WslHelper).toSelf();
  container.bind(WSLVersionCheck).toSelf();
  return container.get(WSLVersionCheck);
}

test('expect WSLVersion preflight check return fail result if the WSL version cannot be read', async () => {
  vi.mocked(WslHelper.prototype.getWSLVersionData).mockRejectedValue(new Error('wsl not found'));

  const result = await createCheck().execute();

  expect(result.description).equal('WSL version should be >= 1.2.5.');
  expect(result.docLinksDescription).equal(GENERIC_DOC_LINKS_DESCRIPTION);
});

test('expect WSLVersion preflight check return fail result if the WSL version is unknown', async () => {
  vi.mocked(WslHelper.prototype.getWSLVersionData).mockResolvedValue({});

  const result = await createCheck().execute();

  expect(result.description).equal('WSL version should be >= 1.2.5.');
  expect(result.docLinksDescription).equal(GENERIC_DOC_LINKS_DESCRIPTION);
});

test('expect WSLVersion preflight check return fail result if the WSL version is older than the minimum supported version', async () => {
  vi.mocked(WslHelper.prototype.getWSLVersionData).mockResolvedValue({ wslVersion: '1.1.3' });

  const result = await createCheck().execute();

  expect(result.description).equal('Your WSL version is 1.1.3 but it should be >= 1.2.5.');
  expect(result.docLinksDescription).equal(
    `Call 'wsl --update' to update your WSL installation. If you do not have access to the Windows store you can run 'wsl --update --web-download'. If you still receive an error please contact your IT administator as 'Windows Store Applications' may have been disabled.`,
  );
});

test.each(['1.2.5.0', '2.4.0'])(
  'expect WSLVersion preflight check return successful result for WSL %s',
  async wslVersion => {
    vi.mocked(WslHelper.prototype.getWSLVersionData).mockResolvedValue({ wslVersion });

    const result = await createCheck().execute();

    expect(result.successful).toBeTruthy();
  },
);

test('expect WSLVersion to be memoized', async () => {
  vi.mocked(WslHelper.prototype.getWSLVersionData).mockResolvedValue({ wslVersion: '1.2.5.0' });

  const check = createCheck();
  await check.execute();
  await check.execute();

  expect(WslHelper.prototype.getWSLVersionData).toHaveBeenCalledTimes(1);
});
