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
import { beforeEach, expect, test, vi } from 'vitest';

import * as states from '/@/stores/kubernetes-contexts-state';

import CronJobList from './CronJobList.svelte';

vi.mock('/@/stores/kubernetes-contexts-state');

beforeEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
  vi.mocked(states).cronJobSearchPattern = writable<string>('');
  vi.mocked(states).kubernetesContextsCheckingStateDelayed = writable();
  vi.mocked(states).kubernetesCurrentContextState = writable();
});

test('Expect cronjob empty screen', async () => {
  vi.mocked(states).kubernetesCurrentContextCronJobsFiltered = writable<KubernetesObject[]>([]);
  render(CronJobList);
  const noCronJobs = screen.getByRole('heading', { name: 'No cronjobs' });
  expect(noCronJobs).toBeInTheDocument();
});

test('Expect cronjobs list', async () => {
  const cronjob: V1CronJob = {
    apiVersion: 'v1',
    kind: 'CronJob',
    metadata: {
      name: 'my-cronjob',
      namespace: 'test-namespace',
    },
    spec: {
      schedule: '*/1 * * * *',
      suspend: false,
      jobTemplate: {
        spec: {
          template: {
            spec: {
              containers: [],
            },
          },
        },
      },
    },
  };
  vi.mocked(states).kubernetesCurrentContextCronJobsFiltered = writable<KubernetesObject[]>([cronjob]);

  render(CronJobList);

  const cronjobName = screen.getByRole('cell', { name: 'my-cronjob test-namespace' });
  expect(cronjobName).toBeInTheDocument();
});

test('Expect filter empty screen', async () => {
  vi.mocked(states).kubernetesCurrentContextCronJobsFiltered = writable<KubernetesObject[]>([]);

  render(CronJobList, { searchTerm: 'No match' });

  const filterButton = screen.getByRole('button', { name: 'Clear filter' });
  expect(filterButton).toBeInTheDocument();
});

test('Expect cronjob list is updated when kubernetesCurrentContextCronJobsFiltered changes', async () => {
  const cronjob1: V1CronJob = {
    apiVersion: 'v1',
    kind: 'CronJob',
    metadata: {
      name: 'my-cronjob-1',
      namespace: 'test-namespace',
    },
    spec: {
      schedule: '*/1 * * * *',
      suspend: false,
      jobTemplate: {
        spec: {
          template: {
            spec: {
              containers: [],
            },
          },
        },
      },
    },
  };
  const cronjob2: V1CronJob = {
    apiVersion: 'v1',
    kind: 'CronJob',
    metadata: {
      name: 'my-cronjob-2',
      namespace: 'test-namespace',
    },
    spec: {
      schedule: '*/1 * * * *',
      suspend: false,
      jobTemplate: {
        spec: {
          template: {
            spec: {
              containers: [],
            },
          },
        },
      },
    },
  };

  const filtered = writable<KubernetesObject[]>([cronjob1, cronjob2]);
  vi.mocked(states).kubernetesCurrentContextCronJobsFiltered = filtered;

  const component = render(CronJobList);
  const cronjobName1 = screen.getByRole('cell', { name: 'my-cronjob-1 test-namespace' });
  expect(cronjobName1).toBeInTheDocument();
  const cronjobName2 = screen.getByRole('cell', { name: 'my-cronjob-2 test-namespace' });
  expect(cronjobName2).toBeInTheDocument();

  filtered.set([cronjob2]);
  await component.rerender({});

  const cronjobName1after = screen.queryByRole('cell', { name: 'my-cronjob-1 test-namespace' });
  expect(cronjobName1after).not.toBeInTheDocument();
  const cronjobName2after = screen.getByRole('cell', { name: 'my-cronjob-2 test-namespace' });
  expect(cronjobName2after).toBeInTheDocument();
});
