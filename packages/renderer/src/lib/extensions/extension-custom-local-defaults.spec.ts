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

import { beforeEach, describe, expect, test } from 'vitest';

import type { SelectableExtensionDevelopmentFolderInfoUI } from '/@/lib/extensions/dev-mode/development-folder-info-ui';

import {
  clearPrototypeDefaultCustomLocalHiddenRows,
  hidePrototypeDefaultCustomLocalRow,
  mergePrototypeDefaultCustomLocalRows,
  PROTOTYPE_DEFAULT_CUSTOM_EXTENSION_ID,
  PROTOTYPE_DEFAULT_LOCAL_EXTENSION_ID,
} from './extension-custom-local-defaults';
import { EXAMPLE_CUSTOM_EXTENSION_OCI, EXAMPLE_LOCAL_EXTENSION_FOLDER } from './extension-install-examples';
import {
  clearPrototypeRemovedExtensions,
  prototypeRemoveExtension,
  setPrototypeUseCasesEnabled,
} from './extension-prototype-use-cases';

beforeEach(() => {
  clearPrototypeDefaultCustomLocalHiddenRows();
  clearPrototypeRemovedExtensions();
  setPrototypeUseCasesEnabled(true);
});

describe('mergePrototypeDefaultCustomLocalRows', () => {
  test('seeds custom and local example rows when the list is empty', () => {
    const merged = mergePrototypeDefaultCustomLocalRows([]);
    expect(merged).toHaveLength(2);
    expect(merged.map(row => row.path)).toEqual([EXAMPLE_CUSTOM_EXTENSION_OCI, EXAMPLE_LOCAL_EXTENSION_FOLDER]);
    expect(merged.every(row => row.prototypeDefault)).toBe(true);
    expect(merged[0].extension?.id).toBe(PROTOTYPE_DEFAULT_CUSTOM_EXTENSION_ID);
    expect(merged[1].extension?.id).toBe(PROTOTYPE_DEFAULT_LOCAL_EXTENSION_ID);
  });

  test('does not duplicate when a real custom row already covers the example', () => {
    const real: SelectableExtensionDevelopmentFolderInfoUI = {
      path: '/tmp/kubernetes-dashboard',
      selected: false,
      name: 'Kubernetes Dashboard',
      source: 'custom',
      extension: {
        id: PROTOTYPE_DEFAULT_CUSTOM_EXTENSION_ID,
        name: 'kubernetes-dashboard',
        state: 'started',
      },
    };
    const merged = mergePrototypeDefaultCustomLocalRows([real]);
    expect(merged).toHaveLength(2);
    expect(merged[0]).toBe(real);
    expect(merged[1].path).toBe(EXAMPLE_LOCAL_EXTENSION_FOLDER);
  });

  test('hides a default row after uninstall until cleared', () => {
    hidePrototypeDefaultCustomLocalRow(EXAMPLE_CUSTOM_EXTENSION_OCI);
    const merged = mergePrototypeDefaultCustomLocalRows([]);
    expect(merged).toHaveLength(1);
    expect(merged[0].path).toBe(EXAMPLE_LOCAL_EXTENSION_FOLDER);

    clearPrototypeDefaultCustomLocalHiddenRows();
    expect(mergePrototypeDefaultCustomLocalRows([])).toHaveLength(2);
  });

  test('hides a default row when explicitly prototype-removed', () => {
    prototypeRemoveExtension(PROTOTYPE_DEFAULT_CUSTOM_EXTENSION_ID);
    const merged = mergePrototypeDefaultCustomLocalRows([]);
    expect(merged.map(row => row.path)).toEqual([EXAMPLE_LOCAL_EXTENSION_FOLDER]);
  });
});
