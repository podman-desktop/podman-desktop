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

import type { NavigationRegistryEntry } from '/@/stores/navigation/navigation-registry';
import type { ContainerInfo } from '/@api/container-info';
import type { GoToInfo, NavigationInfo } from '/@api/documentation-info';
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

// Helper function to extract and capitalize path prefix from link
function extractPathPrefix(link: string, entryName: string): string | undefined {
  // Remove leading slash and split by '/'
  const pathSegments = link.replace(/^\//, '').split('/');

  if (pathSegments.length === 0 || pathSegments[0] === '') {
    return;
  }

  const firstSegment = pathSegments[0];

  // For submenu items (like Kubernetes Dashboard), use the parent category
  if (pathSegments.length > 1) {
    const capitalizedSegment = firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
    return capitalizedSegment;
  }

  // For main navigation items, don't add prefix if name matches path
  const capitalizedSegment = firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
  if (entryName.toLowerCase() === firstSegment.toLowerCase()) {
    return;
  }

  // Capitalize first letter and return
  return capitalizedSegment;
}

// Helper function to process a single navigation entry
function processNavigationEntry(entry: NavigationRegistryEntry, items: NavigationInfo[], parentName = ''): void {
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
    // Extract prefix from the link path dynamically
    const pathPrefix = extractPathPrefix(entry.link, entry.name);
    if (pathPrefix) {
      displayName = `${pathPrefix}> ${entry.name}${countSuffix}`;
    } else {
      // No prefix needed, just add count
      displayName = `${entry.name}${countSuffix}`;
    }
  }

  // Only add actual navigation entries (type 'entry'), not groups or submenus
  if (entry.type === 'entry') {
    const navigationInfo: NavigationInfo = {
      name: displayName,
      link: entry.link,
    };

    items.push(navigationInfo);
  }

  // Process submenu items if they exist
  if (entry.items && entry.items.length > 0) {
    entry.items.forEach(subItem => {
      processNavigationEntry(subItem, items, entry.name);
    });
  }
}

// Helper function to extract navigation paths from navigation registry
function extractNavigationPaths(entries: NavigationRegistryEntry[]): NavigationInfo[] {
  const items: NavigationInfo[] = [];

  entries.forEach(entry => {
    processNavigationEntry(entry, items);
  });

  return items;
}

// Helper function to create GoToInfo items from resources
export function createGoToItems(
  images: ImageInfo[],
  containers: ContainerInfo[],
  pods: PodInfo[],
  volumes: VolumeInfo[],
  navigationEntries: NavigationRegistryEntry[] = [],
): GoToInfo[] {
  const items: GoToInfo[] = [];

  // Add images
  images.forEach(image => {
    items.push({ type: 'Image', ...image });
  });

  // Add containers
  containers.forEach(container => {
    items.push({ type: 'Container', ...container });
  });

  // Add pods
  pods.forEach(pod => {
    items.push({ type: 'Pod', ...pod });
  });

  // Add volumes
  volumes.forEach(volume => {
    items.push({ type: 'Volume', ...volume });
  });

  // Add navigation registry entries
  if (navigationEntries.length > 0) {
    const navigationInfos = extractNavigationPaths(navigationEntries);
    navigationInfos.forEach(navigationInfo => {
      items.push({ type: 'Navigation', ...navigationInfo });
    });
  }

  return items;
}
