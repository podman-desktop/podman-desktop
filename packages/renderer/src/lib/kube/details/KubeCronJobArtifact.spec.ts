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

import type { V1CronJobSpec } from '@kubernetes/client-node';
import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import KubeCronJobArtifact from './KubeCronJobArtifact.svelte';

const fakeCronJobSpec: V1CronJobSpec = {
  schedule: '*/5 * * * *',
  concurrencyPolicy: 'Forbid',
  failedJobsHistoryLimit: 1,
  successfulJobsHistoryLimit: 3,
  startingDeadlineSeconds: 30,
  suspend: false,
  timeZone: 'UTC',
  jobTemplate: {
    metadata: { name: 'example-job' },
  },
} as V1CronJobSpec;

test('Renders CronJob correctly with complete data', () => {
  render(KubeCronJobArtifact, { artifact: fakeCronJobSpec });
  expect(screen.getByText('Schedule')).toBeInTheDocument();
  expect(screen.getByText('*/5 * * * *')).toBeInTheDocument();
  expect(screen.getByText('Concurrency Policy')).toBeInTheDocument();
  expect(screen.getByText('Forbid')).toBeInTheDocument();
  expect(screen.getByText('Failed Jobs History Limit')).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('Successful Jobs History Limit')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
  expect(screen.getByText('Starting Deadline Seconds')).toBeInTheDocument();
  expect(screen.getByText('30')).toBeInTheDocument();
  expect(screen.getByText('Suspend')).toBeInTheDocument();
  expect(screen.getByText('False')).toBeInTheDocument();
  expect(screen.getByText('Time Zone')).toBeInTheDocument();
  expect(screen.getByText('UTC')).toBeInTheDocument();
});

test('Handles undefined artifact gracefully', () => {
  render(KubeCronJobArtifact, { artifact: undefined });

  expect(screen.queryByText('Schedule')).not.toBeInTheDocument();
  expect(screen.queryByText('Concurrency Policy')).not.toBeInTheDocument();
  expect(screen.queryByText('Failed Jobs History Limit')).not.toBeInTheDocument();
  expect(screen.queryByText('Successful Jobs History Limit')).not.toBeInTheDocument();
  expect(screen.queryByText('Starting Deadline Seconds')).not.toBeInTheDocument();
  expect(screen.queryByText('Suspend')).not.toBeInTheDocument();
  expect(screen.queryByText('Time Zone')).not.toBeInTheDocument();
});
