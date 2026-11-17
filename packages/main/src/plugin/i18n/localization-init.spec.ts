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

import type { ApiSenderType } from '@desktop-framework/api/api-sender';
import type { IConfigurationChangeEvent, IConfigurationRegistry } from '@desktop-framework/api/configuration';
import { app } from 'electron';
import { beforeEach, expect, test, vi } from 'vitest';

import { LocalizationInit } from './localization-init.js';

type ChangeCallback = (event: IConfigurationChangeEvent) => void | Promise<void>;

let changeCallbacks: ChangeCallback[];
let configurationRegistry: IConfigurationRegistry;
let apiSender: ApiSenderType;

beforeEach(() => {
  vi.resetAllMocks();
  changeCallbacks = [];
  configurationRegistry = {
    onDidChangeConfiguration: vi.fn((callback: ChangeCallback) => {
      changeCallbacks.push(callback);
      return { dispose: vi.fn() };
    }),
    getConfiguration: vi.fn(),
  } as unknown as IConfigurationRegistry;
  apiSender = {
    send: vi.fn(),
    receive: vi.fn(),
  };
});

function mockPreferredLanguage(value: unknown): void {
  vi.mocked(configurationRegistry.getConfiguration).mockReturnValue({
    get: vi.fn().mockReturnValue(value),
  } as unknown as ReturnType<IConfigurationRegistry['getConfiguration']>);
}

test('Expect an explicit language preference to return its translations', async () => {
  mockPreferredLanguage('ja');
  const localizationInit = new LocalizationInit(configurationRegistry, apiSender);

  const translations = localizationInit.getActiveTranslations();

  expect(translations['preferences.appearance.description']).toContain('システム');
});

test('Expect system preference to resolve through the OS locale', async () => {
  mockPreferredLanguage('system');
  vi.mocked(app.getLocale).mockReturnValue('ja-JP');
  const localizationInit = new LocalizationInit(configurationRegistry, apiSender);

  const translations = localizationInit.getActiveTranslations();

  expect(translations['preferences.language.description']).toContain('表示言語');
});

test('Expect unknown OS locale to fall back to the English translations', async () => {
  mockPreferredLanguage(undefined);
  vi.mocked(app.getLocale).mockReturnValue('fr-FR');
  const localizationInit = new LocalizationInit(configurationRegistry, apiSender);

  const translations = localizationInit.getActiveTranslations();

  expect(translations['preferences.language.description']).toBe(
    'Select the display language, or use your system setting.',
  );
});

test('Expect a language configuration change to push the new translations', async () => {
  const localizationInit = new LocalizationInit(configurationRegistry, apiSender);
  localizationInit.init();

  expect(changeCallbacks.length).toBe(1);
  mockPreferredLanguage('ja');

  await changeCallbacks[0]?.({ key: 'preferences.language', value: 'ja' } as unknown as IConfigurationChangeEvent);

  expect(apiSender.send).toHaveBeenCalledWith(
    'i18n-updated',
    expect.objectContaining({ 'preferences.appearance.description': expect.stringContaining('システム') }),
  );
});

test('Expect an unrelated configuration change not to push translations', async () => {
  const localizationInit = new LocalizationInit(configurationRegistry, apiSender);
  localizationInit.init();

  await changeCallbacks[0]?.({ key: 'preferences.appearance', value: 'dark' } as unknown as IConfigurationChangeEvent);

  expect(apiSender.send).not.toHaveBeenCalled();
});
