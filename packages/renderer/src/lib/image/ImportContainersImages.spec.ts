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

import '@testing-library/jest-dom/vitest';

import type { ProviderContainerConnectionInfo, ProviderInfo } from '@desktop-framework/api';
import type { ProviderStatus } from '@desktop-framework/extension-api';
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { router } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import { providerInfos } from '/@/stores/providers';

import ImportContainersImages from './ImportContainersImages.svelte';

vi.mock(import('tinro'));

const pStatus: ProviderStatus = 'started';
const pInfo: ProviderContainerConnectionInfo = {
  connectionType: 'container',
  name: 'test',
  displayName: 'test',
  status: 'started',
  endpoint: {
    socketPath: '',
  },
  canStart: false,
  canStop: false,
  canEdit: false,
  canDelete: false,
  type: 'podman',
};
const providerInfo = {
  id: 'test',
  internalId: 'id',
  name: '',
  containerConnections: [pInfo],
  kubernetesConnections: undefined,
  status: pStatus,
  containerProviderConnectionCreation: false,
  containerProviderConnectionInitialization: false,
  kubernetesProviderConnectionCreation: false,
  kubernetesProviderConnectionInitialization: false,
  links: undefined,
  detectionChecks: undefined,
  warnings: undefined,
  images: undefined,
  installationSupport: undefined,
} as unknown as ProviderInfo;

const closeCallback = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
  providerInfos.set([]);
});

test('Expect import button to be disabled', async () => {
  render(ImportContainersImages, { closeCallback });
  const btnImportContainer = screen.getByRole('button', { name: 'Import containers' });
  expect(btnImportContainer).toBeInTheDocument();
  expect(btnImportContainer).toBeDisabled();
});

test('Expect import button to be enabled when atleast one container image is selected', async () => {
  providerInfos.set([providerInfo]);
  vi.mocked(window.openDialog).mockResolvedValue(['path/file.tar']);
  render(ImportContainersImages, { closeCallback });
  const btnAddImages = screen.getByRole('button', { name: 'Add images to import' });
  expect(btnAddImages).toBeInTheDocument();
  await userEvent.click(btnAddImages);

  const btnImportContainer = screen.getByRole('button', { name: 'Import containers' });
  expect(btnImportContainer).toBeInTheDocument();
  expect(btnImportContainer).toBeEnabled();

  expect(vi.mocked(window.openDialog)).toBeCalledWith({
    selectors: ['multiSelections', 'openFile'],
    title: 'Select Containers Images to import',
  });
});

test('Expect import button to be enabled when atleast one container image is selected but there is no provider', async () => {
  providerInfos.set([]);
  vi.mocked(window.openDialog).mockResolvedValue(['path/file.tar']);
  render(ImportContainersImages, { closeCallback });
  const btnAddImages = screen.getByRole('button', { name: 'Add images to import' });
  expect(btnAddImages).toBeInTheDocument();
  await userEvent.click(btnAddImages);

  const btnImportContainer = screen.getByRole('button', { name: 'Import containers' });
  expect(btnImportContainer).toBeInTheDocument();
  expect(btnImportContainer).toBeDisabled();
});

test('Expect import call importContainer func', async () => {
  providerInfos.set([providerInfo]);
  vi.mocked(window.openDialog).mockResolvedValue(['path/file.tar']);
  vi.mocked(window.importContainer).mockResolvedValue();
  render(ImportContainersImages, { closeCallback });
  const btnAddImages = screen.getByRole('button', { name: 'Add images to import' });
  expect(btnAddImages).toBeInTheDocument();
  await userEvent.click(btnAddImages);

  const btnImportContainer = screen.getByRole('button', { name: 'Import containers' });
  expect(btnImportContainer).toBeInTheDocument();
  expect(btnImportContainer).toBeEnabled();
  await userEvent.click(btnImportContainer);

  expect(vi.mocked(window.importContainer)).toBeCalledWith({
    provider: pInfo,
    archivePath: 'path/file.tar',
    imageTag: 'file',
  });
  expect(closeCallback).toHaveBeenCalledOnce();
  expect(router.goto).not.toHaveBeenCalled();
});

