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

import type { IConfigurationRegistry } from '/@api/configuration/models.js';

import type { LayoutEditItem, SavedColumnConfig } from './layout-manager.js';
import { LayoutManager } from './layout-manager.js';

let layoutManager: LayoutManager;
let mockConfigurationRegistry: IConfigurationRegistry;
let mockConfiguration: {
  get: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  mockConfiguration = {
    get: vi.fn(),
    update: vi.fn(),
  };

  mockConfigurationRegistry = {
    registerConfigurations: vi.fn(),
    getConfiguration: vi.fn().mockReturnValue(mockConfiguration),
  } as unknown as IConfigurationRegistry;

  layoutManager = new LayoutManager(mockConfigurationRegistry);
});

describe('LayoutManager', () => {
  test('should initialize configuration on init', () => {
    layoutManager.init();

    expect(mockConfigurationRegistry.registerConfigurations).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'preferences',
        title: 'Layout',
        type: 'object',
        properties: expect.objectContaining({
          'layout.dashboard': expect.any(Object),
          'layout.container': expect.any(Object),
          'layout.pod': expect.any(Object),
          'layout.image': expect.any(Object),
          'layout.volume': expect.any(Object),
        }),
      }),
    ]);
  });

  test('should set table defaults', () => {
    const columnNames = ['Status', 'Name', 'Custom'];
    layoutManager.setTableDefaults('custom', columnNames);

    const defaultConfig = layoutManager.getDefaultTableConfig('custom');
    expect(defaultConfig).toEqual([
      { id: 'Status', enabled: true },
      { id: 'Name', enabled: true },
      { id: 'Custom', enabled: true },
    ]);
  });

  test('should get default table config for known table types', () => {
    const containerConfig = layoutManager.getDefaultTableConfig('container');
    expect(containerConfig).toEqual([
      { id: 'Status', enabled: true },
      { id: 'Name', enabled: true },
      { id: 'Environment', enabled: true },
      { id: 'Image', enabled: true },
      { id: 'Uptime', enabled: true },
      { id: 'Actions', enabled: true },
    ]);

    const imageConfig = layoutManager.getDefaultTableConfig('image');
    expect(imageConfig).toEqual([
      { id: 'Status', enabled: true },
      { id: 'Name', enabled: true },
      { id: 'Environment', enabled: true },
      { id: 'Age', enabled: true },
      { id: 'Size', enabled: true },
      { id: 'Actions', enabled: true },
    ]);
  });

  test('should load table config with saved configuration', async () => {
    const savedConfig: SavedColumnConfig[] = [
      { id: 'Name', enabled: true },
      { id: 'Status', enabled: false },
    ];
    mockConfiguration.get.mockReturnValue(savedConfig);

    const result = await layoutManager.loadTableConfig('container', ['Status', 'Name', 'Actions']);

    expect(result).toEqual([
      { id: 'Name', label: 'Name', enabled: true, originalOrder: 1 },
      { id: 'Status', label: 'Status', enabled: false, originalOrder: 0 },
      { id: 'Actions', label: 'Actions', enabled: true, originalOrder: 5 },
    ]);
  });

  test('should load table config with fallback to defaults when no saved config', async () => {
    mockConfiguration.get.mockReturnValue([]);

    const result = await layoutManager.loadTableConfig('container', ['Status', 'Name']);

    expect(result).toEqual([
      { id: 'Status', label: 'Status', enabled: true, originalOrder: 0 },
      { id: 'Name', label: 'Name', enabled: true, originalOrder: 1 },
    ]);
  });

  test('should load table config with fallback when configuration throws error', async () => {
    mockConfiguration.get.mockImplementation(() => {
      throw new Error('Configuration error');
    });

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = await layoutManager.loadTableConfig('container', ['Status', 'Name']);

    expect(consoleSpy).toHaveBeenCalledWith('Failed to load table config for container:', expect.any(Error));
    expect(result).toEqual([
      { id: 'Status', label: 'Status', enabled: true, originalOrder: 0 },
      { id: 'Name', label: 'Name', enabled: true, originalOrder: 1 },
      { id: 'Environment', label: 'Environment', enabled: true, originalOrder: 2 },
      { id: 'Image', label: 'Image', enabled: true, originalOrder: 3 },
      { id: 'Uptime', label: 'Uptime', enabled: true, originalOrder: 4 },
      { id: 'Actions', label: 'Actions', enabled: true, originalOrder: 5 },
    ]);

    consoleSpy.mockRestore();
  });

  test('should save table configuration', async () => {
    const items: LayoutEditItem[] = [
      { id: 'Name', label: 'Name', enabled: true, originalOrder: 1 },
      { id: 'Status', label: 'Status', enabled: false, originalOrder: 0 },
    ];

    await layoutManager.saveTableConfig('container', items);

    expect(mockConfiguration.update).toHaveBeenCalledWith('container', [
      { id: 'Name', enabled: true },
      { id: 'Status', enabled: false },
    ]);
  });

  test('should reset table configuration', async () => {
    const result = await layoutManager.resetTableConfig('container', ['Status', 'Name']);

    expect(mockConfiguration.update).toHaveBeenCalledWith('container', undefined);
    expect(result).toEqual([
      { id: 'Status', label: 'Status', enabled: true, originalOrder: 0 },
      { id: 'Name', label: 'Name', enabled: true, originalOrder: 1 },
      { id: 'Environment', label: 'Environment', enabled: true, originalOrder: 2 },
      { id: 'Image', label: 'Image', enabled: true, originalOrder: 3 },
      { id: 'Uptime', label: 'Uptime', enabled: true, originalOrder: 4 },
      { id: 'Actions', label: 'Actions', enabled: true, originalOrder: 5 },
    ]);
  });

  test('should handle dashboard labels correctly', async () => {
    const result = await layoutManager.loadTableConfig('dashboard', ['release-notes', 'providers']);

    expect(result).toEqual([
      { id: 'release-notes', label: 'Release Notes', enabled: true, originalOrder: 0 },
      { id: 'extension-banners', label: 'Extension Banners', enabled: true, originalOrder: 1 },
      { id: 'learning-center', label: 'Learning Center', enabled: true, originalOrder: 2 },
      { id: 'providers', label: 'Providers', enabled: true, originalOrder: 3 },
    ]);
  });

  test('should merge configuration correctly with new columns', async () => {
    const savedConfig: SavedColumnConfig[] = [
      { id: 'Name', enabled: true },
      { id: 'Status', enabled: false },
    ];
    mockConfiguration.get.mockReturnValue(savedConfig);

    const result = await layoutManager.loadTableConfig('container', ['Status', 'Name', 'NewColumn']);

    expect(result).toEqual([
      { id: 'Name', label: 'Name', enabled: true, originalOrder: 1 },
      { id: 'Status', label: 'Status', enabled: false, originalOrder: 0 },
      { id: 'NewColumn', label: 'NewColumn', enabled: true, originalOrder: 6 },
    ]);
  });

  test('should parse configuration correctly', () => {
    const layout = ['item1', 'item2', 'item3'];
    const result = layoutManager.parseConfiguration(layout);

    expect(result).toEqual([
      { id: 'item1', enabled: true },
      { id: 'item2', enabled: true },
      { id: 'item3', enabled: true },
    ]);
  });

  test('should handle invalid saved config gracefully', async () => {
    // Test with null saved config
    mockConfiguration.get.mockReturnValue(null);
    let result = await layoutManager.loadTableConfig('container', ['Status', 'Name']);
    expect(result).toHaveLength(6); // Should fallback to defaults

    // Test with non-array saved config
    mockConfiguration.get.mockReturnValue('invalid');
    result = await layoutManager.loadTableConfig('container', ['Status', 'Name']);
    expect(result).toHaveLength(6); // Should fallback to defaults
  });

  test('should handle unknown table types', () => {
    const config = layoutManager.getDefaultTableConfig('unknown');
    expect(config).toEqual([]);
  });

  test('should filter out unavailable columns from saved config', async () => {
    const savedConfig: SavedColumnConfig[] = [
      { id: 'Name', enabled: true },
      { id: 'RemovedColumn', enabled: true },
      { id: 'Status', enabled: false },
    ];
    mockConfiguration.get.mockReturnValue(savedConfig);

    const result = await layoutManager.loadTableConfig('container', ['Status', 'Name']);

    expect(result).toEqual([
      { id: 'Name', label: 'Name', enabled: true, originalOrder: 1 },
      { id: 'Status', label: 'Status', enabled: false, originalOrder: 0 },
    ]);
  });
});
