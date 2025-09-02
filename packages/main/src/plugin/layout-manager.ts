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

import { inject, injectable } from 'inversify';

import { type IConfigurationNode, IConfigurationRegistry } from '/@api/configuration/models.js';
import type { IDisposable } from '/@api/disposable.js';

export interface SavedColumnConfig {
  id: string;
  enabled: boolean;
}

export interface LayoutEditItem {
  id: string;
  label: string;
  enabled: boolean;
  originalOrder: number;
}

// Table defaults registry - can be set by each table component
const TABLE_DEFAULTS: Record<string, string[]> = {
  container: ['Status', 'Name', 'Environment', 'Image', 'Uptime', 'Actions'],
  image: ['Status', 'Name', 'Environment', 'Age', 'Size', 'Actions'],
  pod: ['Status', 'Name', 'Containers', 'Age', 'Actions'],
  volume: ['Status', 'Name', 'Environment', 'Age', 'Size', 'Actions'],
  dashboard: ['release-notes', 'extension-banners', 'learning-center', 'providers'],
};

@injectable()
export class LayoutManager {
  #disposables: IDisposable[] = [];

  constructor(@inject(IConfigurationRegistry) private configurationRegistry: IConfigurationRegistry) {}

  init(): void {
    const layoutConfiguration: IConfigurationNode = {
      id: 'preferences',
      title: 'Layout',
      type: 'object',
      properties: {
        ['layout.dashboard']: {
          description: 'Preferred layout of dashboard sections',
          type: 'array',
          default: this.parseConfiguration(TABLE_DEFAULTS['dashboard'] ?? []),
          hidden: true,
        },
        ['layout.container']: {
          description: 'Preferred layout of columns for containers',
          type: 'array',
          default: this.parseConfiguration(TABLE_DEFAULTS['container'] ?? []),
          hidden: true,
        },
        ['layout.pod']: {
          description: 'Preferred layout of columns for pods',
          type: 'array',
          default: this.parseConfiguration(TABLE_DEFAULTS['pod'] ?? []),
          hidden: true,
        },
        ['layout.image']: {
          description: 'Preferred layout of columns for images',
          type: 'array',
          default: this.parseConfiguration(TABLE_DEFAULTS['image'] ?? []),
          hidden: true,
        },
        ['layout.volume']: {
          description: 'Preferred layout of columns for volumes',
          type: 'array',
          default: this.parseConfiguration(TABLE_DEFAULTS['volume'] ?? []),
          hidden: true,
        },
      },
    };

    this.configurationRegistry.registerConfigurations([layoutConfiguration]);
  }

  dispose(): void {
    this.#disposables.forEach(disposable => disposable.dispose());
    this.#disposables = [];
  }

  // Set custom defaults for a table type (called from ContainerList, ImagesList, etc.)
  setTableDefaults(tableKind: string, columnNames: string[]): void {
    TABLE_DEFAULTS[tableKind] = columnNames;
  }

  // Get default configuration for a table type
  getDefaultTableConfig(tableKind: string): SavedColumnConfig[] {
    const defaults = TABLE_DEFAULTS[tableKind] ?? [];
    return defaults.map(name => ({ id: name, enabled: true }));
  }

  // Load table configuration (with fallback to defaults)
  async loadTableConfig(tableKind: string, availableColumns: string[]): Promise<LayoutEditItem[]> {
    try {
      const config = this.configurationRegistry.getConfiguration('layout');
      const savedConfig = config.get<SavedColumnConfig[]>(`${tableKind}`, []);

      if (!savedConfig || !Array.isArray(savedConfig)) {
        return this.createDefaultLayoutItems(tableKind, availableColumns);
      }

      return this.mergeConfigWithAvailableColumns(tableKind, savedConfig, availableColumns);
    } catch (error: unknown) {
      console.warn(`Failed to load table config for ${tableKind}:`, error);
      return this.createDefaultLayoutItems(tableKind, availableColumns);
    }
  }

  // Save table configuration
  async saveTableConfig(tableKind: string, items: LayoutEditItem[]): Promise<void> {
    const configToSave: SavedColumnConfig[] = items.map(item => ({ id: item.id, enabled: item.enabled }));

    const config = this.configurationRegistry.getConfiguration('layout');
    await config.update(`${tableKind}`, configToSave);
  }

  // Reset table to defaults
  async resetTableConfig(tableKind: string, availableColumns: string[]): Promise<LayoutEditItem[]> {
    const config = this.configurationRegistry.getConfiguration('layout');
    await config.update(`${tableKind}`, undefined);
    return this.createDefaultLayoutItems(tableKind, availableColumns);
  }

  // Helper: Create default layout items
  private createDefaultLayoutItems(tableKind: string, availableColumns: string[]): LayoutEditItem[] {
    const defaults = TABLE_DEFAULTS[tableKind] ?? availableColumns;
    return defaults.map((colName, index) => ({
      id: colName,
      label: this.getColumnLabel(tableKind, colName),
      enabled: true,
      originalOrder: index,
    }));
  }

  // Helper: Get proper label for column (dashboard sections have different labels)
  private getColumnLabel(tableKind: string, columnId: string): string {
    if (tableKind === 'dashboard') {
      const labelMap: Record<string, string> = {
        'release-notes': 'Release Notes',
        'extension-banners': 'Extension Banners',
        'learning-center': 'Learning Center',
        providers: 'Providers',
      };
      return labelMap[columnId] ?? columnId;
    }
    return columnId;
  }

  // Helper: Merge saved config with available columns
  private mergeConfigWithAvailableColumns(
    tableKind: string,
    savedConfig: SavedColumnConfig[],
    availableColumns: string[],
  ): LayoutEditItem[] {
    const savedIds = new Set(savedConfig.map(item => item.id));
    const mergedItems: LayoutEditItem[] = [];

    // Get default order to determine originalOrder for each column
    const defaults = TABLE_DEFAULTS[tableKind] ?? availableColumns;
    const getOriginalOrder = (id: string): number => {
      const index = defaults.indexOf(id);
      return index >= 0 ? index : defaults.length; // Put unknown items at the end
    };

    // Add saved columns in their saved order
    savedConfig.forEach(savedItem => {
      if (availableColumns.includes(savedItem.id)) {
        mergedItems.push({
          id: savedItem.id,
          label: this.getColumnLabel(tableKind, savedItem.id),
          enabled: savedItem.enabled,
          originalOrder: getOriginalOrder(savedItem.id),
        });
      }
    });

    // Add any new columns that weren't saved
    availableColumns
      .filter(colName => !savedIds.has(colName))
      .forEach(newCol => {
        mergedItems.push({
          id: newCol,
          label: this.getColumnLabel(tableKind, newCol),
          enabled: true,
          originalOrder: getOriginalOrder(newCol),
        });
      });

    return mergedItems;
  }

  parseConfiguration(layout: string[]): SavedColumnConfig[] {
    return layout.map(item => ({
      id: item,
      enabled: true,
    }));
  }
}
