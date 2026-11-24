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

import { render, screen, within } from '@testing-library/svelte';
import { expect, test } from 'vitest';

import DropDownMenuGroup from './DropDownMenuGroup.svelte';
import DropDownMenuGroupTest from './DropDownMenuGroupTest.svelte';

test('Expect group to be named by its label', () => {
  render(DropDownMenuGroupTest, { label: 'Open Browser' });

  const group = screen.getByRole('group', { name: 'Open Browser' });
  expect(within(group).getByText('Open Browser')).toBeInTheDocument();
  expect(within(group).getByText('Child 1')).toBeInTheDocument();
  expect(within(group).getByText('Child 2')).toBeInTheDocument();
  expect(within(group).queryByText('Before')).not.toBeInTheDocument();
});

test('Expect group without label to only render its items', () => {
  render(DropDownMenuGroupTest);

  const group = screen.getByRole('group');
  expect(group).not.toHaveAttribute('aria-labelledby');
  expect(within(group).getByText('Child 1')).toBeInTheDocument();
});

test('Expect HTML attributes and class to be passed to the group', () => {
  render(DropDownMenuGroup, { label: 'My group', class: 'custom-class', 'data-testid': 'my-group' });

  const group = screen.getByTestId('my-group');
  expect(group).toHaveRole('group');
  expect(group).toHaveClass('custom-class');
  expect(group).toHaveClass('divide-y');
});
