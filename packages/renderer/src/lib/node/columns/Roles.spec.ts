/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import type { NodeUI } from '/@/lib/node/NodeUI';

import Roles from './Roles.svelte';

const nodeControlPlane: NodeUI = {
  name: 'main-node',
  status: 'active',
  role: 'control-plane',
} as NodeUI;

const nodeWorker: NodeUI = {
  name: 'second-node',
  status: 'active',
  role: 'node',
} as NodeUI;

test('Expect role display for control plane', async () => {
  render(Roles, { object: nodeControlPlane });

  const text = screen.getByText('Control Plane');
  expect(text).toBeInTheDocument();
});

test('Expect role display for node', async () => {
  render(Roles, { object: nodeWorker });

  const text = screen.getByText('Node');
  expect(text).toBeInTheDocument();
});

test('Expect GPU display if hasGpu is true', async () => {
  render(Roles, { object: { ...nodeControlPlane, hasGpu: true } });

  const text = screen.getByText('GPU');
  expect(text).toBeInTheDocument();
});

test('Expect no GPU display if hasGpu is false', async () => {
  render(Roles, { object: { ...nodeControlPlane, hasGpu: false } });

  const text = screen.queryByText('GPU');
  expect(text).not.toBeInTheDocument();
});
