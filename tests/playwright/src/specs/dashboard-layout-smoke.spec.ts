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

import type { DashboardPage } from '/@/model/pages/dashboard-page';
import type { NavigationBar } from '/@/model/workbench/navigation';
import { RunnerOptions } from '/@/runner/runner-options';
import { expect as playExpect, test } from '/@/utility/fixtures';
import { setEnhancedDashboardFeature, waitForDashboardState } from '/@/utility/operations';

const LEARNING_CENTER = 'Learning Center';
const EXPLORE_FEATURES = 'Explore Features';
const SYSTEM_OVERVIEW = 'System Overview';
const PROVIDERS = 'Providers';

const TIMEOUT_SHORT = 10_000;

// When the enhanced dashboard leaves experimental, remove the '@experimental' entry and its toggling.
const dashboardModes = [
  { name: 'Dashboard layout manager', tag: ['@smoke'], enableEnhancedDashboard: false },
  { name: 'Dashboard layout manager with enhanced dashboard', tag: ['@experimental'], enableEnhancedDashboard: true },
];

let defaultSectionLabels: string[];

test.use({ runnerOptions: new RunnerOptions({ customFolder: 'dashboard-layout' }) });

test.beforeAll(async ({ runner, welcomePage }) => {
  runner.setVideoAndTraceName('dashboard-layout-e2e');
  await welcomePage.handleWelcomePage(true);
});

test.afterAll(async ({ runner }) => {
  await runner.close();
});

for (const { name, tag, enableEnhancedDashboard } of dashboardModes) {
  test.describe(name, { tag }, () => {
    test.describe.configure({ mode: 'serial', retries: 1 });

    test.beforeAll(async ({ page, navigationBar }) => {
      if (enableEnhancedDashboard) {
        await setEnhancedDashboardFeature(page, navigationBar, true);
        await waitForDashboardState(navigationBar, true);
      }
    });

    test.afterAll(async ({ page, navigationBar }) => {
      try {
        const dashboardPage = await navigationBar.openDashboard();
        await dashboardPage.layoutOrganizer.reset();
        await dashboardPage.layoutOrganizer.close();
      } finally {
        if (enableEnhancedDashboard) {
          await setEnhancedDashboardFeature(page, navigationBar, false);
        }
      }
    });

    test('Layout editor lists all dashboard sections enabled by default', async ({ navigationBar }) => {
      const dashboardPage = await navigationBar.openDashboard();
      await playExpect(dashboardPage.heading).toBeVisible();
      await playExpect(dashboardPage.learningCenterSection).toBeVisible({ timeout: TIMEOUT_SHORT });
      await playExpect(dashboardPage.exploreFeaturesSection).toBeVisible({ timeout: TIMEOUT_SHORT });

      const isEnhancedDashboard = await dashboardPage.systemOverviewButton
        .isVisible({ timeout: 5_000 })
        .catch(() => false);
      if (enableEnhancedDashboard) {
        playExpect(isEnhancedDashboard).toBeTruthy();
      }

      defaultSectionLabels = await dashboardPage.layoutOrganizer.getItemLabels();
      playExpect(defaultSectionLabels).toEqual(
        playExpect.arrayContaining([
          LEARNING_CENTER,
          EXPLORE_FEATURES,
          isEnhancedDashboard ? SYSTEM_OVERVIEW : PROVIDERS,
        ]),
      );
      playExpect(defaultSectionLabels).not.toContain(isEnhancedDashboard ? PROVIDERS : SYSTEM_OVERVIEW);
      for (const label of defaultSectionLabels) {
        playExpect(await dashboardPage.layoutOrganizer.isItemEnabled(label)).toBeTruthy();
      }
      playExpect(defaultSectionLabels.indexOf(EXPLORE_FEATURES)).toBeLessThan(
        defaultSectionLabels.indexOf(LEARNING_CENTER),
      );
      await playExpect(dashboardPage.layoutOrganizer.resetButton).toBeDisabled();
      await dashboardPage.layoutOrganizer.close();
      await verifySectionsOrder(dashboardPage, [EXPLORE_FEATURES, LEARNING_CENTER]);
    });

    test('Hidden section stays hidden after navigating away', async ({ navigationBar }) => {
      let dashboardPage = await navigationBar.openDashboard();

      await test.step('Hide Learning Center section', async () => {
        await dashboardPage.layoutOrganizer.toggleItem(LEARNING_CENTER, false);
        await dashboardPage.layoutOrganizer.close();
        await playExpect(dashboardPage.learningCenterSection).not.toBeVisible();
        await playExpect(dashboardPage.exploreFeaturesSection).toBeVisible();
      });

      dashboardPage = await navigateAwayAndBack(navigationBar);

      await test.step('Verify Learning Center section is still hidden', async () => {
        await playExpect(dashboardPage.exploreFeaturesSection).toBeVisible({ timeout: TIMEOUT_SHORT });
        await playExpect(dashboardPage.learningCenterSection).not.toBeVisible();
        playExpect(await dashboardPage.layoutOrganizer.isItemEnabled(LEARNING_CENTER)).toBeFalsy();
        await dashboardPage.layoutOrganizer.close();
      });

      await test.step('Show Learning Center section again', async () => {
        await dashboardPage.layoutOrganizer.toggleItem(LEARNING_CENTER, true);
        await dashboardPage.layoutOrganizer.close();
        await playExpect(dashboardPage.learningCenterSection).toBeVisible();
      });
    });

    test('Section reordered with keyboard keeps its position after navigating away', async ({ navigationBar }) => {
      let dashboardPage = await navigationBar.openDashboard();

      await test.step('Move Learning Center above Explore Features using keyboard', async () => {
        await dashboardPage.layoutOrganizer.moveItemWithKeyboard(LEARNING_CENTER, 'up');
        await verifyOrganizerOrder(dashboardPage, LEARNING_CENTER, EXPLORE_FEATURES);
        await dashboardPage.layoutOrganizer.close();
        await verifySectionsOrder(dashboardPage, [LEARNING_CENTER, EXPLORE_FEATURES]);
      });

      dashboardPage = await navigateAwayAndBack(navigationBar);

      await test.step('Verify the new order is kept', async () => {
        await verifySectionsOrder(dashboardPage, [LEARNING_CENTER, EXPLORE_FEATURES]);
        await verifyOrganizerOrder(dashboardPage, LEARNING_CENTER, EXPLORE_FEATURES);
        await dashboardPage.layoutOrganizer.close();
      });
    });

    test('Reset layout restores the default sections order and visibility', async ({ navigationBar }) => {
      let dashboardPage = await navigationBar.openDashboard();
      await dashboardPage.layoutOrganizer.toggleItem(EXPLORE_FEATURES, false);
      await playExpect(dashboardPage.layoutOrganizer.resetButton).toBeEnabled();

      await dashboardPage.layoutOrganizer.reset();
      await verifyDefaultLayout(dashboardPage);

      dashboardPage = await navigateAwayAndBack(navigationBar);
      await verifyDefaultLayout(dashboardPage);
    });

    test('Section reordered with mouse drag keeps its position after navigating away', async ({ navigationBar }) => {
      let dashboardPage = await navigationBar.openDashboard();

      await test.step('Drag Learning Center onto Explore Features', async () => {
        await dashboardPage.layoutOrganizer.dragItem(LEARNING_CENTER, EXPLORE_FEATURES);
        await verifyOrganizerOrder(dashboardPage, LEARNING_CENTER, EXPLORE_FEATURES);
        await dashboardPage.layoutOrganizer.close();
        await verifySectionsOrder(dashboardPage, [LEARNING_CENTER, EXPLORE_FEATURES]);
      });

      dashboardPage = await navigateAwayAndBack(navigationBar);

      await test.step('Verify the new order is kept', async () => {
        await verifySectionsOrder(dashboardPage, [LEARNING_CENTER, EXPLORE_FEATURES]);
        await verifyOrganizerOrder(dashboardPage, LEARNING_CENTER, EXPLORE_FEATURES);
      });

      await dashboardPage.layoutOrganizer.reset();
      await verifyDefaultLayout(dashboardPage);
    });
  });
}

