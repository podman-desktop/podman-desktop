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

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import SystemOverview from './SystemOverview.svelte';

vi.mock(import('/@/lib/dashboard/SystemOverviewContent.svelte'));

vi.mock('svelte/transition', () => ({
  slide: (): { delay: number; duration: number } => ({
    delay: 0,
    duration: 0,
  }),
  fade: (): { delay: number; duration: number } => ({
    delay: 0,
    duration: 0,
  }),
}));

beforeEach(() => {
  vi.resetAllMocks();

  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  vi.mocked(window.updateConfigurationValue).mockResolvedValue(undefined);
});

test('should render System Overview title', async () => {
  render(SystemOverview);

  await waitFor(() => expect(screen.getByText('System Overview')).toBeInTheDocument());
});

test('should call getConfigurationValue for system overview expanded state on mount', async () => {
  render(SystemOverview);

  await waitFor(() => expect(window.getConfigurationValue).toHaveBeenCalled());
  await waitFor(() => expect(window.getConfigurationValue).toHaveBeenCalledWith('systemOverview.expanded'));
});

test('should call updateConfigurationValue when toggle is triggered', async () => {
  render(SystemOverview);

  const expandButton = await waitFor(() => screen.getByRole('button', { name: 'System Overview' }));
  await fireEvent.click(expandButton);

  await waitFor(() => expect(window.updateConfigurationValue).toHaveBeenCalled());
  await waitFor(() => expect(window.updateConfigurationValue).toHaveBeenCalledWith('systemOverview.expanded', false));
});
