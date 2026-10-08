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

import { beforeEach, expect, test, vi } from 'vitest';

import { networksListInfo } from '/@/stores/networks';

import { createNavigationNetworkEntry } from './navigation-registry-network.svelte';

beforeEach(() => {
  vi.resetAllMocks();
});

test('createNavigationNetworkEntry', async () => {
  const entry = createNavigationNetworkEntry();
  networksListInfo.set([
    {
      id: 'network1',
      shortId: 'network1',
      name: 'network 1',
      driver: '',
      created: '',
      engineId: '',
      engineName: '',
      engineType: '',
      selected: false,
      status: '',
      containers: [],
      ipv6_enabled: false,
      labels: {},
      options: {},
      subnets: [],
    },
    {
      id: 'network2',
      shortId: 'network2',
      name: 'network 2',
      driver: '',
      created: '',
      engineId: '',
      engineName: '',
      engineType: '',
      selected: false,
      status: '',
      containers: [],
      ipv6_enabled: false,
      labels: {},
      options: {},
      subnets: [],
    },
  ]);

  expect(entry).toBeDefined();
  expect(entry.name).toBe('Networks');
  expect(entry.link).toBe('/networks');
  expect(entry.tooltip).toBe('Networks');
  await vi.waitFor(() => {
    expect(entry.counter).toBe(2);
  });
});
