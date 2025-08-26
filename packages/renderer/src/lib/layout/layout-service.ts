/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import type { LayoutCallbacks, LayoutEditItem } from '/@api/layout-registry-info';

/**
 * Create standardized layout callbacks for a given kind and column names
 * This centralizes the callback logic so each component doesn't duplicate it
 */
export function createLayoutCallbacks(kind: string, columnNames: string[]): LayoutCallbacks {
  return {
    onLoad: async (): Promise<LayoutEditItem[]> => {
      return (await window.loadLayoutConfig(kind, columnNames)) ?? [];
    },
    onSave: async (items: LayoutEditItem[]): Promise<void> => {
      await window.saveLayoutConfig(kind, items);
    },
    onReset: async (): Promise<LayoutEditItem[]> => {
      return (await window.resetLayoutConfig(kind, columnNames)) ?? [];
    },
  };
}
