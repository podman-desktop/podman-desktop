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

import type { PodInfo } from '@podman-desktop/api';

import type { NavigationRegistryEntry } from '/@/stores/navigation/navigation-registry';
import type { ContainerInfo } from '/@api/container-info';
import type { GoToInfo, NavigationInfo } from '/@api/documentation-info';
import type { ImageInfo } from '/@api/image-info';
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

// Helper function to extract navigation paths from navigation registry
function extractNavigationPaths(entries: NavigationRegistryEntry[]): GoToInfo[] {
  const items: GoToInfo[] = [];

  function processEntry(entry: NavigationRegistryEntry, parentName = ''): void {
    // Skip hidden entries
    if (entry.hidden) {
      return;
    }

    // Create a unique ID for the navigation entry
    const id = entry.link.replace(/\//g, '-').replace(/^-/, '');

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

    // Only add the main entry if it doesn't have submenu items
    // Groups and submenus should only show their children, not themselves
    if (!entry.items || entry.items.length === 0) {
      items.push({
        id,
        name: displayName,
        kind: 'Navigation',
        info: {
          link: entry.link,
        } as NavigationInfo,
      });
    }

    // Process submenu items if they exist
    if (entry.items && entry.items.length > 0) {
      entry.items.forEach(subItem => {
        processEntry(subItem, entry.name);
      });
    }
  }

  entries.forEach(entry => {
    processEntry(entry);
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
    const name = image.RepoTags?.[0] ? getShortId(image.RepoTags[0]) : image.Id;
    items.push({
      id: image.Id,
      name: name,
      kind: 'Image',
      info: image,
    });
  });

  // Add containers
  containers.forEach(container => {
    const name = container.Names?.[0]?.replace('/', '') || container.Id;
    items.push({
      id: container.Id,
      name: name,
      kind: 'Container',
      info: container,
    });
  });

  // Add pods
  pods.forEach(pod => {
    const shortId = getShortId(pod.Id);
    const name = pod.Name || shortId;
    items.push({
      id: pod.Id,
      name: name,
      kind: 'Pod',
      info: pod,
    });
  });

  // Add volumes
  volumes.forEach(volume => {
    items.push({
      id: volume.Name,
      name: volume.Name.substring(0, 12),
      kind: 'Volume',
      info: volume,
    });
  });

  // Add navigation registry entries
  if (navigationEntries.length > 0) {
    const navigationItems = extractNavigationPaths(navigationEntries);
    items.push(...navigationItems);
  }

  return items;
}
