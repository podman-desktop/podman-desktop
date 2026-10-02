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
import { describe, expect, test } from 'vitest';

import ExtensionLifecycleStatus, {
  type ExtensionLifecycleStatus as LifecycleStatus,
} from './ExtensionLifecycleStatus.svelte';

interface ExpectedPresentation {
  status: LifecycleStatus;
  icon: string;
  iconColor: string;
  label: string;
  labelColor: string;
}

const presentations: ExpectedPresentation[] = [
  {
    status: 'installed',
    icon: 'Running',
    iconColor: 'var(--pd-status-running)',
    label: 'Installed',
    labelColor: 'var(--pd-status-running)',
  },
  {
    status: 'disabled',
    icon: 'Stopped',
    iconColor: 'var(--pd-status-stopped)',
    label: 'Disabled',
    labelColor: 'var(--pd-status-stopped)',
  },
  {
    status: 'enabling',
    icon: 'Waiting',
    iconColor: 'var(--pd-status-waiting)',
    label: 'Enabling',
    labelColor: 'var(--pd-status-waiting)',
  },
  {
    status: 'disabling',
    icon: 'Waiting',
    iconColor: 'var(--pd-status-waiting)',
    label: 'Disabling',
    labelColor: 'var(--pd-status-waiting)',
  },
  {
    status: 'missing-dependency',
    icon: 'Degraded',
    iconColor: 'var(--pd-status-degraded)',
    label: 'Missing dependency',
    labelColor: 'var(--pd-status-degraded)',
  },
  {
    status: 'failed',
    icon: 'Terminated',
    iconColor: 'var(--pd-status-terminated)',
    label: 'Failed',
    labelColor: 'var(--pd-status-terminated)',
  },
  {
    status: 'incompatible',
    icon: 'Degraded',
    iconColor: 'var(--pd-status-degraded)',
    label: 'Incompatible',
    labelColor: 'var(--pd-status-degraded)',
  },
  {
    status: 'upgrading',
    icon: 'Stopped',
    iconColor: 'var(--pd-status-stopped)',
    label: 'Upgrading',
    labelColor: 'var(--pd-status-stopped)',
  },
  {
    status: 'downgrading',
    icon: 'Stopped',
    iconColor: 'var(--pd-status-stopped)',
    label: 'Downgrading',
    labelColor: 'var(--pd-status-stopped)',
  },
];

describe.each(presentations)('$label lifecycle status', ({ status, icon, iconColor, label, labelColor }) => {
  test('renders the correct icon, color, and label', () => {
    render(ExtensionLifecycleStatus, { status });

    const statusIcon = screen.getByTestId('status-dot-icon');
    expect(statusIcon).toHaveAttribute('aria-label', icon);
    expect(statusIcon.querySelector('path')).toHaveAttribute('fill', iconColor);

    const statusLabel = screen.getByText(label);
    expect(statusLabel).toHaveStyle({ color: labelColor });
  });
});
