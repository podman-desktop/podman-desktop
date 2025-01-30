/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import type { KubernetesObject } from '@kubernetes/client-node';
import { beforeAll, expect, type Mock, test, vi } from 'vitest';

import type { KubernetesContextResources } from '/@api/kubernetes-resources';

import { Disposable } from '../../../../main/src/plugin/types/disposable';
import { listenResources } from './resources-listen';

const callbacks = new Map<string, () => void>();

const eventEmitter = {
  receive: (message: string, callback: () => void): void => {
    callbacks.set(message, callback);
  },
};

beforeAll(() => {
  Object.defineProperty(window, 'events', {
    value: {
      receive: (message: string, callback: () => void) => {
        eventEmitter.receive(message, callback);
        return new Disposable(() => {});
      },
    },
  });
  vi.mocked(window.getConfigurationValue<boolean>).mockResolvedValue(true);
});

test('non filtered resources', async () => {
  const resource1: KubernetesObject = {
    metadata: {
      name: 'res1',
    },
  };
  const contextResource: KubernetesContextResources = {
    contextName: 'ctx1',
    items: [resource1],
  };

  const callbackSpy: Mock<(resoures: KubernetesContextResources[]) => void> = vi.fn();
  vi.mocked(window.kubernetesGetResources).mockResolvedValue([contextResource]);
  const listener = await listenResources('resource1', callbackSpy);
  expect(listener).not.toBeUndefined();
  await listener!.updateContexts(['ctx1']);

  callbackSpy.mockClear();
  const callback = callbacks.get('kubernetes-update-resource1');
  expect(callback).toBeDefined();
  expect(callbackSpy).not.toHaveBeenCalled();

  callbackSpy.mockClear();
  vi.mocked(window.kubernetesGetResources).mockClear();
  callback!();
  expect(window.kubernetesGetResources).toHaveBeenCalledWith(['ctx1'], 'resource1');
  await vi.waitFor(() => {
    expect(callbackSpy).toHaveBeenCalledWith([contextResource]);
  });
});

test('filtered resources', async () => {
  const resource1: KubernetesObject = {
    metadata: {
      name: 'res1',
    },
  };
  const resource2: KubernetesObject = {
    metadata: {
      name: 'res2',
    },
  };
  let contextResource: KubernetesContextResources = {
    contextName: 'ctx1',
    items: [resource1, resource2],
  };

  const callbackSpy: Mock<(resoures: KubernetesContextResources[]) => void> = vi.fn();
  vi.mocked(window.kubernetesGetResources).mockResolvedValue([contextResource]);
  const listener = await listenResources('resource1', callbackSpy);
  expect(listener).not.toBeUndefined();

  callbackSpy.mockClear();
  await listener!.setSearchTerm('res2');
  await vi.waitFor(() => {
    expect(callbackSpy).toHaveBeenCalledWith([
      {
        contextName: 'ctx1',
        items: [resource2],
      },
    ]);
  });

  callbackSpy.mockClear();
  await listener!.setSearchTerm('notfound');
  await vi.waitFor(() => {
    expect(callbackSpy).toHaveBeenCalledWith([
      {
        contextName: 'ctx1',
        items: [],
      },
    ]);
  });

  callbackSpy.mockClear();
  await listener!.setSearchTerm('res1');
  await vi.waitFor(() => {
    expect(callbackSpy).toHaveBeenCalledWith([
      {
        contextName: 'ctx1',
        items: [resource1],
      },
    ]);
  });

  // filter is still active when resources change
  // here, resource1 appears in the result, but resource2 is still filtered
  callbackSpy.mockClear();

  const resource1bis: KubernetesObject = {
    metadata: {
      name: 'res1bis',
    },
  };
  contextResource = {
    contextName: 'ctx1',
    items: [resource1, resource2, resource1bis],
  };

  vi.mocked(window.kubernetesGetResources).mockResolvedValue([contextResource]);

  const callback = callbacks.get('kubernetes-update-resource1');
  expect(callback).toBeDefined();
  expect(callbackSpy).not.toHaveBeenCalled();
  callback!();
  await vi.waitFor(() => {
    expect(callbackSpy).toHaveBeenCalledWith([
      {
        contextName: 'ctx1',
        items: [resource1, resource1bis],
      },
    ]);
  });
});
