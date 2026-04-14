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

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import type { JobCondition, JobUI } from '/@/lib/job/JobUI';

import Conditions from './Conditions.svelte';

function createJobUI(condition: JobCondition): JobUI {
  return {
    uid: '456',
    name: 'my-job',
    status: '',
    namespace: '',
    condition,
    succeeded: 0,
    completions: 0,
    selected: false,
  };
}

test('Expect column styling completed', async () => {
  const job = createJobUI('completed');
  render(Conditions, { object: job });

  const text = screen.getByText('Completed');
  expect(text).toBeInTheDocument();

  const svg = text.parentElement?.querySelector('svg');
  expect(svg).toBeInTheDocument();
  expect(svg).toHaveClass('text-[var(--pd-status-running)]');
});

test('Expect column styling failed', async () => {
  const job = createJobUI('failed');
  render(Conditions, { object: job });

  const text = screen.getByText('Failed');
  expect(text).toBeInTheDocument();

  const svg = text.parentElement?.querySelector('svg');
  expect(svg).toBeInTheDocument();
  expect(svg).toHaveClass('text-[var(--pd-status-dead)]');
});

test('Expect column styling running', async () => {
  const job = createJobUI('running');
  render(Conditions, { object: job });

  const text = screen.getByText('Running');
  expect(text).toBeInTheDocument();

  const svg = text.parentElement?.querySelector('svg');
  expect(svg).toBeInTheDocument();
  expect(svg).toHaveClass('text-[var(--pd-status-running)]');
});

test('Expect column styling pending', async () => {
  const job = createJobUI('pending');
  render(Conditions, { object: job });

  const text = screen.getByText('Pending');
  expect(text).toBeInTheDocument();

  const svg = text.parentElement?.querySelector('svg');
  expect(svg).toBeInTheDocument();
  expect(svg).toHaveClass('text-[var(--pd-status-starting)]');
});

test('Expect column styling unknown', async () => {
  const job = createJobUI('unknown');
  render(Conditions, { object: job });

  const text = screen.getByText('Unknown');
  expect(text).toBeInTheDocument();

  const svg = text.parentElement?.querySelector('svg');
  expect(svg).toBeInTheDocument();
  expect(svg).toHaveClass('text-[var(--pd-status-degraded)]');
});
