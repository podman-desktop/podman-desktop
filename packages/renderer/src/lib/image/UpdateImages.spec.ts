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
import { tick } from 'svelte';
import { router } from 'tinro';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import { imagesInfos } from '/@/stores/images';
import { providerInfos } from '/@/stores/providers';
import { updateImagesInfo } from '/@/stores/update-images-store';
import type { ImageInfo } from '/@api/image-info';
import type { ProviderContainerConnectionInfo, ProviderInfo } from '/@api/provider-info';

import type { ImageInfoUI } from './ImageInfoUI';
import UpdateImages from './UpdateImages.svelte';

const imageInfo: ImageInfoUI = {
  id: 'sha256:abc123',
  shortId: 'abc123',
  name: 'nginx',
  tag: 'latest',
  engineId: 'podman.podman-machine-default',
  engineName: 'Podman Machine',
  status: 'UNUSED',
} as ImageInfoUI;

const imageInfo2: ImageInfoUI = {
  id: 'sha256:def456',
  shortId: 'def456',
  name: 'redis',
  tag: '7',
  engineId: 'podman.podman-machine-default',
  engineName: 'Podman Machine',
  status: 'UNUSED',
} as ImageInfoUI;

const providerConnection: ProviderContainerConnectionInfo = {
  name: 'podman-machine-default',
  status: 'started',
  type: 'podman',
} as ProviderContainerConnectionInfo;

const provider: ProviderInfo = {
  id: 'podman',
  containerConnections: [providerConnection],
} as ProviderInfo;

const imageInfoFromStore: ImageInfo = {
  Id: 'sha256:abc123',
  RepoDigests: ['nginx@sha256:olddigest'],
} as ImageInfo;

beforeAll(() => {
  (window as unknown as Record<string, unknown>).checkImageUpdateStatus = vi.fn();
  (window as unknown as Record<string, unknown>).pullImage = vi.fn();
  (window as unknown as Record<string, unknown>).deleteImage = vi.fn();
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(window.checkImageUpdateStatus).mockResolvedValue({
    status: 'normal',
    updateAvailable: false,
    message: 'Image is already the latest version',
  });
  vi.mocked(window.pullImage).mockResolvedValue();
  vi.mocked(window.deleteImage).mockResolvedValue();
  providerInfos.set([provider]);
  imagesInfos.set([imageInfoFromStore]);
});

async function waitRender(): Promise<void> {
  render(UpdateImages);
  // Wait for the component to mount and auto-check to complete
  await tick();
  await tick();
  await tick();
}

test('Expect redirect to /images/ if no images selected', async () => {
  const goToMock = vi.spyOn(router, 'goto');
  updateImagesInfo.set([]);
  await waitRender();

  expect(goToMock).toHaveBeenCalledWith('/images/');
});

test('Expect Update button is disabled when no updates available', async () => {
  // Default mock returns updateAvailable: false
  updateImagesInfo.set([imageInfo]);
  await waitRender();

  const updateButton = screen.getByRole('button', { name: 'Update images' });
  expect(updateButton).toBeDisabled();
});

test('Expect Done button is present and enabled', async () => {
  updateImagesInfo.set([imageInfo]);
  await waitRender();

  const doneButton = screen.getByRole('button', { name: 'Done' });
  expect(doneButton).toBeEnabled();
});

test('Expect Done button navigates to /images/', async () => {
  const goToMock = vi.spyOn(router, 'goto');
  updateImagesInfo.set([imageInfo]);
  await waitRender();

  const doneButton = screen.getByRole('button', { name: 'Done' });
  await userEvent.click(doneButton);

  expect(goToMock).toHaveBeenCalledWith('/images/');
});

test('Expect images displayed in table', async () => {
  updateImagesInfo.set([imageInfo, imageInfo2]);
  await waitRender();

  screen.getByText('nginx:latest');
  screen.getByText('redis:7');
});

test('Expect checkImageUpdateStatus called automatically on mount', async () => {
  updateImagesInfo.set([imageInfo]);
  await waitRender();

  expect(vi.mocked(window.checkImageUpdateStatus)).toHaveBeenCalledWith('nginx:latest', 'latest', [
    'nginx@sha256:olddigest',
  ]);
});

test('Expect Update button enabled when updates are available and selected', async () => {
  vi.mocked(window.checkImageUpdateStatus).mockResolvedValue({
    status: 'normal',
    updateAvailable: true,
    remoteDigest: 'sha256:newdigest',
    message: 'A new version is available',
  });

  updateImagesInfo.set([imageInfo]);
  await waitRender();

  // Update button should be disabled until user selects an image
  const updateButton = screen.getByRole('button', { name: 'Update images' });
  expect(updateButton).toBeDisabled();

  // Select the image checkbox
  const checkbox = screen.getByRole('checkbox', { name: 'Toggle update-image' });
  await userEvent.click(checkbox);
  await tick();

  // Now the Update button should be enabled
  expect(updateButton).toBeEnabled();
});

test('Expect pullImage called when updating (no delete needed)', async () => {
  vi.mocked(window.checkImageUpdateStatus).mockResolvedValue({
    status: 'normal',
    updateAvailable: true,
    remoteDigest: 'sha256:newdigest',
    message: 'A new version is available',
  });

  updateImagesInfo.set([imageInfo]);
  await waitRender();

  // Select the image checkbox first
  const checkbox = screen.getByRole('checkbox', { name: 'Toggle update-image' });
  await userEvent.click(checkbox);
  await tick();

  // Update button should be enabled after selection
  const updateButton = screen.getByRole('button', { name: 'Update images' });
  await userEvent.click(updateButton);
  await tick();
  await tick();

  // Only pull is called - the pull automatically re-tags to the new image
  expect(vi.mocked(window.pullImage)).toHaveBeenCalledWith(providerConnection, 'nginx:latest', expect.any(Function));
  // deleteImage should NOT be called - pulling automatically handles the tag
  expect(vi.mocked(window.deleteImage)).not.toHaveBeenCalled();
});

test('Expect status columns show correct values after check', async () => {
  vi.mocked(window.checkImageUpdateStatus).mockResolvedValue({
    status: 'normal',
    updateAvailable: true,
    remoteDigest: 'sha256:newdigest',
    message: 'A new version is available',
  });

  updateImagesInfo.set([imageInfo]);
  await waitRender();

  // When update is available, only the "Available" label is shown (message is not displayed)
  screen.getByText('Available');
});

test('Expect error status displayed correctly', async () => {
  vi.mocked(window.checkImageUpdateStatus).mockResolvedValue({
    status: 'error',
    updateAvailable: false,
    message: 'Authentication failed',
  });

  updateImagesInfo.set([imageInfo]);
  await waitRender();

  screen.getByText('Error');
  screen.getByText('Authentication failed');
});

test('Expect skipped status displayed for local/dangling images', async () => {
  vi.mocked(window.checkImageUpdateStatus).mockResolvedValue({
    status: 'skipped',
    updateAvailable: false,
    message: 'Local image cannot be checked for updates',
  });

  updateImagesInfo.set([imageInfo]);
  await waitRender();

  screen.getByText('N/A');
  screen.getByText('Local image cannot be checked for updates');
});
