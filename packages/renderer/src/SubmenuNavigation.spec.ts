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
import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { get } from 'svelte/store';
import type { TinroRouteMeta } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import { t } from '/@/lib/i18n/translations.svelte';

import { lastSubmenuPages } from './stores/breadcrumb';
import type { NavigationRegistryEntry } from './stores/navigation/navigation-registry';
import SubmenuNavigation from './SubmenuNavigation.svelte';

vi.mock(import('@podman-desktop/ui-svelte'));
vi.mock(import('/@/lib/i18n/translations.svelte'));

beforeEach(() => {
  vi.mocked(t).mockReset();
});

test('SubmenuNavigation displays a title and builds SettingsNavItem components', async () => {
  const SettingsNavItemMock = vi.mocked(SettingsNavItem);
  render(SubmenuNavigation, {
    title: 'A title',
    items: [
      {
        tooltip: 'entry 1',
        link: '/link1',
      } as unknown as NavigationRegistryEntry,
      {
        tooltip: 'entry 2',
        link: '/link2',
      } as unknown as NavigationRegistryEntry,
    ],
    meta: {
      url: '/link1/subpath',
    } as TinroRouteMeta,
    link: '/link',
  });

  // title should be displayed
  const title = screen.getByText('A title');
  expect(title).toBeDefined();

  expect(SettingsNavItemMock).toHaveBeenCalledTimes(2);
  expect(SettingsNavItemMock).toHaveBeenNthCalledWith(1, expect.anything(), {
    title: 'entry 1',
    href: '/link1',
    selected: true,
    onClick: expect.any(Function),
  });
  expect(SettingsNavItemMock).toHaveBeenNthCalledWith(2, expect.anything(), {
    title: 'entry 2',
    href: '/link2',
    selected: false,
    onClick: expect.any(Function),
  });
});

test('set up and update lastSubmenuPages store for each submenu', async () => {
  lastSubmenuPages.set({});
  render(SubmenuNavigation, {
    title: 'page 1',
    items: [],
    meta: {
      url: '/link1/subpath',
    } as TinroRouteMeta,
    link: '/page1',
  });
  await tick();

  expect(get(lastSubmenuPages)['page 1']).toBe('/page1');
});

test('translates submenu labels while preserving selection, routes and history keys', async () => {
  const title = '\u62e1\u5f35\u6a5f\u80fd';
  const label = '\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9';
  const labels: Record<string, string> = {
    'navigation.Extensions': title,
    'navigation.Dashboard': label,
  };
  vi.mocked(t).mockImplementation(key => labels[key]);
  lastSubmenuPages.set({});
  render(SubmenuNavigation, {
    title: 'Extensions',
    link: '/extensions',
    items: [
      { tooltip: 'Dashboard', link: '/extensions/dashboard' } as NavigationRegistryEntry,
      { tooltip: 'Custom extension', link: '/extensions/custom' } as NavigationRegistryEntry,
    ],
    meta: { url: '/extensions/dashboard/details' } as TinroRouteMeta,
  });
  await tick();

  screen.getByText(title);
  expect(SettingsNavItem).toHaveBeenCalledWith(expect.anything(), {
    title: label,
    href: '/extensions/dashboard',
    selected: true,
    onClick: expect.any(Function),
  });
  expect(SettingsNavItem).toHaveBeenCalledWith(expect.anything(), {
    title: 'Custom extension',
    href: '/extensions/custom',
    selected: false,
    onClick: expect.any(Function),
  });
  expect(get(lastSubmenuPages)).toEqual({ Extensions: '/extensions' });
  const props = vi.mocked(SettingsNavItem).mock.calls.at(-1)?.[1];
  props?.onClick?.();
  expect(get(lastSubmenuPages)).toEqual({ Extensions: '/extensions/custom' });
});
