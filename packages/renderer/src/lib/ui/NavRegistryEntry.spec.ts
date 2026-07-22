/**********************************************************************
 * Copyright (C) 2024-2026 Red Hat, Inc.
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
import { render, screen } from '@testing-library/svelte';
import type { TinroRouteMeta } from 'tinro';
import { beforeAll, expect, test, vi } from 'vitest';

import type { NavigationRegistryEntry } from '/@/stores/navigation/navigation-registry';

import NavRegistryEntry from './NavRegistryEntry.svelte';

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

test('Expect pin icon next to the title when entry is pinned and expanded', async () => {
  const entry: NavigationRegistryEntry = {
    name: 'Item1',
    hidden: false,
    pinned: true,
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

  const title = screen.queryByLabelText('Item1 title');
  expect(title).toBeInTheDocument();

  const pinIndicator = screen.queryByLabelText('Item1 is pinned to top');
  expect(pinIndicator).toBeInTheDocument();
});

test('Expect pin badge on the icon when entry is pinned and collapsed', async () => {
  const entry: NavigationRegistryEntry = {
    name: 'Item1',
    hidden: false,
    pinned: true,
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

  const pinIndicator = screen.queryByLabelText('Item1 is pinned to top');
  expect(pinIndicator).toBeInTheDocument();
});

test('Expect no pin indicator when entry is not pinned', async () => {
  const entry: NavigationRegistryEntry = {
    name: 'Item1',
    hidden: false,
    pinned: false,
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

  const pinIndicator = screen.queryByLabelText('Item1 is pinned to top');
  expect(pinIndicator).not.toBeInTheDocument();
});
