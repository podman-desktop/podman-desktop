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

import type { ContextMenuAction, OpenMode } from '@podman-desktop/ui-svelte';
import { router } from 'tinro';

import { tabPreferences } from '/@/stores/layout/tab-preferences.svelte';

export function openContainerInWorkspace(container: { id: string; name: string }, _mode: OpenMode): void {
  router.goto(`/containers/${encodeURIComponent(container.id)}/${tabPreferences.tabsEnabled ? 'summary' : ''}`);
}

export function openPodInWorkspace(pod: { name: string; engineId: string }, _mode: OpenMode): void {
  router.goto(
    `/pods/podman/${encodeURIComponent(pod.name)}/${encodeURIComponent(pod.engineId)}/${tabPreferences.tabsEnabled ? 'summary' : ''}`,
  );
}

export function openImageInWorkspace(
  image: { id: string; engineId: string; name: string; tag: string; base64RepoTag: string },
  _mode: OpenMode,
): void {
  router.goto(
    `/images/${encodeURIComponent(image.id)}/${encodeURIComponent(image.engineId)}/${image.base64RepoTag}/summary`,
  );
}

export function buildOpenContextMenuActions(open: (mode: OpenMode) => void): ContextMenuAction[] {
  const actions: ContextMenuAction[] = [
    { id: 'open', title: 'Open', iconClass: 'fas fa-arrow-right', onSelect: (): void => open('replace') },
  ];
  if (tabPreferences.tabsEnabled)
    actions.push({
      id: 'open-new-tab',
      title: 'Open in New Tab',
      iconClass: 'fas fa-plus',
      onSelect: (): void => open('newTab'),
    });
  return actions;
}
