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

import '@testing-library/jest-dom/vitest';

import type { ContainerInfo, ProviderInfo } from '@podman-desktop/core-api';
import { fireEvent, render, type RenderResult, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
/* eslint-disable import/no-duplicates */
import { type Component, type ComponentProps, tick } from 'svelte';
import { get } from 'svelte/store';
/* eslint-enable import/no-duplicates */
import { beforeEach, expect, test, vi } from 'vitest';

import { containersInfos } from '/@/stores/containers';
import { providerInfos } from '/@/stores/providers';

import ContainerList from './ContainerList.svelte';

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.listPods).mockResolvedValue([]);
  vi.mocked(window.listViewsContributions).mockResolvedValue([]);
  vi.mocked(window.getContributedMenus).mockResolvedValue([]);
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);
  vi.mocked(window.onDidUpdateProviderStatus).mockResolvedValue(undefined);
  vi.mocked(window.listContainers).mockResolvedValue([]);
  vi.mocked(window.getProviderInfos).mockResolvedValue([
    {
      name: 'podman',
      status: 'started',
      internalId: 'podman-internal-id',
      containerConnections: [
        {
          name: 'podman-machine-default',
          status: 'started',
        },
      ],
    } as ProviderInfo,
  ]);
  // fake the window.events object
  (window.events as unknown) = {
    receive: (_channel: string, func: () => void): void => {
      func();
    },
  };
});

async function waitRender(
  customProperties: object,
): Promise<RenderResult<Component<ComponentProps<typeof ContainerList>>>> {
  const result = render(ContainerList, { ...customProperties });
  await tick();
  return result;
}

test('Expect no container engines being displayed', async () => {
  render(ContainerList);
  const noEngine = screen.getByRole('heading', { name: 'No Container Engine' });
  expect(noEngine).toBeInTheDocument();
});

test('Expect no containers being displayed', async () => {
  vi.mocked(window.getProviderInfos).mockResolvedValue([
    {
      name: 'podman',
      status: 'started',
      internalId: 'podman-internal-id',
      containerConnections: [
        {
          name: 'podman-machine-default',
          status: 'started',
        },
      ],
    } as ProviderInfo,
  ]);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  await waitFor(() => expect(get(providerInfos)).not.toHaveLength(0));
  await waitRender({});

  const noContainers = screen.getByRole('heading', { name: 'No containers' });
  expect(noContainers).toBeInTheDocument();

  const runningTab = screen.getByRole('button', { name: 'Running' });
  await fireEvent.click(runningTab);

  const noRunningContainers = screen.getByRole('heading', { name: 'No running containers' });
  expect(noRunningContainers).toBeInTheDocument();

  const stoppedTab = screen.getByRole('button', { name: 'Stopped' });
  await fireEvent.click(stoppedTab);

  const noStoppedContainers = screen.getByRole('heading', { name: 'No stopped containers' });
  expect(noStoppedContainers).toBeInTheDocument();
});

test('Expect is:running / is:stopped is added to the filter field', async () => {
  vi.mocked(window.getProviderInfos).mockResolvedValue([
    {
      name: 'podman',
      status: 'started',
      internalId: 'podman-internal-id',
      containerConnections: [
        {
          name: 'podman-machine-default',
          status: 'started',
        },
      ],
    } as ProviderInfo,
  ]);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  await waitFor(() => expect(get(providerInfos)).not.toHaveLength(0));
  await waitRender({});

  const searchField = screen.getByPlaceholderText('Search...');
  expect(searchField).toBeInTheDocument();
  expect(searchField).not.toHaveDisplayValue(/is:running/);
  expect(searchField).not.toHaveDisplayValue(/is:stopped/);

  const runningTab = screen.getByRole('button', { name: 'Running' });
  await fireEvent.click(runningTab);

  expect(searchField).toHaveDisplayValue(/is:running/);
  expect(searchField).not.toHaveDisplayValue(/is:stopped/);

  const stoppedTab = screen.getByRole('button', { name: 'Stopped' });
  await fireEvent.click(stoppedTab);

  expect(searchField).not.toHaveDisplayValue(/is:running/);
  expect(searchField).toHaveDisplayValue(/is:stopped/);
});

