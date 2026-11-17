/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

/* eslint-disable @typescript-eslint/no-explicit-any */

import '@testing-library/jest-dom/vitest';

import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { fireEvent, render, screen } from '@testing-library/svelte';
import type { TinroRouteMeta } from 'tinro';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import { t } from '/@/lib/i18n/translations.svelte';
import type { NavigationRegistryEntry } from '/@/stores/navigation/navigation-registry';

import NavRegistryEntry from './NavRegistryEntry.svelte';

vi.mock(import('/@/lib/i18n/translations.svelte'));

beforeEach(() => {
  vi.mocked(t).mockReset();
});

beforeAll(() => {
  // Mock the animate function
  HTMLElement.prototype.animate = vi.fn().mockReturnValue({
    finished: Promise.resolve(),
    cancel: vi.fn(),
  });
});

test('Expect entry is rendered', async () => {
  const entry: NavigationRegistryEntry = {
    name: 'Item1',
    hidden: false,
    icon: {
      faIcon: { definition: faPuzzlePiece, size: 'lg' },
    },
    tooltip: 'Item tooltip',
    link: '/mylink',
    counter: 0,
    destinations: [],
    type: 'entry',
  };
  const meta = { url: '/test' } as TinroRouteMeta;
  render(NavRegistryEntry, { entry, meta, expanded: false });

  const content = screen.queryByLabelText('Item1');
  expect(content).toBeInTheDocument();
});

test('Expect hidden entry is not rendered', async () => {
  const entry: NavigationRegistryEntry = {
    name: 'Item1',
    hidden: true,
    icon: {
      faIcon: { definition: faPuzzlePiece, size: 'lg' },
    },
    tooltip: 'Item tooltip',
    link: '/mylink',
    counter: 0,
    destinations: [],
    type: 'entry',
  };
  const meta = { url: '/test' } as TinroRouteMeta;
  render(NavRegistryEntry, { entry, meta, expanded: false });

  const content = screen.queryByLabelText('Item1');
  expect(content).not.toBeInTheDocument();
});

test('Expect entry to have title if expanded is true', async () => {
  const entry: NavigationRegistryEntry = {
    name: 'Item1',
    hidden: false,
    icon: {
      faIcon: { definition: faPuzzlePiece, size: 'lg' },
    },
    tooltip: 'Item tooltip',
    link: '/mylink',
    counter: 0,
    destinations: [],
    type: 'entry',
  };
  const meta = { url: '/test' } as TinroRouteMeta;
  render(NavRegistryEntry, { entry, meta, expanded: true });

  const content = screen.queryByLabelText('Item1 title');
  expect(content).toBeInTheDocument();
  expect(content).toHaveTextContent('Item1');
});

test('Expect entry to not have title when collapsed', async () => {
  const entry: NavigationRegistryEntry = {
    name: 'Item1',
    hidden: false,
    icon: {
      faIcon: { definition: faPuzzlePiece, size: 'lg' },
    },
    tooltip: 'Item tooltip',
    link: '/mylink',
    counter: 0,
    destinations: [],
    type: 'entry',
  };
  const meta = { url: '/test' } as TinroRouteMeta;
  render(NavRegistryEntry, { entry, meta, expanded: false });

  const content = screen.queryByLabelText('Item1 title');
  expect(content).not.toBeInTheDocument();
});

test('forwards aria-keyshortcuts to the navigation link', () => {
  const entry: NavigationRegistryEntry = {
    name: 'Item1',
    hidden: false,
    icon: { faIcon: { definition: faPuzzlePiece, size: 'lg' } },
    tooltip: 'Item tooltip',
    link: '/mylink',
    counter: 0,
    destinations: [],
    type: 'entry',
  };
  render(NavRegistryEntry, {
    entry,
    meta: { url: '/test' } as TinroRouteMeta,
    expanded: false,
    'aria-keyshortcuts': 'Control+ArrowUp Control+ArrowDown',
  });

  const link = screen.getByRole('link', { name: 'Item1' });
  expect(link).toHaveAttribute('aria-keyshortcuts', 'Control+ArrowUp Control+ArrowDown');
});

