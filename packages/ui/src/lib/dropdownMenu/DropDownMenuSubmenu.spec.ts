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

import { fireEvent, render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';

import DropDownMenuSubmenuTest from './DropDownMenuSubmenuTest.svelte';

const onClick = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
});

// the hover listeners are on the wrapper of the submenu entry
function getSubmenuWrapper(submenuButton: HTMLElement): HTMLElement {
  const wrapper = submenuButton.parentElement;
  expect(wrapper).toBeInstanceOf(HTMLElement);
  return wrapper as HTMLElement;
}

async function openDropdownMenu(): Promise<HTMLElement> {
  await userEvent.click(screen.getByRole('button', { name: 'kebab menu' }));
  return screen.getByRole('button', { name: 'Submenu' });
}

test('Expect submenu to be closed by default', async () => {
  render(DropDownMenuSubmenuTest, { onClick });
  const submenuButton = await openDropdownMenu();

  expect(submenuButton).toHaveAttribute('aria-haspopup', 'menu');
  expect(submenuButton).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('menu', { name: 'Submenu' })).not.toBeInTheDocument();
});

test('Expect submenu to open on hover and close on leave', async () => {
  render(DropDownMenuSubmenuTest, { onClick });
  const submenuButton = await openDropdownMenu();

  await fireEvent.mouseEnter(getSubmenuWrapper(submenuButton));
  expect(screen.getByRole('menu', { name: 'Submenu' })).toBeInTheDocument();
  expect(submenuButton).toHaveAttribute('aria-expanded', 'true');

  await fireEvent.mouseLeave(getSubmenuWrapper(submenuButton));
  expect(screen.queryByRole('menu', { name: 'Submenu' })).not.toBeInTheDocument();
});

test('Expect clicking the submenu entry to open it without closing the dropdown menu', async () => {
  render(DropDownMenuSubmenuTest, { onClick });
  const submenuButton = await openDropdownMenu();

  await fireEvent.click(submenuButton);

  expect(screen.getByRole('button', { name: 'Submenu' })).toBeInTheDocument();
  expect(screen.getByRole('menu', { name: 'Submenu' })).toBeInTheDocument();
});

test('Expect clicking a child item to call its action and close the dropdown menu', async () => {
  render(DropDownMenuSubmenuTest, { onClick });
  const submenuButton = await openDropdownMenu();
  await fireEvent.click(submenuButton);

  await fireEvent.click(screen.getByText('Child 2'));

  expect(onClick).toHaveBeenCalledOnce();
  expect(screen.queryByRole('button', { name: 'Submenu' })).not.toBeInTheDocument();
});

test('Expect ArrowRight to open the submenu and ArrowLeft to close it', async () => {
  render(DropDownMenuSubmenuTest, { onClick });
  const submenuButton = await openDropdownMenu();

  await fireEvent.keyDown(submenuButton, { key: 'ArrowRight' });
  const submenu = screen.getByRole('menu', { name: 'Submenu' });
  expect(submenu).toBeInTheDocument();
  // focus moves to the first child item
  expect(submenu.contains(document.activeElement)).toBe(true);

  const focusedItem = document.activeElement;
  expect(focusedItem).toBeInstanceOf(HTMLElement);
  await fireEvent.keyDown(focusedItem as HTMLElement, { key: 'ArrowLeft' });
  expect(screen.queryByRole('menu', { name: 'Submenu' })).not.toBeInTheDocument();
  expect(submenuButton).toHaveFocus();
});

test('Expect a disabled submenu not to open', async () => {
  render(DropDownMenuSubmenuTest, { enabled: false, onClick });
  const submenuButton = await openDropdownMenu();

  expect(submenuButton).toHaveAttribute('aria-disabled', 'true');
  await fireEvent.mouseEnter(getSubmenuWrapper(submenuButton));
  await fireEvent.click(submenuButton);

  expect(screen.queryByRole('menu', { name: 'Submenu' })).not.toBeInTheDocument();
});
