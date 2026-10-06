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

import type { ContainerStatsInfo } from '@podman-desktop/core-api';
import { render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';

import { containerStatsPoller } from './container-stats.svelte';
import ContainerColumnCpu from './ContainerColumnCpu.svelte';
import ContainerColumnMemory from './ContainerColumnMemory.svelte';
import { ContainerGroupInfoTypeUI, type ContainerGroupInfoUI, type ContainerInfoUI } from './ContainerInfoUI';

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

function stats(totalUsage: number, systemCpuUsage: number, memoryUsage: number): ContainerStatsInfo {
  return {
    cpu_stats: {
      cpu_usage: { total_usage: totalUsage },
      system_cpu_usage: systemCpuUsage,
      online_cpus: 2,
    },
    memory_stats: { usage: memoryUsage, limit: 10_000_000 },
  } as unknown as ContainerStatsInfo;
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  containerStatsPoller.setRefreshInterval(0);
});

test('should show a placeholder for a running container while statistics are disabled', async () => {
  render(ContainerColumnCpu, { object: container('c1') });
  await vi.advanceTimersByTimeAsync(60_000);

  expect(screen.getByText('-')).toBeInTheDocument();
  expect(window.getContainerStatsSnapshot).not.toHaveBeenCalled();
});

test('should show nothing for a stopped container', async () => {
  containerStatsPoller.setRefreshInterval(5);
  const { container: cell } = render(ContainerColumnCpu, { object: container('c1', 'STOPPED') });
  await vi.advanceTimersByTimeAsync(5_000);

  expect(cell).toHaveTextContent('');
  expect(window.getContainerStatsSnapshot).not.toHaveBeenCalled();
});

test('should show the CPU usage once two readings are available', async () => {
  vi.mocked(window.getContainerStatsSnapshot)
    .mockResolvedValueOnce(stats(100, 1_000, 500))
    .mockResolvedValueOnce(stats(300, 3_000, 500));
  containerStatsPoller.setRefreshInterval(5);

  render(ContainerColumnCpu, { object: container('c1') });
  await vi.advanceTimersByTimeAsync(0);
  expect(screen.getByText('-')).toBeInTheDocument();

  await vi.advanceTimersByTimeAsync(5_000);
  expect(screen.getByText('20.0%')).toBeInTheDocument();
});

test('should show the memory usage after the first reading', async () => {
  vi.mocked(window.getContainerStatsSnapshot).mockResolvedValue(stats(100, 1_000, 2_000_000));
  containerStatsPoller.setRefreshInterval(5);

  render(ContainerColumnMemory, { object: container('c1') });
  await vi.advanceTimersByTimeAsync(0);

  expect(screen.getByText('2 MB')).toBeInTheDocument();
});

test('should sum the memory usage of the running containers of a group', async () => {
  vi.mocked(window.getContainerStatsSnapshot).mockResolvedValue(stats(100, 1_000, 2_000_000));
  containerStatsPoller.setRefreshInterval(5);

  render(ContainerColumnMemory, {
    object: group([container('c1'), container('c2'), container('c3', 'STOPPED')]),
  });
  await vi.advanceTimersByTimeAsync(0);

  expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(2);
  expect(screen.getByText('4 MB')).toBeInTheDocument();
});

test('should not subscribe again when the row is refreshed with the same running containers', async () => {
  vi.mocked(window.getContainerStatsSnapshot).mockResolvedValue(stats(100, 1_000, 500));
  containerStatsPoller.setRefreshInterval(5);

  const { rerender } = render(ContainerColumnCpu, { object: container('c1') });
  await vi.advanceTimersByTimeAsync(0);
  await rerender({ object: container('c1') });
  await vi.advanceTimersByTimeAsync(0);

  expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(1);
});

test('should stop reading once the cell is removed', async () => {
  vi.mocked(window.getContainerStatsSnapshot).mockResolvedValue(stats(100, 1_000, 500));
  containerStatsPoller.setRefreshInterval(5);

  const { unmount } = render(ContainerColumnCpu, { object: container('c1') });
  await vi.advanceTimersByTimeAsync(0);
  unmount();
  await vi.advanceTimersByTimeAsync(60_000);

  expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(1);
});
