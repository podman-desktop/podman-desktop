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

import { get } from 'svelte/store';

import { ContextKeyExpr } from '/@/lib/context/contextKey';
import { normalizeOnboardingWhenClause } from '/@/lib/onboarding/onboarding-utils';
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';
import { context } from '/@/stores/context';
import { onboardingList } from '/@/stores/onboarding';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { isAutoUpdateEnabled } from './extension-catalog-settings.svelte';
import { normalizeVersionValue } from './extension-version-update.svelte';

export interface ExtensionOnboardingStatus {
  enabled: boolean;
  detail: string;
}

export function resolveExtensionOnboardingStatus(extension?: CombinedExtensionInfoUI): ExtensionOnboardingStatus {
  if (!extension) {
    return { enabled: false, detail: 'Not configured' };
  }

  if (extension.type === 'dd') {
    return { enabled: false, detail: 'Not available for Docker Desktop extensions' };
  }

  const matchingOnboarding = get(onboardingList).findLast(
    onboarding => onboarding.extension === extension.id && onboarding.enablement,
  );

  if (!matchingOnboarding) {
    return { enabled: false, detail: 'Not configured' };
  }

  const enablement = normalizeOnboardingWhenClause(matchingOnboarding.enablement, extension.id);
  const whenDeserialized = ContextKeyExpr.deserialize(enablement);
  const isEnabled = whenDeserialized?.evaluate(get(context));

  if (!isEnabled) {
    return { enabled: false, detail: 'Not available in the current context' };
  }

  return { enabled: true, detail: '' };
}

function normalizeVersion(version?: string): string {
  return version?.replace(/^v/i, '').trim() ?? '';
}

export function extensionHasVersionUpdate(
  isInstalled: boolean,
  installedVersion?: string,
  fetchVersion?: string,
  hasUpdate?: boolean,
): boolean {
  if (hasUpdate) {
    return true;
  }

  return (
    isInstalled &&
    !!normalizeVersion(installedVersion) &&
    !!normalizeVersion(fetchVersion) &&
    normalizeVersion(installedVersion) !== normalizeVersion(fetchVersion)
  );
}

export function extensionRequiresManualUpdate(extension: CatalogExtensionInfoUI): boolean {
  return (
    extensionHasVersionUpdate(
      extension.isInstalled,
      extension.installedVersion,
      extension.fetchVersion,
      extension.hasUpdate,
    ) && !isAutoUpdateEnabled(extension.id)
  );
}

export function extensionHasOtherVersions(extension: CatalogExtensionInfoUI): boolean {
  const current = normalizeVersionValue(extension.installedVersion ?? extension.fetchVersion);
  if (!current) {
    return extension.availableVersions.some(version => !!normalizeVersionValue(version.version));
  }

  return extension.availableVersions.some(version => normalizeVersionValue(version.version) !== current);
}
