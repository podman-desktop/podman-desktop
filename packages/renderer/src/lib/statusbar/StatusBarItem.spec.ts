/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

import type { StatusBarEntry } from '@desktop-framework/api';
import { fireEvent, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import { iconClass } from './StatusBarItem';
import StatusBarItem from './StatusBarItem.svelte';

beforeAll(() => {
  Object.defineProperty(window, 'executeStatusBarEntryCommand', {
    value: vi.fn(),
  });
});

beforeEach(() => {
  vi.resetAllMocks();
});

test.each([
  {
    activeIconClass: 'fas fa-podman',
    expectedIcon: 'fas fa-podman',
    description: 'check iconClass with font awesome icons',
  },
  {
    activeIconClass: '${podman}',
    expectedIcon: 'podman-desktop-icon-podman',
    description: 'check iconClass with custom icon name',
  },
  {
    activeIconClass: 'fas fa-sync~spin',
    expectedIcon: 'fas fa-sync animate-spin',
    description: 'check iconClass with font awesome icons and spinning',
  },
])('$description', ({ activeIconClass, expectedIcon }) => {
  const statusBarEntry: StatusBarEntry = {
    enabled: true,
    activeIconClass,
  };

  const icon = iconClass(statusBarEntry);
  expect(icon).toBe(expectedIcon);
});

test('expect dot not rendered', async () => {
  const statusBarEntry: StatusBarEntry = {
    enabled: true,
    activeIconClass: '${podman}',
    highlight: false,
  };

  render(StatusBarItem, { entry: statusBarEntry });

  const dot = screen.queryByRole('status');
  expect(dot).toBeNull();
});

test('expect dot rendered', () => {
  const statusBarEntry: StatusBarEntry = {
    enabled: true,
    activeIconClass: '${podman}',
    highlight: true,
  };

  render(StatusBarItem, { entry: statusBarEntry });

  const dot = screen.getByRole('status');
  expect(dot).toBeDefined();
});

test('expect an icon-only entry to be named by its tooltip', () => {
  const statusBarEntry: StatusBarEntry = {
    enabled: true,
    tooltip: 'Help',
    activeIconClass: 'fa fa-question-circle',
  };

  render(StatusBarItem, { entry: statusBarEntry });

  expect(screen.getByRole('button', { name: 'Help' })).toBeInTheDocument();
});

test('expect a whitespace-only text to fall back to the tooltip as accessible name', () => {
  const statusBarEntry: StatusBarEntry = {
    enabled: true,
    text: ' ',
    tooltip: 'Help',
    activeIconClass: 'fa fa-question-circle',
  };

  render(StatusBarItem, { entry: statusBarEntry });

  expect(screen.getByRole('button', { name: 'Help' })).toBeInTheDocument();
});

test('expect the entry text to be the accessible name when present', () => {
  const statusBarEntry: StatusBarEntry = {
    enabled: true,
    text: 'v1.31.0',
    tooltip: 'Using version v1.31.0',
  };

  render(StatusBarItem, { entry: statusBarEntry });

  expect(screen.getByRole('button', { name: 'v1.31.0' })).toBeInTheDocument();
});

test('expect the tooltip to be shown on hover instead of a native title', async () => {
  const statusBarEntry: StatusBarEntry = {
    enabled: true,
    text: 'Podman',
    tooltip: 'Podman status',
    activeIconClass: '${podman}',
  };

  render(StatusBarItem, { entry: statusBarEntry });

  const item = screen.getByRole('button');
  expect(item).not.toHaveAttribute('title');

  await fireEvent.mouseEnter(item);
  expect(screen.getByRole('tooltip')).toHaveTextContent('Podman status');
});

test('expect no tooltip when the entry has none', async () => {
  const statusBarEntry: StatusBarEntry = {
    enabled: true,
    text: 'Podman',
    activeIconClass: '${podman}',
  };

  render(StatusBarItem, { entry: statusBarEntry });

  await fireEvent.mouseEnter(screen.getByRole('button'));
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('expect click on the item with command/args', async () => {
  const statusBarEntry: StatusBarEntry = {
    enabled: true,
    activeIconClass: '${podman}',
    command: 'my.command',
    commandArgs: ['arg1', 'arg2'],
  };

  render(StatusBarItem, { entry: statusBarEntry });

  /// get the item and click on it
  const item = screen.getByRole('button');
  await userEvent.click(item);

  // check we've called executeStatusBarEntryCommand
  expect(window.executeStatusBarEntryCommand).toHaveBeenCalledWith('my.command', ['arg1', 'arg2']);
});

test('expect click on the item with command but proxy args', async () => {
  const statusBarEntry: StatusBarEntry = {
    enabled: true,
    activeIconClass: '${podman}',
    command: 'my.command',
  };

  // here we don't have real args, but we are faking a proxy object
  const obj1 = {
    toJSON(): string {
      return 'arg1';
    },
  };
  const obj2 = {
    toJSON(): string {
      return 'arg2';
    },
  };
  const targetArray = [obj1, obj2];

  statusBarEntry.commandArgs = targetArray;

  render(StatusBarItem, { entry: statusBarEntry });

  /// get the item and click on it
  const item = screen.getByRole('button');
  await userEvent.click(item);

  // check we've called executeStatusBarEntryCommand but not with uncloneable objects, but with their values
  expect(window.executeStatusBarEntryCommand).toHaveBeenCalledWith('my.command', ['arg1', 'arg2']);
});
