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

import type { V1Pod } from '@kubernetes/client-node';
import { expect, test } from 'vitest';

import { PodUtils } from './pod-utils';

const podUtils = new PodUtils();
const podInfo = {
  apiVersion: 'v1',
  kind: 'Pod',
  metadata: { name: 'my-pod', namespace: 'test-namespace' },
  status: {
    containerStatuses: [
      {
        containerID: 'container-1',
        name: 'container-1-name',
        state: {
          running: {},
        },
      },
      {
        containerID: 'container-2',
        name: 'container-2-name',
        state: {
          terminated: {},
        },
      },
      {
        containerID: 'container-3',
        name: 'container-3-name',
        state: {
          waiting: {},
        },
      },
    ],
  },
  spec: {
    nodeName: 'test-node',
  },
} as unknown as V1Pod;

test('Expect to get node and namespace from pod info', () => {
  const pod = podUtils.getPodUI(podInfo);

  expect(pod.kind).toBe('Pod');
  expect(pod.name).toBe('my-pod');
  expect(pod.node).toBe('test-node');
  expect(pod.namespace).toBe('test-namespace');
});

test('Expect to get container status from pod info', () => {
  const pod = podUtils.getPodUI(podInfo);

  expect(pod.containers).toHaveLength(3);

  expect(pod.containers[0].Id).toBe('container-1');
  expect(pod.containers[0].Names).toBe('container-1-name');
  expect(pod.containers[0].Status).toBe('running');

  expect(pod.containers[1].Id).toBe('container-2');
  expect(pod.containers[1].Names).toBe('container-2-name');
  expect(pod.containers[1].Status).toBe('terminated');

  expect(pod.containers[2].Id).toBe('container-3');
  expect(pod.containers[2].Names).toBe('container-3-name');
  expect(pod.containers[2].Status).toBe('waiting');
});
