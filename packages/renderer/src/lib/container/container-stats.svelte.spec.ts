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

import type { ContainerStatsInfo } from '@podman-desktop/core-api';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { ContainerStatsPoller, MAX_CONCURRENT_READINGS } from './container-stats.svelte';

let poller: ContainerStatsPoller;

function stats(totalUsage: number, systemCpuUsage: number, memoryUsage: number): ContainerStatsInfo {
  return {
    engineId: 'engine',
    engineName: 'Engine',
    cpu_stats: {
      cpu_usage: { total_usage: totalUsage, usage_in_kernelmode: 0, usage_in_usermode: 0 },
      system_cpu_usage: systemCpuUsage,
      online_cpus: 2,
      throttling_data: { periods: 0, throttled_periods: 0, throttled_time: 0 },
    },
    memory_stats: { usage: memoryUsage, limit: 10_000 },
  } as unknown as ContainerStatsInfo;
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  poller = new ContainerStatsPoller();
});

afterEach(() => {
  poller.setRefreshInterval(0);
});

test('should not read statistics while the refresh interval is 0', async () => {
  poller.subscribe('engine', 'c1');

  await vi.advanceTimersByTimeAsync(60_000);

  expect(window.getContainerStatsSnapshot).not.toHaveBeenCalled();
  expect(poller.getUsage(['c1'])).toEqual({ cpuPercentage: undefined, memoryUsage: undefined });
});

test('should read memory straight away and CPU after the second reading', async () => {
  vi.mocked(window.getContainerStatsSnapshot)
    .mockResolvedValueOnce(stats(100, 1_000, 500))
    .mockResolvedValueOnce(stats(300, 3_000, 700));
  poller.setRefreshInterval(5);

  poller.subscribe('engine', 'c1');
  await vi.advanceTimersByTimeAsync(0);

  expect(window.getContainerStatsSnapshot).toHaveBeenCalledWith('engine', 'c1');
  expect(poller.getUsage(['c1'])).toEqual({ cpuPercentage: undefined, memoryUsage: 500 });

  await vi.advanceTimersByTimeAsync(5_000);

  expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(2);
  expect(poller.getUsage(['c1'])).toEqual({ cpuPercentage: 20, memoryUsage: 700 });
});

test('should read each container once per refresh even with several subscribers', async () => {
  vi.mocked(window.getContainerStatsSnapshot).mockResolvedValue(stats(100, 1_000, 500));
  poller.setRefreshInterval(5);

  const unsubscribeCpu = poller.subscribe('engine', 'c1');
  poller.subscribe('engine', 'c1');
  await vi.advanceTimersByTimeAsync(5_000);

  expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(2);

  unsubscribeCpu();
  await vi.advanceTimersByTimeAsync(5_000);

  expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(3);
});

test('should stop reading and forget the usage once the last subscriber leaves', async () => {
  vi.mocked(window.getContainerStatsSnapshot).mockResolvedValue(stats(100, 1_000, 500));
  poller.setRefreshInterval(5);

  const unsubscribe = poller.subscribe('engine', 'c1');
  await vi.advanceTimersByTimeAsync(0);
  unsubscribe();
  await vi.advanceTimersByTimeAsync(60_000);

  expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(1);
  expect(poller.getUsage(['c1'])).toEqual({ cpuPercentage: undefined, memoryUsage: undefined });
});

test('should discard a reading that arrives after unsubscribing', async () => {
  let resolveReading: (value: ContainerStatsInfo) => void = () => {};
  vi.mocked(window.getContainerStatsSnapshot).mockReturnValue(
    new Promise(resolve => {
      resolveReading = resolve;
    }),
  );
  poller.setRefreshInterval(5);

  const unsubscribe = poller.subscribe('engine', 'c1');
  unsubscribe();
  resolveReading(stats(100, 1_000, 500));
  await vi.advanceTimersByTimeAsync(0);

  expect(poller.getUsage(['c1']).memoryUsage).toBeUndefined();
});

test('should clear the usage and stop reading when the refresh interval is set to 0', async () => {
  vi.mocked(window.getContainerStatsSnapshot).mockResolvedValue(stats(100, 1_000, 500));
  poller.setRefreshInterval(5);
  poller.subscribe('engine', 'c1');
  await vi.advanceTimersByTimeAsync(0);
  expect(poller.getUsage(['c1']).memoryUsage).toBe(500);

  poller.setRefreshInterval(0);
  await vi.advanceTimersByTimeAsync(60_000);

  expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(1);
  expect(poller.getUsage(['c1'])).toEqual({ cpuPercentage: undefined, memoryUsage: undefined });
});

test('should read straight away when the refresh interval goes from 0 to a positive value', async () => {
  vi.mocked(window.getContainerStatsSnapshot).mockResolvedValue(stats(100, 1_000, 500));
  poller.subscribe('engine', 'c1');

  poller.setRefreshInterval(10);
  await vi.advanceTimersByTimeAsync(0);
  expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(1);

  await vi.advanceTimersByTimeAsync(9_000);
  expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(1);

  await vi.advanceTimersByTimeAsync(1_000);
  expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(2);
});

