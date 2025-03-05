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

import type { V1JobSpec } from '@kubernetes/client-node';
import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import KubeJobArtifact from './KubeJobArtifact.svelte';

const fakeJobSpec: V1JobSpec = {
  parallelism: 3,
  completions: 5,
  backoffLimit: 6,
  activeDeadlineSeconds: 120,
  ttlSecondsAfterFinished: 60,
  suspend: false,
} as V1JobSpec;

test('Renders Job correctly with complete data', () => {
  render(KubeJobArtifact, { artifact: fakeJobSpec });
  expect(screen.getByText('Parallelism')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
  expect(screen.getByText('Completions')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument();
  expect(screen.getByText('Backoff Limit')).toBeInTheDocument();
  expect(screen.getByText('6')).toBeInTheDocument();
  expect(screen.getByText('Active Deadline Seconds')).toBeInTheDocument();
  expect(screen.getByText('120')).toBeInTheDocument();
  expect(screen.getByText('TTL Seconds After Finished')).toBeInTheDocument();
  expect(screen.getByText('60')).toBeInTheDocument();
  expect(screen.getByText('Suspend')).toBeInTheDocument();
  expect(screen.getByText('False')).toBeInTheDocument();
});

test('Handles undefined artifact gracefully', () => {
  render(KubeJobArtifact, { artifact: undefined });

  expect(screen.queryByText('Parallelism')).not.toBeInTheDocument();
  expect(screen.queryByText('Completions')).not.toBeInTheDocument();
  expect(screen.queryByText('Backoff Limit')).not.toBeInTheDocument();
  expect(screen.queryByText('Active Deadline Seconds')).not.toBeInTheDocument();
  expect(screen.queryByText('TTL Seconds After Finished')).not.toBeInTheDocument();
  expect(screen.queryByText('Suspend')).not.toBeInTheDocument();
});
