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

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import {
  BUILT_IN_EXTENSION_IDS,
  BUNDLED_COMMUNITY_EXTENSION_IDS,
  isBuiltInExtension,
  isBundledCommunityExtension,
  isExtensionPreinstalled,
  isExtensionRemovableInUi,
  resolveExtensionOriginSortLabel,
  resolveExtensionVerificationStatus,
} from './extension-origin-utils';

function createInstalled(id: string, overrides: Partial<CombinedExtensionInfoUI> = {}): CombinedExtensionInfoUI {
  return {
    id,
    name: id,
    displayName: id,
    description: '',
    publisher: '',
    removable: false,
    devMode: false,
    type: 'pd',
    version: '1.0.0',
    state: 'started',
    path: '',
    readme: '',
    ...overrides,
  } as CombinedExtensionInfoUI;
}

describe('extension-origin-utils', () => {
  test('treats compose, docker, and podman as built-in', () => {
    for (const id of BUILT_IN_EXTENSION_IDS) {
      expect(isBuiltInExtension(createInstalled(id))).toBe(true);
      expect(isExtensionPreinstalled(createInstalled(id))).toBe(true);
      expect(resolveExtensionOriginSortLabel(createInstalled(id))).toBe('Built-in extension');
    }
  });

  test('treats bundled community extensions as community even when removable is false', () => {
    for (const id of BUNDLED_COMMUNITY_EXTENSION_IDS) {
      expect(isBundledCommunityExtension(id)).toBe(true);
      expect(isBuiltInExtension(createInstalled(id))).toBe(false);
      expect(isExtensionPreinstalled(createInstalled(id))).toBe(false);
      expect(resolveExtensionOriginSortLabel(createInstalled(id))).toBe('Community');
    }
  });

  test('marks red hat catalog publishers as community verified', () => {
    const { isVerified, isSupportedByRedHat } = resolveExtensionVerificationStatus('Red Hat', []);
    expect(isVerified).toBe(true);
    expect(isSupportedByRedHat).toBe(true);
    expect(resolveExtensionOriginSortLabel(createInstalled('redhat.ai-lab'), { isVerified: true })).toBe(
      'Community Verified',
    );
  });

  test('does not mark podman-desktop publisher as verified by default', () => {
    const { isVerified, isSupportedByRedHat } = resolveExtensionVerificationStatus('Podman Desktop', []);
    expect(isVerified).toBe(false);
    expect(isSupportedByRedHat).toBe(false);
  });

  test('does not treat dev mode or docker desktop extensions as built-in', () => {
    expect(isBuiltInExtension(createInstalled('podman-desktop.compose', { devMode: true }))).toBe(false);
    expect(isBuiltInExtension(createInstalled('some.dd.ext', { type: 'dd' }))).toBe(false);
    expect(resolveExtensionOriginSortLabel(createInstalled('some.dd.ext', { type: 'dd' }))).toBe(
      'Docker Desktop extension',
    );
    expect(resolveExtensionOriginSortLabel(createInstalled('local-dev', { devMode: true }))).toBe('DevMode extension');
  });

  test('only built-ins are non-removable in the UI', () => {
    expect(isExtensionRemovableInUi(createInstalled('podman-desktop.compose'))).toBe(false);
    expect(isExtensionRemovableInUi(createInstalled('podman-desktop.kind'))).toBe(false);
    expect(isExtensionRemovableInUi(createInstalled('podman-desktop.kind'), true)).toBe(true);
    expect(isExtensionRemovableInUi(createInstalled('podman-desktop.quadlet', { removable: true }))).toBe(true);
  });
});
