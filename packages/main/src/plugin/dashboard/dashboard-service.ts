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

import type { ProviderConnectionStatus } from '@podman-desktop/api';
import type { ProviderConnectionInfo, ProviderInfo } from '@podman-desktop/core-api';
import {
  CRITICAL_STATUS,
  ENHANCED_DASHBOARD_CONFIGURATION_KEY,
  HEALTHY_STATUS,
  PROGRESSING_STATUS,
  STABLE_STATUS,
  STATUS_PRIORITY,
  SYSTEM_OVERVIEW_CONFIGURATION_KEY,
  SystemOverviewStatus,
  SystemOverviewStatusInfo,
} from '@podman-desktop/core-api';
import { ApiSenderType } from '@podman-desktop/core-api/api-sender';
import { type IConfigurationNode, IConfigurationRegistry } from '@podman-desktop/core-api/configuration';
import { inject, injectable } from 'inversify';

import { ExperimentalConfigurationManager } from '/@/plugin/experimental-configuration-manager.js';
import { ProviderRegistry } from '/@/plugin/provider-registry.js';

@injectable()
export class DashboardService {
  private isEnhancedDashboardEnabled = false;

  constructor(
    @inject(IConfigurationRegistry) private configurationRegistry: IConfigurationRegistry,
    @inject(ProviderRegistry) private providerRegistry: ProviderRegistry,
    @inject(ExperimentalConfigurationManager)
    private experimentalConfigurationManager: ExperimentalConfigurationManager,
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
      if (e.key === ENHANCED_DASHBOARD_CONFIGURATION_KEY) {
        this.isEnhancedDashboardEnabled = this.experimentalConfigurationManager.isExperimentalConfigurationEnabled(
          ENHANCED_DASHBOARD_CONFIGURATION_KEY,
        );
        this.apiSender.send('enhanced-dashboard-enabled', this.isEnhancedDashboardEnabled);

        this.updateSystemOverviewStatus();
      }
    });

    // Check if enhanced dashboard is enabled during initialization
    this.isEnhancedDashboardEnabled = this.experimentalConfigurationManager.isExperimentalConfigurationEnabled(
      ENHANCED_DASHBOARD_CONFIGURATION_KEY,
    );

    // Provider listeners
    this.providerRegistry.addProviderListener(() => this.updateSystemOverviewStatus());
    this.apiSender.receive('provider-change', () => this.updateSystemOverviewStatus());
  }

  private convertConnectionStatusToOverviewStatus(status: ProviderConnectionStatus): SystemOverviewStatus {
    switch (status) {
      case 'started':
        return HEALTHY_STATUS;
      case 'stopped':
        return STABLE_STATUS;
      case 'unknown':
        return CRITICAL_STATUS;
      case 'starting':
      case 'stopping':
        return PROGRESSING_STATUS;
      default:
        return STABLE_STATUS;
    }
  }

  private getSystemOverviewStatus(): SystemOverviewStatusInfo {
    const providers: ProviderInfo[] = this.providerRegistry.getProviderInfos();

    // Collect all connections from all providers
    const allConnections: ProviderConnectionInfo[] = providers.flatMap(provider => [
      ...provider.containerConnections,
      ...provider.kubernetesConnections,
      ...provider.vmConnections,
    ]);

    // If no connections exist, or no container connections for podman
    const noConnections =
      allConnections.length === 0 || (providers.find(p => p.id === 'podman')?.containerConnections.length ?? 0) === 0;

    if (noConnections) {
      // Show progressing when a provider is configuring or starting (e.g. during setup)
      const isConfiguringOrStarting = providers.some(
        p => p.status === 'configuring' || p.status === 'starting' || p.status === 'stopping',
      );

      const status: SystemOverviewStatus = isConfiguringOrStarting ? PROGRESSING_STATUS : CRITICAL_STATUS;
      return {
        status,
        text: this.getStatusText(status, allConnections, providers),
      };
    }

    // Convert all connection statuses to system overview statuses
    const statuses = allConnections.map(connection => this.convertConnectionStatusToOverviewStatus(connection.status));

    // If no valid statuses found, return critical
    if (statuses.length === 0) {
      return {
        status: CRITICAL_STATUS,
        text: this.getStatusText(CRITICAL_STATUS, allConnections, providers),
      };
    }

    // Find and return the worst status (highest priority number)
    const firstStatus = statuses[0];
    if (!firstStatus) {
      return {
        status: CRITICAL_STATUS,
        text: this.getStatusText(CRITICAL_STATUS, allConnections, providers),
      };
    }

    const worstStatus = statuses.reduce((worst, current) => {
      return STATUS_PRIORITY[current] > STATUS_PRIORITY[worst] ? current : worst;
    }, firstStatus);

    return {
      status: worstStatus,
      text: this.getStatusText(worstStatus, allConnections, providers),
    };
  }

  private getStatusText(
    status: SystemOverviewStatus,
    allConnections: ProviderConnectionInfo[],
    providers: ProviderInfo[],
  ): string {
    const errorConnections = allConnections.filter(connection => connection.status === 'unknown').length;
    const errorProviders = providers.filter(provider => provider.status === 'error').length;

    switch (status) {
      case HEALTHY_STATUS:
        return 'All systems operational';
      case STABLE_STATUS:
        return 'Some systems are stopped';
      case PROGRESSING_STATUS:
        // Check if starting or stopping
        if (allConnections.filter(connection => connection.status === 'starting').length) {
          return 'Starting up...';
        } else {
          return 'Stopping...';
        }
      case CRITICAL_STATUS:
        if (errorConnections > 1 || errorProviders > 1 || (errorConnections === 1 && errorProviders === 1)) {
          return 'Multiple errors detected';
        } else {
          return 'Error detected';
        }
      default:
        return 'Unknown';
    }
  }

  private updateSystemOverviewStatus(): void {
    const statusInfo = this.getSystemOverviewStatus();

    // Send status and text to renderer (frontend will map to icon)
    this.apiSender.send('dashboard:system-overview-status', statusInfo);
  }
}
