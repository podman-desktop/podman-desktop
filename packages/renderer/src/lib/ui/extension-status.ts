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

export type ExtensionLifecycleState =
  | 'installed'
  | 'disabled'
  | 'enabling'
  | 'disabling'
  | 'missing-dependency'
  | 'failed'
  | 'incompatible'
  | 'upgrading'
  | 'downgrading';

export type ExtensionStatusIcon =
  | 'running'
  | 'stopped'
  | 'waiting'
  | 'degraded'
  | 'terminated'
  | 'upgrading'
  | 'downgrading'
  | 'downloadable'
  | 'unknown';

export interface ExtensionStatusPresentation {
  icon: ExtensionStatusIcon;
  textClass: string;
  label: string;
}

export const extensionStatusPresentations: Record<ExtensionLifecycleState, ExtensionStatusPresentation> = {
  installed: {
    icon: 'running',
    textClass: 'text-(--pd-status-running)',
    label: 'Installed',
  },
  disabled: {
    icon: 'stopped',
    textClass: 'text-(--pd-status-stopped)',
    label: 'Disabled',
  },
  enabling: {
    icon: 'waiting',
    textClass: 'text-(--pd-status-waiting)',
    label: 'Enabling',
  },
  disabling: {
    icon: 'waiting',
    textClass: 'text-(--pd-status-waiting)',
    label: 'Disabling',
  },
  'missing-dependency': {
    icon: 'degraded',
    textClass: 'text-(--pd-status-degraded)',
    label: 'Missing dependency',
  },
  failed: {
    icon: 'terminated',
    textClass: 'text-(--pd-status-terminated)',
    label: 'Failed',
  },
  incompatible: {
    icon: 'degraded',
    textClass: 'text-(--pd-status-degraded)',
    label: 'Incompatible',
  },
  upgrading: {
    icon: 'upgrading',
    textClass: 'text-(--pd-status-waiting)',
    label: 'Upgrading',
  },
  downgrading: {
    icon: 'downgrading',
    textClass: 'text-(--pd-status-waiting)',
    label: 'Downgrading',
  },
};

const extensionStateToLifecycleState: Readonly<Record<string, ExtensionLifecycleState>> = {
  started: 'installed',
  starting: 'enabling',
  stopped: 'disabled',
  stopping: 'disabling',
  failed: 'failed',
};

export function toExtensionLifecycleState(status: string): ExtensionLifecycleState | undefined {
  if (Object.hasOwn(extensionStatusPresentations, status)) {
    return status as ExtensionLifecycleState;
  }
  if (Object.hasOwn(extensionStateToLifecycleState, status)) {
    return extensionStateToLifecycleState[status];
  }
  return undefined;
}

export function getExtensionStatusPresentation(status: string): ExtensionStatusPresentation {
  const lifecycleState = toExtensionLifecycleState(status);
  if (lifecycleState) {
    return extensionStatusPresentations[lifecycleState];
  }
  if (status === 'downloadable') {
    return {
      icon: 'downloadable',
      textClass: 'text-(--pd-status-ready)',
      label: 'Downloadable',
    };
  }
  return {
    icon: 'unknown',
    textClass: 'text-(--pd-status-unknown)',
    label: status.toUpperCase(),
  };
}
