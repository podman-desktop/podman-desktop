/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import type { DeploymentCondition, DeploymentUI } from '/@/lib/deployments/DeploymentUI';

import Conditions from './Conditions.svelte';

function createDeploymentUI(conditions: DeploymentCondition[]): DeploymentUI {
  return {
    uid: '123',
    name: 'my-deployment',
    status: '',
    namespace: '',
    replicas: 0,
    ready: 0,
    selected: false,
    conditions: conditions,
  };
}

test('Expect column styling available', async () => {
  const deployment = createDeploymentUI([
    { type: 'Available', message: 'Running fine', reason: 'MinimumReplicasAvailable' },
  ]);
  render(Conditions, { object: deployment });

  const text = screen.getByText('Available');
  expect(text).toBeInTheDocument();

  const svg = text.parentElement?.querySelector('svg');
  expect(svg).toBeInTheDocument();
  expect(svg).toHaveClass('text-[var(--pd-status-running)]');
});

test('Expect column styling unavailable', async () => {
  const deployment = createDeploymentUI([
    { type: 'Available', message: 'Running fine', reason: 'MinimumReplicasUnavailable' },
  ]);
  render(Conditions, { object: deployment });

  const text = screen.getByText('Unavailable');
  expect(text).toBeInTheDocument();

  const svg = text.parentElement?.querySelector('svg');
  expect(svg).toBeInTheDocument();
  expect(svg).toHaveClass('text-[var(--pd-status-degraded)]');
});

test.each([
  {
    name: 'updated',
    type: 'Progressing',
    reason: 'ReplicaSetUpdated',
    displayText: 'Updated',
    statusClass: 'text-[var(--pd-status-updated)]',
  },
  {
    name: 'new replica set',
    type: 'Progressing',
    reason: 'NewReplicaSetCreated',
    displayText: 'New Replica Set',
    statusClass: 'text-[var(--pd-status-updated)]',
  },
  {
    name: 'progressed',
    type: 'Progressing',
    reason: 'NewReplicaSetAvailable',
    displayText: 'Progressed',
    statusClass: 'text-[var(--pd-status-running)]',
  },
  {
    name: 'scaled up',
    type: 'Progressing',
    reason: 'ReplicaSetScaledUp',
    displayText: 'Scaled Up',
    statusClass: 'text-[var(--pd-status-updated)]',
  },
  {
    name: 'scaled down',
    type: 'Progressing',
    reason: 'ReplicaSetScaledDown',
    displayText: 'Scaled Down',
    statusClass: 'text-[var(--pd-status-updated)]',
  },
  {
    name: 'deadline exceeded',
    type: 'Progressing',
    reason: 'ProgressDeadlineExceeded',
    displayText: 'Deadline Exceeded',
    statusClass: 'text-[var(--pd-status-dead)]',
  },
])('Expect column styling $name', async ({ type, reason, displayText, statusClass }) => {
  const deployment = createDeploymentUI([{ type, message: 'Running fine', reason }]);
  render(Conditions, { object: deployment });

  const text = screen.getByText(displayText);
  expect(text).toBeInTheDocument();

  const svg = text.parentElement?.querySelector('svg');
  expect(svg).toBeInTheDocument();
  expect(svg).toHaveClass(statusClass);
});

test('Expect column styling replica failure', async () => {
  const deployment = createDeploymentUI([
    { type: 'ReplicaFailure', message: 'Running fine', reason: 'ReplicaFailure' },
  ]);
  render(Conditions, { object: deployment });

  const text = screen.getByText('Replica Failure');
  expect(text).toBeInTheDocument();

  const svg = text.parentElement?.querySelector('svg');
  expect(svg).toBeInTheDocument();
  expect(svg).toHaveClass('text-[var(--pd-status-dead)]');
});
