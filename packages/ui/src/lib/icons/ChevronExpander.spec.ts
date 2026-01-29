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

import { render, screen } from '@testing-library/svelte';
import { describe, expect, test } from 'vitest';

import ChevronExpander from './ChevronExpander.svelte';

describe('ChevronExpander', () => {
  test('should render collapsed state by default', () => {
    render(ChevronExpander, {});

    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('rotate-0');
    expect(icon).not.toHaveClass('rotate-90');
  });

  test('should render expanded state when expanded=true', () => {
    render(ChevronExpander, { expanded: true });

    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('rotate-90');
    expect(icon).not.toHaveClass('rotate-0');
  });

  test('should have transition classes', () => {
    render(ChevronExpander, {});

    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('transition-transform');
    expect(icon).toHaveClass('duration-200');
  });

  test('should have motion-reduce class for accessibility', () => {
    render(ChevronExpander, {});

    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('motion-reduce:transition-none');
  });

  test('should apply custom class', () => {
    render(ChevronExpander, { class: 'custom-class ml-2' });

    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('custom-class');
    expect(icon).toHaveClass('ml-2');
  });

  test('should apply size prop', () => {
    render(ChevronExpander, { size: '2x' });

    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('style', expect.stringContaining('font-size: 2em;'));
  });
});
