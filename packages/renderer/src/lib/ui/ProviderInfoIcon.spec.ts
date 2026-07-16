/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import ProviderInfoIcon from './ProviderInfoIcon.svelte';

test.each([
  { status: 'started' as const, expectedFill: 'var(--pd-status-running)', expectedLabel: 'Running' },
  { status: 'stopped' as const, expectedFill: 'var(--pd-status-stopped)', expectedLabel: 'Stopped' },
  { status: 'starting' as const, expectedFill: 'var(--pd-status-waiting)', expectedLabel: 'Waiting' },
  { status: 'stopping' as const, expectedFill: 'var(--pd-status-stopped)', expectedLabel: 'Stopped' },
  { status: 'unknown' as const, expectedFill: 'var(--pd-status-unknown)', expectedLabel: 'Unknown' },
])('renders StatusDotIcon for $status as $expectedLabel', ({ status, expectedFill, expectedLabel }) => {
  render(ProviderInfoIcon, { status });
  const svg = screen.getByTestId('status-dot-icon');
  expect(svg).toBeInTheDocument();
  expect(svg.tagName.toLowerCase()).toBe('svg');
  expect(svg).toHaveAttribute('role', 'img');
  expect(svg).toHaveAttribute('aria-label', expectedLabel);
  expect(svg.querySelector('path')).toHaveAttribute('fill', expectedFill);
});

test('Expect missing status to use unknown', () => {
  render(ProviderInfoIcon);
  const svg = screen.getByTestId('status-dot-icon');
  expect(svg).toHaveAttribute('aria-label', 'Unknown');
  expect(svg.querySelector('path')).toHaveAttribute('fill', 'var(--pd-status-unknown)');
});

test('Expect default size to be 12', () => {
  render(ProviderInfoIcon, { status: 'started' });
  const svg = screen.getByTestId('status-dot-icon');
  expect(svg).toHaveAttribute('width', '12');
  expect(svg).toHaveAttribute('height', '12');
});

test('Expect custom size to be applied', () => {
  render(ProviderInfoIcon, { status: 'started', size: '16' });
  const svg = screen.getByTestId('status-dot-icon');
  expect(svg).toHaveAttribute('width', '16');
  expect(svg).toHaveAttribute('height', '16');
});

test('Expect custom class to be applied', () => {
  render(ProviderInfoIcon, { status: 'started', class: 'my-custom-class' });
  const svg = screen.getByTestId('status-dot-icon');
  expect(svg).toHaveClass('my-custom-class');
});
