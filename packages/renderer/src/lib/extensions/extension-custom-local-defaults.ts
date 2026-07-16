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

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';
import type { CombinedExtensionInfoUI } from '/@/stores/all-installed-extensions';

import { normalizeCustomExtensionKey } from './extension-custom-local';
import { getExtensionEffectiveLifecycleState } from './extension-effective-lifecycle-state';
import { EXAMPLE_CUSTOM_EXTENSION_OCI, EXAMPLE_LOCAL_EXTENSION_FOLDER } from './extension-install-examples';
import { isExplicitlyPrototypeRemoved } from './extension-prototype-use-cases';

/** Runtime id for the Install-custom example image. */
export const PROTOTYPE_DEFAULT_CUSTOM_EXTENSION_ID = 'podman-desktop.kubernetes-dashboard';

/** Runtime id for the sample local folder extension. */
export const PROTOTYPE_DEFAULT_LOCAL_EXTENSION_ID = 'podman-desktop-examples.hello-local-extension';

/** Paths hidden by uninstall in the current session (reappear after refresh). */
const hiddenPrototypeDefaultPaths = new Set<string>();

/** Bumped when default-row visibility changes (UI reactivity). */
export const prototypeDefaultCustomLocalRevision = { value: 0 };

function bumpPrototypeDefaultCustomLocalRevision(): void {
  prototypeDefaultCustomLocalRevision.value += 1;
}

export function hidePrototypeDefaultCustomLocalRow(path: string): void {
  if (hiddenPrototypeDefaultPaths.has(path)) {
    return;
  }
  hiddenPrototypeDefaultPaths.add(path);
  bumpPrototypeDefaultCustomLocalRevision();
}

export function clearPrototypeDefaultCustomLocalHiddenRows(): void {
  if (hiddenPrototypeDefaultPaths.size === 0) {
    return;
  }
  hiddenPrototypeDefaultPaths.clear();
  bumpPrototypeDefaultCustomLocalRevision();
}

export function isPrototypeDefaultCustomLocalPath(path: string): boolean {
  return path === EXAMPLE_CUSTOM_EXTENSION_OCI || path === EXAMPLE_LOCAL_EXTENSION_FOLDER;
}

function buildSyntheticInstalledExtension(
  id: string,
  name: string,
  displayName: string,
  path: string,
  state: string,
): CombinedExtensionInfoUI {
  const overlayState = getExtensionEffectiveLifecycleState(id, state);
  return {
    id,
    name,
    displayName,
    description: '',
    publisher: id.includes('.') ? id.split('.')[0] : '',
    removable: true,
    devMode: path === EXAMPLE_LOCAL_EXTENSION_FOLDER,
    version: '0.0.1',
    state: overlayState,
    path,
    readme: '',
    type: 'pd',
  };
}

function buildDefaultCustomRow(): SelectableExtensionDevelopmentFolderInfoUI {
  const installedExtension = buildSyntheticInstalledExtension(
    PROTOTYPE_DEFAULT_CUSTOM_EXTENSION_ID,
    'kubernetes-dashboard',
    'Kubernetes Dashboard',
    EXAMPLE_CUSTOM_EXTENSION_OCI,
    'started',
  );
  return {
    path: EXAMPLE_CUSTOM_EXTENSION_OCI,
    selected: false,
    name: installedExtension.displayName,
    source: 'custom',
    prototypeDefault: true,
    extension: {
      id: installedExtension.id,
      name: installedExtension.name,
      state: installedExtension.state,
    },
    installedExtension,
  };
}

function buildDefaultLocalRow(): SelectableExtensionDevelopmentFolderInfoUI {
  const installedExtension = buildSyntheticInstalledExtension(
    PROTOTYPE_DEFAULT_LOCAL_EXTENSION_ID,
    'hello-local-extension',
    'Hello Local Extension',
    EXAMPLE_LOCAL_EXTENSION_FOLDER,
    'started',
  );
  return {
    path: EXAMPLE_LOCAL_EXTENSION_FOLDER,
    selected: false,
    name: installedExtension.displayName,
    source: 'folder',
    prototypeDefault: true,
    extension: {
      id: installedExtension.id,
      name: installedExtension.name,
      state: installedExtension.state,
    },
    installedExtension,
  };
}

function rowCoversDefault(
  row: SelectableExtensionDevelopmentFolderInfoUI,
  defaultRow: SelectableExtensionDevelopmentFolderInfoUI,
): boolean {
  if (row.path === defaultRow.path) {
    return true;
  }
  const rowId = row.extension?.id ?? row.installedExtension?.id ?? '';
  const defaultId = defaultRow.extension?.id ?? '';
  if (rowId && defaultId && normalizeCustomExtensionKey(rowId) === normalizeCustomExtensionKey(defaultId)) {
    return true;
  }
  const rowName = row.extension?.name ?? row.installedExtension?.name ?? '';
  const defaultName = defaultRow.extension?.name ?? '';
  return (
    !!rowName && !!defaultName && normalizeCustomExtensionKey(rowName) === normalizeCustomExtensionKey(defaultName)
  );
}

/**
 * Ensure the Suggestion-scope Install custom/local tab always has the two
 * documented example rows after a prototype/session refresh, unless the user
 * explicitly uninstalled them in this session. Real tracked/installed rows win.
 */
export function mergePrototypeDefaultCustomLocalRows(
  realRows: readonly SelectableExtensionDevelopmentFolderInfoUI[],
): SelectableExtensionDevelopmentFolderInfoUI[] {
  const defaults = [buildDefaultCustomRow(), buildDefaultLocalRow()];
  const extras: SelectableExtensionDevelopmentFolderInfoUI[] = [];

  for (const defaultRow of defaults) {
    if (hiddenPrototypeDefaultPaths.has(defaultRow.path)) {
      continue;
    }
    const defaultId = defaultRow.extension?.id;
    if (defaultId && isExplicitlyPrototypeRemoved(defaultId)) {
      continue;
    }
    if (realRows.some(row => rowCoversDefault(row, defaultRow))) {
      continue;
    }
    extras.push(defaultRow);
  }

  return [...realRows, ...extras];
}