test('does not add aria-keyshortcuts when it is not provided', () => {
  const entry: NavigationRegistryEntry = {
    name: 'Item1',
    hidden: false,
    icon: { faIcon: { definition: faPuzzlePiece, size: 'lg' } },
    tooltip: 'Item tooltip',
    link: '/mylink',
    counter: 0,
    destinations: [],
    type: 'entry',
  };
  render(NavRegistryEntry, { entry, meta: { url: '/test' } as TinroRouteMeta, expanded: false });

  expect(screen.getByRole('link', { name: 'Item1' })).not.toHaveAttribute('aria-keyshortcuts');
});

test('forwards class to the navigation link', () => {
  const entry: NavigationRegistryEntry = {
    name: 'Item1',
    hidden: false,
    icon: { faIcon: { definition: faPuzzlePiece, size: 'lg' } },
    tooltip: 'Item tooltip',
    link: '/mylink',
    counter: 0,
    destinations: [],
    type: 'entry',
  };
  render(NavRegistryEntry, {
    entry,
    meta: { url: '/test' } as TinroRouteMeta,
    expanded: false,
    class: 'custom-nav-item',
  });

  const link = screen.getByRole('link', { name: 'Item1' });
  expect(link).toHaveClass('custom-nav-item');
  expect(link).toHaveClass('focus-visible:outline-2');
});

test('forwards title to the navigation link when expanded', () => {
  const entry: NavigationRegistryEntry = {
    name: 'Item1',
    hidden: false,
    icon: { faIcon: { definition: faPuzzlePiece, size: 'lg' } },
    tooltip: 'Item tooltip',
    link: '/mylink',
    counter: 0,
    destinations: [],
    type: 'entry',
  };
  render(NavRegistryEntry, {
    entry,
    meta: { url: '/test' } as TinroRouteMeta,
    expanded: true,
    title: 'Hold to reorder',
  });

  expect(screen.getByRole('link', { name: 'Item1' })).toHaveAttribute('title', 'Hold to reorder');
});

test.each([true, false])('translates entry labels with expanded=%s without changing registry data', async expanded => {
  const label = '\u30b3\u30f3\u30c6\u30ca\u30fc';
  vi.mocked(t).mockImplementation(key => (key === 'navigation.Containers' ? label : undefined));
  const entry: NavigationRegistryEntry = {
    name: 'Containers',
    tooltip: 'Containers',
    icon: { faIcon: { definition: faPuzzlePiece, size: 'lg' } },
    link: '/containers',
    counter: 3,
    destinations: [],
    type: 'entry',
  };
  render(NavRegistryEntry, { entry, meta: { url: '/containers' } as TinroRouteMeta, expanded });

  expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', '/containers');
  if (expanded) {
    expect(screen.getByLabelText('Containers title')).toHaveTextContent(label);
  } else {
    await fireEvent.mouseEnter(screen.getByTestId('tooltip-trigger'));
    expect(await screen.findByRole('tooltip')).toHaveTextContent(`${label} (3)`);
  }
  expect(entry.name).toBe('Containers');
  expect(entry.tooltip).toBe('Containers');
  expect(t).toHaveBeenCalledWith('navigation.Containers');
});

test('preserves extension labels when no translation exists', async () => {
  const entry: NavigationRegistryEntry = {
    name: 'Custom extension',
    tooltip: 'Custom extension tooltip',
    icon: { faIcon: { definition: faPuzzlePiece, size: 'lg' } },
    link: '/extension/custom',
    counter: 0,
    destinations: [],
    type: 'entry',
  };
  const { rerender } = render(NavRegistryEntry, { entry, meta: { url: '/' } as TinroRouteMeta, expanded: true });

  expect(screen.getByRole('link', { name: 'Custom extension' })).toHaveAttribute('href', '/extension/custom');
  expect(screen.getByLabelText('Custom extension title')).toHaveTextContent('Custom extension');
  await rerender({ expanded: false });
  await fireEvent.mouseEnter(screen.getByTestId('tooltip-trigger'));
  expect(await screen.findByRole('tooltip')).toHaveTextContent('Custom extension tooltip');
});
