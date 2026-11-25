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

import DropDownMenuLabel from './DropDownMenuLabel.svelte';

test('Expect label to display its title and not be clickable', () => {
  render(DropDownMenuLabel, { title: 'My label', id: 'my-label' });

  const label = screen.getByText('My label');
  expect(label).toHaveAttribute('id', 'my-label');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('Expect HTML attributes and class to be passed to the label', () => {
  render(DropDownMenuLabel, { title: 'My label', class: 'custom-class', 'data-testid': 'my-label' });

  const label = screen.getByTestId('my-label');
  expect(label).toHaveTextContent('My label');
  expect(label).toHaveClass('custom-class');
});
