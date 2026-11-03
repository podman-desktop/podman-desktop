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

import { PassThrough } from 'node:stream';

import type { ContainerUsageInfo, SimpleContainerInfo } from '@desktop-framework/api';
import type { ApiSenderType } from '@desktop-framework/api/api-sender';
import type { IConfigurationChangeEvent, IConfigurationNode } from '@desktop-framework/api/configuration';
import type { ContainerJSONEvent } from '@desktop-framework/extension-api';
import type { ContainerStats } from 'dockerode';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import type { IPCHandle } from '/@/plugin/api.js';
import type { ConfigurationRegistry } from '/@/plugin/configuration-registry.js';
import type { ContainerProviderRegistry } from '/@/plugin/container-registry.js';
import { ContainerStatsService } from '/@/plugin/container-stats-service.js';
import type { PodmanContainersStatsReport } from '/@/plugin/dockerode/libpod-dockerode.js';

const REFRESH_INTERVAL_KEY = 'containers.statsRefreshInterval';

let refreshInterval: number;
const configurationRegistry = {
  registerConfigurations: vi.fn(),
  onDidChangeConfiguration: vi.fn(),
  getConfiguration: vi.fn(),
} as unknown as ConfigurationRegistry;

const apiSender = {
  send: vi.fn(),
} as unknown as ApiSenderType;

const ipcHandle = vi.fn() as unknown as IPCHandle;

const containerRegistry = {
  listSimpleContainers: vi.fn(),
  getAllContainersStatsStream: vi.fn(),
  getContainerStatsStream: vi.fn(),
  onEvent: vi.fn(),
  onApiAttached: vi.fn(),
} as unknown as ContainerProviderRegistry;

let service: ContainerStatsService;
// streams handed to the service, by engine id for Podman engines and by container id for Docker containers
let streams: Map<string, PassThrough>;

function container(
  engineId: string,
  engineType: 'podman' | 'docker',
  id: string,
  State = 'running',
): SimpleContainerInfo {
  return { engineId, engineType, Id: id, State } as unknown as SimpleContainerInfo;
}

function podmanReport(...stats: { id: string; cpu: number; memory: number }[]): PodmanContainersStatsReport {
  return {
    Error: undefined,
    Stats: stats.map(({ id, cpu, memory }) => ({ ContainerID: id, CPU: cpu, MemUsage: memory, MemLimit: 1000 })),
  };
}

// a reading as streamed by Docker, CPU counters are cumulative nanoseconds
function dockerStats(totalUsage: number, systemUsage: number, previous?: [number, number]): ContainerStats {
  return {
    cpu_stats: { cpu_usage: { total_usage: totalUsage }, system_cpu_usage: systemUsage, online_cpus: 4 },
    precpu_stats: previous
      ? { cpu_usage: { total_usage: previous[0] }, system_cpu_usage: previous[1], online_cpus: 4 }
      : { cpu_usage: { total_usage: 0 } },
    memory_stats: { usage: 1000, stats: { inactive_file: 300 } },
  } as unknown as ContainerStats;
}

function write(key: string, value: unknown): void {
  const stream = streams.get(key);
  if (!stream) {
    throw new Error(`no stream ${key}`);
  }
  stream.write(`${JSON.stringify(value)}\n`);
}

function getIpcHandler(channel: string): () => Promise<unknown> {
  // the last service created registered the last handler
  const call = vi.mocked(ipcHandle).mock.calls.findLast(([name]) => name === channel);
  if (!call) {
    throw new Error(`no handler for ${channel}`);
  }
  return call[1] as () => Promise<unknown>;
}

async function subscribe(): Promise<unknown> {
  return getIpcHandler('container-stats:subscribe')();
}

async function unsubscribe(): Promise<unknown> {
  return getIpcHandler('container-stats:unsubscribe')();
}

function changeRefreshInterval(value: number): void {
  const listener = vi.mocked(configurationRegistry.onDidChangeConfiguration).mock.calls.at(-1)?.[0];
  listener?.({ key: REFRESH_INTERVAL_KEY, value } as IConfigurationChangeEvent);
}

function lastUpdate(): ContainerUsageInfo[] | undefined {
  const calls = vi.mocked(apiSender.send).mock.calls.filter(([channel]) => channel === 'container-stats:update');
  return calls.at(-1)?.[1] as ContainerUsageInfo[] | undefined;
}

