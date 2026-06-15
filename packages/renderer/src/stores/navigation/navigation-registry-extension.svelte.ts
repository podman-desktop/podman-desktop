/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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

import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import type { ContributionInfo, WebviewInfo } from '@podman-desktop/core-api';

import { buildExtensionNewNavigationTooltip } from '/@/lib/extensions/extension-badge-styles';
import { isNewBadgeActive } from '/@/lib/extensions/extension-catalog-settings.svelte';
import ExtensionIcon from '/@/lib/images/ExtensionIcon.svelte';
import { contributions } from '/@/stores/contribs';
import { fetchWebviews, webviews } from '/@/stores/webviews';

import type { NavigationRegistryEntry } from './navigation-registry';

export function createNavigationExtensionEntry(): NavigationRegistryEntry {
  return {
    name: 'Extensions',
    icon: { iconComponent: ExtensionIcon },
    link: '/extensions',
    tooltip: 'Extensions',
    type: 'entry',
    counter: 0,
  };
}

/** Bumped when extension webview/contrib navigation items change. */
export const extensionNavigationGroupRevision = $state<{ value: number }>({ value: 0 });

/** Sidebar entries for installed extension webviews/contrib pages. */
export const extensionNavigationState = $state<{ items: NavigationRegistryEntry[] }>({ items: [] });

let allContribs: ContributionInfo[] = [];
let allWebviews: WebviewInfo[] = [];

function buildExtensionNavigationItems(
  contribs: ContributionInfo[],
  webviewItems: WebviewInfo[],
): NavigationRegistryEntry[] {
  const newItems: NavigationRegistryEntry[] = [];

  contribs.forEach(contrib => {
    const extensionId = contrib.extensionId;
    const isNew = extensionId ? isNewBadgeActive(extensionId) : false;

    newItems.push({
      name: contrib.name,
      icon: {
        iconImage: contrib.icon,
      },
      link: `/contribs/${contrib.name}`,
      type: 'entry',
      extensionId,
      tooltip: isNew ? buildExtensionNewNavigationTooltip(contrib.name) : contrib.name,
      counter: 0,
    });
  });

  webviewItems.forEach(webview => {
    const icon = webview.icon
      ? { iconImage: webview.icon }
      : { faIcon: { definition: faPuzzlePiece, size: '1.5x' as const } };
    const extensionId = webview.extensionId;
    const isNew = extensionId ? isNewBadgeActive(extensionId) : false;

    newItems.push({
      name: webview.name,
      icon,
      link: `/webviews/${webview.id}`,
      tooltip: isNew ? buildExtensionNewNavigationTooltip(webview.name) : webview.name,
      type: 'entry',
      extensionId,
      counter: 0,
    });
  });

  return newItems;
}

function createNavigationExtensionGroupShell(): NavigationRegistryEntry {
  return {
    name: 'Extensions',
    icon: { iconComponent: ExtensionIcon },
    link: `/extensions`,
    tooltip: 'Extensions',
    type: 'group',
    counter: 0,
    get items(): NavigationRegistryEntry[] {
      return extensionNavigationState.items;
    },
  };
}

function publishExtensionNavigationUpdate(): void {
  extensionNavigationState.items = buildExtensionNavigationItems(allContribs, allWebviews);
  extensionNavigationGroupRevision.value += 1;

  import('./navigation-registry')
    .then(mod => {
      if (mod.isNavigationRegistryInitialized()) {
        mod.replaceExtensionNavigationGroup(createNavigationExtensionGroupShell());
      }
      mod.refreshNavigationRegistryDisplay();
    })
    .catch((error: unknown) => {
      console.error('Unable to publish extension navigation update', error);
    });
}

/** Refresh extension nav tooltips/items after new-badge state changes. */
export function refreshExtensionNavigationItems(): void {
  publishExtensionNavigationUpdate();
}

let extensionNavigationSubscriptionsReady = false;
let extensionNavigationEventListenersReady = false;

function ensureExtensionNavigationSubscriptions(): void {
  if (extensionNavigationSubscriptionsReady) {
    return;
  }
  extensionNavigationSubscriptionsReady = true;

  contributions.subscribe(contribs => {
    allContribs = [...contribs];
    publishExtensionNavigationUpdate();
  });

  webviews.subscribe(webviewItems => {
    allWebviews = [...webviewItems];
    publishExtensionNavigationUpdate();
  });
}

function ensureExtensionNavigationEventListeners(): void {
  if (extensionNavigationEventListenersReady) {
    return;
  }
  extensionNavigationEventListenersReady = true;

  if (typeof window !== 'undefined' && window.events) {
    for (const eventName of [
      'extension-started',
      'extension-stopped',
      'extensions-started',
      'webview-create',
      'webview-delete',
      'webview-update',
    ] as const) {
      window.events.receive(eventName, () => {
        fetchWebviews()
          .finally(() => {
            publishExtensionNavigationUpdate();
          })
          .catch((error: unknown) => {
            console.error('Unable to fetch webviews for extension navigation', error);
          });
      });
    }
  }
}

// Module-level setup survives Vite HMR reloads of this file (init() only runs once).
ensureExtensionNavigationSubscriptions();
ensureExtensionNavigationEventListeners();

import('./navigation-registry')
  .then(mod => {
    if (mod.isNavigationRegistryInitialized()) {
      mod.replaceExtensionNavigationGroup(createNavigationExtensionGroupShell());
      publishExtensionNavigationUpdate();
    }
  })
  .catch((error: unknown) => {
    console.error('Unable to initialize extension navigation group', error);
  });

export function createNavigationExtensionGroup(): NavigationRegistryEntry {
  publishExtensionNavigationUpdate();
  return createNavigationExtensionGroupShell();
}
