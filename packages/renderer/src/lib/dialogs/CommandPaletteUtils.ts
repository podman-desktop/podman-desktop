/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { ContainerIcon } from '@podman-desktop/ui-svelte/icons';
import { get } from 'svelte/store';

import ImageIcon from '/@/lib/images/ImageIcon.svelte';
import PodIcon from '/@/lib/images/PodIcon.svelte';
import VolumeIcon from '/@/lib/images/VolumeIcon.svelte';
import { isDark } from '/@/stores/appearance';
import type { NavigationRegistryEntry } from '/@/stores/navigation/navigation-registry';
import type { ContainerInfo } from '/@api/container-info';
import type { GoToIcon, GoToInfo, NavigationInfo } from '/@api/documentation-info';
import type { ImageInfo } from '/@api/image-info';
import type { PodInfo } from '/@api/pod-info';
import type { VolumeInfo } from '/@api/volume-info';

// Helper function to get short ID (first 12 characters)
function getShortId(id: string): string {
  if (id.includes('sha256:')) {
    const sha256Index = id.indexOf('sha256:');
    const beforeSha256 = id.substring(0, sha256Index);
    const afterSha256 = id.substring(sha256Index + 'sha256:'.length);
    return beforeSha256 + 'sha256:' + afterSha256.substring(0, 12);
  }
  return id;
}

export function getGoToDisplayText(goToInfo: GoToInfo): string {
  if (goToInfo.type === 'Image') {
    return getShortId(goToInfo.RepoTags?.[0] ?? goToInfo.Id);
  } else if (goToInfo.type === 'Container') {
    return goToInfo.Names[0].replace(/^\//, '');
  } else if (goToInfo.type === 'Pod') {
    return goToInfo.Name;
  } else if (goToInfo.type === 'Volume') {
    return goToInfo.Name.substring(0, 12);
  } else if (goToInfo.type === 'Navigation') {
    return goToInfo.name;
  }
  return 'Unknown';
}

// Helper function to process a single navigation entry
function processNavigationEntry(
  entry: NavigationRegistryEntry,
  items: Array<NavigationInfo & { icon: GoToIcon }>,
  parentName = '',
): void {
  // Skip hidden entries
  if (entry.hidden) {
    return;
  }

  // Determine the display name with appropriate prefix and count
  let displayName = entry.name;

  // Add count in parentheses if available
  const count = entry.counter || 0;
  const countSuffix = count > 0 ? ` (${count})` : '';

  // Add prefix based on the entry type and parent context
  if (parentName) {
    // For submenu items, use the parent name as prefix
    displayName = `${parentName}: ${entry.name}${countSuffix}`;
  } else {
    displayName = `${entry.name}${countSuffix}`;
  }

  // group: Extensions / AI Lab / Kubernetes (After moving to extensions)
  if (entry.type === 'group') {
    entry.items?.forEach(subItem => {
      processNavigationEntry(subItem, items, entry.name);
    });
  }

  // entry: Images / Containers / Pods / Volumes
  // submenu: Kubernetes (Before moving to extensions)
  if (entry.type === 'entry' || entry.type === 'submenu') {
    let iconImage = entry.icon?.iconImage;
    if (iconImage && typeof iconImage !== 'string') {
      iconImage = get(isDark) ? iconImage.dark : iconImage.light;
    }

    items.push({
      icon: {
        iconComponent: entry.icon?.iconComponent,
        faIcon: entry.icon?.faIcon?.definition,
        iconImage: iconImage,
      },
      ...{
        name: displayName,
        link: entry.link,
      },
    });
  }
}

// Helper function to extract navigation paths from navigation registry
function extractNavigationPaths(entries: NavigationRegistryEntry[]): Array<NavigationInfo & { icon: GoToIcon }> {
  const items: Array<NavigationInfo & { icon: GoToIcon }> = [];

  entries.forEach(entry => {
    processNavigationEntry(entry, items);
  });

  return items;
}

// Helper function to fetch extension resources
async function fetchExtensionResources(): Promise<GoToInfo[]> {
  const items: GoToInfo[] = [];
  const extensions = await window.listExtensions();
  const webviews = await window.listWebviews();
  for (const extension of extensions) {
    try {
      const commandId = `${extension.name}.command.list-resources`;
      const resources = await window.executeCommand(commandId);
      const webview = webviews.find(w => w.sourcePath === extension.path);
      if (resources && Array.isArray(resources)) {
        for (const resource of resources) {
          if (resource.hidden) {
            continue;
          }
          items.push({
            type: 'NavigationCommand',
            name: `${webview?.name ?? extension.displayName} > ${resource.title}`,
            command: resource.command,
            id: resource.id,
            icon: { iconImage: resource.icon },
          });
        }
      }
    } catch (err) {
      // Extension doesn't have list-resources command, skip silently
    }
  }
  return items;
}

// Helper function to create GoToInfo items from resources (async version)
export async function createGoToItems(
  images: ImageInfo[],
  containers: ContainerInfo[],
  pods: PodInfo[],
  volumes: VolumeInfo[],
  navigationEntries: NavigationRegistryEntry[] = [],
): Promise<GoToInfo[]> {
  const items: GoToInfo[] = [];

  // Add images
  images.forEach(image => {
    items.push({ type: 'Image', ...image, icon: { iconComponent: ImageIcon } });
  });

  // Add containers
  containers.forEach(container => {
    items.push({ type: 'Container', ...container, icon: { iconComponent: ContainerIcon } });
  });

  // Add pods
  pods.forEach(pod => {
    items.push({ type: 'Pod', ...pod, icon: { iconComponent: PodIcon } });
  });

  // Add volumes
  volumes.forEach(volume => {
    items.push({ type: 'Volume', ...volume, icon: { iconComponent: VolumeIcon } });
  });

  // Add navigation registry entries
  if (navigationEntries.length > 0) {
    const navigationInfos = extractNavigationPaths(navigationEntries);
    navigationInfos.forEach(navigationInfo => {
      items.push({ type: 'Navigation', ...navigationInfo });
    });
  }

  const navigationRoutes = await window.getNavigationRoutes();
  // Add registered navigation routes
  if (navigationRoutes.length > 0) {
    navigationRoutes.forEach(route => {
      // Skip routes without a title (don't show them in the command palette)
      if (!route.title) return;

      items.push({
        type: 'Navigation',
        name: route.extensionId + ' > ' + route.title,
        link: route.routeId,
        icon: { iconImage: route.icon },
      } as GoToInfo);
    });
  }

  const extensionResources = await fetchExtensionResources();
  items.push(...extensionResources);

  return items;
}
