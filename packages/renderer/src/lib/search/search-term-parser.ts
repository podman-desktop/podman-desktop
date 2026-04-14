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

/**
 * Parses a search string into plain-text terms and filter values,
 * respecting quoted values (double or single) via the `search-string` library.
 *
 * All terms and filter values are lowercased.
 *
 * @example
 * const parsed = new SearchTermParser('Foo category:"Extension Packs" is:installed', ['category', 'keyword', 'is', 'not']);
 * parsed.terms              // => ['foo']
 * parsed.getFilter('category') // => ['extension packs']
 * parsed.getFilter('is')      // => ['installed']
 */
export class SearchTermParser<F extends string> {
  readonly terms: string[];
  readonly #filters: ReadonlyMap<F, string[]>;

  constructor(searchTerm: string, allowedFilters: readonly F[]) {
    const terms: string[] = [];
    const filters = new Map<F, string[]>();
    const allowedSet = new Set<string>(allowedFilters);
    const normalized = searchTerm.toLowerCase();

    for (const filter of allowedFilters) {
      filters.set(filter, []);
    }

    const parsed = SearchString.parse(normalized);

    for (const segment of parsed.getTextSegments()) {
      if (!segment.negated && segment.text.length > 0) {
        terms.push(segment.text);
      }
    }

    for (const condition of parsed.getConditionArray()) {
      if (condition.negated) continue;
      const key = condition.keyword as F;
      const bucket = allowedSet.has(key) ? filters.get(key) : undefined;
      if (bucket) {
        bucket.push(condition.value);
      } else {
        terms.push(`${condition.keyword}:${condition.value}`);
      }
    }

    this.terms = terms;
    this.#filters = filters;
  }

  getFilter(name: F): string[] {
    return this.#filters.get(name) ?? [];
  }
}
