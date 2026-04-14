/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { describe, expect, it } from 'vitest';

import { parseExtensionListRequest } from './extension-list';

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
});
