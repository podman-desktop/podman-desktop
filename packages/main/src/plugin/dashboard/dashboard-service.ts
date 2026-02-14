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

import { inject, injectable } from 'inversify';

import { ApiSenderType } from '/@api/api-sender/api-sender-type.js';
import { type IConfigurationNode, IConfigurationRegistry } from '/@api/configuration/models.js';
import { ENHANCED_DASHBOARD_CONFIGURATION_KEY, SYSTEM_OVERVIEW_CONFIGURATION_KEY } from '/@api/dashboard-info.js';

@injectable()
export class DashboardService {
  constructor(
    @inject(IConfigurationRegistry) private configurationRegistry: IConfigurationRegistry,
    @inject(ApiSenderType)
    private apiSender: ApiSenderType,
  ) {}

  init(): void {
    const dashboardConfiguration: IConfigurationNode = {
      id: 'preferences.experimental.enhancedDashboard',
      title: 'Experimental (Enhanced Dashboard)',
      type: 'object',
      properties: {
        [ENHANCED_DASHBOARD_CONFIGURATION_KEY]: {
          description: 'Enhanced dashboard with more features and improved user experience',
          type: 'object',
          default: false,
          experimental: {
            githubDiscussionLink: 'https://github.com/podman-desktop/podman-desktop/discussions/16055',
          },
        },
        [SYSTEM_OVERVIEW_CONFIGURATION_KEY]: {
          type: 'boolean',
          hidden: true,
          default: false,
        },
      },
    };

    this.configurationRegistry.registerConfigurations([dashboardConfiguration]);

    this.configurationRegistry.onDidChangeConfiguration(async e => {
      if (
        e.key === ENHANCED_DASHBOARD_CONFIGURATION_KEY &&
        (typeof e.value === 'object' || typeof e.value === 'undefined')
      ) {
        this.apiSender.send('enhanced-dashboard-enabled', typeof e.value === 'object');
      }
    });
  }
}
