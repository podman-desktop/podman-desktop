/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import { fireEvent } from '@testing-library/dom';
import { render, screen } from '@testing-library/svelte';
import { router } from 'tinro';
import { afterEach, expect, test, vi } from 'vitest';

import { tabPreferences } from '/@/stores/layout/tab-preferences.svelte';
import { MAIN_TAB, tabsState } from '/@/stores/layout/tabs.svelte';

import PodColumnName from './PodColumnName.svelte';
import type { PodInfoUI } from './PodInfoUI';

afterEach(() => {
  tabPreferences.tabsEnabled = false;
});

const pod: PodInfoUI = {
  id: 'pod-id',
  shortId: 'short-id',
  name: 'my-pod',
  engineId: 'podman',
  engineName: '',
  status: '',
  age: '',
  created: '',
  selected: false,
  containers: [],
  node: 'node1',
  namespace: 'default',
};

test('Expect simple column styling', async () => {
  render(PodColumnName, { object: pod });

  const text = screen.getByText(pod.name);
  expect(text).toBeInTheDocument();
  expect(text).toHaveClass('text-[var(--pd-table-body-text-highlight)]');
  expect(text).toHaveClass('overflow-hidden');
  expect(text).toHaveClass('text-ellipsis');
  expect(text.parentElement).toHaveClass('text-left');

  const id = screen.getByText(pod.shortId);
  expect(id).toBeInTheDocument();
  expect(id).toHaveClass('text-[var(--pd-table-body-text)]');
});

test('Expect clicking works', async () => {
  render(PodColumnName, { object: pod });

  const text = screen.getByText(pod.name);
  expect(text).toBeInTheDocument();

  // test click
  const routerGotoSpy = vi.spyOn(router, 'goto');

  fireEvent.click(text);

  expect(routerGotoSpy).toBeCalledWith('/pods/podman/my-pod/podman/');
});

test('Expect middle-click opens the pod in a background tab', async () => {
  tabPreferences.tabsEnabled = true;
  tabsState.tabs = [{ id: MAIN_TAB, title: 'Main', pinned: true, stack: [], index: -1 }];
  tabsState.activeId = MAIN_TAB;
  render(PodColumnName, { object: pod });

  const routerGotoSpy = vi.spyOn(router, 'goto');
  fireEvent(screen.getByText(pod.name), new MouseEvent('auxclick', { bubbles: true, button: 1 }));

  expect(tabsState.activeId).toBe(MAIN_TAB);
  expect(tabsState.tabs.some(tab => tab.id === '/pods/podman/my-pod/podman')).toBe(true);
  expect(routerGotoSpy).not.toHaveBeenCalled();
});
