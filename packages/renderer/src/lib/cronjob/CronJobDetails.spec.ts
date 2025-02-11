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

import '@testing-library/jest-dom/vitest';

import type { KubernetesObject, V1CronJob } from '@kubernetes/client-node';
import { render, screen } from '@testing-library/svelte';
import { writable } from 'svelte/store';
import { expect, test, vi } from 'vitest';

import * as kubeContextStore from '/@/stores/kubernetes-contexts-state';

import CronJobDetails from './CronJobDetails.svelte';

const cronjob: V1CronJob = {
  apiVersion: 'v1',
  kind: 'CronJob',
  metadata: {
    name: 'my-cronjob',
    namespace: 'default',
  },
} as V1CronJob;

vi.mock('/@/stores/kubernetes-contexts-state', async () => {
  return {
    kubernetesCurrentContextCronJobs: vi.fn(),
  };
});

test('Expect renders CronJob details', async () => {
  // mock object store
  const cronjobs = writable<KubernetesObject[]>([cronjob]);
  vi.mocked(kubeContextStore).kubernetesCurrentContextCronJobs = cronjobs;

  render(CronJobDetails, { name: 'my-cronjob', namespace: 'default' });

  expect(screen.getByText('my-cronjob')).toBeInTheDocument();
});
