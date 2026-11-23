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

/** Edits Catalog query conditions only when the full parsed query matches the intended change. */
export class CatalogFilterQuery {
  constructor(readonly searchTerm: string) {}

  /**
   * @param predicate Selects the parsed conditions to remove.
   * @param pattern Global regex used only to propose edits to the original query.
   */
  replace(
    predicate: (condition: Condition) => boolean,
    pattern: RegExp,
    replacement?: { keyword: string; value: string },
  ): string {
    const expected = SearchString.parse(this.searchTerm);
    for (const condition of expected.getConditionArray().filter(predicate)) {
      expected.removeEntry(condition.keyword, condition.value, condition.negated);
    }
    const token = replacement ? `${replacement.keyword}:${this.quote(replacement.value)}` : '';
    if (replacement) expected.addEntry(replacement.keyword, replacement.value, false);
    const signature = this.signature(expected);
    const accepts = (candidate: string): boolean => this.signature(SearchString.parse(candidate)) === signature;

    // These are only candidates, not a second parser. The full-query comparison
    // rejects edits to quoted text or tokens whose meaning depends on context.
    const matches = [...this.searchTerm.matchAll(pattern)];
    for (const match of matches) {
      const candidate = this.replaceToken(this.searchTerm, match.index, match[0].length, token);
      if (accepts(candidate)) return candidate;
    }

    let withoutFilter = this.searchTerm;
    for (const match of matches.toReversed()) {
      withoutFilter = this.replaceToken(withoutFilter, match.index, match[0].length, '');
    }
    const separator = withoutFilter && !withoutFilter.endsWith(' ') ? ' ' : '';
    const appended = token ? `${withoutFilter}${separator}${token}` : withoutFilter;
    if (accepts(appended)) return appended;
    const prepended = token ? `${token} ${withoutFilter}` : withoutFilter;
    if (accepts(prepended)) return prepended;

    // Grouped or escaped values may require normalization. Unlike the library's
    // toString(), preserve quoted phrases and empty condition values.
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

  private quote(value: string): string {
    if (value && !/[\s,:"'\\]|^-/.test(value)) return value;
    return `"${value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
  }
}
