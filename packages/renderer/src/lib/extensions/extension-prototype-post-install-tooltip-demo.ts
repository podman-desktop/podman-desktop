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

import { markNewlyInstalled } from '/@/lib/extensions/extension-catalog-settings.svelte';
import { findWebviewForExtension, queueExtensionNavPointer } from '/@/lib/extensions/extension-nav-pointer.svelte';
import { fetchWebviews, webviews } from '/@/stores/webviews';

import { arePrototypeUseCasesEnabled } from './extension-prototype-use-cases';

/**
 * Catalog extension IDs that can anchor the post-install sidebar tooltip in the prototype.
 * Install one of these (Podman AI Lab is the primary demo) then use Preview install tooltip.
 */
export const PROTOTYPE_POST_INSTALL_TOOLTIP_CANDIDATES = ['redhat.ai-lab', 'redhat.bootable-containers'] as const;

/**
 * Bundled extension with a real onboarding flow used when Learn is clicked from the prototype tooltip.
 * Podman Setup is always registered and works without extra catalog installs.
 */
export const PROTOTYPE_ONBOARDING_ROUTE_EXTENSION_ID = 'podman-desktop.podman';

export function arePrototypePostInstallTooltipDemosEnabled(): boolean {
  return arePrototypeUseCasesEnabled();
}

export function isPrototypePostInstallTooltipTarget(extensionId: string): boolean {
  return (PROTOTYPE_POST_INSTALL_TOOLTIP_CANDIDATES as readonly string[]).includes(extensionId);
}

export function getPrototypeOnboardingRouteExtensionId(pointerExtensionId: string): string {
  if (isPrototypePostInstallTooltipTarget(pointerExtensionId)) {
    return PROTOTYPE_ONBOARDING_ROUTE_EXTENSION_ID;
  }
  return pointerExtensionId;
}

export async function findPostInstallTooltipDemoTarget(): Promise<string | undefined> {
  await fetchWebviews();

  const allWebviews = get(webviews) ?? [];

  for (const extensionId of PROTOTYPE_POST_INSTALL_TOOLTIP_CANDIDATES) {
    if (findWebviewForExtension(extensionId, allWebviews)) {
      return extensionId;
    }
  }

  const catalogWebview = allWebviews.find(item => {
    const extensionId = item.extensionId;
    return extensionId !== undefined && (extensionId.startsWith('redhat.') || extensionId.includes('.'));
  });
  return catalogWebview?.extensionId;
}

/** Show the post-install nav tooltip demo (New badge + callout with Learn). */
export async function showPostInstallTooltipDemo(): Promise<{ shown: boolean; message?: string }> {
  if (!arePrototypePostInstallTooltipDemosEnabled()) {
    return { shown: false, message: 'Prototype demos are disabled.' };
  }

  const extensionId = await findPostInstallTooltipDemoTarget();
  if (!extensionId) {
    return {
      shown: false,
      message:
        'Install Podman AI Lab or Bootable Containers first, then preview the install tooltip from the Catalog tab.',
    };
  }

  markNewlyInstalled(extensionId);
  queueExtensionNavPointer(extensionId);
  return { shown: true };
}
