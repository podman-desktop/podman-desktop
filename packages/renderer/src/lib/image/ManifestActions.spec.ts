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

import '@testing-library/jest-dom/vitest';

import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { beforeAll, expect, test, vi } from 'vitest';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';
import type { ImageInfoUI } from '/@/lib/image/ImageInfoUI';
import ManifestActions from '/@/lib/image/ManifestActions.svelte';

vi.mock(import('/@/lib/dialogs/messagebox-utils'), () => ({
  withConfirmation: vi.fn(),
}));

const getContributedMenusMock = vi.fn();

class ResizeObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}
beforeAll(() => {
  Object.defineProperty(window, 'ResizeObserver', { value: ResizeObserver });

  Object.defineProperty(window, 'getContributedMenus', { value: getContributedMenusMock });
  Object.defineProperty(window, 'hasAuthconfigForImage', {
    value: vi.fn().mockResolvedValue(false),
  });
});

const fakedManifest: ImageInfoUI = {
  id: 'dummy',
  name: 'dummy',
  isManifest: true,
} as unknown as ImageInfoUI;

test('Expect Delete Manifest to be there', async () => {
  render(ManifestActions, { manifest: fakedManifest, onPushManifest: vi.fn() });

  const button = screen.getByRole('button', { name: 'Delete Manifest' });
  expect(button).toBeDefined();
});

test('Expect Push Manifest to be there', async () => {
  // Mock the showMessageBox to return 0 (yes)
  vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });
  getContributedMenusMock.mockResolvedValue([]);

  render(ManifestActions, { manifest: fakedManifest, onPushManifest: vi.fn() });

  const button = screen.getByRole('button', { name: 'Push Manifest' });
  expect(button).toBeDefined();
});

test('Expect withConfirmation to be called with delete variant when clicking Delete Manifest', async () => {
  getContributedMenusMock.mockResolvedValue([]);

  const manifest: ImageInfoUI = {
    ...fakedManifest,
    name: 'my-manifest',
    status: 'UNUSED',
  } as unknown as ImageInfoUI;

  render(ManifestActions, { manifest, onPushManifest: vi.fn() });

  const button = screen.getByRole('button', { name: 'Delete Manifest' });
  await fireEvent.click(button);

  await waitFor(() => {
    expect(withConfirmation).toHaveBeenCalledWith(expect.anything(), 'delete manifest my-manifest', {
      variant: 'delete',
    });
  });
});
