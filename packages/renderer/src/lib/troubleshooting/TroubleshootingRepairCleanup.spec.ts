/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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
import { expect, test, vi } from 'vitest';

import TroubleshootingRepairCleanup from './TroubleshootingRepairCleanup.svelte';

test('Check cleanupProviders is called and button is in progress', async () => {
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 'Clean Up' });

  render(TroubleshootingRepairCleanup);

  // expect to have the cleanup button
  const cleanupButton = screen.getByRole('button', { name: 'Cleanup' });
  expect(cleanupButton).toBeInTheDocument();

  // mock the cleanup as waiting for 10ms
  vi.mocked(window.cleanupProviders).mockReturnValue(new Promise(resolve => setTimeout(resolve, 10)));

  // click on the cleanup button
  expect(cleanupButton).toBeEnabled();
  await fireEvent.click(cleanupButton);

  await waitFor(() => {
    // button should be in progress
    expect(cleanupButton).toBeDisabled();
  });

  // svg should be inside the button
  const svg = cleanupButton.querySelector('svg');
  expect(svg).toBeInTheDocument();

  await waitFor(() => {
    // button should not be in progress anymore
    expect(cleanupButton).toBeEnabled();
  });

  // check that we asked for confirmation
  expect(window.showMessageBox).toBeCalledWith({
    buttons: ['Clean Up', 'Cancel'],
    type: 'danger',
    message: 'This action may delete data. Proceed?',
    title: 'Clean Up Data?',
  });

  // check that we're calling the vi.mocked(window.cleanupProviders)
  expect(vi.mocked(window.cleanupProviders)).toBeCalled();
});

test('Check errors are displayed with clipboard button', async () => {
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 'Clean Up' });

  render(TroubleshootingRepairCleanup);

  // expect to have the cleanup button
  const cleanupButton = screen.getByRole('button', { name: 'Cleanup' });
  expect(cleanupButton).toBeInTheDocument();

  // mock the cleanup as waiting for 2 seconds
  vi.mocked(window.cleanupProviders).mockRejectedValue(new Error('test error'));

  // click on the cleanup button
  expect(cleanupButton).toBeEnabled();
  await fireEvent.click(cleanupButton);

  // check that we asked for confirmation
  expect(window.showMessageBox).toBeCalledWith({
    buttons: ['Clean Up', 'Cancel'],
    type: 'danger',
    message: 'This action may delete data. Proceed?',
    title: 'Clean Up Data?',
  });

  // check that we're calling the vi.mocked(window.cleanupProviders)
  expect(vi.mocked(window.cleanupProviders)).toBeCalled();

  // check errors are displayed
  const alterSection = screen.getByRole('alert');
  expect(alterSection).toBeInTheDocument();
  expect(alterSection).toHaveTextContent('1 failures');
});
