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
import { getPrototypeInstalledDemos } from './extension-prototype-installed-demos';
import {
  applyPrototypeCatalogUseCaseOverlay,
  applyPrototypeUseCaseOverlays,
  setPrototypeUseCasesEnabled,
  USE_CASE_EXTENSION_IDS,
} from './extension-prototype-use-cases';
import { ExtensionsUtils } from './extensions-utils';

describe('prototype use cases on real extensions', () => {
  const extensionsUtils = new ExtensionsUtils();

  afterEach(() => {
    setPrototypeUseCasesEnabled(true);
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
    expect(enriched.fetchVersion).toBe('1.1.0');
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
});
