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

import type { Readable } from 'node:stream';

import type { ContainerUsageInfo, IDisposable } from '@desktop-framework/api';
import { ContainerStatsSettings, DEFAULT_CONTAINER_STATS_REFRESH_INTERVAL } from '@desktop-framework/api';
import { ApiSenderType } from '@desktop-framework/api/api-sender';
import { type IConfigurationNode, IConfigurationRegistry } from '@desktop-framework/api/configuration';
import type { ContainerStats, CPUStats, MemoryStats } from 'dockerode';
import { inject, injectable, postConstruct, preDestroy } from 'inversify';
import streamValues from 'stream-json/streamers/stream-values.js';

import { IPCHandle } from '/@/plugin/api.js';
import { ContainerProviderRegistry } from '/@/plugin/container-registry.js';
import type { PodmanContainersStatsReport } from '/@/plugin/dockerode/libpod-dockerode.js';

const REFRESH_INTERVAL_KEY = `${ContainerStatsSettings.SectionName}.${ContainerStatsSettings.RefreshInterval}`;

// gathers the events of containers started together before listing the containers again
const RESYNC_DELAY = 500;
// delay before opening again a stream that ended while its container or engine may still be running
const RETRY_DELAY = 5_000;

// Docker streams a reading every second, the CPU usage is computed from the readings of two updates
interface DockerReading {
  usage: ContainerUsageInfo;
  latestCpuStats: CPUStats;
  cpuStatsAtLastUpdate: CPUStats;
}

// percentage of one CPU used between two readings, as computed by `docker stats`
function getCpuPercentage(current: CPUStats, previous: CPUStats): number | undefined {
  const cpuDelta = current.cpu_usage.total_usage - previous.cpu_usage.total_usage;
  const systemDelta = current.system_cpu_usage - previous.system_cpu_usage;
  if (!previous.system_cpu_usage || systemDelta <= 0 || cpuDelta < 0) {
    return undefined;
  }
  const cpus = current.online_cpus || current.cpu_usage.percpu_usage?.length || 1;
  return (cpuDelta / systemDelta) * cpus * 100;
}

// memory used without the inactive page cache, as computed by `docker stats` for cgroup v1 and v2
function getMemoryUsage(memoryStats: MemoryStats): number {
  const stats: Partial<MemoryStats['stats']> = memoryStats.stats ?? {};
  const inactiveFile = stats.total_inactive_file ?? stats.inactive_file ?? 0;
  return inactiveFile < memoryStats.usage ? memoryStats.usage - inactiveFile : memoryStats.usage;
}

/**
 * Reads the CPU and memory usage of the running containers while the renderer is subscribed,
 * and sends them all in a single `container-stats:update` event at most once per refresh interval.
 *
 * Podman engines stream the statistics of all their containers at the refresh interval,
 * Docker engines stream the statistics of each container every second.
 */
@injectable()
export class ContainerStatsService implements IDisposable {
  #disposables: IDisposable[] = [];
  #subscribers = 0;
  #refreshInterval = DEFAULT_CONTAINER_STATS_REFRESH_INTERVAL;
  // incremented when reading stops, to discard the streams opened in the meantime
  #generation = 0;
  // streams being read by engine id for Podman, by `engineId/containerId` for Docker, undefined while opening
  #streams = new Map<string, Readable | undefined>();
  #podmanUsages = new Map<string, ContainerUsageInfo[]>();
  #dockerReadings = new Map<string, DockerReading>();
  #lastUpdate = 0;
  #updateTimeout: NodeJS.Timeout | undefined;
  #resyncTimeout: NodeJS.Timeout | undefined;

  constructor(
    @inject(ContainerProviderRegistry)
    private readonly containerRegistry: ContainerProviderRegistry,
    @inject(IConfigurationRegistry)
    private readonly configurationRegistry: IConfigurationRegistry,
    @inject(ApiSenderType)
    private readonly apiSender: ApiSenderType,
    @inject(IPCHandle)
    private readonly ipcHandle: IPCHandle,
  ) {}

