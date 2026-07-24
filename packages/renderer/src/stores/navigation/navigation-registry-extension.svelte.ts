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
import {
  EXTENSION_LIFECYCLE_USER_TOGGLE_EVENT,
  isExtensionUserDisabled,
  isExtensionUserEnabled,
} from '/@/lib/extensions/extension-lifecycle-user-toggle';
import { prototypeLifecycleOverlayRevisionStore } from '/@/lib/extensions/extension-prototype-lifecycle-overlay.svelte';
import {
  applyPrototypeUseCaseOverlays,
  getPrototypeSidebarEntries,
  isPrototypeRemovedExtension,
} from '/@/lib/extensions/extension-prototype-use-cases';
import { areExtensionsImprovementsSuggested } from '/@/lib/extensions/extensions-prototype-scope';
import ExtensionIcon from '/@/lib/images/ExtensionIcon.svelte';
import { type CombinedExtensionInfoUI, combinedInstalledExtensions } from '/@/stores/all-installed-extensions';
import { catalogExtensionInfos } from '/@/stores/catalog-extensions';
import { contributions } from '/@/stores/contribs';
import {
  type CatalogExtensionIdentity,
  resolveInstalledExtensionIdFromWebview,
} from '/@/stores/extension-webview-installed';
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
    destinations: [],
  };
}

/** Bumped when extension webview/contrib navigation items change. */
export const extensionNavigationGroupRevision = $state<{ value: number }>({ value: 0 });

/** Sidebar entries for installed extension webviews/contrib pages. */
export const extensionNavigationState = $state<{ items: NavigationRegistryEntry[] }>({ items: [] });

let allContribs: ContributionInfo[] = [];
let allWebviews: WebviewInfo[] = [];
let allCatalogIdentities: CatalogExtensionIdentity[] = [];
let allInstalledExtensions: CombinedExtensionInfoUI[] = [];
/** Latest non-preview catalog icon href keyed by catalog extension id. */
let catalogIconByExtensionId = new Map<string, string>();

function extensionIdsMatchNav(left: string, right: string): boolean {
  if (left === right) {
    return true;
  }
  const leftName = left.includes('.') ? left.split('.').slice(1).join('.') : left;
  const rightName = right.includes('.') ? right.split('.').slice(1).join('.') : right;
  return leftName === rightName || left.endsWith(`.${rightName}`) || right.endsWith(`.${leftName}`);
}

/**
 * In suggestion scope, hide sidebar entries for removed or disabled (stopped/stopping) extensions.
 * Exported for unit tests.
 */
export function shouldHideExtensionNavigationItem(...extensionIds: Array<string | undefined>): boolean {
  if (!areExtensionsImprovementsSuggested()) {
    return false;
  }

  const candidates = [...new Set(extensionIds.filter((id): id is string => !!id))];
  if (candidates.length === 0) {
    return false;
  }

  for (const id of candidates) {
    if (isPrototypeRemovedExtension(id)) {
      return true;
    }
  }

  for (const id of candidates) {
    if (isExtensionUserDisabled(id)) {
      return true;
    }
  }

  // Keep the nav item visible while / after the user re-enables (including starting).
  for (const id of candidates) {
    if (isExtensionUserEnabled(id)) {
      return false;
    }
  }

  const overlaid = applyPrototypeUseCaseOverlays(allInstalledExtensions);
  for (const id of candidates) {
    const match = overlaid.find(
      extension =>
        extensionIdsMatchNav(extension.id, id) ||
        (extension.name !== undefined && extensionIdsMatchNav(extension.name, id)),
    );
    if (match && (match.state === 'stopped' || match.state === 'stopping')) {
      return true;
    }
  }

  return false;
}

function resolveCatalogIconHref(extensionId: string | undefined): string | undefined {
  if (!extensionId) {
    return undefined;
  }
  const direct = catalogIconByExtensionId.get(extensionId);
  if (direct) {
    return direct;
  }
  for (const [id, icon] of catalogIconByExtensionId) {
    if (extensionIdsMatchNav(id, extensionId)) {
      return icon;
    }
  }
  return undefined;
}

function resolveNavEntryIcon(
  iconHref: string | undefined,
  extensionId: string | undefined,
): NavigationRegistryEntry['icon'] {
  const href = iconHref ?? resolveCatalogIconHref(extensionId);
  if (href) {
    return { iconImage: href };
  }
  return { faIcon: { definition: faPuzzlePiece, size: '1.5x' as const } };
}

