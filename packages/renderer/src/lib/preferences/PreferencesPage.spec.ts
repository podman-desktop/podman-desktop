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

import { render, waitFor } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { router, type TinroBreadcrumb } from 'tinro';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { t } from '/@/lib/i18n/translations.svelte';
import PreferencesPage from '/@/lib/preferences/PreferencesPage.svelte';
import { currentPage } from '/@/stores/breadcrumb';

vi.mock(import('/@/lib/i18n/translations.svelte'));

describe('PreferencesPage routing', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('should set breadcrumb to "Experimental Features" when on /experimental', async () => {
    render(PreferencesPage);
    // Navigate to /experimental
    router.goto('/experimental');
    await waitFor(() => {
      const current: TinroBreadcrumb = get(currentPage);
      expect(current?.name).toBe('Experimental Features');
    });
  });

  test('should translate the breadcrumb without changing its route', async () => {
    vi.mocked(t).mockImplementation(key =>
      key === 'settings.navigation.Experimental Features' ? '\u5b9f\u9a13\u7684\u306a\u6a5f\u80fd' : undefined,
    );
    render(PreferencesPage);
    router.goto('/experimental');

    await waitFor(() => {
      const current: TinroBreadcrumb = get(currentPage);
      expect(current?.name).toBe('\u5b9f\u9a13\u7684\u306a\u6a5f\u80fd');
      expect(current?.path).toBe('/experimental');
    });
  });
});