test('Expect filter is preserved between tabs', async () => {
  vi.mocked(window.getProviderInfos).mockResolvedValue([
    {
      name: 'podman',
      status: 'started',
      internalId: 'podman-internal-id',
      containerConnections: [
        {
          name: 'podman-machine-default',
          status: 'started',
        },
      ],
    } as ProviderInfo,
  ]);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  await waitFor(() => expect(get(providerInfos)).not.toHaveLength(0));
  await waitRender({});

  const searchField = screen.getByPlaceholderText('Search...');
  expect(searchField).toBeInTheDocument();
  const user = userEvent.setup();
  await user.type(searchField, 'foobar');
  expect(searchField).toHaveDisplayValue(/foobar/);

  const runningTab = screen.getByRole('button', { name: 'Running' });
  await fireEvent.click(runningTab);
  expect(searchField).toHaveDisplayValue(/foobar/);

  const stoppedTab = screen.getByRole('button', { name: 'Stopped' });
  await fireEvent.click(stoppedTab);
  expect(searchField).toHaveDisplayValue(/foobar/);
});

test('Try to delete a pod that has containers', async () => {
  vi.mocked(window.getProviderInfos).mockResolvedValue([
    {
      name: 'podman',
      status: 'started',
      internalId: 'podman-internal-id',
      containerConnections: [
        {
          name: 'podman-machine-default',
          status: 'started',
        },
      ],
    } as ProviderInfo,
  ]);

  const podId = 'pod-id';

  const singleContainer = {
    Id: 'sha256:1234567890123',
    Image: 'sha256:123',
    Names: ['foo'],
    Status: 'Running',
    engineId: 'podman',
    engineName: 'podman',
    ImageID: 'dummy-image-id',
  };

  // one single container and two containers part of a pod
  const mockedContainers = [
    singleContainer as ContainerInfo,
    {
      Id: 'sha256:456456456456456',
      Image: 'sha256:234',
      Names: ['internal-only-pod'],
      RepoTags: ['veryold:image'],
      Status: 'Running',
      pod: {
        name: 'my-pod',
        id: podId,
        status: 'Running',
      },
      engineId: 'podman',
      engineName: 'podman',
      ImageID: 'dummy-image-id',
    } as unknown as ContainerInfo,
    {
      Id: 'sha256:7897891234567890123',
      Image: 'sha256:345',
      Names: ['container-in-pod'],
      Status: 'Running',
      pod: {
        name: 'my-pod',
        id: podId,
        status: 'Running',
      },
      engineId: 'podman',
      engineName: 'podman',
      ImageID: 'dummy-image-id',
    } as ContainerInfo,
  ];

  vi.mocked(window.listContainers).mockResolvedValue(mockedContainers);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait store are populated
  await waitFor(() => expect(get(containersInfos)).not.toHaveLength(0));

  await waitFor(() => expect(get(providerInfos)).not.toHaveLength(0));
  await waitRender({});

  // select the checkbox
  const checkbox = screen.getByRole('checkbox', { name: 'Toggle all' });
  expect(checkbox).toBeInTheDocument();

  // click on the checkbox
  await fireEvent.click(checkbox);

  // click on the delete button
  const deleteButton = screen.getByRole('button', { name: 'Delete selected containers and pods' });
  expect(deleteButton).toBeInTheDocument();
  await fireEvent.click(deleteButton);

  // expect that we call to delete the pod first (as it's a group of containers)
  expect(window.removePod).toHaveBeenCalledWith('podman', podId);

  // wait window.deleteContainer is called
  while (vi.mocked(window.deleteContainer).mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // and then only the container that is not inside a pod
  expect(window.deleteContainer).toBeCalledWith('podman', singleContainer.Id);
  expect(window.deleteContainer).toBeCalledTimes(1);
});

test('Try to delete a container without deleting pods', async () => {
  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait for the store to be cleared
  await waitFor(() => expect(get(containersInfos)).toHaveLength(0));

  const podId = 'pod-id2';

  const singleContainer = {
    Id: 'sha256:21234567890123',
    Image: 'sha256:123',
    Names: ['foo'],
    Status: 'Running',
    engineId: 'podman',
    engineName: 'podman',
    ImageID: 'dummy-image-id',
  };

  // one single container and a container as part of a pod
  const mockedContainers = [
    singleContainer as ContainerInfo,
    {
      Id: 'sha256:7897891234567890123',
      Image: 'sha256:345',
      Names: ['container-in-pod'],
      Status: 'Running',
      pod: {
        name: 'my-pod2',
        id: podId,
        status: 'Running',
      },
      engineId: 'podman',
      engineName: 'podman',
      ImageID: 'dummy-image-id',
    } as ContainerInfo,
  ];

  vi.mocked(window.listContainers).mockResolvedValue(mockedContainers);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait until the store is populated
  await waitFor(() => expect(get(containersInfos)).not.toHaveLength(0));

  await waitRender({});

  // select the standalone container checkbox
  const checkboxes = screen.getAllByRole('checkbox', { name: 'Toggle container' });
  expect(checkboxes[0]).toBeInTheDocument();
  await fireEvent.click(checkboxes[0]);

  // click on the delete button
  const deleteButton = screen.getByRole('button', { name: 'Delete selected containers and pods' });
  expect(deleteButton).toBeInTheDocument();
  await fireEvent.click(deleteButton);

  // wait until window.deleteContainer is called
  while (vi.mocked(window.deleteContainer).mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // expect that the container has been deleted
  expect(window.deleteContainer).toBeCalledWith('podman', singleContainer.Id);

  // but not the other container
  expect(window.deleteContainer).toHaveBeenCalledOnce();

  // and not the pod
  expect(window.removePod).not.toBeCalled();
});

test('Try to delete a pod without deleting container', async () => {
  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait for the store to be cleared
  await waitFor(() => expect(get(containersInfos)).toHaveLength(0));
  const podId = 'pod-id3';

  const singleContainer = {
    Id: 'sha256:56789012345',
    Image: 'sha256:567',
    Names: ['foo'],
    Status: 'Running',
    engineId: 'podman',
    engineName: 'podman',
    ImageID: 'dummy-image-id',
  };

  // one single container and a container as part of a pod
  const mockedContainers = [
    singleContainer as ContainerInfo,
    {
      Id: 'sha256:7897891234567890123',
      Image: 'sha256:345',
      Names: ['container-in-pod'],
      Status: 'Running',
      pod: {
        name: 'my-pod3',
        id: podId,
        status: 'Running',
      },
      engineId: 'podman',
      engineName: 'podman',
      ImageID: 'dummy-image-id',
    } as ContainerInfo,
  ];

  vi.mocked(window.listContainers).mockResolvedValue(mockedContainers);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait until the store is populated
  await waitFor(() => expect(get(containersInfos)).not.toHaveLength(0));

  await waitRender({});

  // select the pod checkbox
  const checkboxes = screen.getAllByRole('checkbox', { name: 'Toggle container' });
  expect(checkboxes[1]).toBeInTheDocument();
  await fireEvent.click(checkboxes[1]);

  // click on the delete button
  const deleteButton = screen.getByRole('button', { name: 'Delete selected containers and pods' });
  expect(deleteButton).toBeInTheDocument();
  await fireEvent.click(deleteButton);

  // wait until removePodMock is called
  while (vi.mocked(window.removePod).mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // expect that the pod has been removed
  expect(window.removePod).toHaveBeenCalledWith('podman', podId);
  expect(window.removePod).toHaveBeenCalledOnce();

  // and the standalone container has not been deleted
  expect(window.deleteContainer).not.toHaveBeenCalled();
});

test('Expect filter empty screen', async () => {
  vi.mocked(window.getProviderInfos).mockResolvedValue([
    {
      name: 'podman',
      status: 'started',
      internalId: 'podman-internal-id',
      containerConnections: [
        {
          name: 'podman-machine-default',
          status: 'started',
        },
      ],
    } as ProviderInfo,
  ]);

  const singleContainer = {
    Id: 'sha256:1234567890123',
    Image: 'sha256:123',
    Names: ['foo'],
    Status: 'Running',
    engineId: 'podman',
    engineName: 'podman',
    ImageID: 'dummy-image-id',
  };

  // one single container
  const mockedContainers = [singleContainer as ContainerInfo];

  vi.mocked(window.listContainers).mockResolvedValue(mockedContainers);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait store are populated
  await waitFor(() => expect(get(containersInfos)).not.toHaveLength(0));

  await waitFor(() => expect(get(providerInfos)).not.toHaveLength(0));
  await waitRender({ searchTerm: 'No match' });

  const filterButton = screen.getByRole('button', { name: 'Clear filter' });
  expect(filterButton).toBeInTheDocument();
});

test('Expect clear filter in empty screen to clear serach term, except is:...', async () => {
  vi.mocked(window.getProviderInfos).mockResolvedValue([
    {
      name: 'podman',
      status: 'started',
      internalId: 'podman-internal-id',
      containerConnections: [
        {
          name: 'podman-machine-default',
          status: 'started',
        },
      ],
    } as ProviderInfo,
  ]);

  const singleContainer = {
    Id: 'sha256:1234567890123',
    Image: 'sha256:123',
    Names: ['foo'],
    Status: 'Running',
    engineId: 'podman',
    engineName: 'podman',
    ImageID: 'dummy-image-id',
  };

  // one single container
  const mockedContainers = [singleContainer as ContainerInfo];

  vi.mocked(window.listContainers).mockResolvedValue(mockedContainers);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait store are populated
  await waitFor(() => expect(get(containersInfos)).not.toHaveLength(0));

  await waitFor(() => expect(get(providerInfos)).not.toHaveLength(0));
  await waitRender({});

  const searchField = screen.getByPlaceholderText('Search...');
  expect(searchField).toBeInTheDocument();
  const user = userEvent.setup();
  await user.type(searchField, 'foobar');
  expect(searchField).toHaveDisplayValue(/foobar/);

  const runningTab = screen.getByRole('button', { name: 'Running' });
  await fireEvent.click(runningTab);
  expect(searchField).toHaveDisplayValue(/foobar/);
  expect(searchField).toHaveDisplayValue(/is:running/);

  const filterButton = screen.getByRole('button', { name: 'Clear filter' });
  expect(filterButton).toBeInTheDocument();

  await fireEvent.click(filterButton);
  expect(searchField).not.toHaveDisplayValue(/foobar/);
  expect(searchField).toHaveDisplayValue(/is:running/);
});

test('Expect to display running / stopped containers depending on tab', { timeout: 20_000 }, async () => {
  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait for the store to be cleared
  await vi.waitFor(() => expect(get(containersInfos).length).toBe(0), { timeout: 5_000 });

  vi.mocked(window.getProviderInfos).mockResolvedValue([
    {
      name: 'podman',
      status: 'started',
      internalId: 'podman-internal-id',
      containerConnections: [
        {
          name: 'podman-machine-default',
          status: 'started',
        },
      ],
    } as ProviderInfo,
  ]);

  const pod1Id = 'pod1-id';
  const pod2Id = 'pod2-id';
  const pod3Id = 'pod3-id';

  // 3 pods with 2 containers each
  const mockedContainers = [
    // 2 / 2 containers are running on this pod
    {
      Id: 'sha256:68347658374683476',
      Image: 'sha256:234',
      Names: ['container1-pod1'],
      State: 'Running',
      pod: {
        name: 'pod1',
        id: pod1Id,
        status: 'Running',
      },
      engineId: 'podman',
      engineName: 'podman',
      ImageID: 'dummy-image-id',
    } as ContainerInfo,
    {
      Id: 'sha256:7897891234567890123',
      Image: 'sha256:345',
      Names: ['container2-pod1'],
      State: 'Running',
      pod: {
        name: 'pod1',
        id: pod1Id,
        status: 'Running',
      },
      engineId: 'podman',
      engineName: 'podman',
      ImageID: 'dummy-image-id',
    } as ContainerInfo,

    // 1 / 2 containers are running on this pod
    {
      Id: 'sha256:876532948235',
      Image: 'sha256:876',
      Names: ['container1-pod2'],
      State: 'Running',
      pod: {
        name: 'pod2',
        id: pod2Id,
        status: 'Running',
      },
      engineId: 'podman',
      engineName: 'podman',
      ImageID: 'dummy-image-id',
    } as ContainerInfo,
    {
      Id: 'sha256:834752375490',
      Image: 'sha256:834',
      Names: ['container2-pod2'],
      State: 'Stopped',
      pod: {
        name: 'pod2',
        id: pod2Id,
        status: 'Running',
      },
      engineId: 'podman',
      engineName: 'podman',
      ImageID: 'dummy-image-id',
    } as ContainerInfo,

    // 0 / 2 containers are running on this pod
    {
      Id: 'sha256:56283769268',
      Image: 'sha256:562',
      Names: ['container1-pod3'],
      State: 'Stopped',
      pod: {
        name: 'pod3',
        id: pod3Id,
        status: 'Stopped',
      },
      engineId: 'podman',
      engineName: 'podman',
      ImageID: 'dummy-image-id',
    } as ContainerInfo,
    {
      Id: 'sha256:834752375490',
      Image: 'sha256:834',
      Names: ['container2-pod3'],
      State: 'Stopped',
      pod: {
        name: 'pod3',
        id: pod3Id,
        status: 'Stopped',
      },
      engineId: 'podman',
      engineName: 'podman',
      ImageID: 'dummy-image-id',
    } as ContainerInfo,
  ];

  vi.mocked(window.listContainers).mockResolvedValue(mockedContainers);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait until store is populated
  await vi.waitFor(() => expect(get(containersInfos).length).toBe(6), { timeout: 5_000 });
  await vi.waitFor(() => expect(get(providerInfos).length).toBe(1), { timeout: 5_000 });

  await waitRender({});

  const tests = [
    {
      tabLabel: undefined,
      presentCells: [
        'pod1 (pod) 2 containers',
        'container1-pod1 RUNNING',
        'container2-pod1 RUNNING',
        'pod2 (pod) 2 containers',
        'container1-pod2 RUNNING',
        'container2-pod2 STOPPED',
        'pod3 (pod) 2 containers',
        'container1-pod3 STOPPED',
        'container2-pod3 STOPPED',
      ],
      absentLabels: [],
    },
    {
      tabLabel: 'Running',
      presentCells: [
        'pod1 (pod) 2 containers',
        'container1-pod1 RUNNING',
        'container2-pod1 RUNNING',
        'pod2 (pod) 2 containers (1 filtered)',
        'container1-pod2 RUNNING',
      ],
      absentLabels: [/container2-pod2.*/, /pod3 \(pod\).*/, /container1-pod3.*/, /container2-pod3.*/],
    },
    {
      tabLabel: 'Stopped',
      presentCells: [
        'pod2 (pod) 2 containers (1 filtered)',
        'container2-pod2 STOPPED',
        'pod3 (pod) 2 containers',
        'container1-pod3 STOPPED',
        'container2-pod3 STOPPED',
      ],
      absentLabels: [/pod1 \(pod\).*/, /container1-pod1.*/, /container2-pod1.*/, /container1-pod2.*/],
    },
  ];

  for (const tt of tests) {
    if (tt.tabLabel) {
      const tab = screen.getByRole('button', { name: tt.tabLabel });
      await fireEvent.click(tab);
    }
    for (const presentCell of tt.presentCells) {
      await vi.waitFor(() => {
        expect(screen.getByRole('button', { name: presentCell })).toBeInTheDocument();
      });
    }
    for (const absentCell of tt.absentLabels) {
      await vi.waitFor(() => {
        expect(screen.queryByText(absentCell)).not.toBeInTheDocument();
      });
    }
  }
});

test('Sort containers based on selected parameter', async () => {
  vi.mocked(window.listContainers).mockResolvedValue([]);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait for the store to be cleared
  await waitFor(() => expect(get(containersInfos)).toHaveLength(0));

  const mockedContainers = [
    {
      Id: 'sha256:123454321',
      Image: 'sha256:123',
      Names: ['foo1'],
      Status: 'Running',
      engineId: 'podman',
      engineName: 'podman',
      engineType: 'podman',
      ImageID: 'dummy-image-id',
      startedAt: '2024-06-19T17:30:46.000Z',
    } as unknown as ContainerInfo,
    {
      Id: 'sha256:223454321',
      Image: 'sha256:223',
      Names: ['foo2'],
      Status: 'Exited',
      engineId: 'docker',
      engineName: 'docker',
      engineType: 'docker',
      ImageID: 'dummy-image-id',
      startedAt: '2024-06-19T17:39:46.000Z',
    } as unknown as ContainerInfo,
  ];

  vi.mocked(window.listContainers).mockResolvedValue(mockedContainers);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait until the store is populated
  await waitFor(() => expect(get(containersInfos)).not.toHaveLength(0));

  await waitRender({});

  const status = screen.getByRole('columnheader', { name: 'Status' });
  await fireEvent.click(status);

  const container1 = screen.getByRole('cell', { name: 'foo1' });
  const container2 = screen.getByRole('cell', { name: 'foo2' });

  expect(container1).toBeInTheDocument();
  expect(container2).toBeInTheDocument();

  expect(container2.compareDocumentPosition(container1)).toBe(2);

  const environment = screen.getByRole('columnheader', { name: 'Environment' });
  await fireEvent.click(environment);

  expect(container1.compareDocumentPosition(container2)).toBe(2);

  const image = screen.getByRole('columnheader', { name: 'Image' });
  await fireEvent.click(image);

  expect(container2.compareDocumentPosition(container1)).toBe(2);
});

test('Expect user confirmation to pop up when preferences require', async () => {
  vi.mocked(window.listContainers).mockResolvedValue([]);
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 1 });

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait for the store to be cleared
  await vi.waitUntil(() => get(containersInfos).length === 0);

  // one single container and a container as part of a pod
  const mockedContainers = [
    {
      Id: 'sha256:123454321',
      Image: 'sha256:123',
      Names: ['foo1'],
      Status: 'Running',
      engineId: 'podman',
      engineName: 'podman',
      ImageID: 'dummy-image-id',
    } as ContainerInfo,
  ];

  vi.mocked(window.listContainers).mockResolvedValue(mockedContainers);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait until the store is populated
  await vi.waitUntil(() => get(containersInfos).length > 0);

  await waitRender({});

  // select the standalone container checkbox
  const checkboxes = screen.getAllByRole('checkbox', { name: 'Toggle container' });
  await fireEvent.click(checkboxes[0]);

  const deleteButton = await vi.waitFor(() =>
    screen.getByRole('button', { name: 'Delete selected containers and pods' }),
  );
  await fireEvent.click(deleteButton);

  expect(window.showMessageBox).toHaveBeenCalledOnce();

  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });
  await fireEvent.click(deleteButton);
  expect(window.showMessageBox).toHaveBeenCalledTimes(2);
  await vi.waitFor(() => expect(window.deleteContainer).toHaveBeenCalled());
});

