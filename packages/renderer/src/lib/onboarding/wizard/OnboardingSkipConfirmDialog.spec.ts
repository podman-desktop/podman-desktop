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

import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';

import OnboardingSkipConfirmDialog from './OnboardingSkipConfirmDialog.svelte';

describe('OnboardingSkipConfirmDialog', () => {
  test('renders dialog title and body text', () => {
    render(OnboardingSkipConfirmDialog, { onskip: vi.fn(), onclose: vi.fn() });

    expect(screen.getByRole('dialog', { name: 'Skip setup confirmation' })).toBeInTheDocument();
    expect(screen.getByText('Skip setup?')).toBeInTheDocument();
    expect(screen.getByText(/Taking a moment to configure these settings/)).toBeInTheDocument();
  });

  test('renders Skip anyway and Continue setup buttons', () => {
    render(OnboardingSkipConfirmDialog, { onskip: vi.fn(), onclose: vi.fn() });

    expect(screen.getByRole('button', { name: 'Skip anyway' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue setup' })).toBeInTheDocument();
  });

  test('calls onskip when Skip anyway is clicked', async () => {
    const onskip = vi.fn();
    render(OnboardingSkipConfirmDialog, { onskip, onclose: vi.fn() });

    await fireEvent.click(screen.getByRole('button', { name: 'Skip anyway' }));
    expect(onskip).toHaveBeenCalledOnce();
  });

  test('calls onclose when Continue setup is clicked', async () => {
    const onclose = vi.fn();
    render(OnboardingSkipConfirmDialog, { onskip: vi.fn(), onclose });

    await fireEvent.click(screen.getByRole('button', { name: 'Continue setup' }));
    expect(onclose).toHaveBeenCalledOnce();
  });

  test('calls onclose when close button (X) is clicked', async () => {
    const onclose = vi.fn();
    render(OnboardingSkipConfirmDialog, { onskip: vi.fn(), onclose });

    await fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onclose).toHaveBeenCalledOnce();
  });

  test('calls onclose when Escape key is pressed', async () => {
    const onclose = vi.fn();
    render(OnboardingSkipConfirmDialog, { onskip: vi.fn(), onclose });

    await fireEvent.keyDown(window, { key: 'Escape' });
    expect(onclose).toHaveBeenCalledOnce();
  });
});