function buildExtensionNavigationItems(
  contribs: ContributionInfo[],
  webviewItems: WebviewInfo[],
): NavigationRegistryEntry[] {
  const newItems: NavigationRegistryEntry[] = [];

  contribs.forEach(contrib => {
    // DD extensions (type: 'dd') register as contributions. Check both the raw extensionId
    // and any matching catalog id so that prototype-uninstalled / disabled DD extensions are hidden.
    if (shouldHideExtensionNavigationItem(contrib.extensionId)) {
      return;
    }

    const extensionId = contrib.extensionId;
    const isNew = extensionId ? isNewBadgeActive(extensionId) : false;

    newItems.push({
      name: contrib.name,
      icon: resolveNavEntryIcon(contrib.icon, extensionId),
      link: `/contribs/${contrib.name}`,
      type: 'entry',
      extensionId,
      tooltip: isNew ? buildExtensionNewNavigationTooltip(contrib.name) : contrib.name,
      counter: 0,
      destinations: [],
    });
  });

  webviewItems.forEach(webview => {
    const catalogId = resolveInstalledExtensionIdFromWebview(webview, allCatalogIdentities) ?? webview.extensionId;
    // Check both the resolved catalog id and the raw webview extensionId.
    // The stored prototype-removed / disabled id may use either format depending on which
    // code path triggered the change (e.g. Installed tab vs Catalog kebab menu).
    if (shouldHideExtensionNavigationItem(catalogId, webview.extensionId)) {
      return;
    }

    const webviewIcon = typeof webview.icon === 'string' ? webview.icon : undefined;
    const extensionId = webview.extensionId;
    const isNew = extensionId ? isNewBadgeActive(extensionId) : false;

    newItems.push({
      name: webview.name,
      icon: resolveNavEntryIcon(webviewIcon, catalogId ?? extensionId),
      link: `/webviews/${webview.id}`,
      tooltip: isNew ? buildExtensionNewNavigationTooltip(webview.name) : webview.name,
      type: 'entry',
      extensionId,
      counter: 0,
      destinations: [],
    });
  });

  // Prototype-restored extensions may have no live webview (e.g. AI Lab failed and
  // disposed its panel). Inject synthetic sidebar entries so the icon + post-install
  // tooltip still appear after a demo re-install.
  if (areExtensionsImprovementsSuggested()) {
    for (const entry of getPrototypeSidebarEntries()) {
      if (shouldHideExtensionNavigationItem(entry.extensionId)) {
        continue;
      }
      const alreadyPresent = newItems.some(item => {
        if (item.link === entry.link) {
          return true;
        }
        if (item.extensionId && extensionIdsMatchNav(item.extensionId, entry.extensionId)) {
          return true;
        }
        return false;
      });
      if (alreadyPresent) {
        continue;
      }

      // Also skip when a real webview already maps to this catalog extension.
      const hasMatchingWebview = webviewItems.some(webview => {
        const catalogId = resolveInstalledExtensionIdFromWebview(webview, allCatalogIdentities);
        return (
          (catalogId !== undefined && extensionIdsMatchNav(catalogId, entry.extensionId)) ||
          (webview.extensionId !== undefined && extensionIdsMatchNav(webview.extensionId, entry.extensionId))
        );
      });
      if (hasMatchingWebview) {
        continue;
      }

      const isNew = isNewBadgeActive(entry.extensionId);
      newItems.push({
        name: entry.name,
        icon: resolveNavEntryIcon(entry.iconHref, entry.extensionId),
        link: entry.link,
        tooltip: isNew ? buildExtensionNewNavigationTooltip(entry.name) : entry.name,
        type: 'entry',
        extensionId: entry.extensionId,
        counter: 0,
        destinations: [],
      });
    }
  }

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
    destinations: [],
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

  catalogExtensionInfos.subscribe(catalogs => {
    allCatalogIdentities = catalogs.map(c => ({
      id: c.id,
      displayName: c.displayName,
      extensionName: c.extensionName,
    }));

    const icons = new Map<string, string>();
    for (const catalog of catalogs) {
      const nonPreview = catalog.versions.filter(version => version.preview === false);
      const latest = nonPreview[0] ?? catalog.versions[0];
      const icon = latest?.files.find(file => file.assetType === 'icon')?.data;
      if (icon) {
        icons.set(catalog.id, icon);
      }
    }
    catalogIconByExtensionId = icons;
    // Catalog icons may load after webviews — rebuild so puzzle fallbacks are replaced.
    publishExtensionNavigationUpdate();
  });

  combinedInstalledExtensions.subscribe(extensions => {
    allInstalledExtensions = extensions;
    publishExtensionNavigationUpdate();
  });

  prototypeLifecycleOverlayRevisionStore.subscribe(() => {
    publishExtensionNavigationUpdate();
  });
}

function ensureExtensionNavigationEventListeners(): void {
  if (extensionNavigationEventListenersReady) {
    return;
  }
  extensionNavigationEventListenersReady = true;

  if (typeof window !== 'undefined') {
    window.addEventListener(EXTENSION_LIFECYCLE_USER_TOGGLE_EVENT, () => {
      publishExtensionNavigationUpdate();
    });

    if (window.events) {
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
