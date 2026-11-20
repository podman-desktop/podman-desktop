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

export const DASHBOARD_SECTION_CONTEXT = 'dashboard-section';

/**
 * Provided by DashboardPage to the sections it renders.
 * Sections read it with getContext(DASHBOARD_SECTION_CONTEXT); it is undefined outside the dashboard.
 */
export interface DashboardSectionContext {
  // true when the experimental enhanced dashboard layout is on
  readonly enhanced: boolean;

  // human-readable label for a registry id, the id itself when unknown
  label(id: string): string;

  // hide a section (same as unchecking it in the dashboard layout menu)
  hide(id: string): void;
}