function updateCount(): number {
  return vi.mocked(apiSender.send).mock.calls.filter(([channel]) => channel === 'container-stats:update').length;
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
  refreshInterval = 5;
  streams = new Map();
  vi.mocked(configurationRegistry.getConfiguration).mockReturnValue({
    get: vi.fn(() => refreshInterval),
  } as unknown as ReturnType<ConfigurationRegistry['getConfiguration']>);
  vi.mocked(configurationRegistry.registerConfigurations).mockReturnValue({ dispose: vi.fn() });
  vi.mocked(configurationRegistry.onDidChangeConfiguration).mockReturnValue({ dispose: vi.fn() });
  vi.mocked(containerRegistry.onEvent).mockReturnValue({ dispose: vi.fn() });
  vi.mocked(containerRegistry.onApiAttached).mockReturnValue({ dispose: vi.fn() });
  vi.mocked(containerRegistry.listSimpleContainers).mockResolvedValue([]);
  vi.mocked(containerRegistry.getAllContainersStatsStream).mockImplementation(async engineId => {
    const stream = new PassThrough();
    streams.set(engineId, stream);
    return stream;
  });
  vi.mocked(containerRegistry.getContainerStatsStream).mockImplementation(async (_engineId, containerId) => {
    const stream = new PassThrough();
    streams.set(containerId, stream);
    return stream;
  });

  service = new ContainerStatsService(containerRegistry, configurationRegistry, apiSender, ipcHandle);
  service.init();
});

afterEach(() => {
  service.dispose();
  vi.useRealTimers();
});

test('registers the refresh interval setting', () => {
  const nodes = vi.mocked(configurationRegistry.registerConfigurations).mock.calls[0]?.[0] as IConfigurationNode[];
  expect(nodes[0]?.properties?.[REFRESH_INTERVAL_KEY]).toEqual(
    expect.objectContaining({ type: 'integer', default: 5, minimum: 0 }),
  );
});

test('does not read anything until something subscribes', async () => {
  await vi.advanceTimersByTimeAsync(60_000);

  expect(containerRegistry.listSimpleContainers).not.toHaveBeenCalled();
  expect(apiSender.send).not.toHaveBeenCalled();
});

