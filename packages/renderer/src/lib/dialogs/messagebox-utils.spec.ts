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

import { beforeEach, expect, test, vi } from 'vitest';

import { withConfirmation } from './messagebox-utils';

beforeEach(() => {
  vi.resetAllMocks();
});

test('expect withConfirmation call callback if result OK', async () => {
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });

  const callback = vi.fn();
  withConfirmation(callback, 'Destroy world');

  await vi.waitFor(() => {
    expect(window.showMessageBox).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalled();
  });
});

test('expect withConfirmation not to call callback if result not OK', async () => {
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 1 });

  const callback = vi.fn();
  withConfirmation(callback, 'Destroy world');

  await vi.waitFor(() => {
    expect(window.showMessageBox).toHaveBeenCalledOnce();
    expect(callback).not.toHaveBeenCalled();
  });
});

test('expect withConfirmation to propagate error', async () => {
  const error = new Error('Dummy error');
  vi.mocked(window.showMessageBox).mockRejectedValue(error);

  const callback = vi.fn();
  withConfirmation(callback, 'Destroy world');

  await vi.waitFor(() => {
    expect(window.showMessageBox).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(error);
  });
});

test('expect withConfirmation to use default variant when no options provided', async () => {
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });

  const callback = vi.fn();
  withConfirmation(callback, 'Destroy world');

  await vi.waitFor(() => {
    expect(window.showMessageBox).toHaveBeenCalledWith({
      title: 'Confirmation',
      message: 'Are you sure you want to Destroy world?',
      buttons: ['Yes', 'Cancel'],
      type: 'question',
    });
  });
});

test('expect withConfirmation to use explicit title when provided', async () => {
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });

  const callback = vi.fn();
  withConfirmation(callback, 'Destroy world', { title: 'Destroy World?', buttonLabel: 'Destroy' });

  await vi.waitFor(() => {
    expect(window.showMessageBox).toHaveBeenCalledWith({
      title: 'Destroy World?',
      message: 'Are you sure you want to Destroy world?',
      buttons: ['Destroy', 'Cancel'],
      type: 'question',
    });
    expect(callback).toHaveBeenCalled();
  });
});

test('expect withConfirmation to use delete variant with Delete button and danger type', async () => {
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });

  const callback = vi.fn();
  withConfirmation(callback, 'delete this resource', { variant: 'delete' });

  await vi.waitFor(() => {
    expect(window.showMessageBox).toHaveBeenCalledWith({
      title: 'Confirmation',
      message: 'Are you sure you want to delete this resource?',
      buttons: ['Delete', 'Cancel'],
      type: 'danger',
    });
    expect(callback).toHaveBeenCalled();
  });
});

test('expect withConfirmation to use default variant explicitly', async () => {
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });

  const callback = vi.fn();
  withConfirmation(callback, 'continue', { variant: 'default', buttonLabel: 'Continue' });

  await vi.waitFor(() => {
    expect(window.showMessageBox).toHaveBeenCalledWith({
      title: 'Confirmation',
      message: 'Are you sure you want to continue?',
      buttons: ['Continue', 'Cancel'],
      type: 'question',
    });
    expect(callback).toHaveBeenCalled();
  });
});
