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

/** Non-removable platform extensions integrated into Podman Desktop core. */
export const BUILT_IN_EXTENSION_IDS = new Set([
  'podman-desktop.compose',
  'podman-desktop.docker',
  'podman-desktop.podman',
]);

/**
 * Bundled community extensions shipped with Podman Desktop.
 * They are pre-installed in dev builds (`removable: false`) but are not built-ins.
 */
export const BUNDLED_COMMUNITY_EXTENSION_IDS = new Set([
  'podman-desktop.kind',
  'podman-desktop.registries',
  'podman-desktop.kube-context',
  'podman-desktop.kubectl-cli',
  'podman-desktop.lima',
  'podman-desktop.podman-docker-context',
]);

export type ExtensionOriginSortLabel =
  | 'Built-in extension'
  | 'Community Verified'
  | 'Community'
  | 'Docker Desktop extension'
  | 'DevMode extension';

export function isBuiltInExtension(
  installed?: Pick<CombinedExtensionInfoUI, 'id' | 'removable' | 'devMode' | 'type'>,
): boolean {
  if (!installed || installed.devMode || installed.type === 'dd') {
    return false;
  }

  return BUILT_IN_EXTENSION_IDS.has(installed.id);
}

export function isBundledCommunityExtension(extensionId: string): boolean {
  return BUNDLED_COMMUNITY_EXTENSION_IDS.has(extensionId);
}

/** Only core built-ins show the legacy "Pre-installed" label in card views. */
export function isExtensionPreinstalled(
  installed?: Pick<CombinedExtensionInfoUI, 'id' | 'removable' | 'devMode' | 'type'>,
): boolean {
  return isBuiltInExtension(installed);
}

export function resolveExtensionVerificationStatus(
  publisherDisplayName: string,
  categories: string[] = [],
): { isVerified: boolean; isSupportedByRedHat: boolean } {
  const isSupportedByRedHat = publisherDisplayName.toLowerCase().includes('red hat');
  const isVerified = isSupportedByRedHat || categories.some(category => category.toLowerCase().includes('verified'));

  return { isVerified, isSupportedByRedHat };
}

export function resolveExtensionOriginSortLabel(
  installed?: Pick<CombinedExtensionInfoUI, 'id' | 'removable' | 'devMode' | 'type'>,
  options?: { isVerified?: boolean },
): ExtensionOriginSortLabel {
  if (installed?.type === 'dd') {
    return 'Docker Desktop extension';
  }

  if (installed?.devMode) {
    return 'DevMode extension';
  }

  if (installed && isBuiltInExtension(installed)) {
    return 'Built-in extension';
  }

  return options?.isVerified ? 'Community Verified' : 'Community';
}

export function isExtensionRemovableInUi(
  installed: Pick<CombinedExtensionInfoUI, 'id' | 'type' | 'devMode' | 'removable'>,
  fetchable = false,
): boolean {
  if (installed.type === 'dd') {
    return true;
  }

  if (isBuiltInExtension(installed)) {
    return false;
  }

  return installed.removable ? true : fetchable;
}

/** Show the built-in shield next to the name when uninstall is blocked for platform extensions. */
export function shouldShowBuiltInNameIndicator(
  installed?: Pick<CombinedExtensionInfoUI, 'id' | 'removable' | 'devMode' | 'type'>,
  fetchable = false,
): boolean {
  if (!installed || installed.devMode || installed.type === 'dd') {
    return false;
  }

  return !isExtensionRemovableInUi(installed, fetchable);
}
