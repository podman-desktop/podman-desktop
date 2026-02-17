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
import type { ProviderConnectionStatus } from '@podman-desktop/api';
import { Spinner } from '@podman-desktop/ui-svelte';
import type { Component } from 'svelte';

import type { SystemOverviewStatus } from '/@api/dashboard-info';

export interface Status {
  status: SystemOverviewStatus;
  icon: IconDefinition | Component | string;
  priority: number; // Higher number = worse status
}

// Priority levels: critical (3) > progressing (2) > stable (1) > healthy (0)
export const SYSTEM_OVERVIEW_STATUS: Record<SystemOverviewStatus, Status> = {
  healthy: { status: 'healthy', icon: faCheckCircle, priority: 0 },
  stable: { status: 'stable', icon: faInfoCircle, priority: 1 },
  progressing: { status: 'progressing', icon: Spinner, priority: 2 },
  critical: { status: 'critical', icon: faXmarkCircle, priority: 3 },
};

export function getSystemOverviewStatus(status: ProviderConnectionStatus): Status {
  switch (status) {
    case 'started':
      return SYSTEM_OVERVIEW_STATUS.healthy;
    case 'stopped':
      return SYSTEM_OVERVIEW_STATUS.stable;
    case 'unknown':
      return SYSTEM_OVERVIEW_STATUS.critical;
    case 'starting':
    case 'stopping':
      return SYSTEM_OVERVIEW_STATUS.progressing;
    default:
      return SYSTEM_OVERVIEW_STATUS.stable;
  }
}

/**
 * System overview status store - receives computed status from backend
 */
export const systemOverview = $state<{ status: Status; text: string }>({
  status: SYSTEM_OVERVIEW_STATUS.critical,
  text: 'Loading...',
});

// Listen for status updates from backend (backend sends status string + text)
window.events?.receive('dashboard:system-overview-status', (...args: unknown[]) => {
  const statusInfo = args[0] as { status: SystemOverviewStatus; text: string };
  const status = SYSTEM_OVERVIEW_STATUS[statusInfo.status];
  if (status) {
    // Mutate properties instead of reassigning the entire object
    systemOverview.status = status;
    systemOverview.text = statusInfo.text;
  }
});
