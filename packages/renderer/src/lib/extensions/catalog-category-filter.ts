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

import { SearchTermParser } from '/@/lib/search/search-term-parser';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { CatalogFilterQuery } from './catalog-filter-query';
import { ExtensionsUtils } from './extensions-utils';

export class CatalogCategoryFilter {
  // Dropdown initializes empty values on mount. Keep reset and category choices nonempty and distinct.
  static readonly ALL_CATEGORIES = 'all';
  static readonly CATEGORY_PREFIX = 'category:';

  constructor(
    readonly searchTerm: string,
    readonly extensions: CatalogExtensionInfoUI[],
  ) {}

  get value(): string {
    return this.category
      ? `${CatalogCategoryFilter.CATEGORY_PREFIX}${this.category}`
      : CatalogCategoryFilter.ALL_CATEGORIES;
  }

  private get category(): string {
    return new SearchTermParser(this.searchTerm, ExtensionsUtils.CATALOG_FILTERS).getFilter('category')[0] ?? '';
  }

  get options(): { value: string; label: string }[] {
    const categories = new Map<string, string>();
    for (const extension of this.extensions) {
      for (const category of extension.categories) {
        if (category.trim() && !categories.has(category.toLowerCase())) {
          categories.set(category.toLowerCase(), category);
        }
      }
    }
    // Deep links and typed categories remain visible even when absent from the catalog.
    if (this.category && !categories.has(this.category)) categories.set(this.category, this.category);
    return [
      { value: CatalogCategoryFilter.ALL_CATEGORIES, label: 'All categories' },
      ...[...categories.entries()]
        .toSorted((a, b) => a[1].localeCompare(b[1]))
        .map(([value, label]) => ({ value: `${CatalogCategoryFilter.CATEGORY_PREFIX}${value}`, label })),
    ];
  }

  withCategory(category: string): string {
    const option = this.options.find(candidate => candidate.value === category);
    const reset = category === CatalogCategoryFilter.ALL_CATEGORIES;
    if (!option || (!reset && category === this.value)) return this.searchTerm;
    return new CatalogFilterQuery(this.searchTerm).replace(
      condition => !condition.negated && condition.keyword.toLowerCase() === 'category',
      /(?<=^| )category:(?:"[^"\\]*"|'[^'\\]*'|[^\s,"'\\]+)(?= |$)/gi,
      reset ? undefined : { keyword: 'category', value: option.label },
    );
  }
}
