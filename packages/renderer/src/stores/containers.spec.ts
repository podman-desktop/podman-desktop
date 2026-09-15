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

import type { ContainerInfo } from '@podman-desktop/core-api';
import { get } from 'svelte/store';
import { assert, beforeEach, expect, test, vi } from 'vitest';

import { ContainerGroupInfoTypeUI, type ContainerInfoUI } from '/@/lib/container/ContainerInfoUI';

import {
  clearContainerActionInProgress,
  containersEventStore,
  containersInfos,
  setContainerActionError,
  setContainerGroupStatus,
  setContainerStatus,
} from './containers';

const callbacks = new Map<string, (data?: unknown) => void | Promise<void>>();

beforeEach(() => {
  callbacks.clear();
  containersInfos.set([]);
  vi.resetAllMocks();
  vi.mocked(window.events.receive).mockImplementation((message, callback) => {
    callbacks.set(message, callback);
    return { dispose: vi.fn() };
  });
});

function container(id: string, engineId: string, state = 'RUNNING'): ContainerInfoUI {
  return { id, engineId, state, actionInProgress: false, actionError: '', selected: false } as ContainerInfoUI;
}

function podContainer(id: string, engineId: string, podId: string, podStatus = 'RUNNING'): ContainerInfoUI {
  return {
    ...container(id, engineId),
    groupInfo: { type: ContainerGroupInfoTypeUI.POD, id: podId, engineId, status: podStatus },
  } as ContainerInfoUI;
}

test('container action helpers update only the matching container', () => {
  containersInfos.set([container('one', 'engine-a'), container('two', 'engine-a'), container('one', 'engine-b')]);

  setContainerStatus('engine-a', 'one', 'STARTING');

  const result = get(containersInfos);
  expect(result[0]).toMatchObject({ state: 'STARTING', actionInProgress: true, actionError: '' });
  expect(result[1]).toMatchObject({ state: 'RUNNING', actionInProgress: false });
  expect(result[2]).toMatchObject({ state: 'RUNNING', actionInProgress: false });
});

test('container action helpers clear progress and set errors', () => {
  containersInfos.set([container('one', 'engine-a', 'STARTING')]);

  setContainerActionError('engine-a', 'one', 'failed');
  expect(get(containersInfos)[0]).toMatchObject({ state: 'ERROR', actionInProgress: false, actionError: 'failed' });

  setContainerStatus('engine-a', 'one', 'STOPPING');
  clearContainerActionInProgress('engine-a', 'one');
  expect(get(containersInfos)[0]).toMatchObject({ state: 'STOPPING', actionInProgress: false, actionError: '' });
});

test('setContainerGroupStatus updates the status of every container belonging to the matching pod', () => {
  containersInfos.set([
    podContainer('one', 'engine-a', 'pod-a', 'RUNNING'),
    podContainer('two', 'engine-a', 'pod-a', 'RUNNING'),
    podContainer('three', 'engine-a', 'pod-b', 'RUNNING'),
    podContainer('four', 'engine-b', 'pod-a', 'RUNNING'),
    {
      ...container('five', 'engine-a'),
      groupInfo: { type: ContainerGroupInfoTypeUI.STANDALONE, id: 'five', engineId: 'engine-a' },
    } as ContainerInfoUI,
  ]);

  setContainerGroupStatus('engine-a', 'pod-a', 'DELETING');

  const result = get(containersInfos);
  expect(result[0].groupInfo.status).toBe('DELETING');
  expect(result[1].groupInfo.status).toBe('DELETING');
  // different pod id, engineId or standalone container are left untouched
  expect(result[2].groupInfo.status).toBe('RUNNING');
  expect(result[3].groupInfo.status).toBe('RUNNING');
  expect(result[4]).toMatchObject({ state: 'RUNNING' });
});

test('container action helpers ignore missing containers', () => {
  containersInfos.set([container('one', 'engine-a')]);
  const before = get(containersInfos)[0];

  setContainerStatus('missing-engine', 'missing', 'STARTING');
  clearContainerActionInProgress('missing-engine', 'missing');
  setContainerActionError('missing-engine', 'missing', 'failed');

  expect(get(containersInfos)[0]).toBe(before);
});

test.each([
  ['container-created-event'],
  ['container-stopped-event'],
  ['container-kill-event'],
  ['container-die-event'],
  ['container-init-event'],
  ['container-started-event'],
  ['container-created-event'],
  ['container-removed-event'],
])('fetch containers when receiving event %s', async eventName => {
  // fast delays (10 & 10ms)
  containersEventStore.setupWithDebounce(10, 10);

  // empty list
  vi.mocked(window.listContainers).mockResolvedValue([]);

  // mark as ready to receive updates
  window.dispatchEvent(new CustomEvent('extensions-already-started'));

  // clear mock calls
  vi.mocked(window.listContainers).mockClear();

  // now, setup at least one container
  // the store converts through ContainerUtils, so the mocked backend object has to be
  // complete enough for the conversion: getName reads Names, getState reads State, and
  // an absent field throws inside the updater rather than failing an assertion
  vi.mocked(window.listContainers).mockResolvedValue([
    {
      Id: 'id123',
      Names: ['/container'],
      Image: 'docker.io/library/nginx:latest',
      ImageID: 'sha256:abcdef0123456789',
      State: 'running',
      Labels: {},
      engineId: 'engine',
      engineName: 'podman',
    } as unknown as ContainerInfo,
  ]);

  // send event
  const callback = callbacks.get(eventName);
  assert(callback);
  await callback();

  // wait vi.mocked(window.listContainers) is called
  while (vi.mocked(window.listContainers).mock.calls.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  // now get list
  const containerListResult = get(containersInfos);
  expect(containerListResult.length).toBe(1);
  expect(containerListResult[0].id).toEqual('id123');
});
