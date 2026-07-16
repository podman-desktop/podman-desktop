/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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

import type { ExtensionInfo } from '@podman-desktop/core-api';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';

import { clearPrototypeDefaultCustomLocalHiddenRows } from '/@/lib/extensions/extension-custom-local-defaults';
import { clearPrototypeRemovedExtensions } from '/@/lib/extensions/extension-prototype-use-cases';
import { areExtensionsImprovementsSuggested } from '/@/lib/extensions/extensions-prototype-scope';
import { extensionDevelopmentFolders } from '/@/stores/extensionDevelopmentFolders';
import { extensionInfos } from '/@/stores/extensions';

import DevelopmentExtensionList from './DevelopmentExtensionList.svelte';

vi.mock(import('/@/lib/extensions/extensions-prototype-scope'), () => ({
  areExtensionsImprovementsSuggested: vi.fn(() => false),
}));

beforeEach(() => {
  vi.restoreAllMocks();
  vi.resetAllMocks();
  extensionDevelopmentFolders.set([]);
  extensionInfos.set([]);
  clearPrototypeDefaultCustomLocalHiddenRows();
  clearPrototypeRemovedExtensions();
  vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(false);
});

const devModeNotEnabledText = 'Enable Preferences > Extensions > Development Mode to test local extensions';

test('Expect empty list if dev mode is not enabled', async () => {
  // not enabled
  vi.mocked(window.getConfigurationValue).mockResolvedValue(false);

  render(DevelopmentExtensionList);

  // wait the getConfigurationValue to be called
  await vi.waitFor(() => expect(window.getConfigurationValue).toHaveBeenCalled());

  // expect to find the text devModeNotEnabledText
  expect(screen.getByText(devModeNotEnabledText)).toBeInTheDocument();
});

test('Expect no empty screen if dev mode is enabled but table is empty', async () => {
  // enabled
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  render(DevelopmentExtensionList);

  // wait the getConfigurationValue to be called
  await vi.waitFor(() => expect(window.getConfigurationValue).toHaveBeenCalled());

  // expect the text devModeNotEnabledText is not there
  await vi.waitFor(() => expect(screen.queryByText(devModeNotEnabledText)).not.toBeInTheDocument());

  expect(screen.getByText('No local extensions tracked')).toBeInTheDocument();
  expect(
    screen.getByText('Add a folder on your machine to load and test an extension during development.'),
  ).toBeInTheDocument();
});

test('expect addLocalFolderExtension is working', async () => {
  // enabled
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  render(DevelopmentExtensionList);

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

  render(DevelopmentExtensionList);

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
  // create a folder and an extension having the same path
  extensionDevelopmentFolders.set([{ path: 'foo' }]);
  extensionInfos.set([{ id: 'extensionid', name: 'extension A', path: 'foo' } as ExtensionInfo]);

  // enabled
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  render(DevelopmentExtensionList);

  // wait the text "extension A" to be displayed
  await vi.waitFor(() => expect(screen.getByText('extension A')).toBeInTheDocument());
});

test('suggestion scope shows search when list is present', async () => {
  vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(true);
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);
  extensionDevelopmentFolders.set([{ path: 'foo' }]);
  extensionInfos.set([{ id: 'extensionid', name: 'extension A', path: 'foo', state: 'started' } as ExtensionInfo]);

  render(DevelopmentExtensionList, { onInstallCustom: vi.fn() });

  await vi.waitFor(() => expect(screen.getByText('extension A')).toBeInTheDocument());
  expect(screen.getByRole('textbox', { name: 'search extensions' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Install custom' })).toBeInTheDocument();
});

test('suggestion scope seeds default custom and local example rows', async () => {
  vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(true);
  vi.mocked(window.getConfigurationValue).mockResolvedValue(true);

  render(DevelopmentExtensionList, { onInstallCustom: vi.fn() });

  await vi.waitFor(() => expect(screen.getByText('Kubernetes Dashboard')).toBeInTheDocument());
  expect(screen.getByText('Hello Local Extension')).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: 'search extensions' })).toBeInTheDocument();
  expect(screen.queryByText('Install custom/local extensions')).not.toBeInTheDocument();
});
