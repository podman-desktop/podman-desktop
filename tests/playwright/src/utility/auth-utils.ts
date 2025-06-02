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

import { TroubleshootingPage } from '../model/pages/troubleshooting-page';
import { StatusBar } from '../model/workbench/status-bar';
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

export async function performBrowserLoginToRH(page: Page, username: string, pass: string, path: string): Promise<void> {
  console.log(`Performing browser login...`);
  await playExpect(page).toHaveTitle(/Log In/);
  await playExpect(page.getByRole('heading', { name: 'Log in to your Red Hat' })).toBeVisible();
  console.log(`We are on the login RH Login page...`);
  const input = page.getByRole('textbox', { name: 'Red Hat login or email' });
  await playExpect(input).toBeVisible();
  await input.fill(username);
  const nextButton = page.getByRole('button', { name: 'Next' });
  await nextButton.click();
  const passInput = page.getByRole('textbox', { name: 'Password' });
  await playExpect(passInput).toBeVisible();
  await passInput.fill(pass);
  const loginButton = page.getByRole('button', { name: 'Log in' });
  await playExpect(loginButton).toBeEnabled();
  await loginButton.click();
  const backButton = page.getByRole('button', { name: 'Go back to Podman Desktop' });
  await playExpect(backButton).toBeEnabled();
  await page.screenshot({ path: join(path, 'screenshots', 'after_login_in_browser.png'), type: 'png', fullPage: true });
  console.log(`Logged in, go back...`);
  await backButton.click();
  await page.screenshot({ path: join(path, 'screenshots', 'after_clck_go_back.png'), type: 'png', fullPage: true });
}

export async function performBrowserLogin(
  page: Page,
  title: string | RegExp,
  usernameAction: ConfirmInputValue,
  passwordAction: ConfirmInputValue,
  postLoginAction: (myPage: Page) => Promise<void>,
): Promise<void> {
  console.log(`Performing browser login...`);
  // title
  await playExpect(page).toHaveTitle(title);
  // username
  await playExpect(usernameAction.inputLocator).toBeVisible();
  await usernameAction.inputLocator.fill(usernameAction.inputValue);
  await playExpect(usernameAction.confirmLocator).toBeEnabled();
  await usernameAction.confirmLocator.click();
  // password
  await playExpect(passwordAction.inputLocator).toBeVisible();
  await passwordAction.inputLocator.fill(passwordAction.inputValue);
  await playExpect(passwordAction.confirmLocator).toBeEnabled();
  await passwordAction.confirmLocator.click();
  // custom doing...
  await postLoginAction(page);
}

export async function startChromium(port: string, tracesPath: string): Promise<Browser> {
  console.log('Starting a web server on port 9222');
  const browserLaunch = await chromium.launch({
    headless: false,
    args: [`--remote-debugging-port=${port}`],
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
  return browserLaunch;
}

export async function getEntryFromLogs(
  page: Page,
  filter: RegExp,
  regex: RegExp,
  lineContains = '',
): Promise<string | undefined> {
  await new StatusBar(page).troubleshootingButton.click();
  const troublePage = new TroubleshootingPage(page);
  await playExpect(troublePage.heading).toBeVisible();
  // open logs
  await troublePage.openLogs();
  const logList = troublePage.tabContent.getByRole('list');
  await playExpect(logList).toBeVisible();
  const logLine = logList.getByRole('listitem').filter({ hasText: filter });
  await playExpect(logLine).toBeVisible();
  await logLine.scrollIntoViewIfNeeded();
  if (lineContains) {
    await playExpect(logLine).toContainText(lineContains);
  }
  const logText = await logLine.innerText();
  console.log(`The whole log line: ${logText}`);
  // parse the line using regex:
  const parsedString = regex.exec(logText);
  const urlMatch = parsedString ? parsedString[1] : undefined;
  console.log(`Matched string: ${urlMatch}`);
  return urlMatch;
}
