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

import { faCheckCircle, faXmarkCircle } from '@fortawesome/free-regular-svg-icons';
import { faInfoCircle, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import type { ProviderStatus } from '@podman-desktop/api';
import { Spinner } from '@podman-desktop/ui-svelte';
import type { Component } from 'svelte';
import { get } from 'svelte/store';

import { providerInfos } from '/@/stores/providers';
import type { ProviderConnectionInfo } from '/@api/provider-info';

export interface Status {
  status: SystemOverviewStatus;
  icon: IconDefinition | Component | string;
  priority: number; // Higher number = worse status
}

export type SystemOverviewStatus = 'healthy' | 'stable' | 'progressing' | 'critical';

// Priority levels: critical (3) > progressing (2) > stable (1) > healthy (0)
export const SYSTEM_OVERVIEW_STATUS: Record<SystemOverviewStatus, Status> = {
  healthy: { status: 'healthy', icon: faCheckCircle, priority: 0 },
  stable: { status: 'stable', icon: faInfoCircle, priority: 1 },
  progressing: { status: 'progressing', icon: Spinner, priority: 2 },
  critical: { status: 'critical', icon: faXmarkCircle, priority: 3 },
};

export function convertProviderStatusToSystemOverviewStatus(status: ProviderStatus): Status {
  switch (status) {
    case 'started':
    case 'ready':
      return SYSTEM_OVERVIEW_STATUS.healthy;
    case 'not-installed':
    case 'installed':
    case 'stopped':
      return SYSTEM_OVERVIEW_STATUS.stable;
    case 'error':
    case 'unknown':
      return SYSTEM_OVERVIEW_STATUS.critical;
    case 'starting':
    case 'configuring':
    case 'stopping':
      return SYSTEM_OVERVIEW_STATUS.progressing;
    default:
      return SYSTEM_OVERVIEW_STATUS.stable;
  }
}

const providers = $derived(get(providerInfos));
const allConnections: ProviderConnectionInfo[] = $derived(
  providers.flatMap(provider => [
    ...provider.containerConnections,
    ...provider.kubernetesConnections,
    ...provider.vmConnections,
  ]),
);

/**
 * Evaluates all provider connections and returns the worst status based on priority.
 * Priority order: critical > stopped > progressing > healthy
 */
export function getSystemOverviewStatus(): Status {
  // If no connections exist, return healthy status
  if (allConnections.length === 0) {
    return SYSTEM_OVERVIEW_STATUS.critical;
  }

  // Convert all connection statuses to system overview statuses
  const statuses = allConnections
    .map(connection => convertProviderStatusToSystemOverviewStatus(connection.status))
    .filter((status): status is Status => status !== undefined);

  // If no valid statuses found, return critical
  if (statuses.length === 0) {
    return SYSTEM_OVERVIEW_STATUS.critical;
  }

  // Find and return the worst status (highest priority number)
  const worstStatus = statuses.reduce((worst, current) => {
    return current.priority > worst.priority ? current : worst;
  }, statuses[0]);

  return worstStatus;
}

export function getSystemOverviewText(status: Status): string {
  let text = 'Unknown';
  const errorConnections = allConnections.filter(connection => connection.status === 'unknown').length;
  const errorProviders = providers.filter(provider => provider.status === 'error').length;
  switch (status.status) {
    case 'healthy':
      text = 'All systems operational';
      break;
    case 'stable':
      text = 'Some systems are stopped';
      break;
    case 'progressing':
      // Only starting connections
      if (allConnections.filter(connection => connection.status === 'starting').length) {
        text = 'Starting up...';
      } else {
        // Only stopping connections
        text = 'Stopping...';
      }
      break;
    case 'critical':
      if (errorConnections > 1 || errorProviders > 1 || (errorConnections === 1 && errorProviders === 1)) {
        text = 'Multiple errors detected';
      } else {
        text = 'Error detected';
      }
      break;
  }

  return text;
}
