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

import type { V1JobStatus } from '@kubernetes/client-node';
import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import KubeJobStatusArtifact from './KubeJobStatusArtifact.svelte';

const fakeJobStatus: V1JobStatus = {
  active: 2,
  succeeded: 1,
  failed: 0,
  startTime: new Date(),
  completionTime: new Date(),
} as V1JobStatus;

test('Renders Job status correctly with complete data', () => {
  render(KubeJobStatusArtifact, { artifact: fakeJobStatus });
  expect(screen.getByText('Active Jobs')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText('Succeeded')).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument();
  expect(screen.getByText('Failed')).toBeInTheDocument();
  expect(screen.getByText('0')).toBeInTheDocument();
  expect(screen.getByText('Start Time')).toBeInTheDocument();
  expect(screen.getByText('Completion Time')).toBeInTheDocument();
});

test('Handles undefined artifact gracefully', () => {
  render(KubeJobStatusArtifact, { artifact: undefined });

  expect(screen.queryByText('Active Jobs')).not.toBeInTheDocument();
  expect(screen.queryByText('Succeeded')).not.toBeInTheDocument();
  expect(screen.queryByText('Failed')).not.toBeInTheDocument();
  expect(screen.queryByText('Start Time')).not.toBeInTheDocument();
  expect(screen.queryByText('Completion Time')).not.toBeInTheDocument();
});
