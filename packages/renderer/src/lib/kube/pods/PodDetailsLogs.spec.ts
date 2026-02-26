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

import { render } from '@testing-library/svelte';
import { SearchAddon } from '@xterm/addon-search';
import { beforeEach, expect, test, vi } from 'vitest';

import PodDetailsLogs from '/@/lib/kube/pods/PodDetailsLogs.svelte';
import type { PodUI } from '/@/lib/kube/pods/PodUI';

vi.mock(import('@xterm/xterm'));
vi.mock(import('@xterm/addon-search'));

beforeEach(() => {
  vi.resetAllMocks();
});

const POD: PodUI = {
  name: 'pod-name',
  namespace: 'default',
  status: 'RUNNING',
  selected: false,
  containers: [
    {
      Id: 'container-id',
      Names: 'container-name',
      Status: 'Running',
    },
  ],
};

test('Kubernetes pod should use window#kubernetesReadPodLog', async () => {
  render(PodDetailsLogs, {
    pod: POD,
  });

  await vi.waitFor(() => {
    expect(window.kubernetesReadPodLog).toHaveBeenCalledWith(POD.name, POD.containers[0].Names, expect.any(Function));
  });
});

test('terminal used should have search enabled', async () => {
  render(PodDetailsLogs, {
    pod: POD,
  });

  await vi.waitFor(() => {
    expect(SearchAddon).toHaveBeenCalled();
  });
});