  @postConstruct()
  init(): void {
    const containerStatsConfiguration: IConfigurationNode = {
      id: 'preferences.containers',
      title: 'Containers',
      type: 'object',
      properties: {
        [REFRESH_INTERVAL_KEY]: {
          description:
            'Interval in seconds between CPU and memory readings in the container list. Set to 0 to disable.',
          type: 'integer',
          default: DEFAULT_CONTAINER_STATS_REFRESH_INTERVAL,
          minimum: 0,
          maximum: 60,
        },
      },
    };
    this.#disposables.push(this.configurationRegistry.registerConfigurations([containerStatsConfiguration]));

    this.#refreshInterval = this.configurationRegistry
      .getConfiguration(ContainerStatsSettings.SectionName)
      .get<number>(ContainerStatsSettings.RefreshInterval, DEFAULT_CONTAINER_STATS_REFRESH_INTERVAL);
    this.#disposables.push(
      this.configurationRegistry.onDidChangeConfiguration(event => {
        if (event.key === REFRESH_INTERVAL_KEY) {
          this.setRefreshInterval(
            typeof event.value === 'number' ? event.value : DEFAULT_CONTAINER_STATS_REFRESH_INTERVAL,
          );
        }
      }),
    );

    // Podman streams include the containers started later, but not the engines that had no container yet
    this.#disposables.push(
      this.containerRegistry.onEvent(event => {
        if (event.Type === 'container' && event.status === 'start') {
          this.#scheduleResync(RESYNC_DELAY);
        }
      }),
    );
    this.#disposables.push(this.containerRegistry.onApiAttached(() => this.#scheduleResync(RESYNC_DELAY)));

    this.ipcHandle('container-stats:subscribe', async (): Promise<ContainerUsageInfo[]> => {
      return this.subscribe();
    });
    this.ipcHandle('container-stats:unsubscribe', async (): Promise<void> => {
      this.unsubscribe();
    });
  }

  @preDestroy()
  dispose(): void {
    this.#stop();
    this.#disposables.forEach(disposable => disposable.dispose());
    this.#disposables = [];
  }

  // starts reading when this is the first subscriber, and gives the latest readings
  subscribe(): ContainerUsageInfo[] {
    this.#subscribers++;
    if (this.#subscribers === 1) {
      this.#scheduleResync(0);
    }
    return this.#getUsages();
  }

  // stops reading when this was the last subscriber
  unsubscribe(): void {
    if (this.#subscribers === 0) {
      return;
    }
    this.#subscribers--;
    if (this.#subscribers === 0) {
      this.#stop();
    }
  }

  setRefreshInterval(seconds: number): void {
    seconds = Math.max(0, Math.round(seconds));
    if (seconds === this.#refreshInterval) {
      return;
    }
    const wasReading = this.#isReading();
    this.#refreshInterval = seconds;
    if (!wasReading) {
      this.#scheduleResync(0);
      return;
    }
    // Podman streams are read at the refresh interval: open them again with the new one
    this.#stop();
    if (this.#isReading()) {
      this.#scheduleResync(0);
    } else {
      this.apiSender.send('container-stats:update', []);
    }
  }

  #isReading(): boolean {
    return this.#subscribers > 0 && this.#refreshInterval > 0;
  }

  #stop(): void {
    this.#generation++;
    for (const stream of this.#streams.values()) {
      stream?.destroy();
    }
    this.#streams.clear();
    this.#podmanUsages.clear();
    this.#dockerReadings.clear();
    clearTimeout(this.#updateTimeout);
    this.#updateTimeout = undefined;
    clearTimeout(this.#resyncTimeout);
    this.#resyncTimeout = undefined;
    this.#lastUpdate = 0;
  }

  #scheduleResync(delay: number): void {
    if (!this.#isReading() || this.#resyncTimeout) {
      return;
    }
    this.#resyncTimeout = setTimeout(() => {
      this.#resyncTimeout = undefined;
      this.#resync().catch((error: unknown) => console.error('Unable to read the statistics of the containers', error));
    }, delay);
  }

  // opens the streams of the engines and containers that are not read yet
  async #resync(): Promise<void> {
    const generation = this.#generation;
    const containers = await this.containerRegistry.listSimpleContainers();
    if (generation !== this.#generation) {
      return;
    }
    for (const container of containers) {
      if (container.engineType === 'podman') {
        this.#readPodmanEngine(container.engineId);
      } else if (container.State === 'running') {
        this.#readDockerContainer(container.engineId, container.Id);
      }
    }
  }

  #readPodmanEngine(engineId: string): void {
    this.#read(
      engineId,
      () => this.containerRegistry.getAllContainersStatsStream(engineId, this.#refreshInterval),
      (report: PodmanContainersStatsReport) => {
        // keep the previous readings for this time, Stats is also null when no container is running
        if (report.Error && !report.Stats) {
          return;
        }
        this.#podmanUsages.set(
          engineId,
          (report.Stats ?? []).map(stats => ({
            engineId,
            containerId: stats.ContainerID,
            cpuPercentage: stats.CPU,
            memoryUsage: stats.MemUsage,
          })),
        );
      },
      () => this.#podmanUsages.delete(engineId),
    );
  }

  #readDockerContainer(engineId: string, containerId: string): void {
    const key = `${engineId}/${containerId}`;
    this.#read(
      key,
      () => this.containerRegistry.getContainerStatsStream(engineId, containerId),
      (stats: ContainerStats) => {
        const reading = this.#dockerReadings.get(key);
        if (reading) {
          reading.latestCpuStats = stats.cpu_stats;
          reading.usage.memoryUsage = getMemoryUsage(stats.memory_stats);
        } else {
          this.#dockerReadings.set(key, {
            usage: { engineId, containerId, memoryUsage: getMemoryUsage(stats.memory_stats) },
            latestCpuStats: stats.cpu_stats,
            // the first reading of a stream comes with the CPU counters of the reading before it, if any
            cpuStatsAtLastUpdate: stats.precpu_stats,
          });
        }
      },
      () => this.#dockerReadings.delete(key),
    );
  }

  #read<T>(key: string, open: () => Promise<Readable>, onReading: (value: T) => void, onEnd: () => void): void {
    if (this.#streams.has(key)) {
      return;
    }
    this.#streams.set(key, undefined);
    const generation = this.#generation;

    open()
      .then(stream => {
        if (generation !== this.#generation) {
          stream.destroy();
          return;
        }
        this.#streams.set(key, stream);

        const end = (): void => {
          // ignore the streams closed by #stop
          if (this.#streams.get(key) !== stream) {
            return;
          }
          this.#streams.delete(key);
          onEnd();
          this.#scheduleUpdate();
          // the stream may have ended while its engine is still running: try again later
          this.#scheduleResync(RETRY_DELAY);
        };
        const pipeline = stream.pipe(streamValues.withParserAsStream());
        pipeline.on('data', (data: { value: T }) => {
          onReading(data.value);
          this.#scheduleUpdate();
        });
        pipeline.on('error', (error: unknown) => {
          console.debug(`Error while reading the statistics of ${key}`, error);
          stream.destroy();
          end();
        });
        stream.on('close', end);
      })
      .catch((error: unknown) => {
        console.debug(`Unable to read the statistics of ${key}`, error);
        if (generation === this.#generation) {
          this.#streams.delete(key);
        }
      });
  }

  // sends an update as soon as possible, but not more than once per refresh interval
  #scheduleUpdate(): void {
    if (this.#updateTimeout) {
      return;
    }
    const delay = Math.max(0, this.#lastUpdate + this.#refreshInterval * 1000 - Date.now());
    this.#updateTimeout = setTimeout(() => {
      this.#updateTimeout = undefined;
      this.#lastUpdate = Date.now();
      for (const reading of this.#dockerReadings.values()) {
        // keep the previous CPU usage when there was no new reading since the last update
        if (reading.latestCpuStats !== reading.cpuStatsAtLastUpdate) {
          reading.usage.cpuPercentage =
            getCpuPercentage(reading.latestCpuStats, reading.cpuStatsAtLastUpdate) ?? reading.usage.cpuPercentage;
          reading.cpuStatsAtLastUpdate = reading.latestCpuStats;
        }
      }
      this.apiSender.send('container-stats:update', this.#getUsages());
    }, delay);
  }

  #getUsages(): ContainerUsageInfo[] {
    return [
      ...Array.from(this.#podmanUsages.values()).flat(),
      ...Array.from(this.#dockerReadings.values(), reading => ({ ...reading.usage })),
    ];
  }
}
