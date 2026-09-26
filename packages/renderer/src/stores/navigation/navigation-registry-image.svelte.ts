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

import { type GoToInfo, NavigationPage } from '@podman-desktop/core-api';

import { ImageUtils } from '/@/lib/image/image-utils';
import ImageIcon from '/@/lib/images/ImageIcon.svelte';
import { imagesInfos } from '/@/stores/images';

import type { NavigationRegistryEntry } from './navigation-registry';

let count = $state(0);
let destinations = $state<GoToInfo[]>([]);

const imageUtils = new ImageUtils();

export function createNavigationImageEntry(): NavigationRegistryEntry {
  imagesInfos.subscribe(images => {
    const firstRows = images.filter(
      (image, index) => images.findIndex(other => other.id === image.id && other.engineId === image.engineId) === index,
    );
    count = firstRows.length;
    destinations = [
      ...firstRows.map(image => ({
        page: NavigationPage.IMAGE as const,
        parameters: {
          id: image.id,
          engineId: image.engineId,
          tag: image.tag ? `${image.name}:${image.tag}` : image.name,
        },
        icon: { iconComponent: ImageIcon },
        name: image.tag ? `Image: ${image.name}:${image.tag}` : `Image: ${imageUtils.getShortId(image.id)}`,
      })),
      {
        page: NavigationPage.IMAGES as const,
        icon: { iconComponent: ImageIcon },
        name: `Images (${count})`,
      },
    ];
  });

  const registry: NavigationRegistryEntry = {
    name: 'Images',
    icon: { iconComponent: ImageIcon },
    link: '/images',
    tooltip: 'Images',
    type: 'entry',
    get destinations() {
      return destinations;
    },
    get counter() {
      return count;
    },
  };
  return registry;
}
