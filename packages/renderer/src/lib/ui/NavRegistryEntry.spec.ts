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

import { createSortable } from '@dnd-kit/svelte/sortable';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { render, screen } from '@testing-library/svelte';
import type { TinroRouteMeta } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import type { NavigationRegistryEntry } from '/@/stores/navigation/navigation-registry';

import NavRegistryEntry from './NavRegistryEntry.svelte';

vi.mock(import('@dnd-kit/svelte/sortable'));

beforeEach(() => {
  vi.resetAllMocks();
  // Mock the animate function
  HTMLElement.prototype.animate = vi.fn().mockReturnValue({
    finished: Promise.resolve(),
    cancel: vi.fn(),
  });
  vi.mocked(createSortable).mockReturnValue({
    attach: vi.fn(),
  } as unknown as ReturnType<typeof createSortable>);
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
  render(NavRegistryEntry, { entry, meta, expanded: false, index: 0 });

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
  render(NavRegistryEntry, { entry, meta, expanded: false, index: 0 });

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
  render(NavRegistryEntry, { entry, meta, expanded: true, index: 0 });

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
  render(NavRegistryEntry, { entry, meta, expanded: false, index: 0 });

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
    index: 0,
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
  render(NavRegistryEntry, { entry, meta: { url: '/test' } as TinroRouteMeta, expanded: false, index: 0 });

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
    index: 0,
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
    index: 0,
    title: 'Hold to reorder',
  });

  expect(screen.getByRole('link', { name: 'Item1' })).toHaveAttribute('title', 'Hold to reorder');
});

test('registers the entry as a sortable identified by its link', () => {
  const entry: NavigationRegistryEntry = {
    name: 'Item1',
    icon: { faIcon: { definition: faPuzzlePiece, size: 'lg' } },
    tooltip: 'Item tooltip',
    link: '/mylink',
    counter: 0,
    destinations: [],
    type: 'entry',
  };
  render(NavRegistryEntry, { entry, meta: { url: '/test' } as TinroRouteMeta, expanded: false, index: 3 });

  const input = vi.mocked(createSortable).mock.lastCall?.[0];
  expect(input).toBeDefined();
  expect(input?.id).toBe('/mylink');
  expect(input?.index).toBe(3);
  expect(screen.getByRole('link', { name: 'Item1' })).toBeInTheDocument();
});
