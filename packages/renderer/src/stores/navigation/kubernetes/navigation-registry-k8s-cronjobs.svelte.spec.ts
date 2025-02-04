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
import { expect, test, vi } from 'vitest';

import { createNavigationKubernetesCronJobsEntry } from './navigation-registry-k8s-cronjobs.svelte';

test('createNavigationKubernetesCronJobsEntry', async () => {
  const cronJobs: KubernetesObject[] = [
    {
      apiVersion: 'v1',
      kind: 'CronJob',
      metadata: {
        name: 'cronjob1',
      },
    },
    {
      apiVersion: 'v1',
      kind: 'CronJob',
      metadata: {
        name: 'cronjob2',
      },
    },
  ];

  vi.mocked(window.kubernetesRegisterGetCurrentContextResources).mockResolvedValue(cronJobs);

  const entry = createNavigationKubernetesCronJobsEntry();

  expect(entry).toBeDefined();
  expect(entry.name).toBe('CronJobs');
  expect(entry.link).toBe('/kubernetes/cronjobs');
  expect(entry.tooltip).toBe('CronJobs');
  await vi.waitFor(() => {
    expect(entry.counter).toBe(2);
  });
});
