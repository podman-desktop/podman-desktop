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

import SearchString, { type Condition } from 'search-string';

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
    if (!option || this.value === option.value) return this.searchTerm;

    const expected = SearchString.parse(this.searchTerm);
    for (const condition of expected.getConditionArray().filter(this.isInstallStatus)) {
      expected.removeEntry(condition.keyword, condition.value, condition.negated);
    }
    const token = option.keyword ? `${option.keyword}:installed` : '';
    if (option.keyword) expected.addEntry(option.keyword, 'installed', false);
    const signature = this.signature(expected);
    const accepts = (candidate: string): boolean => this.signature(SearchString.parse(candidate)) === signature;

    // These are only candidates, not a second parser. The full-query comparison
    // rejects edits to quoted text or tokens whose meaning depends on context.
    const matches = [...this.searchTerm.matchAll(/(?<=^| )(?:is|not):(?:installed|"installed"|'installed')(?= |$)/gi)];
    for (const match of matches) {
      const candidate = this.replaceToken(this.searchTerm, match.index, match[0].length, token);
      if (accepts(candidate)) return candidate;
    }

    let withoutStatus = this.searchTerm;
    for (const match of matches.toReversed()) {
      withoutStatus = this.replaceToken(withoutStatus, match.index, match[0].length, '');
    }
    const separator = withoutStatus && !withoutStatus.endsWith(' ') ? ' ' : '';
    const appended = token ? `${withoutStatus}${separator}${token}` : withoutStatus;
    if (accepts(appended)) return appended;
    const prepended = token ? `${token} ${withoutStatus}` : withoutStatus;
    if (accepts(prepended)) return prepended;

    // Grouped or escaped status values may require normalization. Unlike the
    // library's toString(), preserve quoted phrases and empty condition values.
    const filters = expected
      .getConditionArray()
      .map(({ keyword, value, negated }) => `${negated ? '-' : ''}${this.quote(keyword)}:${this.quote(value)}`);
    const terms = expected.getTextSegments().map(({ text, negated }) => `${negated ? '-' : ''}${this.quote(text)}`);
    const normalized = [...terms, ...filters].join(' ');
    return accepts(normalized) ? normalized : this.searchTerm;
  }

  private signature(parsed: SearchString): string {
    const conditions = parsed
      .getConditionArray()
      .map(({ keyword, value, negated }) => JSON.stringify([keyword, value, negated]))
      .toSorted((a, b) => a.localeCompare(b));
    return JSON.stringify([parsed.getTextSegments(), conditions]);
  }

  private replaceToken(source: string, start: number, length: number, token: string): string {
    let end = start + length;
    if (!token) {
      if (source[end] === ' ') end++;
      else if (source[start - 1] === ' ') start--;
    }
    return source.slice(0, start) + token + source.slice(end);
  }

  private isInstallStatus(condition: Condition): boolean {
    return (
      !condition.negated &&
      ['is', 'not'].includes(condition.keyword.toLowerCase()) &&
      condition.value.toLowerCase() === 'installed'
    );
  }

  private quote(value: string): string {
    if (value && !/[\s,:"'\\]|^-/.test(value)) return value;
    return `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
  }
}
