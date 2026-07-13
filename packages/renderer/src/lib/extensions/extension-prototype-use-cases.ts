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
import {
  getPrototypeTransientLifecycleState,
  prototypeLifecycleOverlayRevisionStore,
  setPrototypeLifecycleDemosEnabled,
  startPrototypeActivatingOverlay,
} from './extension-prototype-lifecycle-overlay.svelte';

/** Real bundled / catalog extension IDs used to demo DTUX-2849 UI states. */
export const USE_CASE_EXTENSION_IDS = {
  builtIn: 'podman-desktop.compose',
  /** Installed-tab demo: upgrade available with manual version installation (auto-update off). */
  communityActiveWithUpdate: 'podman-desktop.kind',
  /** Second installed-tab demo row with an available update. */
  communityActiveWithUpdateSecondary: 'podman-desktop.compose',
  communityDisabled: 'podman-desktop.registries',
  communityFailed: 'podman-desktop.kube-context',
  activating: 'podman-desktop.kubectl-cli',
  disabling: 'podman-desktop.lima',
  incompatibleVersion: 'podman-desktop.podman-docker-context',
  missingDependency: 'podman-desktop.kind',
  /** Install Podman AI Lab, then use Preview install tooltip on the Catalog tab. */
  postInstallTooltipWithOnboarding: 'redhat.ai-lab',
} as const;

export const PROTOTYPE_UPDATE_DEMO_EXTENSION_IDS = [
  USE_CASE_EXTENSION_IDS.communityActiveWithUpdate,
  USE_CASE_EXTENSION_IDS.communityActiveWithUpdateSecondary,
] as const;

export function isPrototypeUpdateDemoExtension(extensionId: string): boolean {
  return (PROTOTYPE_UPDATE_DEMO_EXTENSION_IDS as readonly string[]).includes(extensionId);
}

let prototypeUseCasesEnabled = false;

/** Extension ids removed during this session via the prototype uninstall demo. */
const prototypeRemovedExtensionIds = new Set<string>();

/**
 * Extension ids that were restored via a prototype re-install demo.
 * These are forced to the 'started' state to override any real backend error state.
 */
const prototypeRestoredExtensionIds = new Set<string>();

export function setPrototypeUseCasesEnabled(enabled: boolean): void {
  prototypeUseCasesEnabled = enabled;
  setPrototypeLifecycleDemosEnabled(enabled);
  if (enabled) {
    startPrototypeActivatingOverlay();
  }
}

export function arePrototypeUseCasesEnabled(): boolean {
  return prototypeUseCasesEnabled;
}

/** Mark an extension as uninstalled in the prototype (no backend call). */
export function prototypeRemoveExtension(extensionId: string): void {
  prototypeRemovedExtensionIds.add(extensionId);
  prototypeLifecycleOverlayRevisionStore.update(r => r + 1);
}

/**
 * Restore a prototype-removed extension (undo the demo uninstall, no backend call).
 * Also marks the extension as "freshly installed" so it shows Active regardless of
 * the real backend state (e.g. a pre-existing failed state).
 */
export function prototypeRestoreExtension(extensionId: string): void {
  prototypeRemovedExtensionIds.delete(extensionId);
  prototypeRestoredExtensionIds.add(extensionId);
  prototypeLifecycleOverlayRevisionStore.update(r => r + 1);
}

export function isPrototypeRemovedExtension(extensionId: string): boolean {
  return prototypeRemovedExtensionIds.has(extensionId);
}

export function clearPrototypeRemovedExtensions(): void {
  prototypeRemovedExtensionIds.clear();
  prototypeRestoredExtensionIds.clear();
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

  return extensions
    .filter(extension => !prototypeRemovedExtensionIds.has(extension.id))
    .map(extension => {
      const overlay = INSTALLED_STATE_OVERLAYS[extension.id];
      const transientState = getPrototypeTransientLifecycleState(extension.id);

      if (transientState) {
        return {
          ...extension,
          state: transientState,
          error: undefined,
        };
      }

      // Extensions that were "re-installed" via the prototype demo show as Active,
      // overriding any real backend error state.
      if (prototypeRestoredExtensionIds.has(extension.id)) {
        return {
          ...extension,
          state: 'started',
          error: undefined,
        };
      }

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

      if (overlay.state === 'starting' && getPrototypeTransientLifecycleState(extension.id) !== 'starting') {
        return {
          ...extension,
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

/** Bump minor segment for prototype update demos (supports semver suffixes like -next). */
export function bumpPrototypeMinorVersion(version: string): string {
  const normalized = version.replace(/^v/i, '').trim();
  const versionPattern = /^(\d+)\.(\d+)\.(\d+)(.*)$/;
  const match = versionPattern.exec(normalized);
  if (match) {
    const minor = Number.parseInt(match[2], 10) + 1;
    return `${match[1]}.${minor}.0${match[4]}`;
  }

  const legacyParts = normalized.split('.').map(part => Number.parseInt(part, 10));
  if (legacyParts.length > 1 && !legacyParts.some(Number.isNaN)) {
    legacyParts[legacyParts.length - 2] += 1;
    legacyParts[legacyParts.length - 1] = 0;
    return legacyParts.join('.');
  }

  return bumpPrototypePatchVersion(version);
}

export function getPrototypeUpdateTargetVersion(extensionId: string, installedVersion: string): string {
  if (extensionId === USE_CASE_EXTENSION_IDS.communityActiveWithUpdateSecondary) {
    return bumpPrototypeMinorVersion(installedVersion);
  }

  return bumpPrototypePatchVersion(installedVersion);
}

function applyPrototypeUpdateOverlay(catalogInfo: CatalogExtensionInfoUI): CatalogExtensionInfoUI {
  const installedVersion = catalogInfo.installedVersion ?? catalogInfo.fetchVersion ?? '1.0.0';
  const newerVersion = getPrototypeUpdateTargetVersion(catalogInfo.id, installedVersion);
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

  if (isPrototypeUpdateDemoExtension(catalogInfo.id)) {
    return applyPrototypeUpdateOverlay(catalogInfo);
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

/** Keep auto-update disabled on installed-tab manual update demo extensions. */
export function ensurePrototypeManualUpdateSettings(extensions: CatalogExtensionInfoUI[]): void {
  if (!prototypeUseCasesEnabled) {
    return;
  }

  for (const demoId of PROTOTYPE_UPDATE_DEMO_EXTENSION_IDS) {
    const demoExtension = extensions.find(extension => extension.isInstalled && extension.id === demoId);
    if (demoExtension) {
      setAutoUpdateEnabled(demoExtension.id, false);
    }
  }
}
