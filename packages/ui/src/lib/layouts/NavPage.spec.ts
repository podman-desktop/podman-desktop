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

import { fireEvent, render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import NavPage from './NavPage.svelte';

test('Expect title is defined', async () => {
  const title = 'My Dummy Title';
  render(NavPage, {
    title,
  });
  const headingElement = screen.getByRole('heading', { level: 1, name: title });
  expect(headingElement).toBeInTheDocument();
  // check the text
  expect(headingElement).toHaveTextContent(title);
});

test('Expect default search text to remain English', () => {
  render(NavPage, { title: 'containers' });
  expect(screen.getByRole('textbox', { name: 'search containers' })).toHaveAttribute('placeholder', 'Search...');
});

test('Expect localized search labels to preserve editable search values', async () => {
  render(NavPage, {
    title: 'コンテナー',
    searchPlaceholder: '検索…',
    searchAriaLabel: '検索',
    searchTerm: 'status:running',
  });

  const input = screen.getByRole('textbox', { name: '検索' });
  expect(input).toHaveAttribute('placeholder', '検索…');
  expect(input).toHaveValue('status:running');
  await fireEvent.input(input, { target: { value: 'name:demo' } });
  expect(input).toHaveValue('name:demo');
});
