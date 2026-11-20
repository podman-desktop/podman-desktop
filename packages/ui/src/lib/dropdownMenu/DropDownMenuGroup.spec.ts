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
import DropDownMenuLabel from './DropDownMenuLabel.svelte';
import DropDownMenuSeparator from './DropDownMenuSeparator.svelte';

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

test('Expect separator to be rendered', () => {
  render(DropDownMenuGroupTest, { label: 'Open Browser' });

  expect(screen.getByRole('separator')).toBeInTheDocument();
});

test('Expect label to display its title and not be clickable', () => {
  render(DropDownMenuLabel, { title: 'My label', id: 'my-label' });

  const label = screen.getByText('My label');
  expect(label).toHaveAttribute('id', 'my-label');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('Expect HTML attributes and class to be passed to the group', () => {
  render(DropDownMenuGroup, { label: 'My group', class: 'custom-class', 'data-testid': 'my-group' });

  const group = screen.getByTestId('my-group');
  expect(group).toHaveRole('group');
  expect(group).toHaveClass('custom-class');
  expect(group).toHaveClass('divide-y');
});

test('Expect HTML attributes and class to be passed to the label', () => {
  render(DropDownMenuLabel, { title: 'My label', class: 'custom-class', 'data-testid': 'my-label' });

  const label = screen.getByTestId('my-label');
  expect(label).toHaveTextContent('My label');
  expect(label).toHaveClass('custom-class');
});

test('Expect HTML attributes and class to be passed to the separator', () => {
  render(DropDownMenuSeparator, { class: 'custom-class', 'data-testid': 'my-separator' });

  const separator = screen.getByRole('separator');
  expect(separator).toHaveAttribute('data-testid', 'my-separator');
  expect(separator).toHaveClass('custom-class');
  expect(separator).toHaveClass('h-px');
});