describe('Podman engines', () => {
  beforeEach(() => {
    vi.mocked(containerRegistry.listSimpleContainers).mockResolvedValue([
      container('podman1', 'podman', 'a'),
      container('podman1', 'podman', 'b'),
      container('podman2', 'podman', 'c', 'exited'),
    ]);
  });

  test('opens a single stream per engine at the refresh interval', async () => {
    await subscribe();

    await vi.waitFor(() => expect(streams.size).toBe(2));
    expect(containerRegistry.getAllContainersStatsStream).toHaveBeenCalledWith('podman1', 5);
    expect(containerRegistry.getAllContainersStatsStream).toHaveBeenCalledWith('podman2', 5);
    expect(containerRegistry.getContainerStatsStream).not.toHaveBeenCalled();
  });

  test('sends the readings of all containers in one update', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));

    write('podman1', podmanReport({ id: 'a', cpu: 12.5, memory: 100 }, { id: 'b', cpu: 0, memory: 200 }));

    await vi.waitFor(() => expect(updateCount()).toBe(1));
    expect(lastUpdate()).toEqual([
      { engineId: 'podman1', containerId: 'a', cpuPercentage: 12.5, memoryUsage: 100 },
      { engineId: 'podman1', containerId: 'b', cpuPercentage: 0, memoryUsage: 200 },
    ]);
  });

  test('a new reading of an engine replaces the previous one', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));
    write('podman1', podmanReport({ id: 'a', cpu: 1, memory: 100 }, { id: 'b', cpu: 2, memory: 200 }));
    await vi.waitFor(() => expect(updateCount()).toBe(1));

    // b has stopped
    write('podman1', podmanReport({ id: 'a', cpu: 3, memory: 300 }));
    await vi.advanceTimersByTimeAsync(5_000);

    expect(lastUpdate()).toEqual([{ engineId: 'podman1', containerId: 'a', cpuPercentage: 3, memoryUsage: 300 }]);
  });

  test('keeps the previous readings when a report has no statistics', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));
    write('podman1', podmanReport({ id: 'a', cpu: 1, memory: 100 }));
    await vi.waitFor(() => expect(updateCount()).toBe(1));

    write('podman1', { Error: { message: 'container stopped while reading' }, Stats: null });
    await vi.advanceTimersByTimeAsync(5_000);

    expect(lastUpdate()).toEqual([{ engineId: 'podman1', containerId: 'a', cpuPercentage: 1, memoryUsage: 100 }]);
  });

  test('drops the readings when no container is running anymore', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));
    write('podman1', podmanReport({ id: 'a', cpu: 1, memory: 100 }));
    await vi.waitFor(() => expect(updateCount()).toBe(1));

    write('podman1', { Error: null, Stats: null });
    await vi.advanceTimersByTimeAsync(5_000);

    expect(lastUpdate()).toEqual([]);
  });

  test('drops the readings of an engine when its stream ends', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));
    write('podman1', podmanReport({ id: 'a', cpu: 1, memory: 100 }));
    write('podman2', podmanReport({ id: 'c', cpu: 2, memory: 200 }));
    await vi.waitFor(() => expect(lastUpdate()).toHaveLength(2));

    streams.get('podman1')?.end();
    await vi.advanceTimersByTimeAsync(5_000);

    expect(lastUpdate()).toEqual([{ engineId: 'podman2', containerId: 'c', cpuPercentage: 2, memoryUsage: 200 }]);
  });

  test('opens the stream again after it ended unexpectedly', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));

    streams.get('podman1')?.end();
    await vi.advanceTimersByTimeAsync(5_000);

    expect(containerRegistry.getAllContainersStatsStream).toHaveBeenCalledTimes(3);
  });

  test('drops the readings of an engine and opens its stream again when the connection fails', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));
    write('podman1', podmanReport({ id: 'a', cpu: 1, memory: 100 }));
    write('podman2', podmanReport({ id: 'c', cpu: 2, memory: 200 }));
    await vi.waitFor(() => expect(lastUpdate()).toHaveLength(2));
    vi.spyOn(console, 'debug').mockImplementation(() => {});

    streams.get('podman1')?.destroy(new Error('socket hang up'));
    await vi.advanceTimersByTimeAsync(5_000);

    expect(lastUpdate()).toEqual([{ engineId: 'podman2', containerId: 'c', cpuPercentage: 2, memoryUsage: 200 }]);
    expect(containerRegistry.getAllContainersStatsStream).toHaveBeenCalledTimes(3);
  });

  test('opens the streams again when the refresh interval changes', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));
    const previousStream = streams.get('podman1');

    changeRefreshInterval(2);

    await vi.waitFor(() => expect(containerRegistry.getAllContainersStatsStream).toHaveBeenCalledWith('podman1', 2));
    expect(previousStream?.destroyed).toBe(true);
  });
});

