/**********************************************************************
 * Copyright (C) 2025-2026 Red Hat, Inc.
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

import { areExtensionsImprovementsSuggested } from './extensions-prototype-scope';

const screens = ['installed', 'catalog', 'development'] as const;

export type ExtensionListScreen = (typeof screens)[number];

interface ExtensionListRequest {
  searchTerm: string;
  screen: ExtensionListScreen;
}

interface ExtensionDetailsRequest {
  returnScreen: ExtensionListScreen;
}

export function getDefaultExtensionListScreen(): ExtensionListScreen {
  return areExtensionsImprovementsSuggested() ? 'catalog' : 'installed';
}

export function buildExtensionsListPath(screen?: ExtensionListScreen, searchTerm = ''): string {
  const resolved = screen ?? getDefaultExtensionListScreen();
  const params = new URLSearchParams();
  if (resolved !== getDefaultExtensionListScreen()) {
    params.set('screen', resolved);
  }
  if (searchTerm) {
    params.set('searchTerm', searchTerm);
  }
  const query = params.toString();
  return query ? `/extensions?${query}` : '/extensions/';
}

export function buildExtensionDetailsPath(id: string, returnScreen?: ExtensionListScreen): string {
  const resolvedReturn = returnScreen ?? getDefaultExtensionListScreen();
  const params = new URLSearchParams();
  if (resolvedReturn !== getDefaultExtensionListScreen()) {
    params.set('returnScreen', resolvedReturn);
  }
  const query = params.toString();
  const path = `/extensions/details/${encodeURIComponent(id)}/`;
  return query ? `${path}?${query}` : path;
}

export function parseExtensionDetailsRequest(request: { query?: Record<string, string> }): ExtensionDetailsRequest {
  return {
    returnScreen: screens.includes(request.query?.returnScreen as ExtensionListScreen)
      ? (request.query?.returnScreen as ExtensionListScreen)
      : getDefaultExtensionListScreen(),
  };
}

export function parseExtensionListRequest(request: { query?: Record<string, string> }): ExtensionListRequest {
  return {
    searchTerm: request.query?.searchTerm ? decodeURIComponent(request.query.searchTerm) : '',
    screen: screens.includes(request.query?.screen as ExtensionListScreen)
      ? (request.query?.screen as ExtensionListScreen)
      : getDefaultExtensionListScreen(),
  };
}
