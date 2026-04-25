/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

/* eslint-disable @typescript-eslint/no-explicit-any */

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { assert, expect, test, vi } from 'vitest';

import PasswordInput from './PasswordInput.svelte';
import PasswordInputTest from './PasswordInputTest.svelte';

function renderInput(password: string, readonly: boolean): void {
  render(PasswordInput, { id: '', password: password, readonly: readonly });
}

test('Expect basic styling', async () => {
  const value = 'test';
  renderInput(value, false);

  const element = screen.getByRole('button');
  expect(element).toBeInTheDocument();
  expect(element).toHaveAttribute('aria-label', 'show/hide');
  expect(element).toHaveClass('cursor-pointer');
});

test('clicking show/hide button does not submit form', async () => {
  const handleSubmit = vi.fn(e => e.preventDefault());

  render(PasswordInputTest, { onSubmit: handleSubmit });

  const showHideButton = screen.getByRole('button', { name: /show\/hide/i });
  const submitButton = screen.getByText('Submit');

  // Click the show/hide button
  await fireEvent.click(showHideButton);

  // Form should NOT have been submitted
  expect(handleSubmit).not.toHaveBeenCalled();

  // Clicking the real submit button should call the handler
  await fireEvent.click(submitButton);
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});

test('expect default input#type to be password', async () => {
  const name = 'my-special-password';
  const { getByLabelText } = render(PasswordInput, { id: 'foo', name: name });

  const input = getByLabelText('Password foo');
  assert(input instanceof HTMLInputElement);
  expect(input).toHaveAttribute('type', 'password');
});

test('expect hide button to set input#type to text', async () => {
  const name = 'my-special-password';
  const { getByRole, getByLabelText } = render(PasswordInput, { id: 'foo', name: name });

  const btn = getByRole('button', { name: 'show/hide' });
  await fireEvent.click(btn);

  const input = getByLabelText('Password foo');
  await vi.waitFor(() => {
    expect(input).toHaveAttribute('type', 'text');
  });
});

test('typing should callback oninput listener', async () => {
  const oninput = vi.fn();
  const { getByLabelText } = render(PasswordInput, { id: 'foo', oninput: oninput });

  const input = getByLabelText('Password foo');
  assert(input instanceof HTMLInputElement);
  await fireEvent.input(input, { target: { value: 'potato' } });

  await vi.waitFor(() => {
    expect(oninput).toHaveBeenCalledOnce();
    const event = oninput.mock.calls[0][0];
    assert(event instanceof InputEvent);
    assert(event.target instanceof HTMLInputElement);

    expect(event.target.value).toEqual('potato');
  });
});

test('check specific name is applied', async () => {
  const name = 'my-special-password';
  render(PasswordInput, { id: 'foo', name: name });

  const input = screen.getByLabelText('Password foo') as HTMLInputElement;
  expect(input).toBeInTheDocument();
  expect(input.name).toBe(name);
});

test('check default name is set if not specified', async () => {
  render(PasswordInput, { id: 'foo' });

  const input = screen.getByLabelText('Password foo') as HTMLInputElement;
  expect(input).toBeInTheDocument();
  expect(input.name).toBe('password-foo');
});