describe('Docker engines', () => {
  beforeEach(() => {
    vi.mocked(containerRegistry.listSimpleContainers).mockResolvedValue([
      container('docker1', 'docker', 'a'),
      container('docker1', 'docker', 'b'),
      container('docker1', 'docker', 'c', 'exited'),
    ]);
  });

  test('opens a stream per running container', async () => {
    await subscribe();

    await vi.waitFor(() => expect(streams.size).toBe(2));
    expect(containerRegistry.getContainerStatsStream).toHaveBeenCalledWith('docker1', 'a');
    expect(containerRegistry.getContainerStatsStream).toHaveBeenCalledWith('docker1', 'b');
    expect(containerRegistry.getAllContainersStatsStream).not.toHaveBeenCalled();
  });

  test('computes the memory used without the inactive page cache', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));

    write('a', dockerStats(1_000, 10_000));

    await vi.waitFor(() => expect(lastUpdate()).toHaveLength(1));
    expect(lastUpdate()?.[0]).toEqual(expect.objectContaining({ containerId: 'a', memoryUsage: 700 }));
  });

  test('has no CPU usage until two readings are available', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));

    write('a', dockerStats(1_000, 10_000));

    await vi.waitFor(() => expect(lastUpdate()).toHaveLength(1));
    expect(lastUpdate()?.[0]?.cpuPercentage).toBeUndefined();
  });

  test('computes the CPU usage over the whole refresh interval', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));
    write('a', dockerStats(1_000, 10_000));
    await vi.waitFor(() => expect(updateCount()).toBe(1));

    // Docker streams every second, the last reading only covers the last second
    write('a', dockerStats(2_000, 20_000, [1_000, 10_000]));
    write('a', dockerStats(5_000, 30_000, [2_000, 20_000]));
    await vi.advanceTimersByTimeAsync(5_000);

    // 4 000 ns of CPU over 20 000 ns on 4 CPUs
    expect(lastUpdate()?.[0]?.cpuPercentage).toBe(80);
  });

  test('keeps the CPU usage when no new reading arrived since the last update', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));
    write('a', dockerStats(1_000, 10_000));
    await vi.waitFor(() => expect(updateCount()).toBe(1));
    write('a', dockerStats(2_000, 20_000, [1_000, 10_000]));
    await vi.advanceTimersByTimeAsync(5_000);
    expect(lastUpdate()?.[0]?.cpuPercentage).toBe(40);

    write('b', dockerStats(1_000, 10_000));
    await vi.advanceTimersByTimeAsync(5_000);

    expect(lastUpdate()?.find(usage => usage.containerId === 'a')?.cpuPercentage).toBe(40);
  });

  test('drops the readings of a container when its stream ends', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));
    write('a', dockerStats(1_000, 10_000));
    write('b', dockerStats(1_000, 10_000));
    await vi.waitFor(() => expect(lastUpdate()).toHaveLength(2));

    streams.get('a')?.end();
    await vi.advanceTimersByTimeAsync(5_000);

    expect(lastUpdate()?.map(usage => usage.containerId)).toEqual(['b']);
  });

  test('opens a stream for a container started later', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(2));
    vi.mocked(containerRegistry.listSimpleContainers).mockResolvedValue([
      container('docker1', 'docker', 'a'),
      container('docker1', 'docker', 'b'),
      container('docker1', 'docker', 'c'),
    ]);

    const onEvent = vi.mocked(containerRegistry.onEvent).mock.calls[0]?.[0];
    onEvent?.({ Type: 'container', status: 'start', id: 'c' } as ContainerJSONEvent);
    await vi.advanceTimersByTimeAsync(1_000);

    expect(containerRegistry.getContainerStatsStream).toHaveBeenCalledWith('docker1', 'c');
    expect(containerRegistry.getContainerStatsStream).toHaveBeenCalledTimes(3);
  });
});

describe('updates', () => {
  beforeEach(() => {
    vi.mocked(containerRegistry.listSimpleContainers).mockResolvedValue([container('podman1', 'podman', 'a')]);
  });

  test('are sent at most once per refresh interval', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(1));
    write('podman1', podmanReport({ id: 'a', cpu: 1, memory: 100 }));
    await vi.waitFor(() => expect(updateCount()).toBe(1));

    write('podman1', podmanReport({ id: 'a', cpu: 2, memory: 100 }));
    await vi.advanceTimersByTimeAsync(4_000);
    expect(updateCount()).toBe(1);

    await vi.advanceTimersByTimeAsync(1_000);
    expect(updateCount()).toBe(2);
    expect(lastUpdate()?.[0]?.cpuPercentage).toBe(2);
  });

  test('are not sent when nothing has been read', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(1));

    await vi.advanceTimersByTimeAsync(30_000);

    expect(updateCount()).toBe(0);
  });
});

describe('subscriptions', () => {
  beforeEach(() => {
    vi.mocked(containerRegistry.listSimpleContainers).mockResolvedValue([container('podman1', 'podman', 'a')]);
  });

  test('a new subscriber gets the latest readings', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(1));
    write('podman1', podmanReport({ id: 'a', cpu: 1, memory: 100 }));
    await vi.waitFor(() => expect(updateCount()).toBe(1));

    await expect(subscribe()).resolves.toEqual([
      { engineId: 'podman1', containerId: 'a', cpuPercentage: 1, memoryUsage: 100 },
    ]);
  });

  test('share the same streams', async () => {
    await subscribe();
    await subscribe();
    await vi.advanceTimersByTimeAsync(1_000);

    expect(containerRegistry.getAllContainersStatsStream).toHaveBeenCalledOnce();
  });

  test('keep reading until the last subscriber leaves', async () => {
    await subscribe();
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(1));

    await unsubscribe();
    expect(streams.get('podman1')?.destroyed).toBe(false);

    await unsubscribe();
    expect(streams.get('podman1')?.destroyed).toBe(true);
  });

  test('readings still arriving after the last subscriber left are ignored', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(1));
    // data already buffered can still be delivered after the stream is destroyed
    vi.spyOn(streams.get('podman1') as PassThrough, 'destroy').mockReturnThis();

    await unsubscribe();
    write('podman1', podmanReport({ id: 'a', cpu: 1, memory: 100 }));
    await vi.advanceTimersByTimeAsync(10_000);

    expect(updateCount()).toBe(0);
  });

  test('a stream opened after the last subscriber left is closed right away', async () => {
    let resolveStream: (stream: PassThrough) => void = () => {};
    vi.mocked(containerRegistry.getAllContainersStatsStream).mockReturnValue(
      new Promise(resolve => (resolveStream = resolve)),
    );
    await subscribe();
    await vi.waitFor(() => expect(containerRegistry.getAllContainersStatsStream).toHaveBeenCalled());

    await unsubscribe();
    const stream = new PassThrough();
    resolveStream(stream);

    await vi.waitFor(() => expect(stream.destroyed).toBe(true));
  });
});

