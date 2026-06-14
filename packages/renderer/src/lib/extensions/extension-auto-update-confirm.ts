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
import { extensionHasVersionUpdate } from './extension-onboarding-utils';

export function getExtensionAutoUpdateConfirmDetail(extension: CatalogExtensionInfoUI, enabling: boolean): string {
  const hasPendingUpdate = extensionHasVersionUpdate(
    extension.isInstalled,
    extension.installedVersion,
    extension.fetchVersion,
    extension.hasUpdate,
  );

  if (enabling) {
    if (hasPendingUpdate && extension.fetchVersion) {
      return `The available update to v${extension.fetchVersion} will be installed automatically. Future updates will also install without manual action.`;
    }
    return 'New updates will be automatically installed when they become available.';
  }

  return 'You will need to install updates manually using the Update link or Change version action.';
}

export async function confirmExtensionAutoUpdateChange(
  extension: CatalogExtensionInfoUI,
  enabling: boolean,
): Promise<boolean> {
  const result = await window.showMessageBox({
    type: 'question',
    title: enabling
      ? `Enable automatic updates for ${extension.displayName}?`
      : `Disable automatic updates for ${extension.displayName}?`,
    detail: getExtensionAutoUpdateConfirmDetail(extension, enabling),
    buttons: [enabling ? 'Enable' : 'Disable', 'Cancel'],
    defaultId: 0,
    cancelId: 1,
  });

  return result?.response === 0;
}
