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

import { describe, expect, test } from 'vitest';

import { rotateArray } from './array-mutation.js';

describe('rotateArray', () => {
  test('returns empty array as-is', () => {
    expect(rotateArray([], 0)).toEqual([]);
    expect(rotateArray([], 5)).toEqual([]);
  });

  test('returns single-element array as-is', () => {
    expect(rotateArray(['a'], 0)).toEqual(['a']);
    expect(rotateArray(['a'], 3)).toEqual(['a']);
  });

  test('rotates from given start index', () => {
    const items = ['a', 'b', 'c', 'd'];
    expect(rotateArray(items, 0)).toEqual(['a', 'b', 'c', 'd']);
    expect(rotateArray(items, 1)).toEqual(['b', 'c', 'd', 'a']);
    expect(rotateArray(items, 2)).toEqual(['c', 'd', 'a', 'b']);
    expect(rotateArray(items, 3)).toEqual(['d', 'a', 'b', 'c']);
  });

  test('wraps around when start index exceeds length', () => {
    const items = ['a', 'b', 'c'];
    expect(rotateArray(items, 3)).toEqual(['a', 'b', 'c']);
    expect(rotateArray(items, 4)).toEqual(['b', 'c', 'a']);
    expect(rotateArray(items, 7)).toEqual(['b', 'c', 'a']);
  });

  test('handles negative start index by wrapping', () => {
    const items = ['a', 'b', 'c'];
    expect(rotateArray(items, -1)).toEqual(['c', 'a', 'b']);
    expect(rotateArray(items, -2)).toEqual(['b', 'c', 'a']);
  });

  test('does not mutate the original array', () => {
    const items = ['a', 'b', 'c'];
    rotateArray(items, 1);
    expect(items).toEqual(['a', 'b', 'c']);
  });

  test('preserves generic typing', () => {
    const items = [1, 2, 3];
    const result: number[] = rotateArray(items, 1);
    expect(result).toEqual([2, 3, 1]);
  });
});
