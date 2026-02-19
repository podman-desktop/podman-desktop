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

import { providerInfos } from '/@/stores/providers';

import SystemOverviewContent from './SystemOverviewContent.svelte';

vi.mock(import('/@/lib/dashboard/SystemOverviewProviderCardDetailed.svelte'));
vi.mock(import('/@/lib/dashboard/SystemOverviewProviderCardMinimal.svelte'));
vi.mock(import('/@/lib/dashboard/SystemOverviewProviderConfigured.svelte'));
vi.mock(import('/@/lib/dashboard/SystemOverviewProviderInstalled.svelte'));
vi.mock(import('/@/lib/dashboard/SystemOverviewProviderNotInstalled.svelte'));

beforeEach(() => {
  vi.resetAllMocks();
  providerInfos.set([]);
});

test('should render navigate to resources button', async () => {
  render(SystemOverviewContent);
  await vi.waitFor(() =>
    expect(screen.getByRole('button', { name: 'System Overview - Navigate to resources' })).toBeInTheDocument(),
  );
});

test('should show status text from system overview store', async () => {
  render(SystemOverviewContent);
  await vi.waitFor(() => expect(screen.getByText('Loading...')).toBeInTheDocument());
});
