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

import { SettingsNavItem } from '@podman-desktop/ui-svelte';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { get } from 'svelte/store';
import type { TinroRouteMeta } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import { lastSubmenuPages } from './stores/breadcrumb';
import type { NavigationRegistryEntry } from './stores/navigation/navigation-registry';
import SubmenuNavigation from './SubmenuNavigation.svelte';

vi.mock(import('@podman-desktop/ui-svelte'));

beforeEach(() => {
  vi.resetAllMocks();
});

test.each(['Kubernetes', 'Tools'])('qualifies submenu item labels with parent "%s"', parentName => {
  const SettingsNavItemMock = vi.mocked(SettingsNavItem);
  render(SubmenuNavigation, {
    title: parentName,
    items: [
      {
        name: 'Nodes',
        tooltip: 'Nodes',
        link: '/link1',
      } as unknown as NavigationRegistryEntry,
      {
        name: 'Pods',
        tooltip: 'Pods',
        link: '/link2',
      } as unknown as NavigationRegistryEntry,
    ],
    meta: {
      url: '/link1/subpath',
    } as TinroRouteMeta,
    link: '/link',
  });

  expect(SettingsNavItemMock).toHaveBeenCalledTimes(2);
  expect(SettingsNavItemMock).toHaveBeenNthCalledWith(1, expect.anything(), {
    title: `${parentName} > Nodes`,
    href: '/link1',
    selected: true,
    ariaKeyShortcuts: 'Control+ArrowLeft Meta+ArrowLeft',
    onKeyDown: expect.any(Function),
  });
  expect(SettingsNavItemMock).toHaveBeenNthCalledWith(2, expect.anything(), {
    title: `${parentName} > Pods`,
    href: '/link2',
    selected: false,
    ariaKeyShortcuts: 'Control+ArrowLeft Meta+ArrowLeft',
    onKeyDown: expect.any(Function),
  });
});

test('remembers the clicked destination for a submenu', async () => {
  lastSubmenuPages.set({});
  render(SubmenuNavigation, {
    title: 'page 1',
    items: [
      {
        name: 'entry 1',
        tooltip: 'entry 1',
        link: '/link1',
        icon: {},
        counter: 0,
        destinations: [],
        type: 'entry',
      },
    ],
    meta: {
      url: '/link1/subpath',
    } as TinroRouteMeta,
    link: '/page1',
  });
  await tick();

  expect(get(lastSubmenuPages)['page 1']).toBe('/page1');
  await fireEvent.click(screen.getByRole('listitem'));
  expect(get(lastSubmenuPages)['page 1']).toBe('/link1');
});
