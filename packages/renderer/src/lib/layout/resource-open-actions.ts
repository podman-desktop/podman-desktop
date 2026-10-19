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
import { openRouteInBackgroundTab } from '/@/stores/layout/tabs.svelte';

export function openContainerInWorkspace(container: { id: string; name: string }, mode: OpenMode): void {
  const url = `/containers/${encodeURIComponent(container.id)}/${tabPreferences.tabsEnabled ? 'summary' : ''}`;
  if (mode === 'newTab' && tabPreferences.tabsEnabled) {
    openRouteInBackgroundTab(url, container.name);
    return;
  }
  router.goto(url);
}

export function openPodInWorkspace(pod: { name: string; engineId: string }, mode: OpenMode): void {
  const url = `/pods/podman/${encodeURIComponent(pod.name)}/${encodeURIComponent(pod.engineId)}/${tabPreferences.tabsEnabled ? 'summary' : ''}`;
  if (mode === 'newTab' && tabPreferences.tabsEnabled) {
    openRouteInBackgroundTab(url, pod.name);
    return;
  }
  router.goto(url);
}

export function openImageInWorkspace(
  image: { id: string; engineId: string; name: string; tag: string; base64RepoTag: string },
  mode: OpenMode,
): void {
  const url = `/images/${encodeURIComponent(image.id)}/${encodeURIComponent(image.engineId)}/${image.base64RepoTag}/summary`;
  if (mode === 'newTab' && tabPreferences.tabsEnabled) {
    openRouteInBackgroundTab(url, `${image.name}:${image.tag}`);
    return;
  }
  router.goto(url);
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
