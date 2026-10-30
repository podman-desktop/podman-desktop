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

import type { ContainerUsageInfo } from '@desktop-framework/api';
import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import ContainerColumnCpu from './ContainerColumnCpu.svelte';
import ContainerColumnMemory from './ContainerColumnMemory.svelte';
import { ContainerGroupInfoTypeUI, type ContainerGroupInfoUI, type ContainerInfoUI } from './ContainerInfoUI';

// sends a `container-stats:update` event, as the main process does
let sendUpdate: ((usages: ContainerUsageInfo[]) => void) | undefined;

function container(id: string, state = 'RUNNING'): ContainerInfoUI {
  return {
    id,
    engineId: 'podman',
    state,
    name: id,
  } as unknown as ContainerInfoUI;
}

function group(containers: ContainerInfoUI[]): ContainerGroupInfoUI {
  return {
    name: 'my-pod',
    type: ContainerGroupInfoTypeUI.POD,
    id: 'pod-id',
    engineId: 'podman',
    containers,
  } as unknown as ContainerGroupInfoUI;
}

function usage(containerId: string, memoryUsage: number, cpuPercentage?: number): ContainerUsageInfo {
  return { engineId: 'podman', containerId, memoryUsage, cpuPercentage };
}

beforeEach(() => {
  vi.resetAllMocks();
  sendUpdate = undefined;
  vi.mocked(window.events.receive).mockImplementation((channel, func) => {
    if (channel === 'container-stats:update') {
      sendUpdate = (data): void => func(data);
    }
    return { dispose: vi.fn() };
  });
  vi.mocked(window.subscribeContainerStats).mockResolvedValue([]);
  vi.mocked(window.unsubscribeContainerStats).mockResolvedValue(undefined);
});

describe.each([
  { name: 'CPU', component: ContainerColumnCpu },
  { name: 'Memory', component: ContainerColumnMemory },
])('$name column', ({ component }) => {
  test('should show a placeholder for a running container until a reading is available', async () => {
    render(component, { object: container('c1') });
    await tick();

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('should show nothing for a stopped container', async () => {
    vi.mocked(window.subscribeContainerStats).mockResolvedValue([usage('c1', 2_000_000, 12.5)]);

    const { container: cell } = render(component, { object: container('c1', 'STOPPED') });
    await tick();

    expect(cell.textContent).toBe('');
  });

  test('should show nothing for a group without running containers', async () => {
    const { container: cell } = render(component, { object: group([container('c1', 'STOPPED')]) });
    await tick();

    expect(cell.textContent).toBe('');
  });

  test('should subscribe once while mounted, even when the row is refreshed', async () => {
    const { rerender, unmount } = render(component, { object: container('c1') });
    await rerender({ object: container('c1') });

    expect(window.subscribeContainerStats).toHaveBeenCalledOnce();
    expect(window.unsubscribeContainerStats).not.toHaveBeenCalled();

    unmount();

    expect(window.unsubscribeContainerStats).toHaveBeenCalledOnce();
  });
});

test('should show the CPU usage of a running container', async () => {
  vi.mocked(window.subscribeContainerStats).mockResolvedValue([usage('c1', 2_000_000, 12.345)]);

  render(ContainerColumnCpu, { object: container('c1') });

  expect(await screen.findByText('12.3%')).toBeInTheDocument();
});

test('should show a CPU placeholder while only the memory has a reading', async () => {
  // the CPU percentage needs two readings, the memory only one
  vi.mocked(window.subscribeContainerStats).mockResolvedValue([usage('c1', 2_000_000)]);

  render(ContainerColumnCpu, { object: container('c1') });
  render(ContainerColumnMemory, { object: container('c1') });

  expect(await screen.findByText('2 MB')).toBeInTheDocument();
  expect(screen.getByText('-')).toBeInTheDocument();
});

test('should show the memory usage of a running container', async () => {
  vi.mocked(window.subscribeContainerStats).mockResolvedValue([usage('c1', 2_000_000, 12.5)]);

  render(ContainerColumnMemory, { object: container('c1') });

  expect(await screen.findByText('2 MB')).toBeInTheDocument();
});

test('should follow the updates', async () => {
  render(ContainerColumnCpu, { object: container('c1') });
  render(ContainerColumnMemory, { object: container('c1') });
  await tick();

  sendUpdate?.([usage('c1', 2_000_000, 12.5)]);
  await tick();
  expect(screen.getByText('12.5%')).toBeInTheDocument();
  expect(screen.getByText('2 MB')).toBeInTheDocument();

  sendUpdate?.([usage('c1', 3_000_000, 50)]);
  await tick();
  expect(screen.getByText('50.0%')).toBeInTheDocument();
  expect(screen.getByText('3 MB')).toBeInTheDocument();
});

test('should share the subscription between the cells', async () => {
  render(ContainerColumnCpu, { object: container('c1') });
  render(ContainerColumnMemory, { object: container('c1') });
  await tick();

  expect(window.subscribeContainerStats).toHaveBeenCalledOnce();
});

test('should add the usages of the running containers of a group together', async () => {
  // c3 has stopped since the last update
  vi.mocked(window.subscribeContainerStats).mockResolvedValue([
    usage('c1', 2_000_000, 12.5),
    usage('c2', 1_000_000, 7.5),
    usage('c3', 5_000_000, 50),
  ]);
  const pod = group([container('c1'), container('c2'), container('c3', 'STOPPED')]);

  render(ContainerColumnCpu, { object: pod });
  render(ContainerColumnMemory, { object: pod });

  expect(await screen.findByText('20.0%')).toBeInTheDocument();
  expect(screen.getByText('3 MB')).toBeInTheDocument();
});
