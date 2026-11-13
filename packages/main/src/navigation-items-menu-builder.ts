/**********************************************************************
 * Copyright (C) 2024-2026 Red Hat, Inc.
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

import type { DisplayItem } from '@desktop-framework/api';
import { AppearanceSettings } from '@desktop-framework/api/appearance';
import { CONFIGURATION_DEFAULT_SCOPE } from '@desktop-framework/api/configuration';
import type { Configuration } from '@desktop-framework/extension-api';
import type { ContextMenuParams, MenuItemConstructorOptions } from 'electron';

import type { ConfigurationRegistry } from './plugin/configuration-registry.js';

// items that can't be hidden
const EXCLUDED_ITEMS = ['Accounts', 'Settings'];

const EXPANDED_WIDTH = 160;

const GROUP_SEPARATOR = ' > ';
const isGroupedName = (name: string): boolean => name.includes(GROUP_SEPARATOR);

// This class is responsible of creating the items to hide a given selected item of the left navigation bar
// and also display a list of all items with the ability to toggle the visibility of each item.
export class NavigationItemsMenuBuilder {
  private navigationItems: DisplayItem[] = [];

  constructor(private configurationRegistry: ConfigurationRegistry) {}

  receiveNavigationItems(data: DisplayItem[]): void {
    this.navigationItems = data;
  }

  protected getNavbarConfiguration(): Configuration {
    return this.configurationRegistry.getConfiguration('navbar');
  }

  protected getItemOrder(): string[] {
    return this.getNavbarConfiguration().get<string[]>('itemOrder', []);
  }

  protected async setItemOrder(order: string[]): Promise<void> {
    await this.configurationRegistry.updateConfigurationValue('navbar.itemOrder', order, CONFIGURATION_DEFAULT_SCOPE);
  }

  protected getDisabledItems(): string[] {
    return this.getNavbarConfiguration().get<string[]>('disabledItems', []);
  }

  protected async setDisabledItems(items: string[]): Promise<void> {
    await this.configurationRegistry.updateConfigurationValue(
      'navbar.disabledItems',
      items,
      CONFIGURATION_DEFAULT_SCOPE,
    );
  }

  protected async updateNavbarHiddenItem(itemName: string, visible: boolean): Promise<void> {
    let items = this.getDisabledItems();
    if (visible) {
      items = items.filter(i => i !== itemName);
    } else if (!items.includes(itemName)) {
      items.push(itemName);
    }
    await this.setDisabledItems(items);
  }

  protected escapeLabel(label: string): string {
    return label.replace('&', '&&');
  }

  protected computeItemName(rawItemName: string): string {
    // need to filter any counter from the item name
    // it's at the end with parenthesis like itemName (2)
    const itemName = rawItemName.replace(/\s\(\d+\)$/, '');

    // Electron sends the whole element text including sub elements, each level separated by '\n'
    return itemName.split('\n')[0] ?? itemName;
  }

  protected buildHideMenuItem(linkText: string): MenuItemConstructorOptions | undefined {
    const rawItemName = linkText;

    // need to filter any counter from the item name
    // it's at the end with parenthesis like itemName (2)
    const itemName = this.computeItemName(rawItemName);

    if (EXCLUDED_ITEMS.includes(itemName) || isGroupedName(itemName)) {
      return undefined;
    }

    // on electron, need to esccape the & character to show it
    const itemDisplayName = this.escapeLabel(itemName);

    const item: MenuItemConstructorOptions = {
      label: `Hide ${itemDisplayName}`,
      visible: true,
      click: (): void => {
        // flag the item as being disabled
        this.updateNavbarHiddenItem(itemName, false).catch((e: unknown) => console.error('error disabling item', e));
      },
    };
    return item;
  }

  protected buildNavigationToggleMenuItems(): MenuItemConstructorOptions[] {
    const items: MenuItemConstructorOptions[] = [];

    // add all navigation items to be able to show/hide them
    const hideableItems = this.navigationItems.filter(item => !isGroupedName(item.name));

    const menuForNavItems: Electron.MenuItemConstructorOptions[] = hideableItems.map(item => ({
      label: this.escapeLabel(item.name),
      type: 'checkbox',
      checked: item.visible,
      click: (): void => {
        // send the item to the frontend to show/hide it
        this.updateNavbarHiddenItem(item.name, !item.visible).catch((e: unknown) =>
          console.error('error disabling item', e),
        );
      },
    }));
    if (menuForNavItems.length > 0) {
      // add separator
      items.push({ type: 'separator' });
      // add all items
      items.push(...menuForNavItems);
    }

    return items;
  }

  protected buildResetOrderMenuItem(): MenuItemConstructorOptions | undefined {
    if (this.getItemOrder().length === 0) {
      return undefined;
    }
    return {
      label: 'Reset Order',
      visible: true,
      click: (): void => {
        this.resetNavbarItemOrder().catch((e: unknown) => console.error('error resetting item order', e));
      },
    };
  }

  protected buildShowAllMenuItem(): MenuItemConstructorOptions | undefined {
    if (this.getDisabledItems().length === 0) {
      return undefined;
    }
    return {
      label: 'Show All',
      visible: true,
      click: (): void => {
        this.setDisabledItems([]).catch((e: unknown) => console.error('error clearing hidden navigation items', e));
      },
    };
  }

  protected async resetNavbarItemOrder(): Promise<void> {
    await this.setItemOrder([]);
  }

  protected getNavWidth(): number {
    const configuration = this.configurationRegistry.getConfiguration(AppearanceSettings.SectionName);
    return configuration.get<number>(AppearanceSettings.NavigationBarWidth, EXPANDED_WIDTH);
  }

  buildNavigationMenu(parameters: ContextMenuParams): MenuItemConstructorOptions[] {
    const items: MenuItemConstructorOptions[] = [];
    const navWidth = this.getNavWidth();
    const inMainNav = parameters.x < navWidth;

    if (parameters.linkText && inMainNav && parameters.y > 76) {
      // allow to hide the top-level item being selected
      const menu = this.buildHideMenuItem(parameters.linkText);
      if (menu) {
        items.push(menu);
      }
    }
    if (inMainNav) {
      const resetMenu = this.buildResetOrderMenuItem();
      if (resetMenu) {
        items.push(resetMenu);
      }
      const showAllMenu = this.buildShowAllMenuItem();
      if (showAllMenu) {
        items.push(showAllMenu);
      }
      items.push(...this.buildNavigationToggleMenuItems());
    }
    return items;
  }
}
