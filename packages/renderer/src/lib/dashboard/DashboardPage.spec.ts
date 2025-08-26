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

import { render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';

import DashboardPage from './DashboardPage.svelte';

// Mock the layout service
vi.mock('../layout/layout-service', () => ({
  createLayoutCallbacks: vi.fn().mockReturnValue({
    onLoad: vi.fn().mockResolvedValue([]),
    onSave: vi.fn().mockResolvedValue(undefined),
    onReset: vi.fn().mockResolvedValue([]),
  }),
}));

describe('Dashboard layout management', () => {
  test('should create layout callbacks with correct parameters', async () => {
    const { createLayoutCallbacks } = await import('../layout/layout-service');
    const mockCreateLayoutCallbacks = vi.mocked(createLayoutCallbacks);

    const { container } = render(DashboardPage);

    // Verify createLayoutCallbacks was called with correct parameters
    expect(mockCreateLayoutCallbacks).toHaveBeenCalledWith('dashboard', [
      'release-notes',
      'extension-banners',
      'learning-center',
      'providers',
    ]);

    expect(container).toBeInTheDocument();
  });
});
