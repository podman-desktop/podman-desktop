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

import { addAriaDescribedBy, getTooltipAriaTarget, removeAriaDescribedBy } from './tooltip-aria';

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

describe('addAriaDescribedBy', () => {
  test('sets the id when there is no aria-describedby', () => {
    addAriaDescribedBy(element, 'tip');

    expect(element).toHaveAttribute('aria-describedby', 'tip');
  });

  test('appends the id to existing ids', () => {
    element.setAttribute('aria-describedby', 'err');

    addAriaDescribedBy(element, 'tip');

    expect(element).toHaveAttribute('aria-describedby', 'err tip');
  });

  test('does not add the id twice', () => {
    element.setAttribute('aria-describedby', 'err tip');

    addAriaDescribedBy(element, 'tip');

    expect(element).toHaveAttribute('aria-describedby', 'err tip');
  });
});

describe('removeAriaDescribedBy', () => {
  test('removes only the id and keeps the current other ids', () => {
    element.setAttribute('aria-describedby', 'err2 tip other');

    removeAriaDescribedBy(element, 'tip');

    expect(element).toHaveAttribute('aria-describedby', 'err2 other');
  });

  test('removes the attribute when the id was the only one', () => {
    element.setAttribute('aria-describedby', 'tip');

    removeAriaDescribedBy(element, 'tip');

    expect(element).not.toHaveAttribute('aria-describedby');
  });

  test('leaves the attribute untouched when the id is not referenced', () => {
    element.setAttribute('aria-describedby', 'err');

    removeAriaDescribedBy(element, 'tip');

    expect(element).toHaveAttribute('aria-describedby', 'err');
  });
});
