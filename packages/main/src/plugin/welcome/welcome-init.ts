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

import { inject, injectable } from 'inversify';

import { type IConfigurationNode, IConfigurationRegistry } from '/@api/configuration/models.js';

import { WelcomeSettings } from './welcome-settings.js';

@injectable()
export class WelcomeInit {
  constructor(@inject(IConfigurationRegistry) private configurationRegistry: IConfigurationRegistry) {}

  init(): void {
    const welcomePlatformConfiguration: IConfigurationNode = {
      id: 'preferences.welcome',
      title: 'Welcome',
      type: 'object',
      properties: {
        [WelcomeSettings.SectionName + '.' + WelcomeSettings.Version]: {
          description: 'Latest version of the Welcome page shown.',
          type: 'string',
          default: undefined,
          hidden: true,
        },
      },
    };

    this.configurationRegistry.registerConfigurations([welcomePlatformConfiguration]);
  }
}
