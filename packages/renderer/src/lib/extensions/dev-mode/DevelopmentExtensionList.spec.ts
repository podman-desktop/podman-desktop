/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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
import { beforeEach, expect, test, vi } from 'vitest';

import DevelopmentExtensionList from './DevelopmentExtensionList.svelte';

beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetAllMocks();
});

const devModeNotEnabledText = 'Enable Preferences > Extensions > Development Mode to test local extensions';

test('Expect empty list if dev mode is not enabled', async () => {
  // not enabled
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);

  render(DevelopmentExtensionList, { extensionFolders: [] });

  // wait the getConfigurationValue to be called
  await vi.waitFor(() => expect(window.getConfigurationValue).toHaveBeenCalled());

  // expect to find the text devModeNotEnabledText
  expect(screen.getByText(devModeNotEnabledText)).toBeInTheDocument();
});

test('Expect no empty screen if dev mode is enabled but table is empty', async () => {
  // enabled
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  render(DevelopmentExtensionList, { extensionFolders: [] });

  // wait the getConfigurationValue to be called
  await vi.waitFor(() => expect(window.getConfigurationValue).toHaveBeenCalled());

  // expect the text devModeNotEnabledText is not there
  await vi.waitFor(() => expect(screen.queryByText(devModeNotEnabledText)).not.toBeInTheDocument());

  // expect No extension for now to be displayed
  expect(screen.getByText('No extension for now')).toBeInTheDocument();
});

test('expect addLocalFolderExtension is working', async () => {
  // enabled
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  render(DevelopmentExtensionList, { extensionFolders: [] });

  // mock openDialog and returning the foo folder
  vi.mocked(window.openDialog).mockResolvedValue(['foo']);

  // wait the button 'Add a local folder extension is there
  await vi.waitFor(() =>
    expect(screen.getByRole('button', { name: 'Add a local folder extension...' })).toBeInTheDocument(),
  );

  const addButton = screen.getByRole('button', { name: 'Add a local folder extension...' });
  await userEvent.click(addButton);

  // check it call trackExtensionFolder with the foo folder
  await vi.waitFor(() => expect(window.trackExtensionFolder).toHaveBeenCalledWith('foo'));
});

test('expect report error of addLocalFolderExtension', async () => {
  // enabled
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  render(DevelopmentExtensionList, { extensionFolders: [] });

  // mock openDialog and returning the foo folder
  vi.mocked(window.openDialog).mockResolvedValue(['foo']);

  // mock trackExtensionFolder to throw an error
  vi.mocked(window.trackExtensionFolder).mockRejectedValue(new Error('dummy error'));

  // wait the button 'Add a local folder extension is there
  await vi.waitFor(() =>
    expect(screen.getByRole('button', { name: 'Add a local folder extension...' })).toBeInTheDocument(),
  );

  const addButton = screen.getByRole('button', { name: 'Add a local folder extension...' });
  await userEvent.click(addButton);

  // check it call trackExtensionFolder with the foo folder
  await vi.waitFor(() => expect(window.trackExtensionFolder).toHaveBeenCalledWith('foo'));

  // expect the error to be displayed
  await vi.waitFor(() => expect(vi.mocked(window.showMessageBox).mock.calls[0][0].message).toContain('dummy error'));
});

test('expect list displayed if enabled', async () => {
  // enabled
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  render(DevelopmentExtensionList, {
    extensionFolders: [
      { path: 'foo', name: 'foo', selected: false, extension: { id: 'extensionid', name: 'extension A' } },
    ],
  });

  // wait the text "extension A" to be displayed
  await vi.waitFor(() => expect(screen.getByText('extension A')).toBeInTheDocument());
});

test('expect filtered empty screen when the search matches no folder', async () => {
  // enabled
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  render(DevelopmentExtensionList, { extensionFolders: [], searchTerm: 'no-match' });

  await vi.waitFor(() => expect(screen.getByText(`No extensions matching 'no-match' found`)).toBeInTheDocument());
  expect(screen.queryByText('No extension for now')).not.toBeInTheDocument();
});
