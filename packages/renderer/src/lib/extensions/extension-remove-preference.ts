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

import { router } from 'tinro';

import { withConfirmation } from '/@/lib/dialogs/messagebox-utils';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { clearNewBadge } from './extension-catalog-settings.svelte';
import { isBuiltInExtension, isBundledCommunityExtension, isExtensionRemovableInUi } from './extension-origin-utils';

export const EXTENSION_REMOVE_PREFERENCE_TITLE = 'Remove extension';
export const PREFERENCES_MAIN_ROUTE = '/preferences';

export interface RemoveExtensionOptions {
  /** When set, navigate here after a successful removal (e.g. from extension preferences). */
  redirectAfterRemove?: string;
}

export function buildExtensionPreferencesRoute(extensionId: string): string {
  return `/preferences/default/preferences.${extensionId}`;
}

export function redirectToPreferencesMain(route: string = PREFERENCES_MAIN_ROUTE): void {
  router.goto(route, true);
}

export function shouldShowExtensionRemovePreference(extension?: CatalogExtensionInfoUI): boolean {
  return !!extension?.isInstalled && !extension.installedExtension?.devMode;
}

export function canRemoveExtensionFromPreferences(extension: CatalogExtensionInfoUI): boolean {
  const installed = extension.installedExtension;
  if (!installed) {
    return false;
  }

  return isExtensionRemovableInUi(installed, extension.fetchable === true);
}

export function getExtensionRemoveBlockedReason(extension: CatalogExtensionInfoUI): string | undefined {
  const installed = extension.installedExtension;
  if (!installed) {
    return 'Extension is not installed';
  }

  if (canRemoveExtensionFromPreferences(extension)) {
    return undefined;
  }

  if (isBuiltInExtension(installed)) {
    return 'Built-in extensions are integrated with Podman Desktop and cannot be removed';
  }

  if (installed.devMode) {
    return 'Untrack this extension in Local Extensions before removing it';
  }

  if (!installed.removable && isBundledCommunityExtension(installed.id)) {
    return 'Bundled with Podman Desktop and cannot be removed';
  }

  if (!installed.removable && !extension.fetchable) {
    return 'Pre-installed extension cannot be removed';
  }

  if (!installed.removable) {
    return 'Extension is marked as non-removable';
  }

  return 'This extension cannot be removed';
}

/** Shorter copy for the actions menu detail row. */
export function getExtensionRemoveBlockedReasonShort(extension: CatalogExtensionInfoUI): string | undefined {
  const installed = extension.installedExtension;
  if (!installed) {
    return 'Extension is not installed';
  }

  if (canRemoveExtensionFromPreferences(extension)) {
    return undefined;
  }

  if (isBuiltInExtension(installed)) {
    return 'Built-in extension cannot be removed';
  }

  if (installed.devMode) {
    return 'Untrack in Local Extensions first';
  }

  if (!installed.removable && isBundledCommunityExtension(installed.id)) {
    return 'Bundled extension cannot be removed';
  }

  if (!installed.removable && !extension.fetchable) {
    return 'Pre-installed extension cannot be removed';
  }

  if (!installed.removable) {
    return 'Extension cannot be removed';
  }

  return 'Cannot be removed';
}

export function getExtensionRemovePreferenceDetail(extension: CatalogExtensionInfoUI): string {
  const blockedReason = getExtensionRemoveBlockedReason(extension);
  if (blockedReason) {
    return blockedReason;
  }

  return `Permanently remove ${extension.displayName} from Podman Desktop`;
}

export function matchesExtensionRemoveSearch(searchValue: string): boolean {
  if (!searchValue) {
    return true;
  }

  const lower = searchValue.toLowerCase();
  return lower.includes('remove') || EXTENSION_REMOVE_PREFERENCE_TITLE.toLowerCase().includes(lower);
}

export function removeExtensionWithConfirmation(
  extension: CatalogExtensionInfoUI,
  options?: RemoveExtensionOptions,
): void {
  const installed = extension.installedExtension;
  if (!installed || !canRemoveExtensionFromPreferences(extension)) {
    return;
  }

  withConfirmation(
    async () => {
      if (installed.type === 'dd') {
        await window.ddExtensionDelete(installed.id);
      } else {
        await window.removeExtension(installed.id);
      }
      clearNewBadge(extension.id);

      if (options?.redirectAfterRemove) {
        redirectToPreferencesMain(options.redirectAfterRemove);
      }
    },
    `remove ${extension.displayName}`,
    { title: 'Remove extension?', variant: 'delete', buttonLabel: 'Remove' },
  );
}
