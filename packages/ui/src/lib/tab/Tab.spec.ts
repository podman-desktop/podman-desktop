/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import Tab from './Tab.svelte';

test('check link element is created by using url and title and correct class when selected', async () => {
  render(Tab, { selected: true, url: '/url', title: 'title' });

  const item = screen.getByText('title');
  expect(item).toBeDefined();
  expect((item as HTMLAnchorElement).href.endsWith('/url')).toBeTruthy();
  expect(item.textContent).equals('title');
  expect(item.parentElement).not.toHaveClass('border-transparent');
  expect(item.parentElement).toHaveClass('focus:outline-[var(--pd-tab-highlight)]');
});

test('check link element is created by using url and title and correct class when not selected', async () => {
  render(Tab, { selected: false, url: '/url', title: 'title' });

  const item = screen.getByText('title');
  expect(item).toBeDefined();
  expect((item as HTMLAnchorElement).href.endsWith('/url')).toBeTruthy();
  expect(item.textContent).equals('title');
  expect(item.parentElement).toHaveClass('border-transparent');
});
