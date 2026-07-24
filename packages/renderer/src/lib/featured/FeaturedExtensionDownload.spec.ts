/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import type { FeaturedExtension } from '@podman-desktop/core-api/featured';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import type { CatalogExtensionInfoUI } from '/@/lib/extensions/catalog-extension-info-ui';
import { extensionInstallInProgressIds } from '/@/lib/extensions/extension-install-progress.svelte';
import {
  clearPrototypeRemovedExtensions,
  prototypeRemoveExtension,
  setPrototypeUseCasesEnabled,
} from '/@/lib/extensions/extension-prototype-use-cases';
import { areExtensionsImprovementsSuggested } from '/@/lib/extensions/extensions-prototype-scope';

import FeaturedExtensionDownload from './FeaturedExtensionDownload.svelte';

vi.mock(import('/@/lib/extensions/extensions-prototype-scope'), () => ({
  areExtensionsImprovementsSuggested: vi.fn(() => false),
}));

vi.mock(import('/@/stores/extensions'), () => ({
  fetchExtensions: vi.fn(async () => undefined),
}));

vi.mock(import('/@/stores/webviews'), () => ({
  fetchWebviews: vi.fn(async () => undefined),
}));

vi.mock(import('/@/stores/navigation/navigation-registry-extension.svelte'), () => ({
  refreshExtensionNavigationItems: vi.fn(),
}));

vi.mock(import('/@/lib/extensions/extension-nav-pointer.svelte'), () => ({
  syncExtensionNavigationAfterInstall: vi.fn(async () => true),
}));

vi.mock(import('/@/lib/extensions/extension-catalog-settings.svelte'), () => ({
  markNewlyInstalled: vi.fn(),
  setAutoUpdateEnabled: vi.fn(),
  isAutoUpdateEnabled: vi.fn(() => false),
}));

beforeAll(() => {
  (window.events as unknown) = {
    receive: (_channel: string, func: () => void): void => {
      func();
    },
  };
});

beforeEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
  vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(false);
  setPrototypeUseCasesEnabled(false);
  clearPrototypeRemovedExtensions();
  extensionInstallInProgressIds.set(new Set());
});

test('Expect that the install button is hidden if extension is not installable', async () => {
  const featuredExtension: FeaturedExtension = {
    builtin: true,
    id: 'foo.bar',
    displayName: 'FooBar',
    description: 'This is FooBar description',
    icon: 'data:image/png;base64,foobar',
    categories: [],
    fetchable: false,
    installed: false,
  };

  render(FeaturedExtensionDownload, { extension: featuredExtension });

  const installButton = screen.queryByRole('button', { name: 'Install foo.bar Extension' });
  expect(installButton).not.toBeInTheDocument();
});

test('Expect install button hides after install without parent rerender', async () => {
  const featuredExtension: FeaturedExtension = {
    builtin: true,
    id: 'foo.bar',
    displayName: 'FooBar',
    description: 'This is FooBar description',
    icon: 'data:image/png;base64,foobar',
    categories: [],
    fetchable: true,
    fetchLink: 'oci-hello/world',
    fetchVersion: '1.2.3',
    installed: false,
  };

  render(FeaturedExtensionDownload, { extension: featuredExtension });

  vi.mocked(window.extensionInstallFromImage).mockResolvedValue(undefined);

  await fireEvent.click(screen.getByRole('button', { name: 'Install foo.bar Extension' }));

  await vi.waitFor(() => {
    expect(screen.queryByRole('button', { name: 'Install foo.bar Extension' })).not.toBeInTheDocument();
  });
});

test('Expect that clicking install installs the latest version directly', async () => {
  let featuredExtension: FeaturedExtension = {
    builtin: true,
    id: 'foo.bar',
    displayName: 'FooBar',
    description: 'This is FooBar description',
    icon: 'data:image/png;base64,foobar',
    categories: [],
    fetchable: true,
    fetchLink: 'oci-hello/world',
    fetchVersion: '1.2.3',
    installed: false,
  };

  const renderResult = render(FeaturedExtensionDownload, { extension: featuredExtension });

  const installButton = screen.getByRole('button', { name: 'Install foo.bar Extension' });
  expect(installButton).toBeInTheDocument();

  vi.mocked(window.extensionInstallFromImage).mockImplementation(async () => {
    featuredExtension.installed = true;
    featuredExtension.fetchable = false;
    featuredExtension = { ...featuredExtension };
    await renderResult.rerender({ extension: featuredExtension });
  });

  await fireEvent.click(installButton);

  expect(vi.mocked(window.extensionInstallFromImage)).toHaveBeenCalled();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  await vi.waitFor(() => {
    expect(screen.queryByRole('button', { name: 'Install foo.bar Extension' })).not.toBeInTheDocument();
  });
});

