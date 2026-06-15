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
import {
  arePrototypePostInstallTooltipDemosEnabled,
  getPrototypeOnboardingRouteExtensionId,
  isPrototypePostInstallTooltipTarget,
} from './extension-prototype-post-install-tooltip-demo';
import { normalizeVersionValue } from './extension-version-update.svelte';

export interface ExtensionOnboardingStatus {
  enabled: boolean;
  detail: string;
}

export function resolveExtensionOnboardingStatusById(extensionId: string): ExtensionOnboardingStatus {
  return resolveExtensionOnboardingStatus({
    id: extensionId,
    type: 'extension',
    state: 'started',
    name: extensionId,
    removable: true,
    devMode: false,
  });
}

/** Extension id used when opening onboarding (supports prototype routing for catalog demos). */
export function resolveOnboardingRouteExtensionId(extensionId: string): string {
  if (arePrototypePostInstallTooltipDemosEnabled() && isPrototypePostInstallTooltipTarget(extensionId)) {
    return getPrototypeOnboardingRouteExtensionId(extensionId);
  }
  return extensionId;
}

function resolveOnboardingStatusForExtensionId(extensionId: string): ExtensionOnboardingStatus {
  const matchingOnboarding = get(onboardingList).findLast(onboarding => onboarding.extension === extensionId);

  if (!matchingOnboarding) {
    return { enabled: false, detail: 'Not configured' };
  }

  const enablement = matchingOnboarding.enablement?.trim();
  if (!enablement) {
    return { enabled: true, detail: '' };
  }

  const normalizedEnablement = normalizeOnboardingWhenClause(enablement, extensionId);
  const whenDeserialized = ContextKeyExpr.deserialize(normalizedEnablement);
  const isEnabled = whenDeserialized?.evaluate(get(context));

  if (!isEnabled) {
    return { enabled: false, detail: 'Not available in the current context' };
  }

  return { enabled: true, detail: '' };
}

export function resolveExtensionOnboardingStatus(extension?: CombinedExtensionInfoUI): ExtensionOnboardingStatus {
  if (!extension) {
    return { enabled: false, detail: 'Not configured' };
  }

  if (extension.type === 'dd') {
    return { enabled: false, detail: 'Not available for Docker Desktop extensions' };
  }

  const directStatus = resolveOnboardingStatusForExtensionId(extension.id);
  if (directStatus.enabled) {
    return directStatus;
  }

  if (arePrototypePostInstallTooltipDemosEnabled() && isPrototypePostInstallTooltipTarget(extension.id)) {
    const routedStatus = resolveOnboardingStatusForExtensionId(getPrototypeOnboardingRouteExtensionId(extension.id));
    if (routedStatus.enabled) {
      return { enabled: true, detail: '' };
    }
    return { enabled: true, detail: '' };
  }

  return directStatus;
}

/** Resolve onboarding for catalog cards using catalog id as the source of truth. */
export function resolveCatalogExtensionOnboardingStatus(
  catalogExtension: CatalogExtensionInfoUI,
): ExtensionOnboardingStatus {
  const installed = catalogExtension.installedExtension;
  if (installed?.type === 'dd') {
    return { enabled: false, detail: 'Not available for Docker Desktop extensions' };
  }

  const extensionId = installed?.id ?? catalogExtension.id;
  return resolveExtensionOnboardingStatusById(extensionId);
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
