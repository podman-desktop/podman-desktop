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

import { fireEvent, render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import {
  clearPrototypeRemovedExtensions,
  isExplicitlyPrototypeRemoved,
} from '/@/lib/extensions/extension-prototype-use-cases';
import { areExtensionsImprovementsSuggested } from '/@/lib/extensions/extensions-prototype-scope';

import ActionUntrack from './ActionUntrack.svelte';

vi.mock(import('/@/lib/extensions/extensions-prototype-scope'), () => ({
  areExtensionsImprovementsSuggested: vi.fn(() => false),
}));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });
  vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(false);
  clearPrototypeRemovedExtensions();
  localStorage.clear();
});

const extensionFolderWithExtensionFound: SelectableExtensionDevelopmentFolderInfoUI = {
  path: 'foo',
  name: 'foo',
  selected: false,
  source: 'folder',
  extension: {
    id: 'extensionid',
    name: 'My Extension',
    state: 'stopped',
  },
} as unknown as SelectableExtensionDevelopmentFolderInfoUI;

const extensionFolderWithExtensionStarted: SelectableExtensionDevelopmentFolderInfoUI = {
  path: 'foo',
  name: 'foo',
  selected: false,
  source: 'folder',
  extension: {
    id: 'extensionid',
    name: 'My Extension',
    state: 'started',
  },
} as unknown as SelectableExtensionDevelopmentFolderInfoUI;

test('Expect uninstall confirmation before untracking a folder', async () => {
  render(ActionUntrack, { extensionFolder: extensionFolderWithExtensionFound });
  const uninstallButton = screen.getByRole('button', { name: 'Uninstall' });
  expect(uninstallButton).toBeInTheDocument();

  await fireEvent.click(uninstallButton);

  expect(window.showMessageBox).toHaveBeenCalledWith(
    expect.objectContaining({
      title: 'Uninstall extension?',
      buttons: ['Uninstall', 'Cancel'],
      type: 'danger',
    }),
  );
  await vi.waitFor(() => {
    expect(window.untrackExtensionFolder).toHaveBeenCalledWith(extensionFolderWithExtensionFound.path);
  });
});

test('Expect uninstall action being displayed if there is started extension', async () => {
  render(ActionUntrack, { extensionFolder: extensionFolderWithExtensionStarted });
  const uninstallButton = screen.getByRole('button', { name: 'Uninstall' });
  expect(uninstallButton).toBeInTheDocument();
  expect(uninstallButton).not.toHaveClass('hidden');
});

test('Expect cancel not to untrack', async () => {
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 1 });
  render(ActionUntrack, { extensionFolder: extensionFolderWithExtensionFound });
  await fireEvent.click(screen.getByRole('button', { name: 'Uninstall' }));
  expect(window.showMessageBox).toHaveBeenCalled();
  expect(window.untrackExtensionFolder).not.toHaveBeenCalled();
});

test('suggestion scope custom uninstall uses prototype remove instead of backend remove', async () => {
  vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(true);
  const customFolder: SelectableExtensionDevelopmentFolderInfoUI = {
    path: '/tmp/kubernetes-dashboard',
    name: 'Kubernetes Dashboard',
    selected: false,
    source: 'custom',
    extension: {
      id: 'podman-desktop.kubernetes-dashboard',
      name: 'kubernetes-dashboard',
      state: 'started',
    },
  };

  render(ActionUntrack, { extensionFolder: customFolder });
  await fireEvent.click(screen.getByRole('button', { name: 'Uninstall' }));

  await vi.waitFor(() => {
    expect(isExplicitlyPrototypeRemoved('podman-desktop.kubernetes-dashboard')).toBe(true);
  });
  expect(window.removeExtension).not.toHaveBeenCalled();
  expect(window.untrackExtensionFolder).not.toHaveBeenCalled();
});

test('prototype default uninstall hides the seeded row without backend calls', async () => {
  vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(true);
  const defaultFolder: SelectableExtensionDevelopmentFolderInfoUI = {
    path: 'examples/extensions/hello-local-extension',
    name: 'Hello Local Extension',
    selected: false,
    source: 'folder',
    prototypeDefault: true,
    extension: {
      id: 'podman-desktop-examples.hello-local-extension',
      name: 'hello-local-extension',
      state: 'started',
    },
  };

  render(ActionUntrack, { extensionFolder: defaultFolder });
  await fireEvent.click(screen.getByRole('button', { name: 'Uninstall' }));

  await vi.waitFor(() => {
    expect(isExplicitlyPrototypeRemoved('podman-desktop-examples.hello-local-extension')).toBe(true);
  });
  expect(window.removeExtension).not.toHaveBeenCalled();
  expect(window.untrackExtensionFolder).not.toHaveBeenCalled();
});
