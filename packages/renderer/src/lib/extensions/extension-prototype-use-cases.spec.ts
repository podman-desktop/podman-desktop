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

import { afterEach, describe, expect, test, vi } from 'vitest';

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
  PROTOTYPE_TRANSIENT_LIFECYCLE_MS,
  resetPrototypeLifecycleOverlaysForTests,
} from './extension-prototype-lifecycle-overlay.svelte';
import {
  applyPrototypeCatalogUseCaseOverlay,
  applyPrototypeUseCaseOverlays,
  clearPrototypeRemovedExtensions,
  ensurePrototypeManualUpdateSettings,
  isPrototypeRemovedExtension,
  prototypeRemoveExtension,
  prototypeRestoreExtension,
  setPrototypeUseCasesEnabled,
  USE_CASE_EXTENSION_IDS,
} from './extension-prototype-use-cases';
import { ExtensionsUtils } from './extensions-utils';

describe('prototype use cases on real extensions', () => {
  const extensionsUtils = new ExtensionsUtils();

  afterEach(() => {
    clearPrototypeRemovedExtensions();
    setPrototypeUseCasesEnabled(true);
    resetExtensionLifecycleUserTogglesForTests();
    resetPrototypeLifecycleOverlaysForTests();
  });

  test('does not inject fake demo extension rows', () => {
    expect(getPrototypeInstalledDemos()).toEqual([]);
  });

  test('overlays lifecycle state on real bundled extensions', () => {
    vi.useFakeTimers();
    setPrototypeUseCasesEnabled(true);

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
    vi.useRealTimers();
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

  test('restores failed demo overlay after user re-enables extension', async () => {
    vi.useFakeTimers();
    setPrototypeUseCasesEnabled(true);
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

    let [overlay] = applyPrototypeUseCaseOverlays([kubeContext]);
    expect(overlay.state).toBe('starting');

    await vi.advanceTimersByTimeAsync(PROTOTYPE_TRANSIENT_LIFECYCLE_MS);

    [overlay] = applyPrototypeUseCaseOverlays([kubeContext]);
    expect(overlay.state).toBe('failed');
    expect(overlay.error?.message).toContain('Failed to activate extension');
    vi.useRealTimers();
  });

  test('shows disabled state when user disables a demo extension', async () => {
    vi.useFakeTimers();
    setPrototypeUseCasesEnabled(true);
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

    let [overlay] = applyPrototypeUseCaseOverlays([kubectl]);
    expect(overlay.state).toBe('stopping');

    await vi.advanceTimersByTimeAsync(PROTOTYPE_TRANSIENT_LIFECYCLE_MS);

    [overlay] = applyPrototypeUseCaseOverlays([kubectl]);
    expect(overlay.state).toBe('stopped');
    vi.useRealTimers();
  });

  test('shows active state when user enables a forced-disabled demo extension', async () => {
    vi.useFakeTimers();
    setPrototypeUseCasesEnabled(true);
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

    let [overlay] = applyPrototypeUseCaseOverlays([registries]);
    expect(overlay.state).toBe('starting');

    await vi.advanceTimersByTimeAsync(PROTOTYPE_TRANSIENT_LIFECYCLE_MS);

    [overlay] = applyPrototypeUseCaseOverlays([registries]);
    expect(overlay.state).toBe('started');
    vi.useRealTimers();
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

  test('marks Compose as having an update in catalog metadata', () => {
    const composeCatalog: CatalogExtensionInfoUI = {
      id: USE_CASE_EXTENSION_IDS.communityActiveWithUpdateSecondary,
      displayName: 'Compose',
      isFeatured: false,
      fetchable: false,
      fetchLink: '',
      fetchVersion: '1.28.0-next',
      publisherDisplayName: 'podman-desktop',
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

    const enriched = applyPrototypeCatalogUseCaseOverlay(composeCatalog);
    expect(enriched.hasUpdate).toBe(true);
    expect(enriched.fetchVersion).toBe('1.29.0-next');
    expect(enriched.installedVersion).toBe('1.28.0-next');
  });

  test('uses different update targets for Kind and Compose on the same installed version', () => {
    const installedVersion = '1.28.0-next';
    const kindCatalog: CatalogExtensionInfoUI = {
      id: USE_CASE_EXTENSION_IDS.communityActiveWithUpdate,
      displayName: 'Kind',
      isFeatured: false,
      fetchable: false,
      fetchLink: '',
      fetchVersion: installedVersion,
      publisherDisplayName: 'podman-desktop',
      isInstalled: true,
      installedVersion,
      shortDescription: 'Kind clusters',
      categories: [],
      keywords: [],
      availableVersions: [{ version: installedVersion, ociUri: '', preview: false }],
      hasUpdate: false,
      isVerified: false,
      isSupportedByRedHat: false,
    };
    const composeCatalog: CatalogExtensionInfoUI = {
      ...kindCatalog,
      id: USE_CASE_EXTENSION_IDS.communityActiveWithUpdateSecondary,
      displayName: 'Compose',
      shortDescription: 'Compose',
    };

    const kindResult = applyPrototypeCatalogUseCaseOverlay(kindCatalog);
    const composeResult = applyPrototypeCatalogUseCaseOverlay(composeCatalog);

    expect(kindResult.fetchVersion).toBe('1.28.1-next');
    expect(composeResult.fetchVersion).toBe('1.29.0-next');
    expect(kindResult.fetchVersion).not.toBe(composeResult.fetchVersion);
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

  test('shows disabling demo state on load for lima', () => {
    setPrototypeUseCasesEnabled(true);

    const lima: CombinedExtensionInfoUI = {
      type: 'pd',
      id: USE_CASE_EXTENSION_IDS.disabling,
      name: 'lima',
      displayName: 'Lima',
      description: 'Lima',
      publisher: 'podman-desktop',
      removable: true,
      devMode: false,
      version: '1.0.0',
      state: 'started',
      path: '',
      readme: '',
    };

    const [overlay] = applyPrototypeUseCaseOverlays([lima]);
    expect(overlay.state).toBe('stopping');
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

  test('hides non-built-in extensions on refresh until prototype re-install', () => {
    setPrototypeUseCasesEnabled(true);

    const compose: CombinedExtensionInfoUI = {
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
    const aiLab: CombinedExtensionInfoUI = {
      type: 'pd',
      id: 'redhat.ai-lab',
      name: 'ai-lab',
      displayName: 'Podman AI Lab',
      description: 'AI Lab',
      publisher: 'redhat',
      removable: true,
      devMode: false,
      version: '1.9.3',
      state: 'started',
      path: '',
      readme: '',
    };

    expect(isPrototypeRemovedExtension('redhat.ai-lab')).toBe(true);
    expect(isPrototypeRemovedExtension('podman-desktop.compose')).toBe(false);

    let result = applyPrototypeUseCaseOverlays([compose, aiLab]);
    expect(result.map(extension => extension.id)).toEqual(['podman-desktop.compose']);

    prototypeRestoreExtension('redhat.ai-lab', [], 'Podman AI Lab');
    expect(isPrototypeRemovedExtension('redhat.ai-lab')).toBe(false);
    result = applyPrototypeUseCaseOverlays([compose, aiLab]);
    expect(result.map(extension => extension.id)).toEqual(['podman-desktop.compose', 'redhat.ai-lab']);

    prototypeRemoveExtension('redhat.ai-lab');
    expect(isPrototypeRemovedExtension('redhat.ai-lab')).toBe(true);
    result = applyPrototypeUseCaseOverlays([compose, aiLab]);
    expect(result.map(extension => extension.id)).toEqual(['podman-desktop.compose']);

    // Simulate app refresh: in-memory prototype session state is cleared.
    clearPrototypeRemovedExtensions();
    expect(isPrototypeRemovedExtension('redhat.ai-lab')).toBe(true);
    result = applyPrototypeUseCaseOverlays([compose, aiLab]);
    expect(result.map(extension => extension.id)).toEqual(['podman-desktop.compose']);
  });

  test('ensurePrototypeManualUpdateSettings disables auto-update on manual update demos', () => {
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
    const compose: CatalogExtensionInfoUI = {
      ...kind,
      id: USE_CASE_EXTENSION_IDS.communityActiveWithUpdateSecondary,
      displayName: 'Compose',
      shortDescription: 'Compose',
    };

    ensurePrototypeManualUpdateSettings([kind, compose]);

    expect(isAutoUpdateEnabled(kind.id)).toBe(false);
    expect(isAutoUpdateEnabled(compose.id)).toBe(false);
  });

  test('ensurePrototypeUpdateDemo marks Kind and Compose as having updates', () => {
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
      id: USE_CASE_EXTENSION_IDS.communityActiveWithUpdateSecondary,
      displayName: 'Compose',
      installedVersion: '2.0.0',
      fetchVersion: '2.0.0',
      shortDescription: 'Compose',
    };

    const [kindResult, composeResult] = extensionsUtils.ensurePrototypeUpdateDemo([kind, compose]);

    expect(kindResult?.hasUpdate).toBe(true);
    expect(kindResult?.fetchVersion).toBe('1.0.1');
    expect(composeResult?.hasUpdate).toBe(true);
    expect(composeResult?.fetchVersion).toBe('2.1.0');
  });

  test('ensurePrototypeUpdateDemo adds a second update when only Kind is installed', () => {
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
    expect(composeResult?.hasUpdate).toBe(true);
    expect(composeResult?.fetchVersion).toBe('2.1.0');
  });

  test('ensurePrototypeUpdateDemo marks Compose as having an update when Kind is absent', () => {
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

    expect(composeResult?.hasUpdate).toBe(true);
    expect(composeResult?.fetchVersion).toBe('1.29.0-next');
  });
});
