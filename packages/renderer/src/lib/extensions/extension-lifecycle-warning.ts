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

import type { ExtensionDetailsWarning } from './extension-details-warning';

export function isExtensionLifecycleActive(extensionState: string, extensionType: 'dd' | 'pd'): boolean {
  if (extensionType === 'dd') {
    return true;
  }
  return extensionState === 'started';
}

export function resolveExtensionLifecycleWarnings(
  extension?: Pick<CombinedExtensionInfoUI, 'state' | 'type' | 'displayName' | 'error'>,
): ExtensionDetailsWarning[] {
  if (!extension || isExtensionLifecycleActive(extension.state, extension.type)) {
    return [];
  }

  const displayName = extension.displayName;

  switch (extension.state) {
    case 'stopped':
      return [
        {
          key: 'disabled',
          severity: 'warning',
          title: 'Extension is disabled',
          detail: `${displayName} is installed but not running.`,
          fix: 'Open the actions menu (⋮) and select Reactivate.',
        },
      ];
    case 'failed': {
      const errorMessage = extension.error?.message?.trim();
      return [
        {
          key: 'failed',
          severity: 'error',
          title: 'Extension failed to start',
          detail: errorMessage ?? `${displayName} could not be activated.`,
          fix: 'Review the Error tab for details, then select Reactivate from the actions menu (⋮). If the problem continues, report a bug.',
        },
      ];
    }
    case 'starting':
      return [
        {
          key: 'activating',
          severity: 'warning',
          title: 'Extension is activating',
          detail: `${displayName} is starting and is not fully available yet.`,
          fix: 'Wait for activation to finish. If it remains in this state, select Reactivate from the actions menu (⋮).',
        },
      ];
    case 'stopping':
      return [
        {
          key: 'disabling',
          severity: 'warning',
          title: 'Extension is disabling',
          detail: `${displayName} is shutting down.`,
          fix: 'Wait for the process to finish. You can Reactivate it from the actions menu (⋮) once it is disabled.',
        },
      ];
    default:
      return [
        {
          key: `lifecycle-${extension.state}`,
          severity: 'warning',
          title: 'Extension is not active',
          detail: `${displayName} is in the "${extension.state}" state.`,
          fix: 'Open the actions menu (⋮) and select Reactivate to start this extension.',
        },
      ];
  }
}
