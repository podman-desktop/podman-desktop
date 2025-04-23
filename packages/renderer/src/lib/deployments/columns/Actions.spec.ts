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

import type { DeploymentUI } from '../DeploymentUI';
import Actions from './Actions.svelte';

test('Expect action buttons', async () => {
  const deployment: DeploymentUI = {
    uid: '123',
    name: 'my-deployment',
    status: 'RUNNING',
    namespace: '',
    replicas: 0,
    ready: 0,
    selected: false,
    conditions: [],
  };

  render(Actions, { object: deployment });

  const buttons = await screen.findAllByRole('button');
  expect(buttons).toHaveLength(1);
});
