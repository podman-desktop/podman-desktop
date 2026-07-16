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

import { isExtensionUserDisabled, isExtensionUserEnabled } from './extension-lifecycle-user-toggle';
import { getPrototypeTransientLifecycleState } from './extension-prototype-lifecycle-overlay.svelte';

/**
 * Resolve the status label state for an extension, including Suggestion-scope
 * Enabling/Disabling overlays (same rules Catalog/Installed tables use).
 */
export function getExtensionEffectiveLifecycleState(extensionId: string, baseState: string): string {
  const transient = getPrototypeTransientLifecycleState(extensionId);
  if (transient) {
    return transient;
  }

  if (isExtensionUserDisabled(extensionId)) {
    return baseState === 'stopping' ? 'stopping' : 'stopped';
  }

  if (isExtensionUserEnabled(extensionId) && (baseState === 'stopped' || baseState === 'failed')) {
    return 'started';
  }

  return baseState;
}
