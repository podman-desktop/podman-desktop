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

export function getFilteredEmptyLabels(
  kind: string,
  searchTerm: string,
): {
  title: string | undefined;
  message: string | undefined;
  detail: string | undefined;
  clearFilter: string | undefined;
} {
  const resource = t(`resource.kind.${kind}`) ?? kind;
  const filter = searchTerm.length > 20 ? (t('filtered.empty.filter') ?? 'filter') : `「${searchTerm}」`;
  return {
    title: t('filtered.empty.title', { kind: resource, filter }),
    message: t('filtered.empty.message'),
    detail: t('filtered.empty.detail', { kind: resource }),
    clearFilter: t('filtered.empty.clearFilter'),
  };
}
