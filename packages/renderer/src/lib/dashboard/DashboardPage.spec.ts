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
import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import { setupDashboardPageRegistry } from '/@/stores/dashboard/dashboard-page-registry.svelte';

import DashboardPage from './DashboardPage.svelte';

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

beforeEach(() => {
  vi.resetAllMocks();
  tablePersistence.storage = undefined;
  vi.mocked(window.listGuides).mockResolvedValue([]);
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  vi.mocked(window.updateConfigurationValue).mockResolvedValue(undefined);
});

async function waitForSections(): Promise<void> {
  await waitFor(() => expect(screen.getByRole('button', { name: /^Learning Center/ })).toBeInTheDocument());
}

function setEnhanced(enabled: boolean): void {
  vi.mocked(window.isExperimentalConfigurationEnabled).mockResolvedValue(enabled);
}

// opens the dashboard layout menu and returns the entry for a registry id
async function openLayoutMenuItem(container: HTMLElement, id: string): Promise<HTMLElement> {
  await fireEvent.click(screen.getByRole('button', { name: 'Configure Dashboard Sections' }));
  const item = container.querySelector<HTMLElement>(`[data-item-id="${id}"]`);
  if (!item) throw new Error(`no layout menu item for ${id}`);
  return item;
}

test('setting on: layout menu uses sentence-case labels', async () => {
  setEnhanced(true);
  const { container } = render(DashboardPage);

  await waitForSections();
  const item = await openLayoutMenuItem(container, 'Learning Center');

  expect(item).toHaveTextContent('Learning center');
  expect(item).not.toHaveTextContent('Learning Center');
});

test('setting off: layout menu keeps the ids', async () => {
  setEnhanced(false);
  const { container } = render(DashboardPage);

  await waitForSections();
  const item = await openLayoutMenuItem(container, 'Learning Center');

  expect(item).toHaveTextContent('Learning Center');
});

test('stored labels are replaced by registry labels on load', async () => {
  setEnhanced(true);
  tablePersistence.storage = {
    load: vi
      .fn()
      .mockResolvedValue([{ id: 'Learning Center', label: 'Learning Center', enabled: true, originalOrder: 4 }]),
    save: vi.fn().mockResolvedValue(undefined),
    reset: vi.fn().mockResolvedValue([]),
  };
  const { container } = render(DashboardPage);

  await waitFor(() => expect(tablePersistence.storage?.load).toHaveBeenCalled());
  await waitForSections();
  const item = await openLayoutMenuItem(container, 'Learning Center');

  expect(item).toHaveTextContent('Learning center');
  expect(item).not.toHaveTextContent('Learning Center');
});

test('switching the setting at runtime updates the layout menu labels', async () => {
  setEnhanced(false);
  const { container } = render(DashboardPage);

  await waitForSections();

  setEnhanced(true);
  await setupDashboardPageRegistry();

  await waitForSections();
  const item = await openLayoutMenuItem(container, 'Learning Center');
  await waitFor(() => expect(item).toHaveTextContent('Learning center'));
  expect(item).not.toHaveTextContent('Learning Center');
});

test('reset layout keeps registry labels in the layout menu', async () => {
  setEnhanced(true);
  tablePersistence.storage = {
    // a hidden section makes Reset Layout available
    load: vi
      .fn()
      .mockResolvedValue([{ id: 'Learning Center', label: 'Learning Center', enabled: false, originalOrder: 4 }]),
    save: vi.fn().mockResolvedValue(undefined),
    // main's reset answers with ids as labels
    reset: vi
      .fn()
      .mockResolvedValue([{ id: 'Learning Center', label: 'Learning Center', enabled: true, originalOrder: 4 }]),
  };
  const { container } = render(DashboardPage);

  await waitFor(() => expect(tablePersistence.storage?.load).toHaveBeenCalled());
  await fireEvent.click(await screen.findByRole('button', { name: 'Configure Dashboard Sections' }));
  await fireEvent.click(screen.getByRole('button', { name: 'Reset Layout' }));
  await waitFor(() => expect(tablePersistence.storage?.reset).toHaveBeenCalled());

  // the menu stays open after a reset
  await waitFor(() => {
    const item = container.querySelector('[data-item-id="Learning Center"]');
    expect(item).toHaveTextContent('Learning center');
    expect(item).not.toHaveTextContent('Learning Center');
  });
});