test('Expect error shown if import function fails', async () => {
  providerInfos.set([providerInfo]);
  vi.mocked(window.openDialog).mockResolvedValue(['path/file.tar']);
  vi.mocked(window.importContainer).mockRejectedValue('import failed');
  render(ImportContainersImages, { closeCallback });
  const btnAddImages = screen.getByRole('button', { name: 'Add images to import' });
  expect(btnAddImages).toBeInTheDocument();
  await userEvent.click(btnAddImages);

  const btnImportContainer = screen.getByRole('button', { name: 'Import containers' });
  expect(btnImportContainer).toBeInTheDocument();
  expect(btnImportContainer).toBeEnabled();
  await userEvent.click(btnImportContainer);

  expect(vi.mocked(window.importContainer)).toBeCalledWith({
    provider: pInfo,
    archivePath: 'path/file.tar',
    imageTag: 'file',
  });

  const errorDiv = screen.getByRole('alert');
  expect(errorDiv).toBeInTheDocument();
  expect((errorDiv as HTMLDivElement).innerHTML).toContain('import failed');
  expect(closeCallback).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Add images to import' })).toBeEnabled();

  await userEvent.keyboard('{Escape}');
  expect(closeCallback).toHaveBeenCalledOnce();
});

test('Cancel closes the modal without navigation', async () => {
  render(ImportContainersImages, { closeCallback });

  expect(screen.getByRole('dialog', { name: 'Import Containers' })).toHaveFocus();
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

  expect(closeCallback).toHaveBeenCalledOnce();
  expect(router.goto).not.toHaveBeenCalled();
});

test.each(['Escape', 'Close'])('%s closes the modal', async action => {
  render(ImportContainersImages, { closeCallback });

  if (action === 'Escape') {
    await userEvent.keyboard('{Escape}');
  } else {
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  }

  expect(closeCallback).toHaveBeenCalledOnce();
});

test('Keep the modal and form unchanged until import finishes', async () => {
  providerInfos.set([providerInfo]);
  vi.mocked(window.openDialog).mockResolvedValue(['path/file.tar']);
  const pendingImport = Promise.withResolvers<void>();
  vi.mocked(window.importContainer).mockReturnValue(pendingImport.promise);
  render(ImportContainersImages, { closeCallback });

  await userEvent.click(screen.getByRole('button', { name: 'Add images to import' }));
  await userEvent.click(screen.getByRole('button', { name: 'Import containers' }));

  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  await userEvent.keyboard('{Escape}');
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  await userEvent.click(screen.getByLabelText('fade-bg'));

  expect(closeCallback).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Add images to import' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Remove container' })).toBeDisabled();
  expect(screen.getByRole('textbox', { name: 'container importing name' })).toBeDisabled();

  pendingImport.resolve();
  await vi.waitFor(() => expect(closeCallback).toHaveBeenCalledOnce());
});

test('Import uses edited names and excludes removed files', async () => {
  providerInfos.set([providerInfo]);
  vi.mocked(window.openDialog).mockResolvedValue(['path/first.tar', 'path/second.tar']);
  vi.mocked(window.importContainer).mockResolvedValue();
  render(ImportContainersImages, { closeCallback });

  await userEvent.click(screen.getByRole('button', { name: 'Add images to import' }));
  await userEvent.click(screen.getAllByRole('button', { name: 'Remove container' })[0]);

  const nameInput = screen.getByRole('textbox', { name: 'container importing name' });
  await userEvent.clear(nameInput);
  await userEvent.type(nameInput, 'quay.io/podman/hello');
  await userEvent.click(screen.getByRole('button', { name: 'Import containers' }));

  expect(window.importContainer).toHaveBeenCalledExactlyOnceWith({
    provider: pInfo,
    archivePath: 'path/second.tar',
    imageTag: 'quay.io/podman/hello',
  });
  expect(closeCallback).toHaveBeenCalledOnce();
});
