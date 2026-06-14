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

import type { ExtensionError } from '@podman-desktop/core-api';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';

/** Real bundled / catalog extension IDs used to demo DTUX-2849 UI states. */
export const USE_CASE_EXTENSION_IDS = {
  builtIn: 'podman-desktop.compose',
  communityActiveWithUpdate: 'podman-desktop.kind',
  communityDisabled: 'podman-desktop.registries',
  communityFailed: 'podman-desktop.kube-context',
  activating: 'podman-desktop.kubectl-cli',
  disabling: 'podman-desktop.lima',
  incompatibleVersion: 'podman-desktop.podman-docker-context',
  missingDependency: 'podman-desktop.kind',
} as const;

let prototypeUseCasesEnabled = true;

export function setPrototypeUseCasesEnabled(enabled: boolean): void {
  prototypeUseCasesEnabled = enabled;
}

export function arePrototypeUseCasesEnabled(): boolean {
  return prototypeUseCasesEnabled;
}

interface InstalledUseCaseOverlay {
  state?: string;
  error?: ExtensionError;
}

const INSTALLED_STATE_OVERLAYS: Record<string, InstalledUseCaseOverlay> = {
  [USE_CASE_EXTENSION_IDS.communityDisabled]: { state: 'stopped' },
  [USE_CASE_EXTENSION_IDS.communityFailed]: {
    state: 'failed',
    error: {
      message: 'Failed to activate extension: connection timeout while contacting registry.local:5000.',
    },
  },
  [USE_CASE_EXTENSION_IDS.activating]: { state: 'starting' },
  [USE_CASE_EXTENSION_IDS.disabling]: { state: 'stopping' },
};

/**
 * Apply prototype display overlays to installed extensions that are already present.
 * Does not inject fake extension rows.
 */
export function applyPrototypeUseCaseOverlays(extensions: CombinedExtensionInfoUI[]): CombinedExtensionInfoUI[] {
  if (!prototypeUseCasesEnabled) {
    return extensions;
  }

  return extensions.map(extension => {
    const overlay = INSTALLED_STATE_OVERLAYS[extension.id];
    if (!overlay) {
      return extension;
    }

    return {
      ...extension,
      state: overlay.state ?? extension.state,
      error: overlay.error ?? extension.error,
    };
  });
}

/** Enrich catalog metadata for real extensions used in prototype review. */
export function applyPrototypeCatalogUseCaseOverlay(catalogInfo: CatalogExtensionInfoUI): CatalogExtensionInfoUI {
  if (!prototypeUseCasesEnabled) {
    return catalogInfo;
  }

  const version = catalogInfo.installedVersion ?? catalogInfo.fetchVersion ?? '1.0.0';
  const olderVersion = '0.9.0';
  const newerVersion = '1.1.0';
  const versionOptions = [
    { version: newerVersion, ociUri: catalogInfo.fetchLink ?? '', preview: false },
    { version, ociUri: catalogInfo.fetchLink ?? '', preview: false },
    { version: olderVersion, ociUri: '', preview: false },
  ];

  if (catalogInfo.id === USE_CASE_EXTENSION_IDS.communityActiveWithUpdate) {
    return {
      ...catalogInfo,
      availableVersions: versionOptions,
      fetchVersion: newerVersion,
      hasUpdate: true,
    };
  }

  if (catalogInfo.publisherDisplayName.toLowerCase().includes('red hat')) {
    return {
      ...catalogInfo,
      isVerified: true,
      isSupportedByRedHat: true,
    };
  }

  return catalogInfo;
}
