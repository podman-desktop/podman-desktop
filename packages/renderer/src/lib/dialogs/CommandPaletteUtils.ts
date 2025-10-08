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

import type { ContainerInfo } from '/@api/container-info';
import type { GoToInfo } from '/@api/documentation-info';
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
  }
  return 'Unknown';
}

// Helper function to create GoToInfo items from resources
export function createGoToItems(
  images: ImageInfo[],
  containers: ContainerInfo[],
  pods: PodInfo[],
  volumes: VolumeInfo[],
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

  return items;
}
