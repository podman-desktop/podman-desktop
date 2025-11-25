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

import '@testing-library/jest-dom/vitest';

import { render } from '@testing-library/svelte';
import { SearchAddon } from '@xterm/addon-search';
import { beforeEach, expect, test, vi } from 'vitest';

import PodDetailsLogs from '/@/lib/pod/PodDetailsLogs.svelte';
import type { PodInfoUI } from '/@/lib/pod/PodInfoUI';

vi.mock(import('@xterm/xterm'));
vi.mock(import('@xterm/addon-search'));

beforeEach(() => {
  vi.resetAllMocks();
});

const PODMAN_POD: PodInfoUI = {
  id: 'pod-id',
  shortId: 'short-id',
  name: 'fakepod',
  engineId: 'fakeengineid',
  engineName: 'fakeenginename',
  status: 'Running',
  age: '1h',
  created: '2021-01-01T00:00:00Z',
  selected: false,
  containers: [
    {
      Id: 'fakecontainer',
      Names: 'fakecontainername',
      Status: 'Running',
    },
  ],
};

test('Podman pod should use window#logsContainer', async () => {
  render(PodDetailsLogs, {
    pod: PODMAN_POD,
  });

  await vi.waitFor(() => {
    expect(window.logsContainer).toHaveBeenCalledWith({
      engineId: PODMAN_POD.engineId,
      containerId: PODMAN_POD.containers[0].Id,
      callback: expect.any(Function),
    });
  });
});

test('No logs should display EmptyScreen', async () => {
  const { getByText } = render(PodDetailsLogs, {
    pod: PODMAN_POD,
  });

  const element = await vi.waitFor(() => {
    return getByText(`Log output of Pod ${PODMAN_POD.name}`);
  });
  expect(element).toBeDefined();
});

test('terminal used should have search enabled', async () => {
  render(PodDetailsLogs, {
    pod: PODMAN_POD,
  });

  await vi.waitFor(() => {
    expect(SearchAddon).toHaveBeenCalled();
  });
});
