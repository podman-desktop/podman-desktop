/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';

import Dialog from './Dialog.svelte';

test('dialog should be visible and have basic styling', async () => {
  const title = 'A dialog';
  render(Dialog, { title: title, onclose: vi.fn() });

  const bg = screen.getByLabelText('fade-bg');
  expect(bg).toBeDefined();
  const dialog = screen.getByRole('dialog');
  expect(dialog).toBeDefined();

  const titleElem = screen.getByText(title);
  expect(titleElem).toBeDefined();
  expect(titleElem).toHaveClass('grow');
  expect(titleElem).toHaveClass('text-lg ');
  expect(titleElem).toHaveClass('font-bold');
  expect(titleElem).not.toHaveClass('capitalize');
  expect(titleElem.parentElement).toHaveClass('text-[var(--pd-modal-header-text)]');
});

test('bg click should trigger close event', async () => {
  const closeMock = vi.fn();
  render(Dialog, { title: 'A dialog', onclose: closeMock });

  const bg = screen.getByLabelText('fade-bg');
  await userEvent.click(bg);

  expect(closeMock).toHaveBeenCalled();
});

test.each([
  { ignoreFocusOut: true, closeDisabled: false },
  { ignoreFocusOut: false, closeDisabled: true },
  { ignoreFocusOut: true, closeDisabled: true },
])('close guards $ignoreFocusOut/$closeDisabled block dismissal until cleared', async props => {
  const onclose = vi.fn();
  const { rerender } = render(Dialog, { title: 'A dialog', onclose, ...props });

  await userEvent.click(screen.getByLabelText('fade-bg'));
  await userEvent.keyboard('{Escape}');
  expect(onclose).not.toHaveBeenCalled();

  await rerender({ ignoreFocusOut: false, closeDisabled: false });

  await userEvent.keyboard('{Escape}');
  expect(onclose).toHaveBeenCalledOnce();

  await userEvent.click(screen.getByLabelText('fade-bg'));
  expect(onclose).toHaveBeenCalledTimes(2);
});

test.each([false, true])('close button stays enabled with ignoreFocusOut=%s', async ignoreFocusOut => {
  const onclose = vi.fn();
  render(Dialog, { title: 'A dialog', onclose, ignoreFocusOut });

  const button = screen.getByRole('button', { name: 'Close' });
  expect(button).toBeEnabled();

  await userEvent.click(button);
  expect(onclose).toHaveBeenCalledOnce();
});

test('closeDisabled disables the close button until re-enabled', async () => {
  const onclose = vi.fn();
  const { rerender } = render(Dialog, { title: 'A dialog', onclose, closeDisabled: true });

  const button = screen.getByRole('button', { name: 'Close' });
  expect(button).toBeDisabled();

  await userEvent.click(button);
  expect(onclose).not.toHaveBeenCalled();

  await rerender({ closeDisabled: false });
  expect(button).toBeEnabled();

  await userEvent.click(button);
  expect(onclose).toHaveBeenCalledOnce();
});

test('Escape key should trigger close', async () => {
  const closeMock = vi.fn();
  render(Dialog, { title: 'A dialog', onclose: closeMock });

  await userEvent.keyboard('{Escape}');
  expect(closeMock).toHaveBeenCalled();
});

test('dialog container should not take focus by default', async () => {
  render(Dialog, { title: 'A dialog', onclose: vi.fn() });

  const dialog = screen.getByRole('dialog');
  expect(dialog).not.toHaveAttribute('tabindex');
  expect(dialog).not.toHaveFocus();
});

test('initialButtonFocus none should focus the dialog container', async () => {
  render(Dialog, { title: 'A dialog', onclose: vi.fn(), initialButtonFocus: 'none' });

  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveAttribute('tabindex', '-1');
  await vi.waitFor(() => expect(dialog).toHaveFocus());
});

test.each(['first', 'last'] as const)('initialButtonFocus %s should not focus the dialog container', async focus => {
  render(Dialog, { title: 'A dialog', onclose: vi.fn(), initialButtonFocus: focus });

  const dialog = screen.getByRole('dialog');
  expect(dialog).not.toHaveAttribute('tabindex');
  expect(dialog).not.toHaveFocus();
});
