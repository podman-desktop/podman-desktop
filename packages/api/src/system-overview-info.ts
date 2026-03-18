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

export const SYSTEM_OVERVIEW_EXPANDED = 'systemOverview.expanded';

export const HEALTH_MONITOR_STATUS = {
  HEALTHY: 'healthy',
  STABLE: 'stable',
  PROGRESSING: 'progressing',
  CRITICAL: 'critical',
} as const;

export type SystemOverviewStatus = (typeof HEALTH_MONITOR_STATUS)[keyof typeof HEALTH_MONITOR_STATUS];

// Priority levels for status comparison: higher number = worse status
export const HEALTH_MONITOR_STATUS_PRIORITY: Record<SystemOverviewStatus, number> = {
  [HEALTH_MONITOR_STATUS.HEALTHY]: 0,
  [HEALTH_MONITOR_STATUS.STABLE]: 1,
  [HEALTH_MONITOR_STATUS.PROGRESSING]: 2,
  [HEALTH_MONITOR_STATUS.CRITICAL]: 3,
};

export interface SystemOverviewStatusInfo {
  status: SystemOverviewStatus;
  text: string;
}
