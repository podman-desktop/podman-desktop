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

import { render, screen } from '@testing-library/svelte';
import { beforeEach, expect, test, vi } from 'vitest';

import ImageColumnUpdateStatus from './ImageColumnUpdateStatus.svelte';
import type { ImageInfoUI } from './ImageInfoUI';

const baseImage: ImageInfoUI = {
  id: 'my-image',
  shortId: '1234567',
  name: 'test-image',
  engineId: 'podman.podman-machine-default',
  engineName: 'podman',
  tag: 'latest',
  createdAt: 0,
  age: '',
  arch: 'amd64',
  size: 1000,
  humanSize: '1KB',
  base64RepoTag: 'dGVzdC1pbWFnZTpsYXRlc3Q=',
  selected: false,
  status: 'UNUSED',
  badges: [],
};

beforeEach(() => {
  vi.resetAllMocks();
});

test('Expect dash when no update status', async () => {
  const image: ImageInfoUI = { ...baseImage };
  render(ImageColumnUpdateStatus, { object: image });

  screen.getByText('-');
});

test('Expect Checking state when updateCheckInProgress is true', async () => {
  const image: ImageInfoUI = { ...baseImage, updateCheckInProgress: true };
  render(ImageColumnUpdateStatus, { object: image });

  screen.getByText('Checking');
});

test('Expect Updating state when updateInProgress is true', async () => {
  const image: ImageInfoUI = { ...baseImage, updateInProgress: true };
  render(ImageColumnUpdateStatus, { object: image });

  screen.getByText('Updating');
});

test('Expect Available status when update is available', async () => {
  const image: ImageInfoUI = {
    ...baseImage,
    updateStatus: {
      status: 'normal',
      updateAvailable: true,
      message: 'Update available',
    },
  };
  render(ImageColumnUpdateStatus, { object: image });

  const status = screen.getByRole('note');
  expect(status).toHaveTextContent('Available');
});

test('Expect Up to date status when no update is available', async () => {
  const image: ImageInfoUI = {
    ...baseImage,
    updateStatus: {
      status: 'normal',
      updateAvailable: false,
      message: 'Image is up to date',
    },
  };
  render(ImageColumnUpdateStatus, { object: image });

  const status = screen.getByRole('note');
  expect(status).toHaveTextContent('Up to date');
});

test('Expect Error status when status is error', async () => {
  const image: ImageInfoUI = {
    ...baseImage,
    updateStatus: {
      status: 'error',
      updateAvailable: false,
      message: 'Failed to check for updates',
    },
  };
  render(ImageColumnUpdateStatus, { object: image });

  const status = screen.getByRole('note');
  expect(status).toHaveTextContent('Error');
});

test('Expect N/A status when status is skipped', async () => {
  const image: ImageInfoUI = {
    ...baseImage,
    updateStatus: {
      status: 'skipped',
      updateAvailable: false,
      message: 'Local image',
    },
  };
  render(ImageColumnUpdateStatus, { object: image });

  const status = screen.getByRole('note');
  expect(status).toHaveTextContent('N/A');
});
