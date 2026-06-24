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
import { setAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import { isExtensionUserDisabled, isExtensionUserEnabled } from './extension-lifecycle-user-toggle';

/** Real bundled / catalog extension IDs used to demo DTUX-2849 UI states. */
export const USE_CASE_EXTENSION_IDS = {
  builtIn: 'podman-desktop.compose',
  /** Installed-tab demo: upgrade available with manual version installation (auto-update off). */
  communityActiveWithUpdate: 'podman-desktop.kind',
  communityDisabled: 'podman-desktop.registries',
  communityFailed: 'podman-desktop.kube-context',
  activating: 'podman-desktop.kubectl-cli',
  disabling: 'podman-desktop.lima',
  incompatibleVersion: 'podman-desktop.podman-docker-context',
  missingDependency: 'podman-desktop.kind',
  /** Install Podman AI Lab, then use Preview install tooltip on the Catalog tab. */
  postInstallTooltipWithOnboarding: 'redhat.ai-lab',
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

    if (isExtensionUserDisabled(extension.id)) {
      return {
        ...extension,
        state: extension.state === 'stopping' ? 'stopping' : 'stopped',
        error: undefined,
      };
    }

    if (!overlay) {
      return extension;
    }

    if (overlay.state === 'stopped' && isExtensionUserEnabled(extension.id)) {
      return {
        ...extension,
        error: undefined,
      };
    }

    if (extension.state === 'stopped' || extension.state === 'stopping') {
      return {
        ...extension,
        state: extension.state,
        error: undefined,
      };
    }

    return {
      ...extension,
      state: overlay.state ?? extension.state,
      error: overlay.error ?? extension.error,
    };
  });
}

/** Bump patch segment for prototype update demos (supports semver suffixes like -next). */
export function bumpPrototypePatchVersion(version: string): string {
  const normalized = version.replace(/^v/i, '').trim();
  const versionPattern = /^(\d+)\.(\d+)\.(\d+)(.*)$/;
  const match = versionPattern.exec(normalized);
  if (match) {
    const patch = Number.parseInt(match[3], 10) + 1;
    return `${match[1]}.${match[2]}.${patch}${match[4]}`;
  }

  const legacyParts = normalized.split('.').map(part => Number.parseInt(part, 10));
  if (legacyParts.length > 0 && !legacyParts.some(Number.isNaN)) {
    legacyParts[legacyParts.length - 1] += 1;
    return legacyParts.join('.');
  }

  return `${normalized}.1`;
}

function applyPrototypeKindUpdateOverlay(catalogInfo: CatalogExtensionInfoUI): CatalogExtensionInfoUI {
  const installedVersion = catalogInfo.installedVersion ?? catalogInfo.fetchVersion ?? '1.0.0';
  const newerVersion = bumpPrototypePatchVersion(installedVersion);
  const versionOptions = [
    { version: newerVersion, ociUri: catalogInfo.fetchLink ?? '', preview: false },
    { version: installedVersion, ociUri: catalogInfo.fetchLink ?? '', preview: false },
  ];

  return {
    ...catalogInfo,
    availableVersions: versionOptions,
    installedVersion,
    fetchVersion: newerVersion,
    hasUpdate: true,
  };
}

/** Enrich catalog metadata for real extensions used in prototype review. */
export function applyPrototypeCatalogUseCaseOverlay(catalogInfo: CatalogExtensionInfoUI): CatalogExtensionInfoUI {
  if (!prototypeUseCasesEnabled) {
    return catalogInfo;
  }

  if (catalogInfo.id === USE_CASE_EXTENSION_IDS.communityActiveWithUpdate) {
    return applyPrototypeKindUpdateOverlay(catalogInfo);
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

/** Keep auto-update disabled on the installed-tab manual update demo extension. */
export function ensurePrototypeManualUpdateSettings(extensions: CatalogExtensionInfoUI[]): void {
  if (!prototypeUseCasesEnabled) {
    return;
  }

  const demoExtension =
    extensions.find(
      extension => extension.isInstalled && extension.id === USE_CASE_EXTENSION_IDS.communityActiveWithUpdate,
    ) ??
    extensions.find(extension => extension.isInstalled && extension.hasUpdate) ??
    extensions.find(extension => extension.isInstalled);

  if (demoExtension) {
    setAutoUpdateEnabled(demoExtension.id, false);
  }
}
