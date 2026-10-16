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

export type CatalogInstallStatus = 'all' | 'installed' | 'not-installed';

type CatalogFilterKeyword = 'category' | 'is' | 'not';
const CATALOG_TOOLBAR_FILTERS = ['category', 'is', 'not'] as const;
const DOUBLE_QUOTE = String.fromCodePoint(34);
const SINGLE_QUOTE = String.fromCodePoint(39);

interface FilterToken {
  keyword: CatalogFilterKeyword;
  value: string;
}

export interface CatalogInstallStatusOption {
  value: CatalogInstallStatus;
  label: string;
  token?: FilterToken;
}

export interface CatalogCategoryOption {
  value: string;
  label: string;
}

export const CATALOG_INSTALL_STATUS_OPTIONS: CatalogInstallStatusOption[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'installed', label: 'Installed', token: { keyword: 'is', value: 'installed' } },
  { value: 'not-installed', label: 'Not installed', token: { keyword: 'not', value: 'installed' } },
];

/**
 * Presents and updates Catalog filter controls through the existing search-term token model.
 */
export class CatalogExtensionFilterState {
  readonly #parsed: SearchTermParser<(typeof CATALOG_TOOLBAR_FILTERS)[number]>;
  readonly #tokens: string[];

  constructor(
    readonly searchTerm: string,
    readonly categories: string[] = [],
  ) {
    this.#parsed = new SearchTermParser(searchTerm, CATALOG_TOOLBAR_FILTERS);
    this.#tokens = this.#splitSearchTerm();
  }

  /**
   * Returns the install-status control value represented by the search term.
   */
  get installStatus(): CatalogInstallStatus {
    return CATALOG_INSTALL_STATUS_OPTIONS.find(option => option.token && this.#hasToken(option.token))?.value ?? 'all';
  }

  /**
   * Returns the category control value represented by the search term.
   */
  get category(): string {
    const category = this.#parsed.getFilter('category')[0] ?? '';
    return this.categories.find(value => value.toLowerCase() === category.toLowerCase()) ?? category;
  }

  /**
   * Returns category options, including the option that removes the category filter.
   */
  get categoryOptions(): CatalogCategoryOption[] {
    return [
      { value: '', label: 'All categories' },
      ...this.categories.map(category => ({ value: category, label: category })),
    ];
  }

  /**
   * Returns whether the search term requests Featured extensions.
   */
  get featured(): boolean {
    return this.#parsed.getFilter('is').includes('featured');
  }

  /**
   * Returns whether any text or filter token is active.
   */
  get hasActiveFilters(): boolean {
    return this.searchTerm.trim().length > 0;
  }

  /**
   * Returns a search term with the requested install-status token.
   */
  withInstallStatus(status: string): string {
    const option = CATALOG_INSTALL_STATUS_OPTIONS.find(candidate => candidate.value === status);
    if (!option) {
      return this.searchTerm;
    }

    return this.#replaceTokenValue(['is', 'not'], 'installed', option.token);
  }

  /**
   * Returns a search term with the requested category token.
   */
  withCategory(category: string): string {
    return this.#replaceTokens(
      token => this.#matchesToken(token, ['category']),
      category ? { keyword: 'category', value: category } : undefined,
    );
  }

  /**
   * Returns a search term with Featured enabled or with its Featured tokens removed.
   */
  withFeatured(featured: boolean): string {
    return this.#replaceTokenValue(
      ['is', 'not'],
      'featured',
      featured ? { keyword: 'is', value: 'featured' } : undefined,
    );
  }

  #hasToken(token: FilterToken): boolean {
    return this.#parsed.getFilter(token.keyword).includes(token.value);
  }

  #matchesToken(token: string, keywords: CatalogFilterKeyword[], value?: string): boolean {
    const separator = token.indexOf(':');
    if (separator < 0 || token.startsWith('-')) {
      return false;
    }

    const keyword = token.slice(0, separator).toLowerCase();
    const tokenValue = this.#unquote(token.slice(separator + 1)).toLowerCase();
    return keywords.some(candidate => candidate === keyword) && (value === undefined || tokenValue === value);
  }

  #replaceTokens(predicate: (token: string) => boolean, replacement?: FilterToken): string {
    const tokens = this.#tokens.filter(token => !predicate(token));
    if (replacement) {
      tokens.push(`${replacement.keyword}:${this.#quote(replacement.value)}`);
    }
    return tokens.join(' ');
  }

  #replaceTokenValue(keywords: CatalogFilterKeyword[], value: string, replacement?: FilterToken): string {
    const tokens = this.#tokens.flatMap(token => this.#withoutTokenValue(token, keywords, value));
    if (replacement) {
      tokens.push(`${replacement.keyword}:${this.#quote(replacement.value)}`);
    }
    return tokens.join(' ');
  }

  #withoutTokenValue(token: string, keywords: CatalogFilterKeyword[], value: string): string[] {
    const parsed = SearchString.parse(token);
    const conditions = parsed.getConditionArray();
    if (!conditions.some(condition => this.#matchesCondition(condition, keywords, value))) {
      return [token];
    }

    return conditions
      .filter(condition => !this.#matchesCondition(condition, keywords, value))
      .map(condition => `${condition.negated ? '-' : ''}${condition.keyword}:${this.#quote(condition.value)}`);
  }

  #matchesCondition(condition: Condition, keywords: CatalogFilterKeyword[], value: string): boolean {
    return (
      !condition.negated &&
      keywords.some(keyword => keyword === condition.keyword.toLowerCase()) &&
      condition.value.toLowerCase() === value
    );
  }

  #splitSearchTerm(): string[] {
    // Tokenize only for replacement while preserving quoted text exactly.
    // SearchTermParser remains the source of truth for interpreting the filters.
    const tokens: string[] = [];
    let token = '';
    let quote: string | undefined;
    let escaped = false;

    const searchTerm = this.searchTerm.trim();
    for (let index = 0; index < searchTerm.length; index++) {
      const character = searchTerm[index];
      if (escaped) {
        token += character;
        escaped = false;
      } else if (character === '\\') {
        token += character;
        escaped = true;
      } else if (quote) {
        token += character;
        if (character === quote) {
          quote = undefined;
        }
      } else if (
        (character === DOUBLE_QUOTE || character === SINGLE_QUOTE) &&
        this.#hasClosingQuote(searchTerm, index, character)
      ) {
        token += character;
        quote = character;
      } else if (/\s/.test(character)) {
        if (token) {
          tokens.push(token);
          token = '';
        }
      } else {
        token += character;
      }
    }

    if (token) {
      tokens.push(token);
    }
    return tokens;
  }

  #hasClosingQuote(searchTerm: string, openingIndex: number, quote: string): boolean {
    let escaped = false;
    for (let index = openingIndex + 1; index < searchTerm.length; index++) {
      const character = searchTerm[index];
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === quote) {
        return true;
      }
    }
    return false;
  }

  #quote(value: string): string {
    return /\s/.test(value) ? `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"` : value;
  }

  #unquote(value: string): string {
    const first = value.at(0);
    return first && (first === DOUBLE_QUOTE || first === SINGLE_QUOTE) && value.at(-1) === first
      ? value.slice(1, -1)
      : value;
  }
}