async function navigateAwayAndBack(navigationBar: NavigationBar): Promise<DashboardPage> {
  return test.step('Navigate to another page and back to the dashboard', async () => {
    const imagesPage = await navigationBar.openImages();
    await playExpect(imagesPage.heading).toBeVisible();
    const dashboardPage = await navigationBar.openDashboard();
    await playExpect(dashboardPage.heading).toBeVisible();
    return dashboardPage;
  });
}

async function verifyOrganizerOrder(
  dashboardPage: DashboardPage,
  upperLabel: string,
  lowerLabel: string,
): Promise<void> {
  return test.step(`Verify '${upperLabel}' is listed before '${lowerLabel}' in the layout editor`, async () => {
    await playExpect
      .poll(async () => {
        const labels = await dashboardPage.layoutOrganizer.getItemLabels();
        return labels.indexOf(upperLabel) >= 0 && labels.indexOf(upperLabel) < labels.indexOf(lowerLabel);
      })
      .toBeTruthy();
  });
}

async function verifySectionsOrder(dashboardPage: DashboardPage, [upperLabel, lowerLabel]: string[]): Promise<void> {
  return test.step(`Verify '${upperLabel}' section is displayed above '${lowerLabel}'`, async () => {
    const getSection = (label: string): Locator =>
      label === LEARNING_CENTER ? dashboardPage.learningCenterSection : dashboardPage.exploreFeaturesSection;
    const upperSection = getSection(upperLabel);
    const lowerSection = getSection(lowerLabel);
    await playExpect(upperSection).toBeVisible({ timeout: TIMEOUT_SHORT });
    await playExpect(lowerSection).toBeVisible({ timeout: TIMEOUT_SHORT });
    await playExpect.poll(async () => dashboardPage.isSectionAbove(upperSection, lowerSection)).toBeTruthy();
  });
}

async function verifyDefaultLayout(dashboardPage: DashboardPage): Promise<void> {
  return test.step('Verify default dashboard layout', async () => {
    await playExpect.poll(async () => dashboardPage.layoutOrganizer.getItemLabels()).toEqual(defaultSectionLabels);
    for (const label of defaultSectionLabels) {
      await playExpect(dashboardPage.layoutOrganizer.getItem(label)).toHaveAttribute('aria-pressed', 'true');
    }
    await playExpect(dashboardPage.layoutOrganizer.resetButton).toBeDisabled();
    await dashboardPage.layoutOrganizer.close();
    await verifySectionsOrder(dashboardPage, [EXPLORE_FEATURES, LEARNING_CENTER]);
  });
}
