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
import { createRawSnippet } from 'svelte';
import { expect, test } from 'vitest';

import HelperText from './HelperText.svelte';

const children = createRawSnippet(() => ({ render: (): string => '<span>Choose a Containerfile</span>' }));

test('renders the text in a paragraph with the given id', () => {
  render(HelperText, { id: 'reason', children });

  const text = screen.getByText('Choose a Containerfile');
  expect(text.parentElement).toHaveAttribute('id', 'reason');
  expect(text.parentElement?.tagName).toBe('P');
});

test('has no role, so it is not announced as an alert', () => {
  render(HelperText, { id: 'reason', children });

  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByText('Choose a Containerfile').parentElement).not.toHaveAttribute('role');
});

test('describes the control that points aria-describedby at it', () => {
  const { container } = render(HelperText, { id: 'reason', children });
  const button = document.createElement('button');
  button.setAttribute('aria-describedby', 'reason');
  // inside the rendered container, so testing-library removes it after the test
  container.append(button);

  expect(button).toHaveAccessibleDescription('Choose a Containerfile');
});

test('adds a custom class next to the default ones', () => {
  render(HelperText, { id: 'reason', class: 'mt-2', children });

  expect(screen.getByText('Choose a Containerfile').parentElement).toHaveClass('text-sm', 'mt-2');
});

test('passes native attributes through to the paragraph', () => {
  render(HelperText, { id: 'reason', 'aria-live': 'polite', children });

  expect(screen.getByText('Choose a Containerfile').parentElement).toHaveAttribute('aria-live', 'polite');
});

test('does not add an undefined class when none is given', () => {
  render(HelperText, { id: 'reason', children });

  expect(screen.getByText('Choose a Containerfile').parentElement?.className).not.toContain('undefined');
});
