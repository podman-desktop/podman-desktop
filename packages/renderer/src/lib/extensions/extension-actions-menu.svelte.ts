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

export const EXTENSION_ACTIONS_MENU_CHANGE_EVENT = 'extension-actions-menu-change';

let openMenuId: string | undefined;

export function getOpenExtensionActionsMenuId(): string | undefined {
  return openMenuId;
}

export function setOpenExtensionActionsMenuId(menuId: string | undefined): void {
  if (openMenuId === menuId) {
    return;
  }

  openMenuId = menuId;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EXTENSION_ACTIONS_MENU_CHANGE_EVENT));
  }
}

export function isExtensionActionsMenuOpen(menuId: string): boolean {
  return openMenuId === menuId;
}

export function resetOpenExtensionActionsMenuForTests(): void {
  openMenuId = undefined;
}
