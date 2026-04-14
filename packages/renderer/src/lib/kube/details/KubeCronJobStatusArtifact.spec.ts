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

import type { V1CronJobStatus } from '@kubernetes/client-node';
import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import KubeCronJobStatusArtifact from './KubeCronJobStatusArtifact.svelte';

const fakeCronJobStatus: V1CronJobStatus = {
  lastScheduleTime: new Date(),
  lastSuccessfulTime: new Date(),
  active: [{ name: 'cronjob-123' }, { name: 'cronjob-456' }],
};

test('Renders CronJob status correctly with complete data', () => {
  render(KubeCronJobStatusArtifact, { artifact: fakeCronJobStatus });
  expect(screen.getByText('Last Schedule Time')).toBeInTheDocument();
  expect(screen.getByText('Last Successful Time')).toBeInTheDocument();
  expect(screen.getByText('Active Jobs')).toBeInTheDocument();

  // Check that cronjob-123 is shown anywhere in the page, as it's part of the list, just use regex
  expect(screen.getByText(/cronjob-123/)).toBeInTheDocument();
  expect(screen.getByText(/cronjob-456/)).toBeInTheDocument();
});

test('Handles undefined artifact gracefully', () => {
  render(KubeCronJobStatusArtifact, { artifact: undefined });

  // Expect not to find any status info if artifact is undefined
  expect(screen.queryByText('Last Schedule Time')).not.toBeInTheDocument();
  expect(screen.queryByText('Last Successful Time')).not.toBeInTheDocument();
  expect(screen.queryByText('Active Jobs')).not.toBeInTheDocument();
});
