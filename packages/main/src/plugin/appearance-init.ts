/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import { nativeTheme } from 'electron';
import { inject, injectable } from 'inversify';

import { type IConfigurationNode, IConfigurationRegistry } from '/@api/configuration/models.js';

import { AppearanceSettings } from './appearance-settings.js';

const APPEARANCE_FULL_KEY = `${AppearanceSettings.SectionName}.${AppearanceSettings.Appearance}`;

@injectable()
export class AppearanceInit {
  constructor(@inject(IConfigurationRegistry) private configurationRegistry: IConfigurationRegistry) {}

  init(): void {
    const appearanceConfiguration: IConfigurationNode = {
      id: 'preferences.appearance',
      title: 'Appearance',
      type: 'object',
      properties: {
        [APPEARANCE_FULL_KEY]: {
          description: 'Select between light or dark mode, or use your system setting.',
          type: 'string',
          enum: ['system', 'dark', 'light'],
          default: 'system',
        },
        [`${AppearanceSettings.SectionName}.${AppearanceSettings.ZoomLevel}`]: {
          markdownDescription:
            'Select the zoom level. To **Zoom In**, set a positive value like `1` for a 20% zoom. To **Zoom Out**, use a negative value, like `-1`. Use decimals for more fine-grained zoom control.',
          type: 'number',
          minimum: -3,
          maximum: 3,
          default: 0,
          step: 0.1,
        },
        [`${AppearanceSettings.SectionName}.${AppearanceSettings.NavigationAppearance}`]: {
          description: 'Select icon and title or just icon for navigation icons',
          type: 'string',
          enum: [AppearanceSettings.IconAndTitle, AppearanceSettings.Icon],
          default: AppearanceSettings.IconAndTitle,
        },
      },
    };

    this.configurationRegistry.registerConfigurations([appearanceConfiguration]);

    this.configurationRegistry.onDidChangeConfiguration(async e => {
      if (e.key === APPEARANCE_FULL_KEY && typeof e.value === 'string') {
        this.updateNativeTheme(e.value);
      }
    });
  }

  updateNativeTheme(appearance: string): void {
    // appearance config values match the enum values for themeSource, but lets be expicit
    if (appearance === AppearanceSettings.LightEnumValue) {
      nativeTheme.themeSource = 'light';
    } else if (appearance === AppearanceSettings.DarkEnumValue) {
      nativeTheme.themeSource = 'dark';
    } else {
      nativeTheme.themeSource = 'system';
    }
  }
}
