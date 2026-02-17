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

export const ENHANCED_DASHBOARD_CONFIGURATION_KEY = 'dashboard.enhancedDashboard';
export const SYSTEM_OVERVIEW_CONFIGURATION_KEY = 'systemOverview.expanded';

export type SystemOverviewStatus =
  | typeof HEALTHY_STATUS
  | typeof STABLE_STATUS
  | typeof PROGRESSING_STATUS
  | typeof CRITICAL_STATUS;
export const HEALTHY_STATUS = 'healthy';
export const STABLE_STATUS = 'stable';
export const PROGRESSING_STATUS = 'progressing';
export const CRITICAL_STATUS = 'critical';

// Priority levels for status comparison: higher number = worse status
export const STATUS_PRIORITY: Record<SystemOverviewStatus, number> = {
  [HEALTHY_STATUS]: 0,
  [STABLE_STATUS]: 1,
  [PROGRESSING_STATUS]: 2,
  [CRITICAL_STATUS]: 3,
};

export interface SystemOverviewStatusInfo {
  status: SystemOverviewStatus;
  text: string;
}
