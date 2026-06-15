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

export const EXTENSION_TABLE_ROW_BASE_CLASS =
  'grid gap-x-4 min-h-[56px] mb-2 rounded-lg border bg-[var(--pd-content-card-bg)] cursor-pointer transition-colors hover:bg-[var(--pd-content-card-hover-bg)]';

export function extensionTableRowBorderClass(isPinned: boolean): string {
  if (isPinned) {
    return 'border-[var(--pd-content-card-border-selected)] hover:border-[var(--pd-content-card-border-selected)]';
  }
  return 'border-[var(--pd-content-table-border)] hover:border-[var(--pd-content-card-border-selected)]';
}
