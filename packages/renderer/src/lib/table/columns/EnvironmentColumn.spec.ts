/*********************************************************************
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
 ********************************************************************/

import '@testing-library/jest-dom/vitest';

import { render } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import { ContainerGroupInfoTypeUI, type ContainerGroupInfoUI } from '/@/lib/container/ContainerInfoUI';
import type { ImageInfoUI } from '/@/lib/image/ImageInfoUI';
import ImageIcon from '/@/lib/images/ImageIcon.svelte';
import EnvironmentColumn from '/@/lib/table/columns/EnvironmentColumn.svelte';
import type { VolumeInfoUI } from '/@/lib/volume/VolumeInfoUI';

import type { NetworkInfoUI } from '../../network/NetworkInfoUI';

test('Expect simple column styling - pod', async () => {
  const pod: ContainerGroupInfoUI = {
    type: ContainerGroupInfoTypeUI.POD,
    expanded: false,
    selected: false,
    allContainersCount: 0,
    containers: [],
    name: '',
    engineName: 'podman',
    engineType: ContainerGroupInfoTypeUI.PODMAN,
    engineId: '',
    id: 'pod-id',
  };
  const { getByText } = render(EnvironmentColumn, { object: pod });

  const text = getByText('podman');
  expect(text).toBeInTheDocument();
});

test('Expect simple column styling - image', async () => {
  const image: ImageInfoUI = {
    id: 'my-image',
    shortId: '',
    name: '',
    engineId: '',
    engineName: 'podman',
    tag: '',
    createdAt: 0,
    age: '',
    arch: '',
    size: 0,
    humanSize: '',
    base64RepoTag: '',
    selected: false,
    status: 'UNUSED',
    icon: ImageIcon,
    badges: [],
    digest: 'sha256:1234567890',
  };
  const { getByText } = render(EnvironmentColumn, { object: image });

  const text = getByText(image.engineName);
  expect(text).toBeInTheDocument();
});

test('Expect simple column styling - network', async () => {
  const network: NetworkInfoUI = {
    engineId: 'engine1',
    engineName: 'Engine 1',
    engineType: 'podman',
    name: 'Network 1',
    id: '123456789012345',
    created: '',
    shortId: '123456789012',
    driver: '',
    selected: false,
    status: 'UNUSED',
    containers: [],
    ipv6_enabled: false,
  };

  const { getByText } = render(EnvironmentColumn, { object: network });

  const text = getByText(network.engineName);
  expect(text).toBeInTheDocument();
});

test('Expect simple column styling - volume', async () => {
  const volume: VolumeInfoUI = {
    name: '',
    shortName: '',
    mountPoint: '',
    scope: '',
    driver: '',
    created: '',
    age: '',
    size: 0,
    humanSize: '',
    engineId: '',
    engineName: 'my-engine',
    selected: false,
    status: 'UNUSED',
    containersUsage: [],
  };
  const { getByText } = render(EnvironmentColumn, { object: volume });

  const text = getByText(volume.engineName);
  expect(text).toBeInTheDocument();
});
