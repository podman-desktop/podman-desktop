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

import { beforeEach, describe, expect, test, vi } from 'vitest';

import { PodmanDesktopStoragePersist } from './PodmanDesktopStoragePersist';

describe('PodmanDesktopStoragePersist', () => {
  let persist: PodmanDesktopStoragePersist;
  const mockLoadLayoutConfig = vi.fn();
  const mockSaveLayoutConfig = vi.fn();
  const mockResetLayoutConfig = vi.fn();

  beforeEach(() => {
    Object.defineProperty(window, 'loadLayoutConfig', {
      value: mockLoadLayoutConfig,
    });
    Object.defineProperty(window, 'saveLayoutConfig', {
      value: mockSaveLayoutConfig,
    });
    Object.defineProperty(window, 'resetLayoutConfig', {
      value: mockResetLayoutConfig,
    });

    persist = new PodmanDesktopStoragePersist();
  });

  test('should call window.loadLayoutConfig when load is called', async () => {
    const expectedResult = [
      { id: 'name', label: 'Name', enabled: true, originalOrder: 0 },
      { id: 'status', label: 'Status', enabled: true, originalOrder: 1 },
    ];
    mockLoadLayoutConfig.mockResolvedValue(expectedResult);

    const result = await persist.load('containers', ['name', 'status']);

    expect(mockLoadLayoutConfig).toHaveBeenCalledWith('containers', ['name', 'status']);
    expect(result).toEqual(expectedResult);
  });

  test('should call window.saveLayoutConfig when save is called', async () => {
    const items = [
      { id: 'name', label: 'Name', enabled: true, originalOrder: 0 },
      { id: 'status', label: 'Status', enabled: false, originalOrder: 1 },
    ];
    mockSaveLayoutConfig.mockResolvedValue(undefined);

    await persist.save('containers', items);

    expect(mockSaveLayoutConfig).toHaveBeenCalledWith('containers', items);
  });

  test('should call window.resetLayoutConfig when reset is called', async () => {
    const expectedResult = [
      { id: 'name', label: 'Name', enabled: true, originalOrder: 0 },
      { id: 'status', label: 'Status', enabled: true, originalOrder: 1 },
    ];
    mockResetLayoutConfig.mockResolvedValue(expectedResult);

    const result = await persist.reset('containers', ['name', 'status']);

    expect(mockResetLayoutConfig).toHaveBeenCalledWith('containers', ['name', 'status']);
    expect(result).toEqual(expectedResult);
  });

  test('should preserve method signatures for TablePersistenceCallbacks interface', async () => {
    // Test that all required methods exist and have correct signatures
    expect(typeof persist.load).toBe('function');
    expect(typeof persist.save).toBe('function');
    expect(typeof persist.reset).toBe('function');

    // Test return types are promises
    expect(persist.load('test', [])).toBeInstanceOf(Promise);
    expect(persist.save('test', [])).toBeInstanceOf(Promise);
    expect(persist.reset('test', [])).toBeInstanceOf(Promise);
  });
});
