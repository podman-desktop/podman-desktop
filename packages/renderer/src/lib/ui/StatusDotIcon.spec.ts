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

import StatusDotIcon from './StatusDotIcon.svelte';

const allStatuses = [
  'running',
  'terminated',
  'waiting',
  'stopped',
  'paused',
  'exited',
  'dead',
  'created',
  'degraded',
  'upgrading',
  'downgrading',
  'downloadable',
];

const statusColors: Record<string, string> = {
  upgrading: 'var(--pd-status-waiting)',
  downgrading: 'var(--pd-status-waiting)',
  downloadable: 'var(--pd-status-ready)',
};

test.each(allStatuses)('Expect SVG icon to render for %s status', (status: string) => {
  render(StatusDotIcon, { status });
  const svg = screen.getByTestId('status-dot-icon');
  expect(svg).toBeInTheDocument();
  expect(svg.tagName.toLowerCase()).toBe('svg');
});

test.each(allStatuses)('Expect correct aria-label for %s status', (status: string) => {
  render(StatusDotIcon, { status });
  const svg = screen.getByTestId('status-dot-icon');
  const expected = status.charAt(0).toUpperCase() + status.slice(1);
  expect(svg).toHaveAttribute('aria-label', expected);
});

test.each(allStatuses)('Expect role="img" for %s status', (status: string) => {
  render(StatusDotIcon, { status });
  const svg = screen.getByTestId('status-dot-icon');
  expect(svg).toHaveAttribute('role', 'img');
});

test.each(allStatuses)('Expect correct fill color for %s status', (status: string) => {
  render(StatusDotIcon, { status });
  const svg = screen.getByTestId('status-dot-icon');
  const path = svg.querySelector('path');
  expect(path).not.toBeNull();
  expect(path).toHaveAttribute('fill', statusColors[status] ?? `var(--pd-status-${status})`);
});

test.each([
  [
    'upgrading',
    'M6 0a6 6 0 1 1 0 12A6 6 0 0 1 6 0m0 2L2.875 5.125a.884.884 0 0 0 1.25 1.25L5 5.5v3.75a.75.75 0 0 0 .75.75h.5A.75.75 0 0 0 7 9.25V5.5l.875.875a.884.884 0 0 0 1.25-1.25z',
  ],
  [
    'downgrading',
    'M6 0a6 6 0 1 1 0 12A6 6 0 0 1 6 0m-.25 2a.75.75 0 0 0-.75.75v3.752l-.875-.875a.884.884 0 0 0-1.25 1.25L6 10.002l3.125-3.125a.884.884 0 0 0-1.25-1.25L7 6.502V2.75A.75.75 0 0 0 6.25 2z',
  ],
  ['downloadable', 'M6 0a6 6 0 1 1 0 12A6 6 0 0 1 6 0'],
])('Expect the designed glyph path for %s status', (status, pathData) => {
  render(StatusDotIcon, { status });

  expect(screen.getByTestId('status-dot-icon').querySelector('path')).toHaveAttribute('d', pathData);
});

test('Expect unknown status to use unknown fill color', () => {
  render(StatusDotIcon, { status: 'somethingelse' });
  const svg = screen.getByTestId('status-dot-icon');
  const path = svg.querySelector('path');
  expect(path).toHaveAttribute('fill', 'var(--pd-status-unknown)');
});

test('Expect default size to be 12', () => {
  render(StatusDotIcon, { status: 'running' });
  const svg = screen.getByTestId('status-dot-icon');
  expect(svg).toHaveAttribute('width', '12');
  expect(svg).toHaveAttribute('height', '12');
});

test('Expect custom size to be applied', () => {
  render(StatusDotIcon, { status: 'running', size: '16' });
  const svg = screen.getByTestId('status-dot-icon');
  expect(svg).toHaveAttribute('width', '16');
  expect(svg).toHaveAttribute('height', '16');
});

test('Expect custom class to be applied', () => {
  render(StatusDotIcon, { status: 'running', class: 'my-custom-class' });
  const svg = screen.getByTestId('status-dot-icon');
  expect(svg).toHaveClass('my-custom-class');
});
