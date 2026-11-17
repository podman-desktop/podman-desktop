/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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
import { beforeEach, expect, test, vi } from 'vitest';

import { initTranslations } from '/@/lib/i18n/translations.svelte';

import SearchButton from './SearchButton.svelte';

beforeEach(async () => {
  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({});
  await initTranslations();
});

test('Expect basic styling', async () => {
  const onclick = vi.fn();
  const label = 'Search';
  render(SearchButton, { onclick });

  // get button
  const button = screen.getByRole('button', { name: label });
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute('title', label);
  expect(button).toHaveClass('text-[color:var(--pd-global-nav-icon)]');
});

test('Expect click', async () => {
  const onclick = vi.fn();
  render(SearchButton, { onclick });

  // get button
  const button = screen.getByRole('button');

  // click button
  await fireEvent.click(button);

  // check if onclick was called
  expect(onclick).toHaveBeenCalled();
});

test('Expect language changes to update the search label without changing its action', async () => {
  const onclick = vi.fn();
  render(SearchButton, { onclick });
  screen.getByRole('button', { name: 'Search' });

  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({ 'common.search': '検索' });
  await initTranslations();

  const button = await screen.findByRole('button', { name: '検索' });
  expect(button).toHaveAttribute('title', '検索');
  await fireEvent.click(button);
  expect(onclick).toHaveBeenCalledOnce();

  vi.mocked(window.i18nGetActiveTranslations).mockResolvedValue({});
  await initTranslations();
  await screen.findByRole('button', { name: 'Search' });
});
