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

import { get } from 'svelte/store';
import { beforeEach, expect, test, vi } from 'vitest';

import { tasksInfo } from '/@/stores/tasks';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  applyExtensionVersionChange,
  resetVersionUpdateStateForTests,
  setPrototypeVersionChangesEnabled,
} from './extension-version-update.svelte';

const baseExtension: CatalogExtensionInfoUI = {
  id: 'podman-desktop.minikube',
  displayName: 'minikube',
  isFeatured: false,
  fetchable: false,
  fetchLink: '',
  fetchVersion: '0.4.0',
  publisherDisplayName: 'Podman Desktop',
  isInstalled: true,
  installedVersion: '0.4.0',
  shortDescription: 'Run Kubernetes locally',
  categories: [],
  keywords: [],
  availableVersions: [{ version: '0.2.0', ociUri: 'oci:minikube:0.2.0', preview: false }],
  hasUpdate: false,
  isVerified: false,
  isSupportedByRedHat: false,
};

beforeEach(() => {
  vi.useFakeTimers();
  resetVersionUpdateStateForTests();
  tasksInfo.set([]);
  setPrototypeVersionChangesEnabled(true);
});

test('prototype version change creates a footer task with progress', async () => {
  applyExtensionVersionChange(baseExtension, '0.2.0', false);

  const runningTasks = get(tasksInfo).filter(task => task.state === 'running');
  expect(runningTasks).toHaveLength(1);
  expect(runningTasks[0]?.name).toBe('Updating minikube to v0.2.0...');
  expect(runningTasks[0]?.progress).toBe(0);

  await vi.advanceTimersByTimeAsync(1500);

  expect(get(tasksInfo)[0]?.progress).toBeGreaterThan(0);

  await vi.advanceTimersByTimeAsync(1500);

  expect(get(tasksInfo).filter(task => task.state === 'running')).toHaveLength(0);
});
