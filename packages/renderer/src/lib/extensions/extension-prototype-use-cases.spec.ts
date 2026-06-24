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

import { afterEach, describe, expect, test } from 'vitest';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { isAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import {
  markExtensionUserDisabled,
  markExtensionUserEnabled,
  resetExtensionLifecycleUserTogglesForTests,
} from './extension-lifecycle-user-toggle';
import { getPrototypeInstalledDemos } from './extension-prototype-installed-demos';
import {
  applyPrototypeCatalogUseCaseOverlay,
  applyPrototypeUseCaseOverlays,
  ensurePrototypeManualUpdateSettings,
  setPrototypeUseCasesEnabled,
  USE_CASE_EXTENSION_IDS,
} from './extension-prototype-use-cases';
import { ExtensionsUtils } from './extensions-utils';

describe('prototype use cases on real extensions', () => {
  const extensionsUtils = new ExtensionsUtils();

  afterEach(() => {
    setPrototypeUseCasesEnabled(true);
    resetExtensionLifecycleUserTogglesForTests();
  });

  test('does not inject fake demo extension rows', () => {
    expect(getPrototypeInstalledDemos()).toEqual([]);
  });

  test('overlays lifecycle state on real bundled extensions', () => {
    const registries: CombinedExtensionInfoUI = {
      type: 'pd',
      id: USE_CASE_EXTENSION_IDS.communityDisabled,
      name: 'registries',
      displayName: 'Registries',
      description: 'Registries',
      publisher: 'podman-desktop',
      removable: true,
      devMode: false,
      version: '1.0.0',
      state: 'started',
      path: '',
      readme: '',
    };

    const [overlay] = applyPrototypeUseCaseOverlays([registries]);
    expect(overlay.state).toBe('stopped');
    expect(overlay.displayName).toBe('Registries');
  });

  test('respects user-disabled state for failed demo extensions', () => {
    const kubeContext: CombinedExtensionInfoUI = {
      type: 'pd',
      id: USE_CASE_EXTENSION_IDS.communityFailed,
      name: 'kube-context',
      displayName: 'Kube Context',
      description: 'Kube Context',
      publisher: 'podman-desktop',
      removable: true,
      devMode: false,
      version: '1.0.0',
      state: 'stopped',
      path: '',
      readme: '',
      error: {
        message: 'Original backend error',
      },
    };

    const [overlay] = applyPrototypeUseCaseOverlays([kubeContext]);
    expect(overlay.state).toBe('stopped');
    expect(overlay.error).toBeUndefined();
  });

  test('restores failed demo overlay after user re-enables extension', () => {
    markExtensionUserEnabled(USE_CASE_EXTENSION_IDS.communityFailed);

    const kubeContext: CombinedExtensionInfoUI = {
      type: 'pd',
      id: USE_CASE_EXTENSION_IDS.communityFailed,
      name: 'kube-context',
      displayName: 'Kube Context',
      description: 'Kube Context',
      publisher: 'podman-desktop',
      removable: true,
      devMode: false,
      version: '1.0.0',
      state: 'started',
      path: '',
      readme: '',
    };

    const [overlay] = applyPrototypeUseCaseOverlays([kubeContext]);
    expect(overlay.state).toBe('failed');
    expect(overlay.error?.message).toContain('Failed to activate extension');
  });

  test('shows disabled state when user disables a demo extension', () => {
    markExtensionUserDisabled(USE_CASE_EXTENSION_IDS.activating);

    const kubectl: CombinedExtensionInfoUI = {
      type: 'pd',
      id: USE_CASE_EXTENSION_IDS.activating,
      name: 'kubectl-cli',
      displayName: 'kubectl CLI',
      description: 'kubectl CLI',
      publisher: 'podman-desktop',
      removable: true,
      devMode: false,
      version: '1.0.0',
      state: 'stopped',
      path: '',
      readme: '',
    };

    const [overlay] = applyPrototypeUseCaseOverlays([kubectl]);
    expect(overlay.state).toBe('stopped');
  });

  test('shows active state when user enables a forced-disabled demo extension', () => {
    markExtensionUserEnabled(USE_CASE_EXTENSION_IDS.communityDisabled);

    const registries: CombinedExtensionInfoUI = {
      type: 'pd',
      id: USE_CASE_EXTENSION_IDS.communityDisabled,
      name: 'registries',
      displayName: 'Registries',
      description: 'Registries',
      publisher: 'podman-desktop',
      removable: true,
      devMode: false,
      version: '1.0.0',
      state: 'started',
      path: '',
      readme: '',
    };

    const [overlay] = applyPrototypeUseCaseOverlays([registries]);
    expect(overlay.state).toBe('started');
  });

  test('marks Kind as having an update in catalog metadata', () => {
    const kindCatalog: CatalogExtensionInfoUI = {
      id: USE_CASE_EXTENSION_IDS.communityActiveWithUpdate,
      displayName: 'Kind',
      isFeatured: false,
      fetchable: false,
      fetchLink: '',
      fetchVersion: '1.0.0',
      publisherDisplayName: 'podman-desktop',
      isInstalled: true,
      installedVersion: '1.0.0',
      shortDescription: 'Kind clusters',
      categories: [],
      keywords: [],
      availableVersions: [{ version: '1.0.0', ociUri: '', preview: false }],
      hasUpdate: false,
      isVerified: false,
      isSupportedByRedHat: false,
    };

    const enriched = applyPrototypeCatalogUseCaseOverlay(kindCatalog);
    expect(enriched.hasUpdate).toBe(true);
    expect(enriched.fetchVersion).toBe('1.0.1');
    expect(enriched.installedVersion).toBe('1.0.0');
  });

  test('marks Kind update relative to the installed next-channel version', () => {
    const kindCatalog: CatalogExtensionInfoUI = {
      id: USE_CASE_EXTENSION_IDS.communityActiveWithUpdate,
      displayName: 'Kind',
      isFeatured: false,
      fetchable: false,
      fetchLink: '',
      fetchVersion: '1.28.0-next',
      publisherDisplayName: 'podman-desktop',
      isInstalled: true,
      installedVersion: '1.28.0-next',
      shortDescription: 'Kind clusters',
      categories: [],
      keywords: [],
      availableVersions: [{ version: '1.28.0-next', ociUri: '', preview: false }],
      hasUpdate: false,
      isVerified: false,
      isSupportedByRedHat: false,
    };

    const enriched = applyPrototypeCatalogUseCaseOverlay(kindCatalog);
    expect(enriched.hasUpdate).toBe(true);
    expect(enriched.fetchVersion).toBe('1.28.1-next');
    expect(enriched.installedVersion).toBe('1.28.0-next');
  });

  test('applyPrototypeUseCaseOverlays keeps list length unchanged', () => {
    const existing: CombinedExtensionInfoUI = {
      type: 'pd',
      id: 'podman-desktop.compose',
      name: 'compose',
      displayName: 'Compose',
      description: 'Compose',
      publisher: 'podman-desktop',
      removable: false,
      devMode: false,
      version: '1.0.0',
      state: 'started',
      path: '',
      readme: '',
    };

    const result = extensionsUtils.applyPrototypeUseCaseOverlays([existing]);
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('podman-desktop.compose');
  });

  test('ensurePrototypeManualUpdateSettings disables auto-update on the manual update demo', () => {
    const kind: CatalogExtensionInfoUI = {
      id: USE_CASE_EXTENSION_IDS.communityActiveWithUpdate,
      displayName: 'Kind',
      isFeatured: false,
      fetchable: false,
      fetchLink: '',
      fetchVersion: '1.1.0',
      publisherDisplayName: 'Podman Desktop',
      isInstalled: true,
      installedVersion: '1.0.0',
      shortDescription: 'Kind clusters',
      categories: [],
      keywords: [],
      availableVersions: [{ version: '1.1.0', ociUri: '', preview: false }],
      hasUpdate: true,
      isVerified: false,
      isSupportedByRedHat: false,
    };

    ensurePrototypeManualUpdateSettings([kind]);

    expect(isAutoUpdateEnabled(kind.id)).toBe(false);
  });

  test('ensurePrototypeUpdateDemo prefers Kind when installed and no other updates exist', () => {
    const kind: CatalogExtensionInfoUI = {
      id: USE_CASE_EXTENSION_IDS.communityActiveWithUpdate,
      displayName: 'Kind',
      isFeatured: false,
      fetchable: false,
      fetchLink: '',
      fetchVersion: '1.0.0',
      publisherDisplayName: 'Podman Desktop',
      isInstalled: true,
      installedVersion: '1.0.0',
      shortDescription: 'Kind clusters',
      categories: [],
      keywords: [],
      availableVersions: [{ version: '1.0.0', ociUri: '', preview: false }],
      hasUpdate: false,
      isVerified: false,
      isSupportedByRedHat: false,
    };
    const compose: CatalogExtensionInfoUI = {
      ...kind,
      id: 'podman-desktop.compose',
      displayName: 'Compose',
      installedVersion: '2.0.0',
      fetchVersion: '2.0.0',
    };

    const [kindResult, composeResult] = extensionsUtils.ensurePrototypeUpdateDemo([kind, compose]);

    expect(kindResult?.hasUpdate).toBe(true);
    expect(kindResult?.fetchVersion).toBe('1.0.1');
    expect(composeResult?.hasUpdate).toBe(false);
  });

  test('ensurePrototypeUpdateDemo does not apply fallback update when Kind is absent', () => {
    const compose: CatalogExtensionInfoUI = {
      id: 'podman-desktop.compose',
      displayName: 'Compose',
      isFeatured: false,
      fetchable: false,
      fetchLink: '',
      fetchVersion: '1.28.0-next',
      publisherDisplayName: 'Podman Desktop',
      isInstalled: true,
      installedVersion: '1.28.0-next',
      shortDescription: 'Compose',
      categories: [],
      keywords: [],
      availableVersions: [{ version: '1.28.0-next', ociUri: '', preview: false }],
      hasUpdate: false,
      isVerified: false,
      isSupportedByRedHat: false,
    };

    const [composeResult] = extensionsUtils.ensurePrototypeUpdateDemo([compose]);

    expect(composeResult?.hasUpdate).toBe(false);
    expect(composeResult?.fetchVersion).toBe('1.28.0-next');
  });
});