test('Try to run pods in bulk', async () => {
  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait for the store to be cleared
  await waitFor(() => expect(get(containersInfos)).toHaveLength(0));

  const podId = 'pod-id3';
  const containerId = 'sha256:56789012345';

  const singleContainer = {
    Id: containerId,
    Image: 'sha256:567',
    Names: ['foo'],
    Status: 'Stopped',
    engineId: 'podman',
    engineName: 'podman',
    ImageID: 'dummy-image-id',
  };

  // one single container and a container as part of a pod
  const mockedContainers = [
    singleContainer as ContainerInfo,
    {
      Id: 'sha256:7897891234567890123',
      Image: 'sha256:345',
      Names: ['container-in-pod'],
      Status: 'Stopped',
      pod: {
        name: 'my-pod3',
        id: podId,
        status: 'Stopped',
      },
      engineId: 'podman',
      engineName: 'podman',
      ImageID: 'dummy-image-id',
    } as ContainerInfo,
  ];

  vi.mocked(window.listContainers).mockResolvedValue(mockedContainers);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait until the store is populated
  await waitFor(() => expect(get(containersInfos)).not.toHaveLength(0));

  await waitRender({});

  // select the pod checkbox
  const checkboxes = screen.getAllByRole('checkbox', { name: 'Toggle container' });
  expect(checkboxes[0]).toBeInTheDocument();
  expect(checkboxes[1]).toBeInTheDocument();
  await fireEvent.click(checkboxes[0]);
  await fireEvent.click(checkboxes[1]);

  // click on the bulk run button
  const runBulkButton = screen.getByRole('button', { name: 'Run selected containers and pods' });
  expect(runBulkButton).toBeInTheDocument();
  await fireEvent.click(runBulkButton);

  // wait until startPodMock is called
  while (vi.mocked(window.startPod).mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // wait until startContainerMock is called
  while (vi.mocked(window.startContainer).mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // expect that the pod is running
  expect(window.startPod).toHaveBeenCalledWith('podman', podId);
  expect(window.startPod).toHaveBeenCalledOnce();

  // expect that the container is running
  expect(window.startContainer).toHaveBeenCalledWith('podman', containerId);
  expect(window.startContainer).toHaveBeenCalledOnce();
});

test('Ensuring the table and empty screen are not visible at the same time', async () => {
  // mock one container
  vi.mocked(window.listContainers).mockResolvedValue([
    {
      Id: 'sha256:7897891234567890123',
      Image: 'sha256:345',
      Names: ['container-in-pod'],
      Status: 'Stopped',
      engineId: 'podman',
      engineName: 'podman',
      ImageID: 'dummy-image-id',
    } as ContainerInfo,
  ]);
  // mock zero provider infos
  vi.mocked(window.getProviderInfos).mockResolvedValue([]);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait until the stores are populated
  await vi.waitUntil(() => get(containersInfos).length === 1 && get(providerInfos).length === 0);

  const { getByRole, queryByRole } = await waitRender({});

  const noEngine = getByRole('heading', { name: 'No Container Engine' });
  expect(noEngine).toBeInTheDocument();

  const table = queryByRole('table');
  expect(table).toBeNull();
});

test('pods with same name on different engines should have separate group', async () => {
  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait until the store is populated
  await vi.waitUntil(async () => {
    return get(containersInfos).length === 0;
  });

  const CONTAINERS_MOCK: Array<ContainerInfo> = Array.from({ length: 3 }).map((_, index) => ({
    Id: `sha256:${index}`,
    Image: 'sha256:234',
    Names: ['foo-bar-pod'], // have the same name for all
    RepoTags: ['veryold:image'],
    Status: 'Running',
    pod: {
      name: 'my-pod',
      id: `podman-engine-${index}`, // unique pod id (only pod-id is unique accross all engines)
      status: 'Running',
      engineId: `podman-${index}`,
    },
    engineId: `podman-${index}`,
    engineName: 'podman',
    ImageID: 'dummy-image-id',
    engineType: 'podman',
    StartedAt: '0',
    ImageBase64RepoTag: '',
    Created: 0,
    Ports: [],
    Labels: {},
    State: '',
  }));

  vi.mocked(window.listContainers).mockResolvedValue(CONTAINERS_MOCK);

  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  window.dispatchEvent(new CustomEvent('provider-lifecycle-change'));
  window.dispatchEvent(new CustomEvent('tray:update-provider'));

  // wait until the store is populated
  await vi.waitUntil(async () => {
    return get(containersInfos).length > 0;
  });

  const { getAllByRole } = await waitRender({});

  await vi.waitFor(() => {
    const expandButtons = getAllByRole('button', { name: 'Collapse Row' });
    expect(expandButtons).toHaveLength(CONTAINERS_MOCK.length);
  });
});
