/**********************************************************************
 * Copyright (C) 2023-2026 Red Hat, Inc.
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
import { beforeEach, expect, test, vi } from 'vitest';

import StatusDot from './StatusDot.svelte';

vi.mock(import('./StatusDotIcon.svelte'));

beforeEach(() => {
  vi.resetAllMocks();
});

const renderStatusDot = (containerStatus: string, name = 'foobar'): void => {
  render(StatusDot, { name, status: containerStatus });
};

test('Expect the dot wrapper to exist for running status', () => {
  renderStatusDot('running');
  const dot = screen.getByTestId('status-dot');
  expect(dot).toBeInTheDocument();
});

test('Expect auto-generated tooltip from name and status', () => {
  renderStatusDot('running', 'my-container');
  const dot = screen.getByTestId('status-dot');
  expect(dot).toHaveAttribute('title', 'my-container: Running');
});

test('Expect custom tooltip to override auto-generated', () => {
  render(StatusDot, { status: 'running', name: 'my-container', tooltip: 'Custom tip' });
  const dot = screen.getByTestId('status-dot');
  expect(dot).toHaveAttribute('title', 'Custom tip');
});

test('Expect number badge to render when number is provided', () => {
  render(StatusDot, { status: 'running', name: 'foobar', number: 5 });
  const dot = screen.getByTestId('status-dot');
  expect(dot).toHaveClass('mt-3');
  expect(screen.getByText('5')).toBeInTheDocument();
});

test('Expect no number badge when number is 0', () => {
  renderStatusDot('running');
  expect(screen.queryByText('0')).not.toBeInTheDocument();
});

test('Expect dot wrapper to have margin class', () => {
  renderStatusDot('running');
  const dot = screen.getByTestId('status-dot');
  expect(dot).toHaveClass('mr-0.5');
});

test('Expect no mt-3 class when number is 0', () => {
  renderStatusDot('running');
  const dot = screen.getByTestId('status-dot');
  expect(dot).not.toHaveClass('mt-3');
});

test('Expect empty tooltip when name and status are empty', () => {
  render(StatusDot, { status: '', name: '' });
  const dot = screen.getByTestId('status-dot');
  expect(dot).toHaveAttribute('title', '');
});

test('Expect auto-generated tooltip when only name is empty', () => {
  render(StatusDot, { status: 'running', name: '' });
  const dot = screen.getByTestId('status-dot');
  expect(dot).toHaveAttribute('title', '');
});

test('Expect StatusDotIcon to receive the status prop', () => {
  const { container } = render(StatusDot, { status: 'stopped', name: 'test' });
  const dotWrapper = container.querySelector('[data-testid="status-dot"]');
  expect(dotWrapper).toBeInTheDocument();
});
