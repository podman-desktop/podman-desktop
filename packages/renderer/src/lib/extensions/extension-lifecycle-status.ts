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

import type { ExtensionCompatibilityIssue } from './extension-compatibility';

export interface ExtensionLifecyclePresentation {
  statusDotStatus: string;
  label: string;
  textColorVar: string;
}

export function getExtensionCompatibilityPresentation(
  issue: ExtensionCompatibilityIssue,
): ExtensionLifecyclePresentation {
  if (issue.type === 'incompatible-version') {
    return {
      statusDotStatus: 'degraded',
      label: 'Incompatible',
      textColorVar: 'var(--pd-state-warning)',
    };
  }

  return {
    statusDotStatus: 'degraded',
    label: 'Missing dependency',
    textColorVar: 'var(--pd-state-warning)',
  };
}

export function getExtensionVersionUpdatePresentation(): ExtensionLifecyclePresentation {
  return {
    statusDotStatus: 'stopped',
    label: 'Upgrading',
    textColorVar: 'var(--pd-status-stopped)',
  };
}

export function getExtensionLifecyclePresentation(
  extensionState: string,
  extensionType: 'dd' | 'pd',
): ExtensionLifecyclePresentation {
  if (extensionType === 'dd') {
    return {
      statusDotStatus: 'running',
      label: 'Active',
      textColorVar: 'var(--pd-status-running)',
    };
  }

  switch (extensionState) {
    case 'started':
      return {
        statusDotStatus: 'running',
        label: 'Active',
        textColorVar: 'var(--pd-status-running)',
      };
    case 'stopped':
      return {
        statusDotStatus: 'stopped',
        label: 'Disabled',
        textColorVar: 'var(--pd-status-stopped)',
      };
    case 'starting':
      return {
        statusDotStatus: 'starting',
        label: 'Activating',
        textColorVar: 'var(--pd-status-starting)',
      };
    case 'stopping':
      return {
        statusDotStatus: 'waiting',
        label: 'Disabling',
        textColorVar: 'var(--pd-status-waiting)',
      };
    case 'failed':
      return {
        statusDotStatus: 'terminated',
        label: 'Failed',
        textColorVar: 'var(--pd-status-terminated)',
      };
    default:
      return {
        statusDotStatus: 'unknown',
        label: extensionState,
        textColorVar: 'var(--pd-status-unknown)',
      };
  }
}
