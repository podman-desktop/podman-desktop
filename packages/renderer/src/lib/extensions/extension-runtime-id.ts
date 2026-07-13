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

import type { ExtensionInfo, WebviewInfo } from '@podman-desktop/core-api';
import { get } from 'svelte/store';

import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import {
  type CatalogExtensionIdentity,
  resolveInstalledExtensionIdFromWebview,
} from '/@/stores/extension-webview-installed';
import { extensionInfos } from '/@/stores/extensions';
import { webviews } from '/@/stores/webviews';

export function toCatalogIdentities(
  catalogExtensions: ReadonlyArray<Pick<CatalogExtensionIdentity, 'id' | 'displayName' | 'extensionName'>>,
): CatalogExtensionIdentity[] {
  return catalogExtensions.map(catalog => ({
    id: catalog.id,
    displayName: catalog.displayName,
    extensionName: catalog.extensionName,
  }));
}

function extensionIdsMatch(left: string, right: string): boolean {
  if (left === right) {
    return true;
  }

  const leftName = left.includes('.') ? left.split('.').slice(1).join('.') : left;
  const rightName = right.includes('.') ? right.split('.').slice(1).join('.') : right;
  return leftName === rightName || left.endsWith(`.${rightName}`) || right.endsWith(`.${leftName}`);
}

function runtimeMatchesInstalled(
  runtime: Pick<ExtensionInfo, 'id' | 'name'>,
  installed: Pick<CombinedExtensionInfoUI, 'id' | 'name'>,
): boolean {
  return (
    runtime.id === installed.id ||
    runtime.name === installed.name ||
    extensionIdsMatch(runtime.id, installed.id) ||
    runtime.id.endsWith(`.${installed.name}`) ||
    installed.id.endsWith(`.${runtime.name}`)
  );
}

/** Resolve the backend extension id used for start/stop/remove API calls. */
export function resolveExtensionRuntimeId(
  installed: Pick<CombinedExtensionInfoUI, 'id' | 'name' | 'type'>,
  runtimeExtensions: ReadonlyArray<Pick<ExtensionInfo, 'id' | 'name'>>,
  webviewItems: WebviewInfo[] = [],
  catalogIdentities: CatalogExtensionIdentity[] = [],
): string {
  if (installed.type === 'dd') {
    return installed.id;
  }

  const runtimeById = new Map(runtimeExtensions.map(extension => [extension.id, extension]));

  if (runtimeById.has(installed.id)) {
    return installed.id;
  }

  for (const runtime of runtimeExtensions) {
    if (runtimeMatchesInstalled(runtime, installed)) {
      return runtime.id;
    }
  }

  for (const webview of webviewItems) {
    const catalogId = resolveInstalledExtensionIdFromWebview(webview, catalogIdentities);
    if (!catalogId || !extensionIdsMatch(catalogId, installed.id)) {
      continue;
    }

    if (webview.extensionId && runtimeById.has(webview.extensionId)) {
      return webview.extensionId;
    }
  }

  return installed.id;
}

export function resolveInstalledExtensionRuntimeId(
  installed: Pick<CombinedExtensionInfoUI, 'id' | 'name' | 'type'>,
): string {
  return resolveExtensionRuntimeId(
    installed,
    get(extensionInfos),
    get(webviews),
    toCatalogIdentities(get(catalogExtensionInfos)),
  );
}
