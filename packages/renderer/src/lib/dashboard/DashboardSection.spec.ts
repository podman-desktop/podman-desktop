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

import { DASHBOARD_SECTION_CONTEXT, type DashboardSectionContext } from './dashboard-section-context';
import DashboardSectionTest from './DashboardSectionTest.svelte';

vi.mock(import('svelte/transition'), () => ({
  slide: (): { delay: number; duration: number } => ({ delay: 0, duration: 0 }),
  fade: (): { delay: number; duration: number } => ({ delay: 0, duration: 0 }),
}));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  vi.mocked(window.updateConfigurationValue).mockResolvedValue(undefined);
});

// the persisted expanded state loads asynchronously on mount; wait for it before interacting
async function waitForContent(): Promise<void> {
  await waitFor(() => expect(screen.getByText('content')).toBeInTheDocument());
}

function renderEnhanced(): DashboardSectionContext {
  const context: DashboardSectionContext = {
    enhanced: true,
    label: vi.fn().mockReturnValue('Learning center'),
    hide: vi.fn(),
  };
  render(DashboardSectionTest, { context: new Map([[DASHBOARD_SECTION_CONTEXT, context]]) });
  return context;
}

test('enhanced: renders the context label as the toggle and the content in a named region', async () => {
  renderEnhanced();

  const toggle = screen.getByRole('button', { name: 'Learning center' });
  expect(toggle).toHaveAttribute('aria-expanded', 'true');

  const region = await waitFor(() => screen.getByRole('region', { name: 'Learning center' }));
  expect(region).toHaveTextContent('content');
  // content aligns with the header; the column gutter lives on the page, not inside the section
  expect(region).not.toHaveClass('px-6');
});

test('legacy: without context renders the id as the title and no close button', async () => {
  render(DashboardSectionTest);
  await waitForContent();

  // in the legacy card the status snippet sits inside the toggle, so it joins the accessible name
  const toggle = screen.getByRole('button', { name: /^Learning Center/ });
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(screen.queryByRole('button', { name: /^Hide/ })).not.toBeInTheDocument();
});

test('enhanced: status snippet receives the expanded state', async () => {
  renderEnhanced();
  await waitForContent();

  expect(screen.getByText('status:true')).toBeInTheDocument();
  await fireEvent.click(screen.getByRole('button', { name: 'Learning center' }));
  await waitFor(() => expect(screen.getByText('status:false')).toBeInTheDocument());
});

test('enhanced: toggling persists through the configuration key', async () => {
  renderEnhanced();
  await waitForContent();

  await fireEvent.click(screen.getByRole('button', { name: 'Learning center' }));
  expect(window.updateConfigurationValue).toHaveBeenCalledWith('learningCenter.expanded', false);
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Learning center' })).toHaveAttribute('aria-expanded', 'false'),
  );
});

test('legacy: toggling persists through the configuration key', async () => {
  render(DashboardSectionTest);
  await waitForContent();

  await fireEvent.click(screen.getByRole('button', { name: /^Learning Center/ }));
  expect(window.updateConfigurationValue).toHaveBeenCalledWith('learningCenter.expanded', false);
});

test('enhanced: collapsed when the configuration value is false', async () => {
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);
  renderEnhanced();

  await waitFor(() => expect(window.getConfigurationValue).toHaveBeenCalledWith('learningCenter.expanded'));
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Learning center' })).toHaveAttribute('aria-expanded', 'false'),
  );
  expect(screen.queryByRole('region', { name: 'Learning center' })).not.toBeInTheDocument();
});

test('enhanced: close button is focusable, visible on hover and focus, and hides the section', async () => {
  const context = renderEnhanced();

  const close = screen.getByRole('button', { name: 'Hide Learning center' });
  expect(close).not.toHaveAttribute('tabindex', '-1');
  expect(close).toHaveClass('group-hover:opacity-100');
  expect(close).toHaveClass('focus-visible:opacity-100');

  await fireEvent.click(close);
  expect(context.hide).toHaveBeenCalledWith('Learning Center');
});

test('enhanced: close button has a 24px hit area', () => {
  renderEnhanced();

  expect(screen.getByRole('button', { name: 'Hide Learning center' })).toHaveClass('size-6');
});
