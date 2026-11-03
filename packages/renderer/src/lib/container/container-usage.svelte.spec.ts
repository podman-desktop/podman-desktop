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

import type { ContainerUsageInfo } from '@desktop-framework/api';
import { tick } from 'svelte';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  ContainerUsages,
  containerUsages,
  getContainerUsage,
  getRunningContainers,
  trackContainerUsage,
} from './container-usage.svelte';
import { ContainerGroupInfoTypeUI, type ContainerGroupInfoUI, type ContainerInfoUI } from './ContainerInfoUI';

const UPDATE_CHANNEL = 'container-stats:update';

let usages: ContainerUsages;
// sends a `container-stats:update` event, as the main process does
let sendUpdate: ((usages: ContainerUsageInfo[]) => void) | undefined;
const disposeUpdates = vi.fn();
// unsubscribes the subscribers to the shared usages left over by a test
const cleanups: (() => void)[] = [];

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
    if (channel === UPDATE_CHANNEL) {
      sendUpdate = (data): void => func(data);
    }
    return { dispose: disposeUpdates };
  });
  vi.mocked(window.subscribeContainerStats).mockResolvedValue([]);
  vi.mocked(window.unsubscribeContainerStats).mockResolvedValue(undefined);
  usages = new ContainerUsages();
});

afterEach(() => {
  cleanups.splice(0).forEach(cleanup => cleanup());
});

describe('ContainerUsages', () => {
  test('should not subscribe to the statistics until there is a subscriber', () => {
    expect(window.subscribeContainerStats).not.toHaveBeenCalled();
    expect(window.events.receive).not.toHaveBeenCalled();
  });

  test('should subscribe to the statistics and listen to the updates for the first subscriber', () => {
    usages.subscribe();

    expect(window.subscribeContainerStats).toHaveBeenCalledOnce();
    expect(window.events.receive).toHaveBeenCalledWith(UPDATE_CHANNEL, expect.any(Function));
  });

  test('should subscribe to the statistics only once for several subscribers', () => {
    usages.subscribe();
    usages.subscribe();

    expect(window.subscribeContainerStats).toHaveBeenCalledOnce();
    expect(window.events.receive).toHaveBeenCalledOnce();
  });

  test('should give the usages answered to the subscription', async () => {
    vi.mocked(window.subscribeContainerStats).mockResolvedValue([usage('c1', 500, 12.5)]);

    usages.subscribe();

    await vi.waitFor(() => expect(usages.getUsage(['c1'])).toEqual({ cpuPercentage: 12.5, memoryUsage: 500 }));
  });

  test('should replace all the usages with each update', async () => {
    vi.mocked(window.subscribeContainerStats).mockResolvedValue([usage('c1', 500, 12.5)]);
    usages.subscribe();
    await vi.waitFor(() => expect(usages.getUsage(['c1']).memoryUsage).toBe(500));

    sendUpdate?.([usage('c2', 700, 3)]);

    // c1 is not running anymore
    expect(usages.getUsage(['c1'])).toEqual({});
    expect(usages.getUsage(['c2'])).toEqual({ cpuPercentage: 3, memoryUsage: 700 });
  });

  test('should keep the usages while some subscribers remain', () => {
    const unsubscribe = usages.subscribe();
    usages.subscribe();
    sendUpdate?.([usage('c1', 500, 12.5)]);

    unsubscribe();

    expect(disposeUpdates).not.toHaveBeenCalled();
    expect(window.unsubscribeContainerStats).not.toHaveBeenCalled();
    expect(usages.getUsage(['c1'])).toEqual({ cpuPercentage: 12.5, memoryUsage: 500 });
  });

  test('should unsubscribe and forget the usages once the last subscriber leaves', () => {
    const unsubscribeCpu = usages.subscribe();
    const unsubscribeMemory = usages.subscribe();
    sendUpdate?.([usage('c1', 500, 12.5)]);

    unsubscribeCpu();
    unsubscribeMemory();

    expect(disposeUpdates).toHaveBeenCalledOnce();
    expect(window.unsubscribeContainerStats).toHaveBeenCalledOnce();
    expect(usages.getUsage(['c1'])).toEqual({});
  });

  test('should count a subscriber leaving several times only once', () => {
    const unsubscribe = usages.subscribe();
    usages.subscribe();

    unsubscribe();
    unsubscribe();

    expect(window.unsubscribeContainerStats).not.toHaveBeenCalled();
  });

  test('should ignore a subscription answer arriving after the last subscriber left', async () => {
    const { promise, resolve } = Promise.withResolvers<ContainerUsageInfo[]>();
    vi.mocked(window.subscribeContainerStats).mockReturnValue(promise);

    const unsubscribe = usages.subscribe();
    unsubscribe();
    resolve([usage('c1', 500, 12.5)]);
    await promise;
    await vi.waitFor(() => expect(window.unsubscribeContainerStats).toHaveBeenCalled());

    expect(usages.getUsage(['c1'])).toEqual({});
  });

  test('should subscribe again when a subscriber comes back after the last one left', async () => {
    const unsubscribe = usages.subscribe();
    unsubscribe();
    vi.mocked(window.subscribeContainerStats).mockResolvedValue([usage('c1', 500, 12.5)]);

    usages.subscribe();

    expect(window.subscribeContainerStats).toHaveBeenCalledTimes(2);
    expect(window.events.receive).toHaveBeenCalledTimes(2);
    await vi.waitFor(() => expect(usages.getUsage(['c1']).memoryUsage).toBe(500));
  });

  test('should log an error when the subscription fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('main process is gone');
    vi.mocked(window.subscribeContainerStats).mockRejectedValue(error);

    usages.subscribe();

    await vi.waitFor(() =>
      expect(consoleError).toHaveBeenCalledWith('Unable to subscribe to the container statistics', error),
    );
  });

  test('should log an error when unsubscribing fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('main process is gone');
    vi.mocked(window.unsubscribeContainerStats).mockRejectedValue(error);

    usages.subscribe()();

    await vi.waitFor(() =>
      expect(consoleError).toHaveBeenCalledWith('Unable to unsubscribe from the container statistics', error),
    );
  });
});

