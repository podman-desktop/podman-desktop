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
import { expect, test } from 'vitest';

import ButtonRowTest from './ButtonRowTest.svelte';

test('renders actions in DOM order and right-aligns the row', () => {
  const { container } = render(ButtonRowTest);

  expect(container.textContent).not.toContain('Copyright (C) 2026 Red Hat, Inc.');

  const actions = screen.getAllByRole('button');
  expect(actions.map(action => action.textContent)).toEqual(['Cancel', 'Save']);

  const row = container.firstElementChild;
  expect(row).toHaveClass('flex');
  expect(row).toHaveClass('justify-end');
  expect(row).not.toHaveClass('justify-center');
  expect(row).not.toHaveClass('w-full');
});

test('does not move focus by default', () => {
  render(ButtonRowTest);

  expect(document.activeElement).toBe(document.body);
});

test('focuses the first action when requested', () => {
  render(ButtonRowTest, { initialFocus: 'first' });

  expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
});

test('focuses the last enabled action when requested', () => {
  render(ButtonRowTest, { initialFocus: 'last' });

  expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
});

test('skips disabled actions when choosing the last action to focus', () => {
  render(ButtonRowTest, { initialFocus: 'last', disabledPrimary: true });

  expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
});

test('skips a disabled first action when choosing the first action to focus', () => {
  render(ButtonRowTest, { initialFocus: 'first', disabledCancel: true });

  expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
});

test('skips a hidden first action when choosing the first action to focus', () => {
  render(ButtonRowTest, { initialFocus: 'first', hiddenCancel: true });

  expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
});
