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

import { ApiSenderType } from '@desktop-framework/api/api-sender';
import { AppearanceSettings } from '@desktop-framework/api/appearance';
import { IConfigurationRegistry } from '@desktop-framework/api/configuration';
import { app } from 'electron';
import { inject, injectable } from 'inversify';

import { getLanguages } from './language-registry.js';
import { resolveActiveLanguage } from './language-resolution.js';

const LANGUAGE_FULL_KEY = `${AppearanceSettings.SectionName}.${AppearanceSettings.Language}`;

/**
 * Resolves the active UI language (including the 'system' fallback to the OS
 * locale) and shares its translation entries with the renderer process.
 * Push-based flow: the renderer pulls on startup and receives 'i18n-updated'
 * events whenever preferences.language changes.
 */
@injectable()
export class LocalizationInit {
  constructor(
    @inject(IConfigurationRegistry) private configurationRegistry: IConfigurationRegistry,
    @inject(ApiSenderType) private apiSender: ApiSenderType,
  ) {}

  init(): void {
    this.configurationRegistry.onDidChangeConfiguration(async e => {
      if (e.key === LANGUAGE_FULL_KEY) {
        this.apiSender.send('i18n-updated', this.getActiveTranslations());
      }
    });
  }

  getActiveTranslations(): Record<string, string> {
    const preferred = this.configurationRegistry
      .getConfiguration(AppearanceSettings.SectionName)
      .get<string>(AppearanceSettings.Language);
    const active = resolveActiveLanguage(preferred, app.getLocale(), getLanguages());
    return { ...active?.translations };
  }
}
