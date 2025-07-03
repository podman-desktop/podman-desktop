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

@injectable()
export class OpenDevToolsInit {
  constructor(@inject(IConfigurationRegistry) private configurationRegistry: IConfigurationRegistry) {}

  init(): void {
    // add configuration
    const openDevToolsConfigurationNode: IConfigurationNode = {
      id: 'preferences.OpenDevTools',
      title: 'Open Dev Tools',
      type: 'object',
      properties: {
        ['preferences.OpenDevTools']: {
          description: 'Open DevTools when launching Podman Desktop in development mode.',
          type: 'string',
          enum: ['left', 'right', 'bottom', 'undocked', 'detach', 'none'],
          default: 'undocked',
        },
      },
    };

    this.configurationRegistry.registerConfigurations([openDevToolsConfigurationNode]);
  }
}
