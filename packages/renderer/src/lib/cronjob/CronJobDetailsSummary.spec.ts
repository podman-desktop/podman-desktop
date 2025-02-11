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

import type { V1CronJob } from '@kubernetes/client-node';
import { render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import CronJobDetailsSummary from './CronJobDetailsSummary.svelte';

const cronjob: V1CronJob = {
  apiVersion: 'v1',
  kind: 'CronJob',
  metadata: {
    name: 'my-cronjob',
    namespace: 'default',
  },
} as V1CronJob;

const kubeError = 'Error retrieving CronJob';

beforeEach(() => {
  vi.resetAllMocks();
});

test('Expect to render CronJob details when CronJob data is available', async () => {
  render(CronJobDetailsSummary, { cronjob: cronjob, kubeError: undefined });

  expect(screen.getByText('my-cronjob')).toBeInTheDocument();
});

test('Expect to show error message when there is a kube error', async () => {
  render(CronJobDetailsSummary, { cronjob: cronjob, kubeError: kubeError });

  const errorMessage = screen.getByText(kubeError);
  expect(errorMessage).toBeInTheDocument();
});

test('Expect to show loading indicator when CronJob data is not available', async () => {
  render(CronJobDetailsSummary, {});

  const loadingMessage = screen.getByText('Loading ...');
  expect(loadingMessage).toBeInTheDocument();
});
