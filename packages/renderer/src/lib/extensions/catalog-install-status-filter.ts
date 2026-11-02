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

import SearchString from 'search-string';

import { SearchTermParser } from '/@/lib/search/search-term-parser';

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
    if (!option) return this.searchTerm;

    const parsed = SearchString.parse(this.searchTerm);
    const conditions = parsed
      .getConditionArray()
      .filter(
        condition =>
          !condition.negated &&
          ['is', 'not'].includes(condition.keyword.toLowerCase()) &&
          condition.value.toLowerCase() === 'installed',
      );
    for (const condition of conditions) {
      parsed.removeEntry(condition.keyword, condition.value, condition.negated);
    }
    if (option.keyword) {
      parsed.addEntry(option.keyword, 'installed', false);
    }

    // search-string's toString loses quoted text and empty condition values.
    // Quote parsed values directly to keep unrelated search content intact.
    const filters = parsed
      .getConditionArray()
      .map(({ keyword, value, negated }) => `${negated ? '-' : ''}${this.quote(keyword)}:${this.quote(value)}`);
    const terms = parsed.getTextSegments().map(({ text, negated }) => `${negated ? '-' : ''}${this.quote(text)}`);
    return [...filters, ...terms].join(' ');
  }

  private quote(value: string): string {
    if (value && !/[\s,:"'\\]|^-/.test(value)) return value;
    return `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
  }
}
