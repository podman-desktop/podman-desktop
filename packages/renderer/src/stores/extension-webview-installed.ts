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

import type { WebviewInfo } from '@podman-desktop/core-api';

import type { CombinedExtensionInfoUI } from './all-installed-extensions';

export interface CatalogExtensionIdentity {
  id: string;
  displayName: string;
  extensionName: string;
}

function normalizeLabel(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, ' ');
}

function webviewNameMatchesCatalog(webviewName: string, catalog: CatalogExtensionIdentity): boolean {
  const normalizedWebviewName = normalizeLabel(webviewName);
  const normalizedDisplayName = normalizeLabel(catalog.displayName);
  const normalizedExtensionName = normalizeLabel(catalog.extensionName.replace(/-/g, ' '));

  if (normalizedDisplayName === normalizedWebviewName || normalizedExtensionName === normalizedWebviewName) {
    return true;
  }

  return (
    normalizedDisplayName.endsWith(` ${normalizedWebviewName}`) ||
    normalizedWebviewName.endsWith(` ${normalizedExtensionName}`)
  );
}

function findCatalogByWebviewName(
  webviewName: string,
  catalogIdentities: CatalogExtensionIdentity[],
): CatalogExtensionIdentity | undefined {
  const matches = catalogIdentities.filter(catalog => webviewNameMatchesCatalog(webviewName, catalog));
  return matches.length === 1 ? matches[0] : undefined;
}

function findCatalogByExtensionId(
  extensionId: string,
  catalogIdentities: CatalogExtensionIdentity[],
): CatalogExtensionIdentity | undefined {
  const exact = catalogIdentities.find(catalog => catalog.id === extensionId);
  if (exact) {
    return exact;
  }

  const extensionName = extensionId.includes('.') ? extensionId.split('.').slice(1).join('.') : extensionId;
  const byExtensionName = catalogIdentities.filter(catalog => catalog.extensionName === extensionName);
  return byExtensionName.length === 1 ? byExtensionName[0] : undefined;
}

export function resolveInstalledExtensionIdFromWebview(
  webview: WebviewInfo,
  catalogIdentities: CatalogExtensionIdentity[] = [],
): string | undefined {
  const byWebviewName = findCatalogByWebviewName(webview.name, catalogIdentities);
  if (byWebviewName) {
    return byWebviewName.id;
  }

  if (webview.extensionId) {
    const byExtensionId = findCatalogByExtensionId(webview.extensionId, catalogIdentities);
    if (byExtensionId) {
      return byExtensionId.id;
    }
  }

  if (webview.extensionId?.includes('.')) {
    return webview.extensionId;
  }

  return webview.extensionId || undefined;
}

export function synthesizeInstalledExtensionFromWebview(
  webview: WebviewInfo,
  extensionId: string,
): CombinedExtensionInfoUI {
  const segments = extensionId.split('.');
  const publisher = segments[0] ?? 'unknown';
  const name = segments.slice(1).join('.') || extensionId;

  return {
    id: extensionId,
    name,
    displayName: webview.name,
    description: '',
    publisher,
    version: '',
    state: 'started',
    removable: true,
    devMode: false,
    path: webview.sourcePath,
    readme: '',
    icon: typeof webview.icon === 'string' ? webview.icon : undefined,
    type: 'pd',
  };
}

function extensionIdsMatch(left: string, right: string): boolean {
  if (left === right) {
    return true;
  }

  const leftName = left.includes('.') ? left.split('.').slice(1).join('.') : left;
  const rightName = right.includes('.') ? right.split('.').slice(1).join('.') : right;
  return leftName === rightName || left.endsWith(`.${rightName}`) || right.endsWith(`.${leftName}`);
}

export function mergeWebviewInstalledExtensions(
  extensions: CombinedExtensionInfoUI[],
  webviewItems: WebviewInfo[],
  catalogIdentities: CatalogExtensionIdentity[] = [],
): CombinedExtensionInfoUI[] {
  const byId = new Map(extensions.map(extension => [extension.id, extension]));

  for (const webview of webviewItems) {
    const extensionId = resolveInstalledExtensionIdFromWebview(webview, catalogIdentities);
    if (!extensionId) {
      continue;
    }

    const alreadyPresent =
      byId.has(extensionId) ||
      Array.from(byId.values()).some(extension => extensionIdsMatch(extension.id, extensionId));

    if (alreadyPresent) {
      continue;
    }

    byId.set(extensionId, synthesizeInstalledExtensionFromWebview(webview, extensionId));
  }

  const merged = Array.from(byId.values());
  merged.sort((a, b) => a.displayName.localeCompare(b.displayName));
  return merged;
}
