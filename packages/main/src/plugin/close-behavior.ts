/**********************************************************************
 * Copyright (C) 2022 Red Hat, Inc.
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

import { isUnixLike } from '../util.js';

@injectable()
export class CloseBehavior {
  constructor(@inject(IConfigurationRegistry) private configurationRegistry: IConfigurationRegistry) {}

  async init(): Promise<void> {
    // add configuration
    const closeBehaviorConfigurationNode: IConfigurationNode = {
      id: 'preferences.ExitOnClose',
      title: 'Exit On Close',
      type: 'object',
      properties: {
        ['preferences.ExitOnClose']: {
          description: 'Quit the app when the close button is clicked instead of minimizing to the tray.',
          type: 'boolean',
          default: isUnixLike(),
        },
      },
    };

    this.configurationRegistry.registerConfigurations([closeBehaviorConfigurationNode]);
  }
}
