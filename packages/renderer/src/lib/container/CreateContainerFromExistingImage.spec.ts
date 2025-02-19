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

import type { ImageInfo, ProviderStatus } from '@podman-desktop/api';
import { render, screen, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { tick } from 'svelte';
import { router } from 'tinro';
import { beforeEach, expect, test, vi } from 'vitest';

import { providerInfos } from '/@/stores/providers';
import type { ImageSearchResult } from '/@api/image-registry';
import type { ProviderContainerConnectionInfo, ProviderInfo } from '/@api/provider-info';

import CreateContainerFromExistingImage from './CreateContainerFromExistingImage.svelte';

const registryImageList: ImageSearchResult[] = [
  { name: 'image12', description: '', star_count: 3, is_official: true },
  { name: 'mysql21', description: '', star_count: 5, is_official: true },
  { name: 'fedora21', description: '', star_count: 5, is_official: false },
];
const localImageList = [
  {
    Id: 'sha256:1234567890123',
    RepoTags: ['fedora1:3'],
    Created: 1644009612,
    Size: 123,
    engineId: 'podman',
    engineName: 'podman',
  } as unknown as ImageInfo,
  {
    Id: 'sha256:1234567890123',
    RepoTags: ['helloworld1:2'],
    Created: 1644009612,
    Size: 123,
    engineId: 'docker',
    engineName: 'docker',
  } as unknown as ImageInfo,
  {
    Id: 'sha256:1234567890123',
    RepoTags: ['fedora2:3'],
    Created: 1644009612,
    Size: 123,
    engineId: 'podman',
    engineName: 'podman',
  } as unknown as ImageInfo,
  {
    Id: 'sha256:2345678901234',
    RepoTags: ['image1:3'],
    Created: 1644009612,
    Size: 123,
    engineId: 'podman',
    engineName: 'podman',
  } as unknown as ImageInfo,
  {
    Id: 'sha256:3456789012345',
    RepoTags: ['fedora:4'],
    Created: 1644009612,
    Size: 123,
    engineId: 'podman',
    engineName: 'podman',
  } as unknown as ImageInfo,
];

vi.mock('tinro', () => {
  return {
    router: {
      goto: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(window.listImages).mockResolvedValue(localImageList);
  vi.mocked(window.searchImageInRegistry).mockResolvedValue(registryImageList);
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  Object.defineProperty(window, 'matchMedia', {
    value: () => {
      return {
        matches: false,
        addListener: (): void => {},
        removeListener: (): void => {},
      };
    },
  });
});

const pStatus: ProviderStatus = 'started';
const pInfo: ProviderContainerConnectionInfo = {
  name: 'test',
  displayName: 'test',
  status: 'started',
  endpoint: {
    socketPath: '',
  },
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
providerInfos.set([providerInfo]);

test('Expect that textbox and two buttons show up when page opened', async () => {
  render(CreateContainerFromExistingImage);

  const entry = screen.getByPlaceholderText('Select an exisiting image');
  expect(entry).toBeInTheDocument();
  const cancelButton = screen.getByRole('button', { name: 'Cancel' });
  expect(cancelButton).toBeInTheDocument();
  expect(cancelButton).not.toBeDisabled();

  const actionButton = screen.getByRole('button', { name: 'Select Image' });
  expect(actionButton).toBeInTheDocument();
  expect(actionButton).toBeDisabled();
});

test('Expect that typeahead menu has Local Images and Registry Images headings', async () => {
  render(CreateContainerFromExistingImage);

  const inputBox = screen.getByPlaceholderText('Select an exisiting image');
  expect(inputBox).toBeInTheDocument();
  await userEvent.type(inputBox, 'f');

  await tick();
  await waitFor(() => expect(screen.queryByRole('row')).toBeInTheDocument());
  expect(screen.getByText('Local Images')).toBeInTheDocument();
  expect(screen.getByText('Registry Images')).toBeInTheDocument();
});

test('Expect not a local image to have an active pull image button', async () => {
  vi.mocked(window.searchImageInRegistry).mockResolvedValue([
    { name: 'image12', description: '', star_count: 3, is_official: true },
  ]);
  render(CreateContainerFromExistingImage);
  await tick();

  const inputBox = screen.getByPlaceholderText('Select an exisiting image');
  expect(inputBox).toBeInTheDocument();
  await userEvent.type(inputBox, 'image12');

  await tick();
  await waitFor(() => expect(screen.queryByRole('row')).toBeInTheDocument());

  const list = screen.getByRole('row');
  const items = within(list).getAllByRole('button');
  expect(items.length).toBe(2);

  await userEvent.keyboard('[ArrowDown]');

  const pullImagebutton = screen.getByRole('button', { name: 'Pull Image' });

  expect(pullImagebutton).toBeInTheDocument();
  expect(pullImagebutton).not.toBeDisabled();

  await userEvent.click(pullImagebutton);
  expect(window.pullImage).toHaveBeenCalledWith(pInfo, 'docker.io/image12', expect.any(Function));
});

test('Expect a local image to have an active select image button', async () => {
  vi.mocked(window.searchImageInRegistry).mockResolvedValue([
    { name: 'fedora21', description: '', star_count: 5, is_official: false },
  ]);
  render(CreateContainerFromExistingImage);
  await tick();

  const inputBox = screen.getByPlaceholderText('Select an exisiting image');
  expect(inputBox).toBeInTheDocument();
  await userEvent.type(inputBox, 'fedora');

  await tick();
  await waitFor(() => expect(screen.queryByRole('row')).toBeInTheDocument());

  const list = screen.getByRole('row');
  const items = within(list).getAllByRole('button');
  expect(items.length).toBe(6);

  await userEvent.keyboard('[ArrowDown]');

  const selectImagebutton = screen.getByRole('button', { name: 'Select Image' });

  expect(selectImagebutton).toBeInTheDocument();
  expect(selectImagebutton).not.toBeDisabled();

  await userEvent.click(selectImagebutton);
  expect(router.goto).toHaveBeenCalledWith('/image/run/basic');
});

test('Expect no user input to show only local images', async () => {
  vi.mocked(window.searchImageInRegistry).mockResolvedValue([
    { name: 'image12', description: '', star_count: 3, is_official: true },
  ]);
  render(CreateContainerFromExistingImage);
  await tick();

  const inputBox = screen.getByPlaceholderText('Select an exisiting image');
  expect(inputBox).toBeInTheDocument();
  await userEvent.type(inputBox, ' ');

  await tick();
  await waitFor(() => expect(screen.queryByRole('row')).toBeInTheDocument());

  const list = screen.getByRole('row');
  const items = within(list).getAllByRole('button');
  expect(items.length).toBe(6);
});
