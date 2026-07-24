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

import type { CatalogExtension } from '@podman-desktop/core-api';
import { beforeEach, describe, expect, test } from 'vitest';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import {
  forgetCustomInstalledExtension,
  getCustomInstalledExtensionIds,
  isCustomInstalledExtension,
  isCustomOrLocalTabExtension,
  isRememberedCustomExtension,
  normalizeCustomExtensionKey,
  reconcileCustomInstalledExtensions,
  rememberCustomInstalledExtension,
} from './extension-custom-local';
import {
  clearPrototypeRemovedExtensions,
  isExplicitlyPrototypeRemoved,
  isPrototypeRemovedExtension,
  prototypeRemoveExtension,
  setPrototypeUseCasesEnabled,
} from './extension-prototype-use-cases';

function makeExtension(overrides: Partial<CombinedExtensionInfoUI> = {}): CombinedExtensionInfoUI {
  return {
    id: 'publisher.my-ext',
    name: 'my-ext',
    displayName: 'My Ext',
    description: '',
    publisher: 'publisher',
    removable: true,
    devMode: false,
    version: '1.0.0',
    state: 'started',
    path: '/tmp/my-ext',
    readme: '',
    type: 'pd',
    ...overrides,
  };
}

beforeEach(() => {
  localStorage.clear();
  clearPrototypeRemovedExtensions();
  setPrototypeUseCasesEnabled(true);
});

describe('extension-custom-local', () => {
  test('remember and forget custom installed ids', () => {
    rememberCustomInstalledExtension('publisher.my-ext');
    expect(getCustomInstalledExtensionIds().has('publisher.my-ext')).toBe(true);
    forgetCustomInstalledExtension('publisher.my-ext');
    expect(getCustomInstalledExtensionIds().has('publisher.my-ext')).toBe(false);
  });

  test('treats remembered ids as custom', () => {
    rememberCustomInstalledExtension('publisher.my-ext');
    expect(isCustomInstalledExtension(makeExtension({ removable: false }))).toBe(true);
  });

  test('heuristic is disabled when catalog is empty', () => {
    expect(isCustomInstalledExtension(makeExtension(), [])).toBe(false);
  });

  test('heuristic marks removable non-catalog pd extensions as custom', () => {
    const catalog = [{ id: 'other.ext', extensionName: 'other' }] as CatalogExtension[];
    expect(isCustomInstalledExtension(makeExtension(), catalog)).toBe(true);
  });

  test('does not treat catalog-matched extensions as custom', () => {
    const catalog = [{ id: 'publisher.my-ext', extensionName: 'my-ext' }] as CatalogExtension[];
    expect(isCustomInstalledExtension(makeExtension(), catalog)).toBe(false);
  });

  test('devMode extensions are local tab but not custom', () => {
    const extension = makeExtension({ devMode: true, removable: false });
    expect(isCustomInstalledExtension(extension, [])).toBe(false);
    expect(isCustomOrLocalTabExtension(extension, [])).toBe(true);
  });

  test('normalizes oci image tokens to match runtime extension ids', () => {
    expect(normalizeCustomExtensionKey('podman-desktop.kubernetes-dashboard')).toBe('kubernetesdashboard');
    expect(
      normalizeCustomExtensionKey('ghcr.io/podman-desktop/podman-desktop-extension-kubernetes-dashboard:latest'),
    ).toBe('kubernetesdashboard');
  });

  test('fuzzy-matches remembered oci token against runtime id', () => {
    rememberCustomInstalledExtension('podman-desktop-extension-kubernetes-dashboard');
    const extension = makeExtension({
      id: 'podman-desktop.kubernetes-dashboard',
      name: 'kubernetes-dashboard',
    });
    expect(isRememberedCustomExtension(extension)).toBe(true);
    expect(
      isCustomInstalledExtension(extension, [{ id: 'podman-desktop.kubernetes-dashboard' } as CatalogExtension]),
    ).toBe(true);
  });

  test('reconcile remembers and restores the install-custom example when already installed', () => {
    const extension = makeExtension({
      id: 'podman-desktop.kubernetes-dashboard',
      name: 'kubernetes-dashboard',
    });
    expect(isPrototypeRemovedExtension(extension.id)).toBe(true);
    reconcileCustomInstalledExtensions([extension]);
    expect(isRememberedCustomExtension(extension)).toBe(true);
    expect(isPrototypeRemovedExtension(extension.id)).toBe(false);
  });

  test('reconcile does not restore an explicitly uninstalled custom extension', () => {
    const extension = makeExtension({
      id: 'podman-desktop.kubernetes-dashboard',
      name: 'kubernetes-dashboard',
    });
    prototypeRemoveExtension(extension.id);
    forgetCustomInstalledExtension(extension.id);

    reconcileCustomInstalledExtensions([extension]);
    expect(isExplicitlyPrototypeRemoved(extension.id)).toBe(true);
    expect(isPrototypeRemovedExtension(extension.id)).toBe(true);
  });
});
