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

/* eslint-disable @typescript-eslint/no-explicit-any */

import { get } from 'svelte/store';
import { afterEach, expect, test } from 'vitest';

import type { ImageInfoUI } from '/@/lib/image/ImageInfoUI';

import { updateImagesInfo } from './update-images-store';

const imageInfo: ImageInfoUI = {
  id: 'id',
} as ImageInfoUI;

afterEach(() => {
  // Reset store to avoid state leakage between tests
  updateImagesInfo.set([]);
});

test('check that update image store is filled', async () => {
  // initial images
  updateImagesInfo.set([imageInfo]);
  const imageInfoInStore = get(updateImagesInfo);
  expect(imageInfoInStore.length).equal(1);
  expect(imageInfoInStore[0]).equal(imageInfo);
});
