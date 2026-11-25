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

import DropDownMenuSeparator from './DropDownMenuSeparator.svelte';

test('Expect separator to be rendered', () => {
  render(DropDownMenuSeparator);

  expect(screen.getByRole('separator')).toBeInTheDocument();
});

test('Expect HTML attributes and class to be passed to the separator', () => {
  render(DropDownMenuSeparator, { class: 'custom-class', 'data-testid': 'my-separator' });

  const separator = screen.getByRole('separator');
  expect(separator).toHaveAttribute('data-testid', 'my-separator');
  expect(separator).toHaveClass('custom-class');
  expect(separator).toHaveClass('h-px');
});
