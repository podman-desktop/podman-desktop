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

import '@testing-library/jest-dom/vitest';

import { beforeEach, describe, expect, test } from 'vitest';

import { getTooltipAriaTarget } from './tooltip-aria';

let element: HTMLElement;

beforeEach(() => {
  element = document.createElement('div');
});

describe('getTooltipAriaTarget', () => {
  test('returns the first focusable descendant', () => {
    const button = document.createElement('button');
    element.appendChild(document.createElement('span'));
    element.appendChild(button);

    expect(getTooltipAriaTarget(element)).toBe(button);
  });

  test('skips disabled descendants and falls back to the root', () => {
    const button = document.createElement('button');
    button.disabled = true;
    element.appendChild(button);

    expect(getTooltipAriaTarget(element)).toBe(element);
  });

  test('returns a descendant made focusable with tabindex', () => {
    const span = document.createElement('span');
    span.tabIndex = 0;
    element.appendChild(span);

    expect(getTooltipAriaTarget(element)).toBe(span);
  });

  test('returns the root when it has no descendants', () => {
    expect(getTooltipAriaTarget(element)).toBe(element);
  });
});
