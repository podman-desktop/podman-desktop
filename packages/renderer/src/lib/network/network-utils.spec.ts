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

import type { NetworkInspectInfo } from '@podman-desktop/core-api';
import type { NetworkContainer } from 'dockerode';
import { beforeEach, expect, test, vi } from 'vitest';

import { NetworkUtils } from './network-utils';

let networkUtils: NetworkUtils;

const network1: NetworkInspectInfo = {
  engineId: 'podman1',
  engineName: 'Podman 1',
  engineType: 'podman',
  Name: 'Network 1',
  Id: '123456789012345',
  Created: '',
  Scope: '',
  Driver: '',
  EnableIPv6: false,
  Internal: false,
  Attachable: false,
  Ingress: false,
  ConfigOnly: false,
};

const network2: NetworkInspectInfo = {
  engineId: 'podman2',
  engineName: 'Podman 2',
  engineType: 'podman',
  Name: 'Network 2',
  Id: '123456789123456',
  Created: '',
  Scope: '',
  Driver: '',
  EnableIPv6: false,
  Internal: false,
  Attachable: false,
  Ingress: false,
  ConfigOnly: false,
  Containers: { container1: { Name: 'Container 1' } as unknown as NetworkContainer },
};

beforeEach(() => {
  vi.clearAllMocks();
  networkUtils = new NetworkUtils();
});

test('Should expect to have a valid NetworkInfoUI object', async () => {
  const networkInfo = networkUtils.toNetworkInfoUI(network1);
  expect(networkInfo).toEqual({
    id: '123456789012345',
    shortId: '123456789012',
    name: 'Network 1',
    driver: '',
    created: '',
    engineId: 'podman1',
    engineName: 'Podman 1',
    engineType: 'podman',
    selected: false,
    status: 'UNUSED',
    ipv6_enabled: false,
    containers: [],
  });

  const networkInfo2 = networkUtils.toNetworkInfoUI(network2);
  expect(networkInfo2).toEqual({
    id: '123456789123456',
    shortId: '123456789123',
    name: 'Network 2',
    driver: '',
    created: '',
    engineId: 'podman2',
    engineName: 'Podman 2',
    engineType: 'podman',
    selected: false,
    status: 'USED',
    ipv6_enabled: false,
    containers: [{ id: 'container1', name: 'Container 1' }],
  });
});
