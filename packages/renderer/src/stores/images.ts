/**********************************************************************
 * Copyright (C) 2022-2023 Red Hat, Inc.
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

import type { ImageInfo } from '@podman-desktop/core-api';
import type { Writable } from 'svelte/store';
import { derived, get, writable } from 'svelte/store';

import type { ContainerInfoUI } from '/@/lib/container/ContainerInfoUI';
import { ImageUtils } from '/@/lib/image/image-utils';
import type { ImageInfoUI } from '/@/lib/image/ImageInfoUI';
import ImageIcon from '/@/lib/images/ImageIcon.svelte';

import { containersInfos } from './containers';
import { EventStore } from './event-store';
import { findMatchInLeaves } from './search-util';

const windowEvents = [
  'extension-started',
  'extension-stopped',
  'provider-change',
  'provider-container-connection-update-status',
  'image-pull-event',
  'image-remove-event',
  'image-build-event',
  'registry-register',
  'registry-unregister',
  'image-tag-event',
  'image-untag-event',
  'extensions-started',
  'image-loadfromarchive-event',
];
const windowListeners = ['image-build', 'extensions-already-started'];

let readyToUpdate = false;

async function checkForUpdate(eventName: string): Promise<boolean> {
  if ('extensions-already-started' === eventName) {
    readyToUpdate = true;
  }

  // do not fetch until extensions are all started
  return readyToUpdate;
}

export const imagesInfos: Writable<ImageInfoUI[]> = writable([]);

const imageUtils = new ImageUtils();
let images: ImageInfo[] = [];
function toImagesInfoUI(containers: ContainerInfoUI[]): ImageInfoUI[] {
  return images.map(image => imageUtils.getImagesInfoUI(image, containers, images)).flat();
}

// use helper here as window methods are initialized after the store in tests
const listImages = async (): Promise<ImageInfoUI[]> => {
  images = await window.listImages();
  return toImagesInfoUI(get(containersInfos));
};

containersInfos.subscribe(containers => imagesInfos.set(toImagesInfoUI(containers)));

export function setImageStatus(
  engineId: string,
  imageId: string,
  base64RepoTag: string,
  status: ImageInfoUI['status'],
): void {
  const update = (image: ImageInfoUI): ImageInfoUI => {
    if (image.id === imageId && image.engineId === engineId && image.base64RepoTag === base64RepoTag) {
      return { ...image, status };
    }
    return image.children?.length ? { ...image, children: image.children.map(update) } : image;
  };
  imagesInfos.update(imageInfos => imageInfos.map(update));
}

export function getImageInfo(engineId: string, imageId: string): ImageInfo | undefined {
  return images.find(image => image.engineId === engineId && image.Id === imageId);
}

export const imagesEventStore = new EventStore<ImageInfoUI[]>(
  'images',
  imagesInfos,
  checkForUpdate,
  windowEvents,
  windowListeners,
  listImages,
  ImageIcon,
);
imagesEventStore.setupWithDebounce();

export const searchPattern = writable('');

export const filtered = derived([searchPattern, imagesInfos], ([$searchPattern, $imagesInfos]) =>
  $imagesInfos.filter(imageInfo =>
    findMatchInLeaves({ ...imageInfo, children: undefined }, $searchPattern.toLowerCase()),
  ),
);
