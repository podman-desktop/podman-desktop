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

import type { OnboardingInfo } from '@podman-desktop/core-api';
import { beforeEach, describe, expect, test } from 'vitest';

import { context } from '/@/stores/context';
import { onboardingList } from '/@/stores/onboarding';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { setAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import {
  extensionHasOtherVersions,
  extensionHasVersionUpdate,
  extensionRequiresManualUpdate,
  resolveCatalogExtensionOnboardingStatus,
  resolveOnboardingRouteExtensionId,
} from './extension-onboarding-utils';
import { setPrototypeUseCasesEnabled } from './extension-prototype-use-cases';

function createPodmanOnboarding(): OnboardingInfo {
  return {
    extension: 'podman-desktop.podman',
    name: 'podman',
    displayName: 'Podman',
    description: 'Podman',
    icon: '',
    welcomeMessage: 'Welcome',
    priority: 1,
    title: 'Podman Setup',
    steps: [],
    removable: false,
  };
}

function createExtension(partial: Partial<CatalogExtensionInfoUI>): CatalogExtensionInfoUI {
  return {
    id: 'test',
    displayName: 'Test',
    isFeatured: false,
    fetchable: true,
    fetchLink: '',
    fetchVersion: '1.0.0',
    publisherDisplayName: 'Publisher',
    isInstalled: true,
    shortDescription: '',
    categories: [],
    keywords: [],
    availableVersions: [],
    hasUpdate: false,
    isVerified: false,
    isSupportedByRedHat: false,
    ...partial,
  };
}

describe('extensionHasVersionUpdate', () => {
  test('returns true when catalog versions differ even without hasUpdate flag', () => {
    expect(extensionHasVersionUpdate(true, '0.4.0', '0.4.1', false)).toBe(true);
  });

  test('returns true when versions differ with v prefix', () => {
    expect(extensionHasVersionUpdate(true, 'v0.4.0', 'v0.4.1', false)).toBe(true);
  });

  test('returns false when installed version matches catalog version', () => {
    expect(extensionHasVersionUpdate(true, '0.4.0', '0.4.0', false)).toBe(false);
  });
});

describe('extensionHasOtherVersions', () => {
  test('returns true when another version is available', () => {
    const extension = createExtension({
      installedVersion: '1.0.0',
      availableVersions: [
        { version: '1.0.0', ociUri: 'oci:1.0.0', preview: false },
        { version: '1.1.0', ociUri: 'oci:1.1.0', preview: false },
      ],
    });

    expect(extensionHasOtherVersions(extension)).toBe(true);
  });

  test('returns false when only the current version is available', () => {
    const extension = createExtension({
      installedVersion: '1.0.0',
      availableVersions: [{ version: '1.0.0', ociUri: 'oci:1.0.0', preview: false }],
    });

    expect(extensionHasOtherVersions(extension)).toBe(false);
  });

  test('returns false when no versions are available', () => {
    const extension = createExtension({
      installedVersion: '1.0.0',
      availableVersions: [],
    });

    expect(extensionHasOtherVersions(extension)).toBe(false);
  });

  test('treats v-prefix versions as equivalent to current version', () => {
    const extension = createExtension({
      installedVersion: 'v1.0.0',
      availableVersions: [{ version: '1.0.0', ociUri: 'oci:1.0.0', preview: false }],
    });

    expect(extensionHasOtherVersions(extension)).toBe(false);
  });
});

describe('extensionRequiresManualUpdate', () => {
  test('returns true when an update is available and automatic updates are disabled', () => {
    const extension = createExtension({
      id: 'manual-update',
      isInstalled: true,
      installedVersion: '1.0.0',
      fetchVersion: '1.1.0',
    });

    expect(extensionRequiresManualUpdate(extension)).toBe(true);
  });

  test('returns false when automatic updates are enabled', () => {
    const extension = createExtension({
      id: 'auto-update',
      isInstalled: true,
      installedVersion: '1.0.0',
      fetchVersion: '1.1.0',
    });

    setAutoUpdateEnabled('auto-update', true);

    expect(extensionRequiresManualUpdate(extension)).toBe(false);
  });
});

describe('resolveExtensionOnboardingStatus', () => {
  beforeEach(() => {
    setPrototypeUseCasesEnabled(true);
    onboardingList.set([createPodmanOnboarding()]);
    context.set({});
  });

  test('enables onboarding for AI Lab via prototype route to Podman Setup', () => {
    const status = resolveCatalogExtensionOnboardingStatus({
      id: 'redhat.ai-lab',
      displayName: 'Podman AI Lab',
      isFeatured: true,
      fetchable: true,
      fetchLink: '',
      fetchVersion: '1.9.3',
      publisherDisplayName: 'Red Hat',
      isInstalled: true,
      installedVersion: '1.9.3',
      shortDescription: '',
      categories: [],
      keywords: [],
      availableVersions: [],
      hasUpdate: false,
      isVerified: true,
      isSupportedByRedHat: true,
      installedExtension: {
        id: 'redhat.ai-lab',
        type: 'extension',
        state: 'started',
        name: 'ai-lab',
        displayName: 'Podman AI Lab',
        description: '',
        publisher: 'redhat',
        removable: true,
        devMode: false,
        version: '1.9.3',
        path: '',
        readme: '',
      },
    });

    expect(status.enabled).toBe(true);
    expect(resolveOnboardingRouteExtensionId('redhat.ai-lab')).toBe('podman-desktop.podman');
  });

  test('enables onboarding for AI Lab even before onboarding list is populated', () => {
    onboardingList.set([]);

    const status = resolveCatalogExtensionOnboardingStatus({
      id: 'redhat.ai-lab',
      displayName: 'Podman AI Lab',
      isFeatured: true,
      fetchable: true,
      fetchLink: '',
      fetchVersion: '1.9.3',
      publisherDisplayName: 'Red Hat',
      isInstalled: true,
      shortDescription: '',
      categories: [],
      keywords: [],
      availableVersions: [],
      hasUpdate: false,
      isVerified: true,
      isSupportedByRedHat: true,
    });

    expect(status.enabled).toBe(true);
  });
});
