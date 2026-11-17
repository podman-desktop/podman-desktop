/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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
import { beforeEach, expect, test, vi } from 'vitest';

import { t } from '/@/lib/i18n/translations.svelte';

import SettingsPage from './SettingsPage.svelte';

vi.mock(import('/@/lib/i18n/translations.svelte'));

beforeEach(() => {
  vi.resetAllMocks();
});

test('should preserve the original title when a translation is unavailable', () => {
  render(SettingsPage, { title: 'Extension settings' });

  expect(screen.getByRole('heading', { name: 'Title' })).toHaveTextContent('Extension settings');
  expect(screen.getByRole('region', { name: 'Extension settings' })).toBeVisible();
});

test.each([
  ['Settings', 'settings.title'],
  ['Resources', 'settings.navigation.Resources'],
])('should translate the %s title and region label', (title, key) => {
  vi.mocked(t).mockImplementation(candidate => (candidate === key ? '\u8a2d\u5b9a' : undefined));
  render(SettingsPage, { title });

  expect(screen.getByRole('heading', { name: 'Title' })).toHaveTextContent('\u8a2d\u5b9a');
  expect(screen.getByRole('region', { name: '\u8a2d\u5b9a' })).toBeVisible();
});
