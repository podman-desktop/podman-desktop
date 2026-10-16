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
import { expect, test } from 'vitest';

import type { ExtensionLifecycleState } from './extension-status';
import ExtensionStatus from './ExtensionStatus.svelte';

interface ExpectedPresentation {
  status: ExtensionLifecycleState;
  icon: string;
  iconColor: string;
  label: string;
  labelClass: string;
}

const presentations: ExpectedPresentation[] = [
  {
    status: 'installed',
    icon: 'Running',
    iconColor: 'var(--pd-status-running)',
    label: 'Installed',
    labelClass: 'text-(--pd-status-running)',
  },
  {
    status: 'disabled',
    icon: 'Stopped',
    iconColor: 'var(--pd-status-stopped)',
    label: 'Disabled',
    labelClass: 'text-(--pd-status-stopped)',
  },
  {
    status: 'enabling',
    icon: 'Waiting',
    iconColor: 'var(--pd-status-waiting)',
    label: 'Enabling',
    labelClass: 'text-(--pd-status-waiting)',
  },
  {
    status: 'disabling',
    icon: 'Waiting',
    iconColor: 'var(--pd-status-waiting)',
    label: 'Disabling',
    labelClass: 'text-(--pd-status-waiting)',
  },
  {
    status: 'missing-dependency',
    icon: 'Degraded',
    iconColor: 'var(--pd-status-degraded)',
    label: 'Missing dependency',
    labelClass: 'text-(--pd-status-degraded)',
  },
  {
    status: 'failed',
    icon: 'Terminated',
    iconColor: 'var(--pd-status-terminated)',
    label: 'Failed',
    labelClass: 'text-(--pd-status-terminated)',
  },
  {
    status: 'incompatible',
    icon: 'Degraded',
    iconColor: 'var(--pd-status-degraded)',
    label: 'Incompatible',
    labelClass: 'text-(--pd-status-degraded)',
  },
  {
    status: 'upgrading',
    icon: 'Upgrading',
    iconColor: 'var(--pd-status-waiting)',
    label: 'Upgrading',
    labelClass: 'text-(--pd-status-waiting)',
  },
  {
    status: 'downgrading',
    icon: 'Downgrading',
    iconColor: 'var(--pd-status-waiting)',
    label: 'Downgrading',
    labelClass: 'text-(--pd-status-waiting)',
  },
];

test.each(presentations)(
  'renders icon, color, and label for $status',
  ({ status, icon, iconColor, label, labelClass }) => {
    render(ExtensionStatus, { status });

    const statusIcon = screen.getByTestId('status-dot-icon');
    expect(statusIcon).toHaveAttribute('aria-label', icon);
    expect(statusIcon.querySelector('path')).toHaveAttribute('fill', iconColor);

    const statusLabel = screen.getByText(label);
    expect(statusLabel).toHaveClass(labelClass);
  },
);

test.each([
  ['started', 'Installed'],
  ['starting', 'Enabling'],
  ['stopped', 'Disabled'],
  ['stopping', 'Disabling'],
  ['failed', 'Failed'],
])('renders extension state %s as %s', (status, label) => {
  render(ExtensionStatus, { status });

  expect(screen.getByText(label)).toBeInTheDocument();
});

test.each([
  ['downloadable', 'Downloadable', 'Downloadable', 'var(--pd-status-ready)'],
  ['unexpected', 'UNEXPECTED', 'Unknown', 'var(--pd-status-unknown)'],
])('renders non-lifecycle status %s', (status, label, icon, iconColor) => {
  render(ExtensionStatus, { status });

  expect(screen.getByText(label)).toBeInTheDocument();
  const statusIcon = screen.getByTestId('status-dot-icon');
  expect(statusIcon).toHaveAttribute('aria-label', icon);
  expect(statusIcon.querySelector('path')).toHaveAttribute('fill', iconColor);
});

test('forwards HTML attributes to the status container', () => {
  render(ExtensionStatus, {
    status: 'installed',
    class: 'custom-class',
    title: 'Extension status',
    'data-source': 'extension',
  });

  const status = screen.getByTestId('extension-status');
  expect(status).toHaveClass('custom-class');
  expect(status).toHaveAttribute('title', 'Extension status');
  expect(status).toHaveAttribute('data-source', 'extension');
});
