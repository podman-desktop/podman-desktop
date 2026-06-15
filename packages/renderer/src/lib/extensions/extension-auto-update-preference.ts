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

import type { CatalogExtension } from '@podman-desktop/core-api/extension-catalog';
import type { FeaturedExtension } from '@podman-desktop/core-api/featured';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { confirmExtensionAutoUpdateChange } from './extension-auto-update-confirm';
import { isAutoUpdateEnabled, setAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import {
  applyExtensionVersionChange,
  resolveVersionChangeTarget,
  withDisplayInstalledVersion,
} from './extension-version-update.svelte';
import type { ExtensionsUtils } from './extensions-utils';

export const EXTENSION_AUTO_UPDATE_PREFERENCE_TITLE = 'Automatic updates';

export function getExtensionPreferencesSectionTitle(displayName: string): string {
  return `Extension: ${displayName}`;
}

export function resolveExtensionIdFromPreferencesKey(key: string): string | undefined {
  if (!key.startsWith('preferences.')) {
    return undefined;
  }

  const extensionId = key.slice('preferences.'.length);
  return extensionId.length > 0 ? extensionId : undefined;
}

export function shouldShowExtensionAutoUpdatePreference(extension?: CatalogExtensionInfoUI): boolean {
  if (!extension?.isInstalled || extension.installedExtension?.devMode) {
    return false;
  }

  return extension.fetchable || extension.availableVersions.length > 0;
}

export function getExtensionAutoUpdatePreferenceDetail(extension: CatalogExtensionInfoUI): string {
  if (isAutoUpdateEnabled(extension.id)) {
    return 'New updates will be automatically installed';
  }

  const targetVersion = resolveVersionChangeTarget(withDisplayInstalledVersion(extension));

  if (targetVersion) {
    return `An update to v${targetVersion} is available, install manually or enable automatic updates`;
  }

  return 'Manual version installation is required';
}

export function matchesExtensionAutoUpdateSearch(searchValue: string): boolean {
  if (!searchValue) {
    return true;
  }

  const lower = searchValue.toLowerCase();
  return (
    lower.includes('automatic') ||
    lower.includes('update') ||
    EXTENSION_AUTO_UPDATE_PREFERENCE_TITLE.toLowerCase().includes(lower)
  );
}

export function resolveExtensionPreferenceCatalog(
  preferencesKey: string,
  installedExtensions: CombinedExtensionInfoUI[],
  catalogExtensions: CatalogExtension[],
  featuredExtensions: FeaturedExtension[],
  extensionsUtils: ExtensionsUtils,
): CatalogExtensionInfoUI | undefined {
  const extensionId = resolveExtensionIdFromPreferencesKey(preferencesKey);
  if (!extensionId) {
    return undefined;
  }

  const catalogInfo = extensionsUtils.buildCatalogExtensionInfoForId(
    extensionId,
    catalogExtensions,
    featuredExtensions,
    installedExtensions,
  );

  if (!catalogInfo?.isInstalled || catalogInfo.installedExtension?.devMode) {
    return undefined;
  }

  return catalogInfo;
}

export function resolveExtensionAutoUpdatePreference(
  preferencesKey: string,
  installedExtensions: CombinedExtensionInfoUI[],
  catalogExtensions: CatalogExtension[],
  featuredExtensions: FeaturedExtension[],
  extensionsUtils: ExtensionsUtils,
): CatalogExtensionInfoUI | undefined {
  const catalogInfo = resolveExtensionPreferenceCatalog(
    preferencesKey,
    installedExtensions,
    catalogExtensions,
    featuredExtensions,
    extensionsUtils,
  );

  if (!catalogInfo || !shouldShowExtensionAutoUpdatePreference(catalogInfo)) {
    return undefined;
  }

  return catalogInfo;
}

export async function toggleExtensionAutoUpdate(
  extension: CatalogExtensionInfoUI,
  enabling: boolean,
): Promise<boolean> {
  const confirmed = await confirmExtensionAutoUpdateChange(extension, enabling);
  if (!confirmed) {
    return false;
  }

  setAutoUpdateEnabled(extension.id, enabling);

  if (enabling) {
    const targetVersion = resolveVersionChangeTarget(withDisplayInstalledVersion(extension));
    if (targetVersion) {
      applyExtensionVersionChange(extension, targetVersion, true);
    }
  }

  return true;
}
