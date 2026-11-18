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

import { tablePersistence } from '@podman-desktop/ui-svelte';
import { cleanup, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import { setupDashboardPageRegistry } from '/@/stores/dashboard/dashboard-page-registry.svelte';

import DashboardPage from './DashboardPage.svelte';
import ReleaseNotesBox from './ReleaseNotesBox.svelte';

vi.mock(import('svelte/transition'), () => ({
  slide: (): { delay: number; duration: number } => ({ delay: 0, duration: 0 }),
  fade: (): { delay: number; duration: number } => ({ delay: 0, duration: 0 }),
}));
vi.mock(import('./NotificationsBox.svelte'));
vi.mock(import('/@/lib/dashboard/ReleaseNotesBox.svelte'));
vi.mock(import('/@/lib/recommendation/ExtensionBanners.svelte'));
vi.mock(import('/@/lib/explore-features/ExploreFeatures.svelte'));
vi.mock(import('/@/lib/dashboard/SystemOverview.svelte'));
vi.mock(import('/@/lib/dashboard/ProvidersSection.svelte'));
// LearningCenter stays real: its card title tells the page has rendered its sections
const COLUMN = '.max-w-\\[900px\\]';

beforeEach(() => {
  vi.resetAllMocks();
  tablePersistence.storage = undefined;
  vi.mocked(window.listGuides).mockResolvedValue([]);
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
});

async function waitForLearningCenter(): Promise<void> {
  await waitFor(() => expect(screen.getByRole('button', { name: /^Learning Center/ })).toBeInTheDocument());
}

function setEnhanced(enabled: boolean): void {
  vi.mocked(window.isExperimentalConfigurationEnabled).mockResolvedValue(enabled);
}

test('setting off: renders the NavPage title and no 900px column', async () => {
  setEnhanced(false);
  const { container } = render(DashboardPage);

  await waitForLearningCenter();
  expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toHaveClass('font-bold');
  expect(container.querySelector(COLUMN)).toBeNull();
});

test('setting on: renders the column, the header row and the content region', async () => {
  setEnhanced(true);
  const { container } = render(DashboardPage);

  await waitFor(() => expect(container.querySelector(COLUMN)).not.toBeNull());
  expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toHaveClass('font-extralight');
  expect(screen.getByRole('region', { name: 'content' })).toHaveClass('px-6', '@container');
  expect(screen.getByRole('region', { name: 'Dashboard' })).toBeInTheDocument();
  expect(container.querySelector(COLUMN)).toHaveClass('pb-6');
});

test('switching the setting at runtime re-renders the layout', async () => {
  setEnhanced(false);
  const { container } = render(DashboardPage);

  await waitForLearningCenter();
  expect(container.querySelector(COLUMN)).toBeNull();

  setEnhanced(true);
  await setupDashboardPageRegistry();

  await waitFor(() => expect(container.querySelector(COLUMN)).not.toBeNull());
  expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toHaveClass('font-extralight');
});

test('sections get the enhanced prop only in the enhanced layout', async () => {
  setEnhanced(false);
  render(DashboardPage);
  await waitForLearningCenter();
  expect(ReleaseNotesBox).toHaveBeenCalledWith(expect.anything(), expect.not.objectContaining({ enhanced: true }));

  cleanup();
  vi.mocked(ReleaseNotesBox).mockClear();
  setEnhanced(true);
  render(DashboardPage);
  await waitFor(() =>
    expect(ReleaseNotesBox).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ enhanced: true })),
  );
});

test('the page waits for the setting to resolve before rendering a layout', async () => {
  let resolveSetting: (value: boolean) => void = () => {};
  vi.mocked(window.isExperimentalConfigurationEnabled).mockReturnValue(
    new Promise<boolean>(resolve => (resolveSetting = resolve)),
  );
  render(DashboardPage);

  // wait until the page has asked for the setting, which is still unresolved: neither shell is shown
  await vi.waitFor(() => expect(window.isExperimentalConfigurationEnabled).toHaveBeenCalled());
  expect(screen.queryByRole('heading', { level: 1, name: 'Dashboard' })).not.toBeInTheDocument();

  resolveSetting(true);
  expect(await screen.findByRole('heading', { level: 1, name: 'Dashboard' })).toHaveClass('font-extralight');
  expect(screen.getByRole('button', { name: 'Configure Dashboard Sections' })).toBeInTheDocument();
});
