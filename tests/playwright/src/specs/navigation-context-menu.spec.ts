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

import type { Locator } from '@playwright/test';

import { RunnerOptions } from '/@/runner/runner-options';
import { type CapturedContextMenu, withCapturedContextMenu } from '/@/utility/context-menu';
import { expect as playExpect, test } from '/@/utility/fixtures';

const TOGGLEABLE_ITEMS = ['Containers', 'Pods', 'Images', 'Volumes'];

interface ConfigurationWindow {
  updateConfigurationValue(key: string, value: unknown): Promise<void>;
  getConfigurationValue<T>(key: string): Promise<T | undefined>;
}

test.use({ runnerOptions: new RunnerOptions({ customFolder: 'navigation-context-menu' }) });

test.skip(
  process.env.DEBUGGING_PORT !== undefined && process.env.PODMAN_DESKTOP_BINARY !== undefined,
  'Test requires Electron main process evaluation, not supported with CDP runner',
);

test.beforeAll(async ({ runner, welcomePage }) => {
  runner.setVideoAndTraceName('navigation-context-menu-e2e');
  await welcomePage.handleWelcomePage(true);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

async function withNavigationContextMenu(
  link: Locator,
  action: (menu: CapturedContextMenu) => Promise<void>,
): Promise<void> {
  await playExpect(link).toBeVisible();
  await withCapturedContextMenu(() => link.click({ button: 'right' }), action);
}

test.describe('Navigation bar context menu', () => {
  test.describe.configure({ mode: 'serial' });

  test('Offers to hide the item and lists the items as toggles', async ({ navigationBar }) => {
    await withNavigationContextMenu(navigationBar.imagesLink, async menu => {
      const entries = await menu.getEntries();
      const labels = entries.map(entry => entry.label);

      playExpect(labels).toContain('Hide Images');
      // nothing is hidden or reordered yet
      playExpect(labels).not.toContain('Show All');
      playExpect(labels).not.toContain('Reset Order');

      for (const name of TOGGLEABLE_ITEMS) {
        playExpect(entries).toContainEqual(
          playExpect.objectContaining({ label: name, type: 'checkbox', checked: true }),
        );
      }
    });
  });

  test('Settings cannot be hidden', async ({ navigationBar }) => {
    await withNavigationContextMenu(navigationBar.settingsLink, async menu => {
      const labels = await menu.getLabels();

      playExpect(labels).not.toContain('Hide Settings');
      playExpect(labels).toEqual(playExpect.arrayContaining(TOGGLEABLE_ITEMS));
    });
  });

  test('Hide entry removes the item from the navigation bar', async ({ navigationBar }) => {
    await withNavigationContextMenu(navigationBar.imagesLink, menu => menu.clickEntry('Hide Images'));

    await playExpect(navigationBar.imagesLink).toBeHidden();
    // other items are untouched
    await playExpect(navigationBar.containersLink).toBeVisible();

    await withNavigationContextMenu(navigationBar.containersLink, async menu => {
      const entries = await menu.getEntries();

      playExpect(entries.map(entry => entry.label)).toContain('Show All');
      playExpect(entries).toContainEqual(playExpect.objectContaining({ label: 'Images', checked: false }));
    });
  });

  test('Toggle entry shows a hidden item again', async ({ navigationBar }) => {
    await withNavigationContextMenu(navigationBar.containersLink, menu => menu.clickEntry('Images'));

    await playExpect(navigationBar.imagesLink).toBeVisible();

    await withNavigationContextMenu(navigationBar.containersLink, async menu => {
      playExpect(await menu.getLabels()).not.toContain('Show All');
    });
  });

  test('Toggle entry hides a visible item', async ({ navigationBar }) => {
    await withNavigationContextMenu(navigationBar.containersLink, menu => menu.clickEntry('Volumes'));

    await playExpect(navigationBar.volumesLink).toBeHidden();
  });

  test('Show All entry restores every hidden item', async ({ navigationBar }) => {
    await withNavigationContextMenu(navigationBar.containersLink, menu => menu.clickEntry('Hide Containers'));
    await playExpect(navigationBar.containersLink).toBeHidden();
    await playExpect(navigationBar.volumesLink).toBeHidden();

    await withNavigationContextMenu(navigationBar.imagesLink, menu => menu.clickEntry('Show All'));

    await playExpect(navigationBar.containersLink).toBeVisible();
    await playExpect(navigationBar.volumesLink).toBeVisible();

    await withNavigationContextMenu(navigationBar.imagesLink, async menu => {
      playExpect(await menu.getLabels()).not.toContain('Show All');
    });
  });

  test('Reset Order entry clears the custom item order', async ({ navigationBar, page }) => {
    // the order is normally set by pinning an item, seed it directly to keep the test on the menu
    await page.evaluate(() =>
      (window as unknown as ConfigurationWindow).updateConfigurationValue('navbar.itemOrder', ['Images', 'Containers']),
    );

    await withNavigationContextMenu(navigationBar.imagesLink, async menu => {
      playExpect(await menu.getLabels()).toContain('Reset Order');
      await menu.clickEntry('Reset Order');
    });

    await playExpect
      .poll(() =>
        page.evaluate(() =>
          (window as unknown as ConfigurationWindow).getConfigurationValue<string[]>('navbar.itemOrder'),
        ),
      )
      .toEqual([]);

    await withNavigationContextMenu(navigationBar.imagesLink, async menu => {
      playExpect(await menu.getLabels()).not.toContain('Reset Order');
    });
  });
});
