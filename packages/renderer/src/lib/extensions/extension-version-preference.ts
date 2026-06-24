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

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { extensionHasVersionUpdate } from './extension-onboarding-utils';
import {
  getDisplayInstalledVersion,
  getStoreInstalledVersion,
  getVersionChangeLinkLabel,
  normalizeVersionValue,
} from './extension-version-update.svelte';

export const EXTENSION_VERSION_PREFERENCE_TITLE = 'Version';

export type ExtensionVersionOptionStatus = 'current' | 'upgrade' | 'downgrade';

export interface ExtensionVersionOption {
  label: string;
  value: string;
  icon?: IconDefinition;
  status: ExtensionVersionOptionStatus;
}

export function shouldShowExtensionVersionPreference(extension?: CatalogExtensionInfoUI): boolean {
  return !!extension?.isInstalled && !extension.installedExtension?.devMode;
}

function collectCatalogVersions(extension: CatalogExtensionInfoUI): Set<string> {
  const versions = new Set<string>();

  for (const version of extension.availableVersions) {
    const normalized = normalizeVersionValue(version.version);
    if (normalized) {
      versions.add(normalized);
    }
  }

  const fetchVersion = normalizeVersionValue(extension.fetchVersion);
  if (fetchVersion) {
    versions.add(fetchVersion);
  }

  return versions;
}

function getLatestCatalogVersion(extension: CatalogExtensionInfoUI): string | undefined {
  const versions = collectCatalogVersions(extension);
  if (versions.size === 0) {
    return undefined;
  }

  return [...versions].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0];
}

export function extensionIsOnLatestVersion(extension: CatalogExtensionInfoUI): boolean {
  const current = getExtensionVersionPreferenceValue(extension);
  if (!current) {
    return false;
  }

  if (extensionHasVersionUpdate(extension.isInstalled, current, extension.fetchVersion, extension.hasUpdate)) {
    return false;
  }

  const latest = getLatestCatalogVersion(extension);
  return !!latest && current === latest;
}

export function extensionHasVersionChoices(extension: CatalogExtensionInfoUI): boolean {
  const current = getExtensionVersionPreferenceValue(extension);
  const versions = collectCatalogVersions(extension);

  if (!current) {
    return versions.size > 1;
  }

  return [...versions].some(version => version !== current);
}

export function getExtensionVersionPreferenceSummary(currentVersion: string): string {
  if (!currentVersion) {
    return 'No version installed';
  }

  return `Currently installed v${currentVersion}`;
}

export function getExtensionVersionPreferenceDetail(hasOtherVersions: boolean): string {
  if (!hasOtherVersions) {
    return 'No other versions available';
  }

  return 'Select a version to upgrade or downgrade (may require restart of extension)';
}

export function getExtensionVersionPreferenceDescription(currentVersion: string, hasOtherVersions: boolean): string {
  return `${getExtensionVersionPreferenceSummary(currentVersion)}. ${getExtensionVersionPreferenceDetail(hasOtherVersions)}`;
}

export function getVersionOptionStatus(version: string, currentVersion: string): ExtensionVersionOptionStatus {
  if (!currentVersion || version === currentVersion) {
    return 'current';
  }

  const comparison = version.localeCompare(currentVersion, undefined, { numeric: true });
  return comparison > 0 ? 'upgrade' : 'downgrade';
}

export function getExtensionVersionOptions(
  extension: CatalogExtensionInfoUI,
  currentVersion: string,
): ExtensionVersionOption[] {
  const versions = collectCatalogVersions(extension);

  return [...versions]
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
    .map(version => {
      const status = getVersionOptionStatus(version, currentVersion);

      if (status === 'current') {
        return {
          label: `v${version}`,
          value: version,
          status,
        };
      }

      if (status === 'upgrade') {
        return {
          label: `v${version} · Upgrade`,
          value: version,
          icon: faArrowUp,
          status,
        };
      }

      return {
        label: `v${version} · Downgrade`,
        value: version,
        icon: faArrowDown,
        status,
      };
    });
}

export function getExtensionVersionPreferenceValue(extension: CatalogExtensionInfoUI): string {
  const storeVersion = getStoreInstalledVersion(extension);
  return normalizeVersionValue(getDisplayInstalledVersion(extension.id, storeVersion) ?? storeVersion) ?? '';
}

export function matchesExtensionVersionSearch(searchValue: string): boolean {
  if (!searchValue) {
    return true;
  }

  const lower = searchValue.toLowerCase();
  return (
    lower.includes('version') ||
    EXTENSION_VERSION_PREFERENCE_TITLE.toLowerCase().includes(lower) ||
    lower.includes('change')
  );
}

export async function confirmExtensionVersionChange(
  extension: CatalogExtensionInfoUI,
  targetVersion: string,
): Promise<boolean> {
  const actionLabel = getVersionChangeLinkLabel(getExtensionVersionPreferenceValue(extension), targetVersion);
  const result = await window.showMessageBox({
    type: 'none',
    title: `${actionLabel} for ${extension.displayName}?`,
    detail: `The extension will be updated to v${targetVersion}.`,
    buttons: [actionLabel, 'Cancel'],
    defaultId: 0,
    cancelId: 1,
  });

  return result?.response === 0;
}
