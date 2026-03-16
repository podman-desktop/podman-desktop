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

export const SYSTEM_OVERVIEW_CONFIGURATION_KEY = 'systemOverview.expanded';

export const STATUS = {
  HEALTHY: 'healthy',
  STABLE: 'stable',
  PROGRESSING: 'progressing',
  CRITICAL: 'critical',
};

export type SystemOverviewStatus = (typeof STATUS)[keyof typeof STATUS];

// Priority levels for status comparison: higher number = worse status
export const STATUS_PRIORITY: Record<SystemOverviewStatus, number> = {
  [STATUS.HEALTHY]: 0,
  [STATUS.STABLE]: 1,
  [STATUS.PROGRESSING]: 2,
  [STATUS.CRITICAL]: 3,
};

export interface SystemOverviewStatusInfo {
  status: SystemOverviewStatus;
  text: string;
}
