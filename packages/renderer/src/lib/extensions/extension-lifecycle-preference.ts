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

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { canToggleExtensionLifecycle, isExtensionLifecycleEnabled } from './extension-lifecycle-toggle';

export const EXTENSION_LIFECYCLE_PREFERENCE_TITLE = 'Enabled';

export function shouldShowExtensionLifecyclePreference(extension?: CatalogExtensionInfoUI): boolean {
  return !!extension?.isInstalled && !extension.installedExtension?.devMode;
}

export function isExtensionLifecyclePreferenceChecked(extension: CatalogExtensionInfoUI): boolean {
  return isExtensionLifecycleEnabled(extension.installedExtension?.state ?? '');
}

export function canChangeExtensionLifecyclePreference(extension: CatalogExtensionInfoUI): boolean {
  return canToggleExtensionLifecycle(extension.installedExtension?.state ?? '');
}

export function getExtensionLifecyclePreferenceDetail(extension: CatalogExtensionInfoUI): string {
  const state = extension.installedExtension?.state ?? '';

  if (state === 'starting') {
    return 'Extension is starting';
  }

  if (state === 'stopping') {
    return 'Extension is stopping';
  }

  if (!canToggleExtensionLifecycle(state)) {
    return 'Extension state cannot be changed in the current state';
  }

  if (isExtensionLifecycleEnabled(state)) {
    return 'Extension is running and available in Podman Desktop';
  }

  return 'Extension is stopped and not available in Podman Desktop';
}

export function matchesExtensionLifecycleSearch(searchValue: string): boolean {
  if (!searchValue) {
    return true;
  }

  const lower = searchValue.toLowerCase();
  return (
    lower.includes('enable') ||
    lower.includes('disable') ||
    lower.includes('enabled') ||
    EXTENSION_LIFECYCLE_PREFERENCE_TITLE.toLowerCase().includes(lower)
  );
}

export async function toggleExtensionLifecyclePreference(
  extension: CatalogExtensionInfoUI,
  enabling: boolean,
): Promise<void> {
  const installed = extension.installedExtension;
  if (!installed || !canChangeExtensionLifecyclePreference(extension)) {
    return;
  }

  if (enabling) {
    await window.startExtension(installed.id);
    return;
  }

  await window.stopExtension(installed.id);
}
