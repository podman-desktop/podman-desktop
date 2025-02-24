/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import type { CoreV1Event, KubernetesObject, V1Node } from '@kubernetes/client-node';
import { render, screen } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import { router } from 'tinro';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import * as states from '/@/stores/kubernetes-contexts-state';

import type { IDisposable } from '../../../../main/src/plugin/types/disposable';
import * as resourcesListen from '../kube/resources-listen';
import NodeDetails from './NodeDetails.svelte';
import * as nodeDetailsSummary from './NodeDetailsSummary.svelte';

const node: V1Node = {
  apiVersion: 'v1',
  kind: 'Node',
  metadata: {
    uid: '12345678',
    name: 'my-node',
    namespace: 'default',
  },
} as V1Node;

vi.mock(import('../kube/resources-listen'), async importOriginal => {
  // we want to keep the original nonVerbose
  const original = await importOriginal();
  return {
    ...original,
    listenResources: vi.fn(),
    isKubernetesExperimentalMode: vi.fn(),
  };
});

vi.mock('/@/stores/kubernetes-contexts-state');

beforeEach(() => {
  vi.resetAllMocks();
  router.goto('http://localhost:3000');
});

type initListsReturnType = {
  updateNodes: (objects: KubernetesObject[]) => void;
  updateEvents: (objects: CoreV1Event[]) => void;
};

describe.each<{
  experimental: boolean;
  initLists: (nodes: KubernetesObject[], events: CoreV1Event[]) => initListsReturnType;
}>([
  {
    experimental: false,
    initLists: (nodes: KubernetesObject[], events: CoreV1Event[]): initListsReturnType => {
      const nodesStore = writable<KubernetesObject[]>(nodes);
      vi.mocked(states).kubernetesCurrentContextNodes = nodesStore;
      const eventsStore = writable<CoreV1Event[]>(events);
      vi.mocked(states).kubernetesCurrentContextEvents = eventsStore;
      return {
        updateNodes: (nodes: KubernetesObject[]): void => {
          nodesStore.set(nodes);
        },
        updateEvents: (events: CoreV1Event[]): void => {
          eventsStore.set(events);
        },
      };
    },
  },
  {
    experimental: true,
    initLists: (nodes: KubernetesObject[], events: CoreV1Event[]): initListsReturnType => {
      let nodesCallback: (resources: KubernetesObject[]) => void;
      let eventsCallback: (resources: CoreV1Event[]) => void;
      vi.mocked(resourcesListen.listenResources).mockImplementation(
        async (resourceName, _options, cb): Promise<IDisposable> => {
          if (resourceName === 'nodes') {
            nodesCallback = cb;
            setTimeout(() => nodesCallback(nodes));
            return {
              dispose: (): void => {},
            };
          } else {
            eventsCallback = cb;
            setTimeout(() => eventsCallback(events));
            return {
              dispose: (): void => {},
            };
          }
        },
      );
      return {
        updateNodes: (updatedObjects: KubernetesObject[]): void => {
          nodesCallback(updatedObjects);
        },
        updateEvents: (updatedObjects: CoreV1Event[]): void => {
          eventsCallback(updatedObjects);
        },
      };
    },
  },
])('is experimental: $experimental', ({ experimental, initLists }) => {
  beforeEach(() => {
    vi.mocked(resourcesListen.isKubernetesExperimentalMode).mockResolvedValue(experimental);
  });

  test('Confirm renders node details', async () => {
    // mock object store
    initLists([node], []);
    render(NodeDetails, { name: 'my-node' });

    await vi.waitFor(() => {
      expect(screen.getByText('my-node')).toBeInTheDocument();
    });
  });

  test('Expect NodeDetailsSummary to be called with related events only', async () => {
    const nodeDetailsSummarySpy = vi.spyOn(nodeDetailsSummary, 'default');

    const events: CoreV1Event[] = [
      {
        kind: 'Event',
        metadata: {
          name: 'event1',
        },
        involvedObject: { uid: '12345678' },
      },
      {
        kind: 'Event',
        metadata: {
          name: 'event2',
        },
        involvedObject: { uid: '12345678' },
      },
      {
        kind: 'Event',
        metadata: {
          name: 'event3',
        },
        involvedObject: { uid: '1234' },
      },
    ];

    initLists([node], events);

    if (!experimental) {
      vi.mocked(window.kubernetesReadNode).mockResolvedValue(node);
    }

    render(NodeDetails, { name: 'my-node' });
    router.goto('summary');
    await vi.waitFor(() => {
      expect(nodeDetailsSummarySpy).toHaveBeenCalledWith(expect.anything(), {
        node: node,
        events: [events[0], events[1]],
      });
    });
  });
});
