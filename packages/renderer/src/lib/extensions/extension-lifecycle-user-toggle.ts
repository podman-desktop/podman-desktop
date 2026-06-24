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

export const EXTENSION_LIFECYCLE_USER_TOGGLE_EVENT = 'extension-lifecycle-user-toggle';

const userDisabledExtensionIds = new Set<string>();
const userEnabledExtensionIds = new Set<string>();

function notifyLifecycleUserToggle(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EXTENSION_LIFECYCLE_USER_TOGGLE_EVENT));
  }
}

export function markExtensionUserDisabled(extensionId: string): void {
  userDisabledExtensionIds.add(extensionId);
  userEnabledExtensionIds.delete(extensionId);
  notifyLifecycleUserToggle();
}

export function markExtensionUserEnabled(extensionId: string): void {
  userEnabledExtensionIds.add(extensionId);
  userDisabledExtensionIds.delete(extensionId);
  notifyLifecycleUserToggle();
}

export function isExtensionUserDisabled(extensionId: string): boolean {
  return userDisabledExtensionIds.has(extensionId);
}

export function isExtensionUserEnabled(extensionId: string): boolean {
  return userEnabledExtensionIds.has(extensionId);
}

export function resetExtensionLifecycleUserTogglesForTests(): void {
  userDisabledExtensionIds.clear();
  userEnabledExtensionIds.clear();
}
