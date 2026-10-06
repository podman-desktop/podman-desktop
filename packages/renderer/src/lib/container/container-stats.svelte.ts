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
import { untrack } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

import { ContainerUtils } from './container-utils';
import type { ContainerGroupInfoUI, ContainerInfoUI } from './ContainerInfoUI';

export interface ContainerResourceUsage {
  cpuPercentage?: number;
  memoryUsage?: number;
}

// enough to read a hundred containers in a fraction of a second without flooding the engine with requests
export const MAX_CONCURRENT_READINGS = 4;

interface Subscription {
  engineId: string;
  count: number;
}

/**
 * Reads CPU and memory usage of the containers that are currently displayed.
 *
 * Readings are one-shot snapshots taken every refresh interval, as streamed statistics
 * come at a pace decided by the engine (every second for Docker, every 5 seconds for Podman).
 * The CPU usage is computed from the delta between two consecutive snapshots.
 */
export class ContainerStatsPoller {
  readonly #containerUtils = new ContainerUtils();
  readonly #usages = new SvelteMap<string, ContainerResourceUsage>();
  readonly #previousCpuStats = new SvelteMap<string, ContainerStatsInfo['cpu_stats']>();
  readonly #subscriptions = new SvelteMap<string, Subscription>();
  #refreshIntervalSeconds = 0;
  #timer: ReturnType<typeof setTimeout> | undefined;
  #readingsInProgress = 0;
  readonly #waitingReadings: (() => void)[] = [];

  subscribe(engineId: string, containerId: string): () => void {
    const subscription = this.#subscriptions.get(containerId);
    if (subscription) {
      subscription.count++;
    } else {
      this.#subscriptions.set(containerId, { engineId, count: 1 });
      if (this.#refreshIntervalSeconds > 0) {
        this.#read(containerId).catch(console.error);
      }
      this.#schedule();
    }

    let subscribed = true;
    return (): void => {
      if (subscribed) {
        subscribed = false;
        this.#unsubscribe(containerId);
      }
    };
  }

  setRefreshInterval(seconds: number): void {
    if (seconds === this.#refreshIntervalSeconds) {
      return;
    }
    const wasDisabled = this.#refreshIntervalSeconds <= 0;
    this.#refreshIntervalSeconds = seconds;
    this.#cancelTimer();

    if (seconds <= 0) {
      this.#usages.clear();
      this.#previousCpuStats.clear();
      return;
    }
    if (wasDisabled) {
      this.#readAll().catch(console.error);
    }
    this.#schedule();
  }

  // usage of the given containers added together, metrics without any reading stay undefined
  getUsage(containerIds: string[]): ContainerResourceUsage {
    const total: ContainerResourceUsage = {};
    for (const containerId of containerIds) {
      const usage = this.#usages.get(containerId);
      if (usage?.cpuPercentage !== undefined) {
        total.cpuPercentage = (total.cpuPercentage ?? 0) + usage.cpuPercentage;
      }
      if (usage?.memoryUsage !== undefined) {
        total.memoryUsage = (total.memoryUsage ?? 0) + usage.memoryUsage;
      }
    }
    return { cpuPercentage: total.cpuPercentage, memoryUsage: total.memoryUsage };
  }

  #unsubscribe(containerId: string): void {
    const subscription = this.#subscriptions.get(containerId);
    if (!subscription) {
      return;
    }
    subscription.count--;
    if (subscription.count > 0) {
      return;
    }
    this.#subscriptions.delete(containerId);
    this.#usages.delete(containerId);
    this.#previousCpuStats.delete(containerId);
    if (this.#subscriptions.size === 0) {
      this.#cancelTimer();
    }
  }

  #schedule(): void {
    if (this.#timer !== undefined || this.#refreshIntervalSeconds <= 0 || this.#subscriptions.size === 0) {
      return;
    }
    this.#timer = setTimeout(() => {
      this.#timer = undefined;
      this.#readAll()
        .catch(console.error)
        .finally(() => this.#schedule());
    }, this.#refreshIntervalSeconds * 1000);
  }

  #cancelTimer(): void {
    clearTimeout(this.#timer);
    this.#timer = undefined;
  }

  async #readAll(): Promise<void> {
    await Promise.all(Array.from(this.#subscriptions.keys()).map(containerId => this.#read(containerId)));
  }

  async #read(containerId: string): Promise<void> {
    let stats: ContainerStatsInfo | undefined;
    try {
      stats = await this.#withReadingSlot(async () => {
        // the container may have left the list or statistics been disabled while waiting for a slot
        const subscription = this.#subscriptions.get(containerId);
        if (!subscription || this.#refreshIntervalSeconds <= 0) {
          return undefined;
        }
        return window.getContainerStatsSnapshot(subscription.engineId, containerId);
      });
    } catch (error: unknown) {
      // the container may have stopped since the last refresh of the list
      console.debug(`Unable to read statistics of container ${containerId}`, error);
      return;
    }
    if (!stats) {
      return;
    }
    // the container may have left the list or statistics been disabled while reading
    if (!this.#subscriptions.has(containerId) || this.#refreshIntervalSeconds <= 0) {
      return;
    }

    const previousCpuStats = this.#previousCpuStats.get(containerId);
    this.#previousCpuStats.set(containerId, stats.cpu_stats);
    this.#usages.set(containerId, {
      cpuPercentage: previousCpuStats
        ? this.#containerUtils.getCpuUsagePercentage(stats.cpu_stats, previousCpuStats)
        : undefined,
      memoryUsage: this.#containerUtils.getUsedMemory(stats.memory_stats),
    });
  }

  // runs the reading once fewer than MAX_CONCURRENT_READINGS are in progress
  async #withReadingSlot<T>(reading: () => Promise<T>): Promise<T> {
    if (this.#readingsInProgress < MAX_CONCURRENT_READINGS) {
      this.#readingsInProgress++;
    } else {
      // the slot is handed over by the reading that completes
      await new Promise<void>(resolve => this.#waitingReadings.push(resolve));
    }
    try {
      return await reading();
    } finally {
      const next = this.#waitingReadings.shift();
      if (next) {
        next();
      } else {
        this.#readingsInProgress--;
      }
    }
  }
}

export const containerStatsPoller = new ContainerStatsPoller();

export function getRunningContainers(object: ContainerInfoUI | ContainerGroupInfoUI): ContainerInfoUI[] {
  const containers = 'containers' in object ? object.containers : [object];
  return containers.filter(container => container.state === 'RUNNING');
}

/**
 * Keeps the running containers of a row subscribed to the poller while the calling component is mounted,
 * and gives their usage added together. Must be called while the component is being initialised.
 */
export function trackContainerUsage(getObject: () => ContainerInfoUI | ContainerGroupInfoUI): {
  readonly running: boolean;
  readonly current: ContainerResourceUsage;
} {
  const runningContainers = $derived(getRunningContainers(getObject()));
  // rows are rebuilt on every refresh of the list: only subscribe again when the running containers change
  const subscriptionKey = $derived(runningContainers.map(container => `${container.engineId}/${container.id}`).join());
  const usage = $derived(containerStatsPoller.getUsage(runningContainers.map(container => container.id)));

  $effect(() => {
    if (!subscriptionKey) {
      return;
    }
    const unsubscribes = untrack(() =>
      runningContainers.map(container => containerStatsPoller.subscribe(container.engineId, container.id)),
    );
    return (): void => unsubscribes.forEach(unsubscribe => unsubscribe());
  });

  return {
    get running(): boolean {
      return subscriptionKey !== '';
    },
    get current(): ContainerResourceUsage {
      return usage;
    },
  };
}
