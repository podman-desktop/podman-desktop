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

import { join } from 'node:path';

import type { Browser, Locator, Page } from '@playwright/test';
import { chromium, expect as playExpect } from '@playwright/test';

import { waitUntil } from './wait';

export type ConfirmInputValue = {
  inputLocator: Locator;
  inputValue: string;
  confirmLocator: Locator;
};

export async function findPageWithTitleInBrowser(browser: Browser, expectedTitle: string): Promise<Page | undefined> {
  await waitUntil(async () => browser.contexts().length > 0, {
    timeout: 10_000,
    message: 'Waiting for browser contexts to be available',
    sendError: false,
  });
  const pages = browser.contexts().flatMap(context => context.pages());
  const pagesTitles = await Promise.all(pages.map(async page => ({ page, title: await page.title() })));

  const chromePage = pagesTitles.find(p => p.title.includes(expectedTitle))?.page;
  if (!chromePage) {
    console.error(`No page found with title: ${expectedTitle}`);
  }
  return chromePage;
}

export async function performBrowserLogin(
  page: Page,
  title: string | RegExp,
  usernameAction: ConfirmInputValue,
  passwordAction: ConfirmInputValue,
  postLoginAction: (myPage: Page) => Promise<void>,
  options: {
    screenshotsPath: string | undefined;
  } = { screenshotsPath: '' },
): Promise<void> {
  console.log('Performing browser login...');
  const path = options.screenshotsPath;
  if (path) {
    await page.screenshot({ path: join(path, 'screenshots', 'initial_page.png'), type: 'png', fullPage: true });
  }
  // title
  await playExpect(page).toHaveTitle(title);
  // username
  await playExpect(usernameAction.inputLocator).toBeVisible();
  await usernameAction.inputLocator.fill(usernameAction.inputValue);
  await playExpect(usernameAction.confirmLocator).toBeEnabled();
  await usernameAction.confirmLocator.click();
  if (path) {
    await page.screenshot({ path: join(path, 'screenshots', 'after_username_page.png'), type: 'png', fullPage: true });
  }
  // password
  await playExpect(passwordAction.inputLocator).toBeVisible();
  await passwordAction.inputLocator.fill(passwordAction.inputValue);
  await playExpect(passwordAction.confirmLocator).toBeEnabled();
  await passwordAction.confirmLocator.click();
  if (path) {
    await page.screenshot({ path: join(path, 'screenshots', 'after_password_page.png'), type: 'png', fullPage: true });
  }
  // custom doing...
  await postLoginAction(page);
}

export async function startChromium(port: string, tracesPath: string, args: string[] = []): Promise<Browser> {
  console.log('Starting a web server on port 9222');
  const browserLaunch = await chromium.launch({
    headless: false,
    args: [`--remote-debugging-port=${port}`, ...args],
    tracesDir: tracesPath,
    slowMo: 200,
  });

  // hard wait
  await waitUntil(async () => browserLaunch?.isConnected(), {
    timeout: 10_000,
    message: 'Waiting for browser to be connected',
    sendError: false,
  });
  // Connect to the same Chrome instance via CDP
  // possible option is to use chromium.connectOverCDP(`http://localhost:${port}`);
  if (!browserLaunch) {
    throw new Error('Browser object was not initialized properly');
  }
  console.log(`Browser is launched. Executable path: ${browserLaunch.browserType().executablePath()}`);
  return browserLaunch;
}

// to be deprecated, use getEntryFromConsoleLogs instead
export async function getEntryFromLogs(
  page: Page,
  filter: RegExp,
  regex: RegExp,
  lineContains = '',
): Promise<string | undefined> {
  return await getEntryFromConsoleLogs(page, filter, regex, lineContains, 10_000);
}

// get a page's console log entry filtered by a regexp filter argument and matched by a regex
export async function getEntryFromConsoleLogs(
  page: Page,
  filter: RegExp,
  regex: RegExp,
  checkString: string,
  timeout = 10_000,
): Promise<string | undefined> {
  const consoleLogPromise = page.waitForEvent('console', {
    predicate: msg => {
      return msg.type() === 'log' && filter.test(msg.text());
    },
    timeout: timeout,
  });
  const consoleMsg = await consoleLogPromise;
  const logLine = consoleMsg.text();
  if (checkString) {
    playExpect(logLine).toContain(checkString);
  }
  const parsedString = regex.exec(logLine);
  const urlMatch = parsedString ? parsedString[1] : undefined;
  console.log(`Matched string: ${urlMatch}`);
  return urlMatch;
}

// Accept/Refuse the cooking in the iframe element
export async function handleCookies(
  page: Page,
  iframTitle: string,
  buttonName: string,
  timeout: number,
): Promise<void> {
  const iframe = page.frameLocator(`iframe[title="${iframTitle}"]`);
  const button = iframe.getByRole('button', { name: buttonName });
  const buttonVisible = await checkLocatorExistence(button, timeout);
  if (buttonVisible) {
    await playExpect(button).toBeVisible();
    await button.click();
    console.log(`Clicked on the button: ${buttonName}`);
  } else {
    console.log(`${buttonName} button is not visible, skipping confirmation...`);
  }
}

// function is dedicated to verify if some locator exists, depending on external circumstances
export async function checkLocatorExistence(locator: Locator, timeout = 5000): Promise<boolean> {
  try {
    await playExpect(locator).toBeVisible({ timeout: timeout });
  } catch (error: unknown) {
    console.log(`Locator not found: ${error}`);
    return false;
  }
  return true;
}
