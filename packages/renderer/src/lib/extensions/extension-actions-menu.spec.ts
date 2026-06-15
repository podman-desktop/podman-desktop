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
 *********************************************************************/

import { afterEach, describe, expect, test } from 'vitest';

import {
  getOpenExtensionActionsMenuId,
  isExtensionActionsMenuOpen,
  resetOpenExtensionActionsMenuForTests,
  setOpenExtensionActionsMenuId,
} from './extension-actions-menu.svelte';

describe('extension-actions-menu', () => {
  afterEach(() => {
    resetOpenExtensionActionsMenuForTests();
  });

  test('tracks the currently open menu id', () => {
    setOpenExtensionActionsMenuId('podman-desktop.kind');
    expect(getOpenExtensionActionsMenuId()).toBe('podman-desktop.kind');
    expect(isExtensionActionsMenuOpen('podman-desktop.kind')).toBe(true);
    expect(isExtensionActionsMenuOpen('podman-desktop.compose')).toBe(false);

    setOpenExtensionActionsMenuId(undefined);
    expect(getOpenExtensionActionsMenuId()).toBeUndefined();
  });

  test('only one menu id can be open at a time', () => {
    setOpenExtensionActionsMenuId('podman-desktop.compose');
    setOpenExtensionActionsMenuId('podman-desktop.docker');

    expect(getOpenExtensionActionsMenuId()).toBe('podman-desktop.docker');
    expect(isExtensionActionsMenuOpen('podman-desktop.compose')).toBe(false);
    expect(isExtensionActionsMenuOpen('podman-desktop.docker')).toBe(true);
  });
});
