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

/**
 * Payload sent from the main process to the renderer when an extension calls
 * `navigation.pushHistoryEntry`, so the entry can be added to the global
 * back/forward navigation history stack.
 */
export interface NavigationHistoryPushInfo {
  extensionId: string;
  id: string;
  label: string;
  icon?: string | { readonly light: string; readonly dark: string };
}

/**
 * A single entry in the renderer's navigation history stack.
 * Regular (router-based) entries only carry a `url`. Entries pushed by an
 * extension via `navigation.pushHistoryEntry` also carry `extensionEntry`,
 * and `url` is a synthetic display value (never passed to the router).
 */
export interface HistoryStackEntry {
  url: string;
  extensionEntry?: NavigationHistoryPushInfo;
}