describe('getUsage', () => {
  beforeEach(() => {
    usages.subscribe();
  });

  test('should add the usages of several containers together', () => {
    sendUpdate?.([usage('c1', 500, 12.5), usage('c2', 250, 7.5)]);

    expect(usages.getUsage(['c1', 'c2'])).toEqual({ cpuPercentage: 20, memoryUsage: 750 });
  });

  test('should leave the CPU undefined while no container has a CPU reading', () => {
    // the CPU percentage needs two readings, the memory only one
    sendUpdate?.([usage('c1', 500), usage('c2', 250)]);

    expect(usages.getUsage(['c1', 'c2'])).toEqual({ memoryUsage: 750 });
  });

  test('should only add the CPU of the containers having a CPU reading', () => {
    sendUpdate?.([usage('c1', 500, 12.5), usage('c2', 250)]);

    expect(usages.getUsage(['c1', 'c2'])).toEqual({ cpuPercentage: 12.5, memoryUsage: 750 });
  });

  test('should ignore the containers without a reading', () => {
    sendUpdate?.([usage('c1', 500, 12.5)]);

    expect(usages.getUsage(['c1', 'unknown'])).toEqual({ cpuPercentage: 12.5, memoryUsage: 500 });
    expect(usages.getUsage(['unknown'])).toEqual({});
    expect(usages.getUsage([])).toEqual({});
  });
});

describe('getRunningContainers', () => {
  test('should give a running container', () => {
    const running = container('c1');

    expect(getRunningContainers(running)).toEqual([running]);
  });

  test('should give nothing for a stopped container', () => {
    expect(getRunningContainers(container('c1', 'STOPPED'))).toEqual([]);
  });

  test('should give the running containers of a group', () => {
    const c1 = container('c1');
    const c3 = container('c3');

    expect(getRunningContainers(group([c1, container('c2', 'EXITED'), c3]))).toEqual([c1, c3]);
  });
});

describe('getContainerUsage', () => {
  beforeEach(() => {
    cleanups.push(containerUsages.subscribe());
  });

  test('should give the usage of a running container', () => {
    sendUpdate?.([usage('c1', 500, 12.5)]);

    expect(getContainerUsage(container('c1'))).toEqual({ cpuPercentage: 12.5, memoryUsage: 500 });
  });

  test('should give nothing for a stopped container even with a reading', () => {
    // the container has stopped since the last update
    sendUpdate?.([usage('c1', 500, 12.5)]);

    expect(getContainerUsage(container('c1', 'STOPPED'))).toEqual({});
  });

  test('should add the usages of the running containers of a group together', () => {
    sendUpdate?.([usage('c1', 500, 12.5), usage('c2', 250, 7.5), usage('c3', 1_000, 50)]);

    expect(getContainerUsage(group([container('c1'), container('c2'), container('c3', 'STOPPED')]))).toEqual({
      cpuPercentage: 20,
      memoryUsage: 750,
    });
  });
});

describe('trackContainerUsage', () => {
  let tracked: ReturnType<typeof trackContainerUsage> | undefined;

  // runs trackContainerUsage as a mounted component would, until the returned function is called
  async function mount(getObject: () => ContainerInfoUI | ContainerGroupInfoUI): Promise<() => void> {
    const destroy = $effect.root(() => {
      tracked = trackContainerUsage(getObject);
    });
    await tick();
    let mounted = true;
    const unmount = (): void => {
      if (mounted) {
        mounted = false;
        destroy();
      }
    };
    cleanups.push(unmount);
    return unmount;
  }

  beforeEach(() => {
    tracked = undefined;
  });

  test('should subscribe to the usages while mounted', async () => {
    const unmount = await mount(() => container('c1'));

    expect(window.subscribeContainerStats).toHaveBeenCalledOnce();
    expect(window.unsubscribeContainerStats).not.toHaveBeenCalled();

    unmount();

    expect(window.unsubscribeContainerStats).toHaveBeenCalledOnce();
  });

  test('should tell whether the row has running containers', async () => {
    await mount(() => group([container('c1', 'STOPPED'), container('c2')]));
    expect(tracked?.running).toBe(true);

    await mount(() => group([container('c1', 'STOPPED')]));
    expect(tracked?.running).toBe(false);
  });

  test('should follow the updates and the changes of the row', async () => {
    let object = $state(container('c1'));
    await mount(() => object);

    sendUpdate?.([usage('c1', 500, 12.5), usage('c2', 250, 7.5)]);
    expect(tracked?.current).toEqual({ cpuPercentage: 12.5, memoryUsage: 500 });

    object = container('c2');
    expect(tracked?.current).toEqual({ cpuPercentage: 7.5, memoryUsage: 250 });

    object = container('c2', 'STOPPED');
    expect(tracked?.running).toBe(false);
    expect(tracked?.current).toEqual({});
  });
});
