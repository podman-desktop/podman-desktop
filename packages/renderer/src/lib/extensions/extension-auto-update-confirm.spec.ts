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

import { beforeEach, describe, expect, test, vi } from 'vitest';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { confirmExtensionAutoUpdateChange, getExtensionAutoUpdateConfirmDetail } from './extension-auto-update-confirm';

const extension: CatalogExtensionInfoUI = {
  id: 'my-extension',
  displayName: 'Minikube extension',
  isFeatured: false,
  fetchable: true,
  fetchLink: '',
  fetchVersion: '1.28.1',
  publisherDisplayName: 'Publisher',
  isInstalled: true,
  installedVersion: '1.28.0',
  shortDescription: '',
  categories: [],
  keywords: [],
  availableVersions: [],
  hasUpdate: false,
  isVerified: false,
  isSupportedByRedHat: false,
};

beforeEach(() => {
  vi.mocked(window.showMessageBox).mockReset();
});

describe('getExtensionAutoUpdateConfirmDetail', () => {
  test('includes pending update version when enabling with an update available', () => {
    expect(getExtensionAutoUpdateConfirmDetail(extension, true)).toContain('v1.28.1');
  });

  test('describes manual updates when disabling', () => {
    expect(getExtensionAutoUpdateConfirmDetail(extension, false)).toContain('manually');
  });
});

describe('confirmExtensionAutoUpdateChange', () => {
  test('returns true when the user confirms enable', async () => {
    vi.mocked(window.showMessageBox).mockResolvedValue({ response: 0 });

    await expect(confirmExtensionAutoUpdateChange(extension, true)).resolves.toBe(true);
    expect(window.showMessageBox).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Enable automatic updates for Minikube extension?',
        buttons: ['Enable', 'Cancel'],
      }),
    );
  });

  test('returns false when the user cancels disable', async () => {
    vi.mocked(window.showMessageBox).mockResolvedValue({ response: 1 });

    await expect(confirmExtensionAutoUpdateChange(extension, false)).resolves.toBe(false);
    expect(window.showMessageBox).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Disable automatic updates for Minikube extension?',
        buttons: ['Disable', 'Cancel'],
      }),
    );
  });
});
