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

import { t } from '/@/lib/i18n/translations.svelte';

/** Keeps localization separate from the table's stable sort and persistence identifiers. */
export function getTableLabels(): {
  column: (title: string) => string;
  configureColumns: string | undefined;
  resetColumns: string | undefined;
  toggleAll: string | undefined;
  toggleItem: string | undefined;
  expandRow: string | undefined;
  collapseRow: string | undefined;
} {
  return {
    column: (title: string): string => t(`table.column.${title}`) ?? title,
    configureColumns: t('table.configureColumns'),
    resetColumns: t('table.resetColumns'),
    toggleAll: t('table.toggleAll'),
    toggleItem: t('table.toggleItem'),
    expandRow: t('table.expandRow'),
    collapseRow: t('table.collapseRow'),
  };
}
