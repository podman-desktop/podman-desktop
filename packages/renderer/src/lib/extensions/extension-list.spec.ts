/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { areExtensionsImprovementsSuggested } from './extensions-prototype-scope';

vi.mock(import('./extensions-prototype-scope'), () => ({
  areExtensionsImprovementsSuggested: vi.fn(() => false),
}));

const { buildExtensionDetailsPath, buildExtensionsListPath, parseExtensionDetailsRequest, parseExtensionListRequest } =
  await import('./extension-list');

beforeEach(() => {
  vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(false);
});

describe('parseExtensionListRequest', () => {
  it('should return the correct query params when specified correctly', () => {
    const request = { query: { searchTerm: 'category%3Akubernetes%20keyword%3Aprovider%20term', screen: 'catalog' } };
    const result = parseExtensionListRequest(request);
    expect(result).toEqual({ searchTerm: 'category:kubernetes keyword:provider term', screen: 'catalog' });
  });

  it('should return the correct query params when screen is not specified correctly', () => {
    const request = { query: { searchTerm: 'test', screen: 'unknown' } };
    const result = parseExtensionListRequest(request);
    expect(result).toEqual({ searchTerm: 'test', screen: 'installed' });
  });

  it('should return the correct query params when nothing is specified', () => {
    const request = {};
    const result = parseExtensionListRequest(request);
    expect(result).toEqual({ searchTerm: '', screen: 'installed' });
  });

  it('defaults to catalog in suggestion scope', () => {
    vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(true);
    expect(parseExtensionListRequest({})).toEqual({ searchTerm: '', screen: 'catalog' });
  });
});

describe('extension navigation helpers', () => {
  it('builds catalog list path with screen query in current scope', () => {
    expect(buildExtensionsListPath('catalog')).toBe('/extensions?screen=catalog');
  });

  it('omits catalog screen query in suggestion scope (catalog is default)', () => {
    vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(true);
    expect(buildExtensionsListPath('catalog')).toBe('/extensions/');
    expect(buildExtensionsListPath('installed')).toBe('/extensions?screen=installed');
  });

  it('builds details path with return screen query', () => {
    expect(buildExtensionDetailsPath('my-id', 'catalog')).toBe('/extensions/details/my-id/?returnScreen=catalog');
  });

  it('parses return screen from details request', () => {
    expect(parseExtensionDetailsRequest({ query: { returnScreen: 'catalog' } })).toEqual({
      returnScreen: 'catalog',
    });
  });
});