describe('refresh interval set to 0', () => {
  beforeEach(() => {
    vi.mocked(containerRegistry.listSimpleContainers).mockResolvedValue([container('podman1', 'podman', 'a')]);
  });

  test('nothing is read', async () => {
    refreshInterval = 0;
    service.dispose();
    service = new ContainerStatsService(containerRegistry, configurationRegistry, apiSender, ipcHandle);
    service.init();

    await subscribe();
    await vi.advanceTimersByTimeAsync(10_000);

    expect(containerRegistry.listSimpleContainers).not.toHaveBeenCalled();
  });

  test('stops reading and clears the readings', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(1));
    write('podman1', podmanReport({ id: 'a', cpu: 1, memory: 100 }));
    await vi.waitFor(() => expect(updateCount()).toBe(1));

    changeRefreshInterval(0);

    expect(streams.get('podman1')?.destroyed).toBe(true);
    expect(lastUpdate()).toEqual([]);
  });

  test('starts reading again when set back', async () => {
    await subscribe();
    await vi.waitFor(() => expect(streams.size).toBe(1));
    changeRefreshInterval(0);

    changeRefreshInterval(3);

    await vi.waitFor(() => expect(containerRegistry.getAllContainersStatsStream).toHaveBeenCalledWith('podman1', 3));
  });
});

test('an engine attached later is read', async () => {
  await subscribe();
  await vi.advanceTimersByTimeAsync(1_000);
  vi.mocked(containerRegistry.listSimpleContainers).mockResolvedValue([container('podman1', 'podman', 'a')]);

  vi.mocked(containerRegistry.onApiAttached).mock.calls[0]?.[0]('podman1');
  await vi.advanceTimersByTimeAsync(1_000);

  expect(containerRegistry.getAllContainersStatsStream).toHaveBeenCalledWith('podman1', 5);
});

test('a stream that cannot be opened does not prevent reading the others', async () => {
  vi.mocked(containerRegistry.listSimpleContainers).mockResolvedValue([
    container('docker1', 'docker', 'a'),
    container('docker1', 'docker', 'b'),
  ]);
  vi.mocked(containerRegistry.getContainerStatsStream).mockRejectedValueOnce(new Error('no such container'));
  vi.spyOn(console, 'debug').mockImplementation(() => {});

  await subscribe();

  await vi.waitFor(() => expect(streams.size).toBe(1));
  write('b', dockerStats(1_000, 10_000));
  await vi.waitFor(() => expect(lastUpdate()?.map(usage => usage.containerId)).toEqual(['b']));
});

test('a stream that cannot be opened is tried again later', async () => {
  vi.mocked(containerRegistry.listSimpleContainers).mockResolvedValue([container('podman1', 'podman', 'a')]);
  vi.mocked(containerRegistry.getAllContainersStatsStream).mockRejectedValueOnce(new Error('connection refused'));
  vi.spyOn(console, 'debug').mockImplementation(() => {});

  await subscribe();
  await vi.advanceTimersByTimeAsync(5_000);

  expect(containerRegistry.getAllContainersStatsStream).toHaveBeenCalledTimes(2);
  expect(streams.has('podman1')).toBe(true);
});

test('dispose closes the streams', async () => {
  vi.mocked(containerRegistry.listSimpleContainers).mockResolvedValue([container('podman1', 'podman', 'a')]);
  await subscribe();
  await vi.waitFor(() => expect(streams.size).toBe(1));

  service.dispose();

  expect(streams.get('podman1')?.destroyed).toBe(true);
});
