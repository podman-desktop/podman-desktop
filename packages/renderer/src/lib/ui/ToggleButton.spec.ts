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

import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import ToggleButton from './ToggleButton.svelte';

test('button has aria-pressed="true" when selected is true', () => {
  render(ToggleButton, { icon: faCheckSquare, selected: true });

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-pressed', 'true');
});

test('button has aria-pressed="false" when selected is false', () => {
  render(ToggleButton, { icon: faCheckSquare, selected: false });

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-pressed', 'false');
});

test('button has aria-pressed="false" by default when selected is not provided', () => {
  render(ToggleButton, { icon: faCheckSquare });

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-pressed', 'false');
});

test('clicking the button flips aria-pressed from true to false', async () => {
  render(ToggleButton, { icon: faCheckSquare, selected: true });

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-pressed', 'true');

  await fireEvent.click(button);

  expect(button).toHaveAttribute('aria-pressed', 'false');
});

test('disabled button still exposes aria-pressed reflecting selected', () => {
  render(ToggleButton, { icon: faCheckSquare, selected: true, disabled: true });

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(button).toBeDisabled();
});
