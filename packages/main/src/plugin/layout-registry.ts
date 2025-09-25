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
import { IDisposable } from '/@api/disposable.js';
import { LayoutEditItem, SavedLayoutConfig } from '/@api/layout-manager-info.js';

// Dynamic layout registry - populated by frontend components during initialization
const REGISTERED_LAYOUTS: Record<string, string[]> = {};

@injectable()
export class LayoutRegistry implements IDisposable {
  #disposables: IDisposable[] = [];

  constructor(@inject(IConfigurationRegistry) private configurationRegistry: IConfigurationRegistry) {}

  public dispose(): void {
    this.#disposables.forEach(disposable => disposable.dispose());
    this.#disposables = [];
  }

  // Get default configuration for a layout kind
  getDefaultLayoutConfig(layoutKind: string): SavedLayoutConfig[] {
    const defaults = REGISTERED_LAYOUTS[layoutKind] ?? [];
    return defaults.map(name => ({ id: name, enabled: true }));
  }

  // Load layout configuration (with fallback to defaults)
  async loadLayoutConfig(layoutKind: string, availableColumns: string[]): Promise<LayoutEditItem[]> {
    try {
      // Auto-register the layout if not already registered
      if (!REGISTERED_LAYOUTS[layoutKind]) {
        REGISTERED_LAYOUTS[layoutKind] = availableColumns;

        // Register the configuration with the configuration registry
        const layoutConfiguration: IConfigurationNode = {
          id: 'preferences',
          title: 'Layout',
          type: 'object',
          properties: {
            [`layout.${layoutKind}`]: {
              description: `Preferred layout of columns for ${layoutKind}`,
              type: 'array',
              default: this.parseConfiguration(availableColumns),
              hidden: true,
            },
          },
        };

        this.#disposables.push(this.configurationRegistry.registerConfigurations([layoutConfiguration]));
      }

      const config = this.configurationRegistry.getConfiguration('layout');
      const savedConfig = config.get<SavedLayoutConfig[]>(`${layoutKind}`, []);

      return this.mergeConfigWithAvailableColumns(layoutKind, savedConfig, availableColumns);
    } catch (error: unknown) {
      console.warn(`Failed to load layout config for ${layoutKind}:`, error);
      return this.createDefaultLayoutItems(layoutKind, availableColumns);
    }
  }

  // Save layout configuration
  async saveLayoutConfig(layoutKind: string, items: LayoutEditItem[]): Promise<void> {
    const configToSave: SavedLayoutConfig[] = items.map(item => ({ id: item.id, enabled: item.enabled }));

    const config = this.configurationRegistry.getConfiguration('layout');
    await config.update(`${layoutKind}`, configToSave);
  }

  // Reset layout to defaults
  async resetLayoutConfig(layoutKind: string, availableColumns: string[]): Promise<LayoutEditItem[]> {
    const config = this.configurationRegistry.getConfiguration('layout');
    await config.update(`${layoutKind}`, undefined);
    return this.createDefaultLayoutItems(layoutKind, availableColumns);
  }

  // Helper: Create default layout items
  private createDefaultLayoutItems(layoutKind: string, availableColumns: string[]): LayoutEditItem[] {
    const defaults = REGISTERED_LAYOUTS[layoutKind] ?? availableColumns;
    return defaults.map((colName, index) => ({
      id: colName,
      label: this.getColumnLabel(colName),
      enabled: true,
      originalOrder: index,
    }));
  }

  // Helper: Get proper label for column (dashboard sections have different labels)
  private getColumnLabel(columnId: string): string {
    // Transform kebab-case to Title Case (e.g., 'release-notes' -> 'Release Notes')
    return columnId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Helper: Merge saved config with available columns
  private mergeConfigWithAvailableColumns(
    layoutKind: string,
    savedConfig: SavedLayoutConfig[],
    availableColumns: string[],
  ): LayoutEditItem[] {
    const savedIds = new Set(savedConfig.map(item => item.id));
    const mergedItems: LayoutEditItem[] = [];

    // Get default order to determine originalOrder for each column
    const defaults = REGISTERED_LAYOUTS[layoutKind] ?? availableColumns;
    const getOriginalOrder = (id: string): number => {
      const index = defaults.indexOf(id);
      return index >= 0 ? index : defaults.length; // Put unknown items at the end
    };

    // Add saved columns in their saved order
    savedConfig.forEach(savedItem => {
      if (availableColumns.includes(savedItem.id)) {
        mergedItems.push({
          id: savedItem.id,
          label: this.getColumnLabel(savedItem.id),
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
          label: this.getColumnLabel(newCol),
          enabled: true,
          originalOrder: getOriginalOrder(newCol),
        });
      });

    return mergedItems;
  }

  parseConfiguration(layout: string[]): SavedLayoutConfig[] {
    return layout.map(item => ({
      id: item,
      enabled: true,
    }));
  }
}
