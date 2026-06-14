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

import { beforeEach, expect, test, vi } from 'vitest';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import {
  applyExtensionVersionChange,
  getDisplayInstalledVersion,
  getExtensionVersionUpdateState,
  getLatestAvailableVersion,
  getOptimisticInstalledVersion,
  getVersionChangeLinkLabel,
  isExtensionVersionUpdating,
  resetVersionUpdateStateForTests,
  resolveVersionChangeTarget,
  setPrototypeVersionChangesEnabled,
  shouldShowVersionChangeLink,
} from './extension-version-update.svelte';

const baseExtension: CatalogExtensionInfoUI = {
  id: 'podman-desktop.minikube',
  displayName: 'minikube',
  isFeatured: false,
  fetchable: false,
  fetchLink: '',
  fetchVersion: '0.4.0',
  publisherDisplayName: 'Podman Desktop',
  isInstalled: true,
  installedVersion: '0.4.0',
  shortDescription: 'Run Kubernetes locally',
  categories: [],
  keywords: [],
  availableVersions: [
    { version: '0.4.0', ociUri: 'oci:minikube:0.4.0', preview: false },
    { version: '0.2.0', ociUri: 'oci:minikube:0.2.0', preview: false },
  ],
  hasUpdate: false,
  isVerified: false,
  isSupportedByRedHat: false,
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.resetAllMocks();
  setPrototypeVersionChangesEnabled(false);
  resetVersionUpdateStateForTests();
  Object.defineProperty(window, 'updateExtension', {
    value: vi.fn().mockResolvedValue(undefined),
    configurable: true,
  });
  Object.defineProperty(window, 'extensionInstallFromImage', {
    value: vi.fn().mockResolvedValue(undefined),
    configurable: true,
  });
});

test('getLatestAvailableVersion returns the highest catalog version', () => {
  expect(getLatestAvailableVersion(baseExtension)).toBe('0.4.0');
});

test('applyExtensionVersionChange uses updateExtension and stores optimistic version', async () => {
  applyExtensionVersionChange(baseExtension, '0.2.0', false);

  expect(getExtensionVersionUpdateState(baseExtension.id)?.status).toBe('updating');
  expect(getExtensionVersionUpdateState(baseExtension.id)?.message).toBe('Updating to v0.2.0...');
  expect(shouldShowVersionChangeLink(baseExtension)).toBe(false);
  expect(isExtensionVersionUpdating(baseExtension.id)).toBe(true);

  await vi.advanceTimersByTimeAsync(3000);

  expect(window.updateExtension).toHaveBeenCalledWith('podman-desktop.minikube', 'oci:minikube:0.2.0');
  expect(window.extensionInstallFromImage).not.toHaveBeenCalled();
  expect(getOptimisticInstalledVersion(baseExtension.id)).toBe('0.2.0');
  expect(getExtensionVersionUpdateState(baseExtension.id)).toBeUndefined();
});

test('after downgrade, upgrade link targets the latest available version', async () => {
  applyExtensionVersionChange(baseExtension, '0.2.0', false);
  await vi.advanceTimersByTimeAsync(3000);

  const downgradedExtension = {
    ...baseExtension,
    installedVersion: getDisplayInstalledVersion(baseExtension.id, '0.4.0'),
  };

  expect(shouldShowVersionChangeLink(downgradedExtension)).toBe(true);
  expect(resolveVersionChangeTarget(downgradedExtension)).toBe('0.4.0');
  expect(getVersionChangeLinkLabel(downgradedExtension.installedVersion, '0.4.0')).toBe('Upgrade to v0.4.0');
});

test('applyExtensionVersionChange surfaces backend errors when prototype mode is disabled', async () => {
  vi.mocked(window.updateExtension).mockRejectedValueOnce(new Error('Update failed'));

  applyExtensionVersionChange(baseExtension, '0.2.0', false);
  await vi.advanceTimersByTimeAsync(3000);

  expect(getExtensionVersionUpdateState(baseExtension.id)?.status).toBe('error');
  expect(getExtensionVersionUpdateState(baseExtension.id)?.message).toBe('Update failed');
  expect(getDisplayInstalledVersion(baseExtension.id, '0.4.0')).toBe('0.4.0');
});

test('prototype mode updates UI without calling backend', async () => {
  setPrototypeVersionChangesEnabled(true);

  applyExtensionVersionChange(baseExtension, '0.2.0', false);
  await vi.advanceTimersByTimeAsync(3000);

  expect(getOptimisticInstalledVersion(baseExtension.id)).toBe('0.2.0');
  expect(getExtensionVersionUpdateState(baseExtension.id)).toBeUndefined();
  expect(window.updateExtension).not.toHaveBeenCalled();
  expect(window.extensionInstallFromImage).not.toHaveBeenCalled();
});

test('prototype mode completes after 3 seconds without waiting for backend', async () => {
  setPrototypeVersionChangesEnabled(true);

  applyExtensionVersionChange(baseExtension, '0.2.0', false);

  expect(getExtensionVersionUpdateState(baseExtension.id)?.status).toBe('updating');
  expect(window.updateExtension).not.toHaveBeenCalled();

  await vi.advanceTimersByTimeAsync(3000);

  expect(getOptimisticInstalledVersion(baseExtension.id)).toBe('0.2.0');
  expect(getExtensionVersionUpdateState(baseExtension.id)).toBeUndefined();
  expect(window.updateExtension).not.toHaveBeenCalled();
});

test('prototype mode updates UI when selected version has no oci uri', async () => {
  setPrototypeVersionChangesEnabled(true);

  applyExtensionVersionChange(
    {
      ...baseExtension,
      availableVersions: [{ version: '0.2.0', ociUri: '', preview: false }],
    },
    '0.2.0',
    false,
  );
  await vi.advanceTimersByTimeAsync(3000);

  expect(window.updateExtension).not.toHaveBeenCalled();
  expect(getOptimisticInstalledVersion(baseExtension.id)).toBe('0.2.0');
});
