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

import { SvelteMap } from 'svelte/reactivity';

import type { CatalogExtensionInfoUI } from './catalog-extension-info-ui';
import { setAutoUpdateEnabled } from './extension-catalog-settings.svelte';

export interface ExtensionVersionUpdateState {
  status: 'updating' | 'error';
  message: string;
  targetVersion: string;
}

const versionUpdateStates = new SvelteMap<string, ExtensionVersionUpdateState>();

export function getExtensionVersionUpdateState(extensionId: string): ExtensionVersionUpdateState | undefined {
  return versionUpdateStates.get(extensionId);
}

export function clearExtensionVersionUpdateState(extensionId: string): void {
  versionUpdateStates.delete(extensionId);
}

export function normalizeVersionValue(value: unknown): string {
  if (typeof value === 'string') {
    return value.replace(/^v/i, '').trim();
  }
  if (value && typeof value === 'object' && 'version' in value) {
    return normalizeVersionValue((value as { version: unknown }).version);
  }
  return '';
}

export async function applyExtensionVersionChange(
  extension: CatalogExtensionInfoUI,
  targetVersion: string,
  autoUpdateEnabled: boolean,
): Promise<void> {
  const normalizedTarget = normalizeVersionValue(targetVersion);
  const target = extension.availableVersions.find(
    version => normalizeVersionValue(version.version) === normalizedTarget,
  );

  if (!target?.ociUri) {
    versionUpdateStates.set(extension.id, {
      status: 'error',
      message: 'Selected version is not available for installation.',
      targetVersion: normalizedTarget,
    });
    return;
  }

  versionUpdateStates.set(extension.id, {
    status: 'updating',
    message: 'Version update...',
    targetVersion: normalizedTarget,
  });

  setAutoUpdateEnabled(extension.id, autoUpdateEnabled);

  try {
    await window.extensionInstallFromImage(
      target.ociUri,
      () => {
        versionUpdateStates.set(extension.id, {
          status: 'updating',
          message: 'Version update...',
          targetVersion: normalizedTarget,
        });
      },
      (error: string) => {
        versionUpdateStates.set(extension.id, {
          status: 'error',
          message: error,
          targetVersion: normalizedTarget,
        });
      },
      extension.id,
    );
    versionUpdateStates.delete(extension.id);
  } catch (error) {
    versionUpdateStates.set(extension.id, {
      status: 'error',
      message: String(error),
      targetVersion: normalizedTarget,
    });
  }
}
