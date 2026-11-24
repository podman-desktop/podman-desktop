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

import type { Condition } from 'search-string';

import { SearchTermParser } from '/@/lib/search/search-term-parser';

import { CatalogFilterQuery } from './catalog-filter-query';
import { ExtensionsUtils } from './extensions-utils';

type CatalogInstallStatus = 'all' | 'installed' | 'not-installed';

export class CatalogInstallStatusFilter {
  static readonly OPTIONS: { value: CatalogInstallStatus; label: string; keyword?: 'is' | 'not' }[] = [
    { value: 'all', label: 'All statuses' },
    { value: 'installed', label: 'Installed', keyword: 'is' },
    { value: 'not-installed', label: 'Not installed', keyword: 'not' },
  ];

  constructor(readonly searchTerm: string) {}

  get value(): CatalogInstallStatus {
    const parsed = new SearchTermParser(this.searchTerm, ExtensionsUtils.CATALOG_FILTERS);
    return (
      CatalogInstallStatusFilter.OPTIONS.find(
        option => option.keyword && parsed.getFilter(option.keyword).includes('installed'),
      )?.value ?? 'all'
    );
  }

  withStatus(status: string): string {
    const option = CatalogInstallStatusFilter.OPTIONS.find(candidate => candidate.value === status);
    if (!option || this.value === option.value) return this.searchTerm;

    return new CatalogFilterQuery(this.searchTerm).replace(
      this.isInstallStatus,
      /(?<=^| )(?:is|not):(?:installed|"installed"|'installed')(?= |$)/gi,
      option.keyword ? { keyword: option.keyword, value: 'installed' } : undefined,
    );
  }

  private isInstallStatus(condition: Condition): boolean {
    return (
      !condition.negated &&
      ['is', 'not'].includes(condition.keyword.toLowerCase()) &&
      condition.value.toLowerCase() === 'installed'
    );
  }
}
