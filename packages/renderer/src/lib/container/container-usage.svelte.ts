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

import type { ContainerUsageInfo, IDisposable } from '@desktop-framework/api';
import { SvelteMap } from 'svelte/reactivity';

import type { ContainerGroupInfoUI, ContainerInfoUI } from './ContainerInfoUI';

export interface ContainerResourceUsage {
  cpuPercentage?: number;
  memoryUsage?: number;
}

/**
 * Latest CPU and memory usage of the running containers, pushed by the main process
 * while at least one component is subscribed.
 */
export class ContainerUsages {
  readonly #usages = new SvelteMap<string, ContainerUsageInfo>();
  #subscribers = 0;
  #updates: IDisposable | undefined;

  // returns the function to call when the subscriber does not need the usages anymore
  subscribe(): () => void {
    this.#subscribers++;
    if (this.#subscribers === 1) {
      this.#start();
    }
    let subscribed = true;
    return (): void => {
      if (subscribed) {
        subscribed = false;
        this.#subscribers--;
        if (this.#subscribers === 0) {
          this.#stop();
        }
      }
    };
  }

  // usage of the given containers added together, metrics without any reading stay undefined
  getUsage(containerIds: string[]): ContainerResourceUsage {
    const total: ContainerResourceUsage = {};
    for (const containerId of containerIds) {
      const usage = this.#usages.get(containerId);
      if (usage?.cpuPercentage !== undefined) {
        total.cpuPercentage = (total.cpuPercentage ?? 0) + usage.cpuPercentage;
      }
      if (usage !== undefined) {
        total.memoryUsage = (total.memoryUsage ?? 0) + usage.memoryUsage;
      }
    }
    return total;
  }

  #start(): void {
    this.#updates = window.events?.receive('container-stats:update', usages => this.#set(usages));
    window
      .subscribeContainerStats()
      .then(usages => this.#set(usages))
      .catch((error: unknown) => console.error('Unable to subscribe to the container statistics', error));
  }

  #stop(): void {
    this.#updates?.dispose();
    this.#updates = undefined;
    this.#usages.clear();
    window
      .unsubscribeContainerStats()
      .catch((error: unknown) => console.error('Unable to unsubscribe from the container statistics', error));
  }

  #set(usages: ContainerUsageInfo[]): void {
    // a late answer to the subscription after the last subscriber left
    if (this.#subscribers === 0) {
      return;
    }
    // each update has all the running containers
    this.#usages.clear();
    for (const usage of usages) {
      this.#usages.set(usage.containerId, usage);
    }
  }
}

export const containerUsages = new ContainerUsages();

export function getRunningContainers(object: ContainerInfoUI | ContainerGroupInfoUI): ContainerInfoUI[] {
  const containers = 'containers' in object ? object.containers : [object];
  return containers.filter(container => container.state === 'RUNNING');
}

export function getContainerUsage(object: ContainerInfoUI | ContainerGroupInfoUI): ContainerResourceUsage {
  return containerUsages.getUsage(getRunningContainers(object).map(container => container.id));
}

/**
 * Keeps the usages subscribed while the calling component is mounted, and gives the usage
 * of the running containers of the row added together. Must be called while the component is being initialised.
 */
export function trackContainerUsage(getObject: () => ContainerInfoUI | ContainerGroupInfoUI): {
  readonly running: boolean;
  readonly current: ContainerResourceUsage;
} {
  const running = $derived(getRunningContainers(getObject()).length > 0);
  const usage = $derived(getContainerUsage(getObject()));

  $effect(() => containerUsages.subscribe());

  return {
    get running(): boolean {
      return running;
    },
    get current(): ContainerResourceUsage {
      return usage;
    },
  };
}
