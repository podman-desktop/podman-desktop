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

import DetailsCell from './DetailsCell.svelte';

test('a details cell can wrap a value with nothing to wrap at', async () => {
  render(DetailsCell);

  // The defect this guards: a details cell holds values nobody chose the length
  // of — a container command, an image digest, a secret. One with no spaces
  // cannot wrap, so the table takes its width from that value and the card
  // scrolls sideways, putting the labels and every other field off-screen.
  expect(screen.getByRole('cell')).toHaveClass('wrap-anywhere');
});

test('the caller can still add classes of its own', async () => {
  render(DetailsCell, { style: 'text-right' });

  const cell = screen.getByRole('cell');
  expect(cell).toHaveClass('text-right');
  expect(cell).toHaveClass('wrap-anywhere');
});
