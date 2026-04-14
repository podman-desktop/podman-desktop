/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { render, screen } from '@testing-library/svelte';
import { assert, describe, expect, test } from 'vitest';

import Spinner from './Spinner.svelte';

describe('parent attributes should be propagate', () => {
  test('style attribute should be propagated', () => {
    render(Spinner, {
      style: 'color: green;',
    });

    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toBeDefined();
    expect(spinner).toHaveAttribute('aria-live', 'polite');

    expect(spinner.getAttribute('style')).toBe('color: green;');
  });

  test('class attribute should be propagated', () => {
    render(Spinner, {
      class: 'dummy-class',
    });

    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(spinner).toBeDefined();
    expect(spinner).toHaveAttribute('aria-live', 'polite');

    expect(spinner.classList).toContain('dummy-class');
  });
});

test('should use custom label', () => {
  const { getByRole } = render(Spinner, { label: 'Custom Loading' });
  getByRole('status', { name: 'Custom Loading' });
});

describe('spinner SVG structure', () => {
  test('should have 8 line elements', () => {
    render(Spinner);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    const svg = spinner.querySelector('svg');
    expect(svg).not.toBeNull();
    const lines = svg!.querySelectorAll('line');
    expect(lines.length).toBe(8);
  });

  test('should have viewBox 0 0 64 64', () => {
    render(Spinner);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    const svg = spinner.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute('viewBox')).toBe('0 0 64 64');
  });

  test('should have a g element wrapping all lines as the animation target', () => {
    render(Spinner);
    const spinner = screen.getByRole('status', { name: 'Loading' });
    const svg = spinner.querySelector('svg');
    assert(svg);
    const g = svg.querySelector('g');
    assert(g);
    expect(g.querySelectorAll('line').length).toBe(8);
    expect(g.children.length).toBe(8);
  });
});
