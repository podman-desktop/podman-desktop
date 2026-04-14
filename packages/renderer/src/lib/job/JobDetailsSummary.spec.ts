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

import type { V1Job } from '@kubernetes/client-node';
import { render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import JobDetailsSummary from './JobDetailsSummary.svelte';

const job: V1Job = {
  apiVersion: 'v1',
  kind: 'Job',
  metadata: {
    name: 'my-job',
    namespace: 'default',
  },
} as V1Job;

const kubeError = 'Error retrieving Job';

beforeEach(() => {
  vi.resetAllMocks();
});

test('Expect to render Job details when Job data is available', async () => {
  render(JobDetailsSummary, { job: job, kubeError: undefined });

  expect(screen.getByText('my-job')).toBeInTheDocument();
});

test('Expect to show error message when there is a kube error', async () => {
  render(JobDetailsSummary, { job: job, kubeError: kubeError });

  const errorMessage = screen.getByText(kubeError);
  expect(errorMessage).toBeInTheDocument();
});

test('Expect to show loading indicator when Job data is not available', async () => {
  render(JobDetailsSummary, {});

  const loadingMessage = screen.getByText('Loading ...');
  expect(loadingMessage).toBeInTheDocument();
});
