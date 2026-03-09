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

import type { ImageUpdateStatus } from '@podman-desktop/core-api';
import { writable } from 'svelte/store';

export interface ImageUpdateStatusEntry {
  status: ImageUpdateStatus;
  checkedAt: number;
}

/**
 * In-memory store keyed by engineId:imageId:tag. Naturally clears when the session ends.
 */
const imageUpdateStatusMap = writable<Map<string, ImageUpdateStatusEntry>>(new Map());

function getKey(engineId: string, name: string, imageId: string, tag: string): string {
  return `${engineId}:${name}:${imageId}:${tag}`;
}

export function getImageUpdateStatus(
  engineId: string,
  name: string,
  imageId: string,
  tag: string,
): ImageUpdateStatusEntry | undefined {
  let result: ImageUpdateStatusEntry | undefined;
  imageUpdateStatusMap.subscribe(map => {
    result = map.get(getKey(engineId, name, imageId, tag));
  })();
  return result;
}

export function setImageUpdateStatus(
  engineId: string,
  name: string,
  imageId: string,
  tag: string,
  status: ImageUpdateStatus,
): void {
  imageUpdateStatusMap.update(map => {
    const newMap = new Map(map);
    newMap.set(getKey(engineId, name, imageId, tag), {
      status,
      checkedAt: Date.now(),
    });
    return newMap;
  });
}

export function clearImageUpdateStatus(engineId: string, name: string, imageId: string, tag: string): void {
  imageUpdateStatusMap.update(map => {
    const newMap = new Map(map);
    newMap.delete(getKey(engineId, name, imageId, tag));
    return newMap;
  });
}

export function clearAllImageUpdateStatuses(): void {
  imageUpdateStatusMap.set(new Map());
}
