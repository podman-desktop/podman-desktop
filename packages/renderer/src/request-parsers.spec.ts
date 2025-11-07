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

import { describe, expect, test } from 'vitest';

import { parseParamId } from './request-parsers';

describe('parseParamId', () => {
  test('should return undefined if the id is not present', () => {
    const request: { params?: Record<string, string> } = { params: {} };
    const result = parseParamId(request);
    expect(result).toBeUndefined();
  });

  test('should return the id if it is present', () => {
    const request: { params?: Record<string, string> } = { params: { id: '123' } };
    const result = parseParamId(request);
    expect(result).toEqual({ id: '123' });
  });

  test('should return undefined if params is not defined', () => {
    const request: { query?: Record<string, string>; params?: Record<string, string> } = { query: { id: '123' } };
    const result = parseParamId(request);
    expect(result).toBeUndefined();
  });
});
