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

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';

import RenameVolumeDialog from './RenameVolumeDialog.svelte';
import type { VolumeInfoUI } from './VolumeInfoUI';

const volume = {
  name: 'current-volume',
  engineId: 'podman1',
} as VolumeInfoUI;

const onClose = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

test('requires a changed non-empty name and submits the normalized value', async () => {
  render(RenameVolumeDialog, { volume, onClose });

  const nameInput = screen.getByRole('textbox', { name: 'Volume Name' });
  const renameButton = screen.getByRole('button', { name: 'Rename' });
  expect(nameInput).toHaveValue('current-volume');
  expect(renameButton).toBeDisabled();

  await userEvent.clear(nameInput);
  expect(renameButton).toBeDisabled();

  await userEvent.type(nameInput, ' renamed-volume ');
  expect(renameButton).toBeEnabled();
  await fireEvent.click(renameButton);

  await waitFor(() => {
    expect(window.renameVolume).toHaveBeenCalledWith('podman1', 'current-volume', 'renamed-volume');
  });
  expect(onClose).toHaveBeenCalledOnce();
});

test('keeps the dialog open and displays Podman errors', async () => {
  vi.mocked(window.renameVolume).mockRejectedValue(new Error('volume is currently mounted'));
  render(RenameVolumeDialog, { volume, onClose });

  const nameInput = screen.getByRole('textbox', { name: 'Volume Name' });
  await userEvent.clear(nameInput);
  await userEvent.type(nameInput, 'renamed-volume');
  await fireEvent.click(screen.getByRole('button', { name: 'Rename' }));

  expect(await screen.findByText('volume is currently mounted')).toBeInTheDocument();
  expect(onClose).not.toHaveBeenCalled();
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
