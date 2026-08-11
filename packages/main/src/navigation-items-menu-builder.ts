/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { AppearanceSettings } from '@podman-desktop/core-api/appearance';
import { CONFIGURATION_DEFAULT_SCOPE } from '@podman-desktop/core-api/configuration';
import type { ContextMenuParams, MenuItemConstructorOptions } from 'electron';
import { dialog } from 'electron';

import type { ConfigurationRegistry } from './plugin/configuration-registry.js';

const EXCLUDED_ITEMS = ['Accounts', 'Settings', 'Containers', 'Images', 'Dashboard'];

const EXPANDED_WIDTH = 160;

export interface NavigationItemsPayload {
  items: { name: string; visible: boolean }[];
  activeItem?: string;
}

export class NavigationItemsMenuBuilder {
  private navigationItems: { name: string; visible: boolean }[] = [];
  private activeItemName: string | undefined;

  constructor(private configurationRegistry: ConfigurationRegistry) {}

  receiveNavigationItems(data: NavigationItemsPayload): void {
    this.navigationItems = data.items;
    this.activeItemName = data.activeItem;
  }

  protected async updateNavbarHiddenItem(itemName: string, visible: boolean): Promise<void> {
    // grab the disabled items, and add the new one
    const configuration = this.configurationRegistry.getConfiguration('navbar');
    let items = configuration.get<string[]>('disabledItems', []);

    if (visible) {
      items = items.filter(i => i !== itemName);
    } else if (!items.includes(itemName)) {
      items.push(itemName);
    }
    await this.configurationRegistry.updateConfigurationValue(
      'navbar.disabledItems',
      items,
      CONFIGURATION_DEFAULT_SCOPE,
    );
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

  protected isHideConfirmationDismissed(): boolean {
    const configuration = this.configurationRegistry.getConfiguration('navbar');
    return configuration.get<boolean>('hideConfirmationDismissed', false);
  }

  protected async dismissHideConfirmation(): Promise<void> {
    await this.configurationRegistry.updateConfigurationValue(
      'navbar.hideConfirmationDismissed',
      true,
      CONFIGURATION_DEFAULT_SCOPE,
    );
  }

  protected async showHideConfirmation(itemName: string): Promise<boolean> {
    if (this.isHideConfirmationDismissed()) {
      return true;
    }

    const result = await dialog.showMessageBox({
      type: 'question',
      title: 'Hide From Navigation Bar',
      message: `Hide "${itemName}" from the navigation bar?`,
      detail:
        'You can restore hidden items by right-clicking the navigation bar and selecting "Show Hidden Items", or by using "Reset Navigation Bar".',
      buttons: ['Hide', "Don't show again", 'Cancel'],
      defaultId: 0,
      cancelId: 2,
    });

    if (result.response === 2) {
      return false;
    }

    if (result.response === 1) {
      await this.dismissHideConfirmation();
    }

    return true;
  }

  protected buildHideMenuItem(linkText: string): MenuItemConstructorOptions | undefined {
    const rawItemName = linkText;
    const itemName = this.computeItemName(rawItemName);

    if (EXCLUDED_ITEMS.includes(itemName)) {
      return undefined;
    }

    if (itemName === this.activeItemName) {
      return undefined;
    }

    const itemDisplayName = this.escapeLabel(itemName);

    const item: MenuItemConstructorOptions = {
      label: `Hide ${itemDisplayName} From Navigation Bar`,
      visible: true,
      click: (): void => {
        this.showHideConfirmation(itemName)
          .then(confirmed => {
            if (confirmed) {
              return this.updateNavbarHiddenItem(itemName, false);
            }
          })
          .catch((e: unknown) => console.error('error hiding item', e));
      },
    };
    return item;
  }

  protected buildNavigationToggleMenuItems(): MenuItemConstructorOptions[] {
    const items: MenuItemConstructorOptions[] = [];

    // add all navigation items to be able to show/hide them
    const menuForNavItems: Electron.MenuItemConstructorOptions[] = this.navigationItems.map(item => ({
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

  protected buildShowHiddenItemsSubmenu(): MenuItemConstructorOptions | undefined {
    const hiddenItems = this.navigationItems.filter(item => !item.visible);
    if (hiddenItems.length === 0) {
      return undefined;
    }

    return {
      label: 'Show Hidden Items',
      submenu: hiddenItems.map(item => ({
        label: this.escapeLabel(item.name),
        click: (): void => {
          this.updateNavbarHiddenItem(item.name, true).catch((e: unknown) => console.error('error showing item', e));
        },
      })),
    };
  }

  protected buildResetMenuItem(): MenuItemConstructorOptions {
    return {
      label: 'Reset Navigation Bar',
      click: (): void => {
        this.configurationRegistry
          .updateConfigurationValue('navbar.disabledItems', [], CONFIGURATION_DEFAULT_SCOPE)
          .catch((e: unknown) => console.error('error resetting navigation bar', e));
      },
    };
  }

  protected getNavWidth(): number {
    const configuration = this.configurationRegistry.getConfiguration(AppearanceSettings.SectionName);
    return configuration.get<number>(AppearanceSettings.NavigationBarWidth, EXPANDED_WIDTH);
  }

  buildNavigationMenu(parameters: ContextMenuParams): MenuItemConstructorOptions[] {
    const items: MenuItemConstructorOptions[] = [];
    const navWidth = this.getNavWidth();

    if (parameters.linkText && parameters.x < navWidth && parameters.y > 76) {
      const menu = this.buildHideMenuItem(parameters.linkText);
      if (menu) {
        items.push(menu);
      }
    }
    if (parameters.x < navWidth) {
      items.push(...this.buildNavigationToggleMenuItems());

      const showHidden = this.buildShowHiddenItemsSubmenu();
      if (showHidden) {
        items.push({ type: 'separator' });
        items.push(showHidden);
      }

      items.push({ type: 'separator' });
      items.push(this.buildResetMenuItem());
    }
    return items;
  }
}