test('should keep reading other containers when one reading fails', async () => {
  vi.spyOn(console, 'debug').mockImplementation(() => {});
  vi.mocked(window.getContainerStatsSnapshot).mockImplementation(async (_engineId, containerId) => {
    if (containerId === 'broken') {
      throw new Error('no such container');
    }
    return stats(100, 1_000, 500);
  });
  poller.setRefreshInterval(5);

  poller.subscribe('engine', 'broken');
  poller.subscribe('engine', 'c1');
  await vi.advanceTimersByTimeAsync(5_000);

  expect(poller.getUsage(['c1']).memoryUsage).toBe(500);
  expect(poller.getUsage(['broken']).memoryUsage).toBeUndefined();
  expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(4);
});

describe('concurrency', () => {
  // readings that only complete when the test resolves them
  function deferReadings(): ((value: ContainerStatsInfo) => void)[] {
    const pending: ((value: ContainerStatsInfo) => void)[] = [];
    vi.mocked(window.getContainerStatsSnapshot).mockImplementation(() => {
      const { promise, resolve } = Promise.withResolvers<ContainerStatsInfo>();
      pending.push(resolve);
      return promise;
    });
    return pending;
  }

  test('should limit the number of readings in progress', async () => {
    const pending = deferReadings();
    poller.setRefreshInterval(5);
    const containerCount = MAX_CONCURRENT_READINGS * 2 + 1;

    for (let index = 0; index < containerCount; index++) {
      poller.subscribe('engine', `c${index}`);
    }
    await vi.advanceTimersByTimeAsync(0);
    expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(MAX_CONCURRENT_READINGS);

    // each completed reading lets a waiting one start
    while (pending.length > 0) {
      pending.shift()?.(stats(100, 1_000, 500));
      await vi.advanceTimersByTimeAsync(0);
    }

    expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(containerCount);
    for (let index = 0; index < containerCount; index++) {
      expect(poller.getUsage([`c${index}`]).memoryUsage).toBe(500);
    }
  });

  test('should skip a waiting reading when the container leaves before its turn', async () => {
    const pending = deferReadings();
    poller.setRefreshInterval(5);

    for (let index = 0; index < MAX_CONCURRENT_READINGS; index++) {
      poller.subscribe('engine', `c${index}`);
    }
    const unsubscribeLast = poller.subscribe('engine', 'last');
    await vi.advanceTimersByTimeAsync(0);
    unsubscribeLast();

    while (pending.length > 0) {
      pending.shift()?.(stats(100, 1_000, 500));
      await vi.advanceTimersByTimeAsync(0);
    }

    expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(MAX_CONCURRENT_READINGS);
    expect(window.getContainerStatsSnapshot).not.toHaveBeenCalledWith('engine', 'last');
  });

  test('should free its slot when a reading fails', async () => {
    vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.mocked(window.getContainerStatsSnapshot).mockRejectedValue(new Error('engine is gone'));
    poller.setRefreshInterval(5);

    for (let index = 0; index < MAX_CONCURRENT_READINGS * 2; index++) {
      poller.subscribe('engine', `c${index}`);
    }
    await vi.advanceTimersByTimeAsync(0);

    expect(window.getContainerStatsSnapshot).toHaveBeenCalledTimes(MAX_CONCURRENT_READINGS * 2);
  });
});

describe('getUsage', () => {
  test('should sum the usage of several containers', async () => {
    vi.mocked(window.getContainerStatsSnapshot).mockImplementation(async (_engineId, containerId) =>
      containerId === 'c1' ? stats(100, 1_000, 500) : stats(200, 1_000, 250),
    );
    poller.setRefreshInterval(5);
    poller.subscribe('engine', 'c1');
    poller.subscribe('engine', 'c2');
    await vi.advanceTimersByTimeAsync(0);

    vi.mocked(window.getContainerStatsSnapshot).mockImplementation(async (_engineId, containerId) =>
      containerId === 'c1' ? stats(300, 3_000, 500) : stats(300, 3_000, 250),
    );
    await vi.advanceTimersByTimeAsync(5_000);

    expect(poller.getUsage(['c1', 'c2'])).toEqual({ cpuPercentage: 30, memoryUsage: 750 });
  });

  test('should ignore containers without a reading yet', async () => {
    vi.mocked(window.getContainerStatsSnapshot).mockResolvedValue(stats(100, 1_000, 500));
    poller.setRefreshInterval(5);
    poller.subscribe('engine', 'c1');
    await vi.advanceTimersByTimeAsync(0);

    expect(poller.getUsage(['c1', 'unknown'])).toEqual({ cpuPercentage: undefined, memoryUsage: 500 });
  });
});
