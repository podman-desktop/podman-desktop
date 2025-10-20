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

import '@testing-library/jest-dom/vitest';

import { render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import TextHighLight from './TextHighLight.svelte';

test('No input - should display text without highlighting', () => {
  const text = 'My command 1';

  render(TextHighLight, { text, query: '' });

  const fullText = screen.getByText(text);
  expect(fullText).toBeInTheDocument();

  const markElements = screen.queryAllByRole('mark');
  expect(markElements).toHaveLength(0);
});

test('No match when something is typed - should display text without highlighting', () => {
  const text = 'My command 1';
  const query = 'xyz';

  render(TextHighLight, { text, query });

  const fullText = screen.getByText(text);
  expect(fullText).toBeInTheDocument();

  const markElements = screen.queryAllByRole('mark');
  expect(markElements).toHaveLength(0);
});

test('Match - should highlight matching text', () => {
  const text = 'My command 1';
  const query = 'My';

  render(TextHighLight, { text, query });

  // Check that we have exactly one mark element
  const markElements = screen.getAllByRole('mark');
  expect(markElements).toHaveLength(1);

  const highlightedText = screen.getByText('My');
  expect(highlightedText).toBeInTheDocument();
  expect(highlightedText).toHaveClass('text-[var(--pd-label-primary-text)]');
  expect(highlightedText).toHaveClass('font-semibold');
});

test('Multiple matches - should highlight all matching text', () => {
  const text = 'My command My test';
  const query = 'My';

  render(TextHighLight, { text, query });

  const markElements = screen.getAllByRole('mark');
  expect(markElements).toHaveLength(2);

  markElements.forEach(mark => {
    expect(mark).toHaveClass('text-[var(--pd-label-primary-text)]');
    expect(mark).toHaveClass('font-semibold');
    expect(mark.textContent).toBe('My');
  });
});