test('Expect Install button returns after prototype uninstall of a previously installed extension', async () => {
  vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(true);
  setPrototypeUseCasesEnabled(true);

  const catalogExtension: CatalogExtensionInfoUI = {
    id: 'redhat.ai-lab',
    displayName: 'Podman AI Lab',
    isFeatured: true,
    fetchable: true,
    fetchLink: 'oci:ai-lab',
    fetchVersion: '1.9.3',
    publisherDisplayName: 'Red Hat',
    isInstalled: false,
    installedVersion: undefined,
    shortDescription: 'Work with LLMs locally',
    categories: [],
    keywords: [],
    availableVersions: [{ version: '1.9.3', ociUri: 'oci:ai-lab', preview: false }],
    hasUpdate: false,
    isVerified: true,
    isSupportedByRedHat: true,
  };

  const renderResult = render(FeaturedExtensionDownload, { extension: catalogExtension });

  await fireEvent.click(screen.getByRole('button', { name: 'Install redhat.ai-lab Extension' }));

  // Prototype install simulation takes a few seconds of real delays.
  await vi.waitFor(
    () => {
      expect(screen.queryByRole('button', { name: 'Install redhat.ai-lab Extension' })).not.toBeInTheDocument();
    },
    { timeout: 10_000 },
  );

  // Parent reflects installed state (clears local installCompleted latch).
  await renderResult.rerender({
    extension: {
      ...catalogExtension,
      isInstalled: true,
      installedVersion: '1.9.3',
    },
  });

  prototypeRemoveExtension('redhat.ai-lab');

  // Catalog card reflects prototype uninstall.
  await renderResult.rerender({
    extension: {
      ...catalogExtension,
      isInstalled: false,
      installedVersion: undefined,
    },
  });

  expect(screen.getByRole('button', { name: 'Install redhat.ai-lab Extension' })).toBeInTheDocument();
}, 15_000);

test('Suggestion scope: Install is icon-only and shows filled pie while locking the row', async () => {
  vi.mocked(areExtensionsImprovementsSuggested).mockReturnValue(true);
  setPrototypeUseCasesEnabled(true);

  const catalogExtension: CatalogExtensionInfoUI = {
    id: 'redhat.ai-lab',
    displayName: 'Podman AI Lab',
    isFeatured: true,
    fetchable: true,
    fetchLink: 'oci:ai-lab',
    fetchVersion: '1.9.3',
    publisherDisplayName: 'Red Hat',
    isInstalled: false,
    installedVersion: undefined,
    shortDescription: 'Work with LLMs locally',
    categories: [],
    keywords: [],
    availableVersions: [{ version: '1.9.3', ociUri: 'oci:ai-lab', preview: false }],
    hasUpdate: false,
    isVerified: true,
    isSupportedByRedHat: true,
  };

  render(FeaturedExtensionDownload, { extension: catalogExtension });

  const installButton = screen.getByRole('button', { name: 'Install redhat.ai-lab Extension' });
  // Images-page pattern: no bordered secondary box.
  expect(installButton.className).not.toContain('border-2');
  expect(installButton.className).toContain('rounded-full');

  await fireEvent.click(installButton);

  await vi.waitFor(() => {
    expect(screen.getByRole('progressbar', { name: /Install progress/ })).toBeInTheDocument();
    expect(get(extensionInstallInProgressIds).has('redhat.ai-lab')).toBe(true);
  });

  // Let the prototype install simulation finish so afterEach cleanup is not left hanging.
  await vi.waitFor(
    () => {
      expect(get(extensionInstallInProgressIds).has('redhat.ai-lab')).toBe(false);
    },
    { timeout: 10_000 },
  );
}, 15_000);
