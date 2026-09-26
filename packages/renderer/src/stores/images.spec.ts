/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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
import { get } from 'svelte/store';
import { assert, beforeEach, describe, expect, test, vi } from 'vitest';

import type { ContainerInfoUI } from '/@/lib/container/ContainerInfoUI';
import type { ImageInfoUI } from '/@/lib/image/ImageInfoUI';

import { containersInfos } from './containers';
import { filtered, imagesEventStore, imagesInfos, searchPattern, setImageStatus } from './images';
import { findMatchInLeaves } from './search-util';

const callbacks = new Map<string, (data?: unknown) => void | Promise<void>>();

// We always mock findMatchInLeaves to return true so we can test image.ts without having to render
// the component, as we are not testing the $searchPattern store / functionality.
vi.mock(import('./search-util'), () => ({
  findMatchInLeaves: vi.fn(() => true), // Assume it always finds a match unless specified otherwise
}));

beforeEach(() => {
  callbacks.clear();
  vi.resetAllMocks();
  containersInfos.set([]);
  vi.mocked(window.events.receive).mockImplementation((message, callback) => {
    callbacks.set(message, callback);
    return { dispose: vi.fn() };
  });
});

test('images should be updated in case of a image is loaded from an archive', async () => {
  // initial images
  vi.mocked(window.listImages).mockResolvedValue([
    {
      Id: '1',
      Size: 0,
    } as unknown as ImageInfo,
  ]);
  const storeInfo = imagesEventStore.setup();

  // send 'extensions-already-started' event
  window.dispatchEvent(new CustomEvent('extensions-already-started'));

  // fetch
  await storeInfo.fetch();

  // now get list
  const images = get(imagesInfos);
  expect(images.length).toBe(1);
  expect(images[0].id).toBe('1');

  // ok now mock the listImages function to return an empty list
  vi.mocked(window.listImages).mockResolvedValue([]);

  // call 'image-loadfromarchive-event' event
  const imageLoadFromArchiveCallback = callbacks.get('image-loadfromarchive-event');
  assert(imageLoadFromArchiveCallback);
  await imageLoadFromArchiveCallback();

  // wait debounce
  await new Promise(resolve => setTimeout(resolve, 2000));

  // check if the images have been updated
  const images2 = get(imagesInfos);
  expect(images2.length).toBe(0);
});

describe('filtered images tests', () => {
  test('images with isManifest field missing should be included', async () => {
    // No isManifest field
    vi.mocked(window.listImages).mockResolvedValue([
      { Id: '2', Size: 0 } as unknown as ImageInfo, // Simulate isManifest field missing
    ]);

    // Setup, callback and fetch the images
    const storeInfo = imagesEventStore.setup();
    window.dispatchEvent(new CustomEvent('extensions-already-started'));
    await storeInfo.fetch();

    const images = get(filtered);
    expect(images.length).toBe(1);
    expect(images[0].id).toBe('2');
  });

  test('images with isManifest false should be included', async () => {
    // isManifest but set to false
    vi.mocked(window.listImages).mockResolvedValue([{ Id: '3', Size: 0, isManifest: false } as unknown as ImageInfo]);

    // Setup, callback and fetch the images
    const storeInfo = imagesEventStore.setup();
    window.dispatchEvent(new CustomEvent('extensions-already-started'));
    await storeInfo.fetch();

    // Check the filtered images
    const images = get(filtered);
    expect(images.length).toBe(1);
    expect(images[0].id).toBe('3');
    expect(images[0].isManifest).toBe(false);
  });

  test('images with isManifest true should be included', async () => {
    // isManifest but set to true
    vi.mocked(window.listImages).mockResolvedValue([{ Id: '4', Size: 0, isManifest: true } as unknown as ImageInfo]);

    // Setup, callback and fetch the images
    const storeInfo = imagesEventStore.setup();
    window.dispatchEvent(new CustomEvent('extensions-already-started'));
    await storeInfo.fetch();

    // Check the filtered images, make sure that we do NOT have any images
    // as we do not want filtered to show images with isManifest set to true
    const images = get(filtered);
    expect(images.length).toBe(1);
  });

  test('check against 3 images with different isManifest values', async () => {
    // 3 images with different isManifest values
    vi.mocked(window.listImages).mockResolvedValue([
      { Id: '5', Size: 0, isManifest: false } as unknown as ImageInfo,
      { Id: '6', Size: 0, isManifest: true } as unknown as ImageInfo,
      { Id: '7', Size: 0 } as unknown as ImageInfo, // Simulate isManifest field missing
    ]);

    // Setup, callback and fetch the images
    const storeInfo = imagesEventStore.setup();
    window.dispatchEvent(new CustomEvent('extensions-already-started'));
    await storeInfo.fetch();

    // Check the filtered images
    const images = get(filtered);

    // Expect to have 3 images now
    expect(images.length).toBe(3);

    // Check the first image
    expect(images[0].id).toBe('5');
    expect(images[0].isManifest).toBe(false);

    // Check the second image
    expect(images[1].id).toBe('6');
    expect(images[1].isManifest).toBeDefined();
  });
});

test('store holds one ImageInfoUI per RepoTag and resolves manifest children', async () => {
  const twoTagImage = {
    Id: 'image-1',
    RepoTags: ['repo/name:tag1', 'repo/name:tag2'],
    Created: 1700000000,
    Size: 100,
    engineId: 'engine1',
    engineName: 'Podman',
  } as unknown as ImageInfo;
  const untaggedImage = {
    Id: 'image-2',
    Created: 1700000000,
    Size: 50,
    engineId: 'engine1',
    engineName: 'Podman',
  } as unknown as ImageInfo;
  const childImage = {
    Id: 'image-3',
    RepoTags: ['child/name:tag'],
    Digest: 'sha256:child-digest',
    Created: 1700000000,
    Size: 20,
    engineId: 'engine1',
    engineName: 'Podman',
  } as unknown as ImageInfo;
  const manifestImage = {
    Id: 'image-4',
    RepoTags: ['manifest/name:tag'],
    isManifest: true,
    manifests: [{ digest: 'sha256:child-digest' }],
    Created: 1700000000,
    Size: 10,
    engineId: 'engine1',
    engineName: 'Podman',
  } as unknown as ImageInfo;

  vi.mocked(window.listImages).mockResolvedValue([twoTagImage, untaggedImage, manifestImage, childImage]);
  const storeInfo = imagesEventStore.setup();
  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  await storeInfo.fetch();

  await vi.waitFor(() => {
    const rows = get(imagesInfos);

    const tagRows = rows.filter(row => row.id === 'image-1');
    expect(tagRows).toHaveLength(2);
    expect(tagRows[0].base64RepoTag).not.toBe(tagRows[1].base64RepoTag);

    const untaggedRow = rows.find(row => row.id === 'image-2');
    expect(untaggedRow?.name).toBe('<none>');

    const manifestRow = rows.find(row => row.id === 'image-4');
    expect(manifestRow?.children).toHaveLength(1);
    expect(manifestRow?.children?.[0].id).toBe('image-3');
  });
});

test('status follows containersInfos without a refetch', async () => {
  const image = {
    Id: 'image-b',
    RepoTags: ['app:latest'],
    Created: 1700000000,
    Size: 30,
    engineId: 'engine1',
    engineName: 'Podman',
  } as unknown as ImageInfo;

  vi.mocked(window.listImages).mockResolvedValue([image]);
  const storeInfo = imagesEventStore.setup();
  window.dispatchEvent(new CustomEvent('extensions-already-started'));
  await storeInfo.fetch();

  await vi.waitFor(() => {
    const rows = get(imagesInfos);
    expect(rows).toHaveLength(1);
    expect(rows[0].status).toBe('UNUSED');
  });

  vi.mocked(window.listImages).mockClear();

  containersInfos.set([{ imageId: 'image-b', image: 'app:latest' } as ContainerInfoUI]);

  await vi.waitFor(() => {
    const rows = get(imagesInfos);
    expect(rows[0].status).toBe('USED');
  });
  expect(window.listImages).not.toHaveBeenCalled();
});

test('setImageStatus marks only the matching row', () => {
  const row1 = {
    id: 'image-c',
    engineId: 'engine1',
    base64RepoTag: 'dGFnMQ==',
    status: 'UNUSED',
    selected: true,
  } as ImageInfoUI;
  const row2 = {
    id: 'image-c',
    engineId: 'engine1',
    base64RepoTag: 'dGFnMg==',
    status: 'UNUSED',
    selected: false,
  } as ImageInfoUI;
  const row3 = {
    id: 'image-c',
    engineId: 'engine2',
    base64RepoTag: 'dGFnMQ==',
    status: 'UNUSED',
    selected: false,
  } as ImageInfoUI;
  imagesInfos.set([row1, row2, row3]);

  setImageStatus('engine1', 'image-c', 'dGFnMQ==', 'DELETING');

  const result = get(imagesInfos);
  expect(result[0]).not.toBe(row1);
  expect(result[0].status).toBe('DELETING');
  expect(result[0].selected).toBe(true);
  expect(result[1]).toBe(row2);
  expect(result[2]).toBe(row3);
  expect(result[2].status).toBe('UNUSED');
});

test('setImageStatus reaches a child nested in a manifest', () => {
  const childRow = {
    id: 'child-d',
    engineId: 'engine1',
    base64RepoTag: 'Y2hpbGQ=',
    status: 'UNUSED',
    selected: false,
  } as ImageInfoUI;
  const manifestRow = {
    id: 'manifest-d',
    engineId: 'engine1',
    base64RepoTag: 'bWFuaWZlc3Q=',
    status: 'UNUSED',
    selected: false,
    children: [childRow],
  } as ImageInfoUI;
  imagesInfos.set([manifestRow, childRow]);

  setImageStatus('engine1', 'child-d', 'Y2hpbGQ=', 'DELETING');

  const result = get(imagesInfos);
  const topLevelChild = result.find(row => row.id === 'child-d');
  const manifest = result.find(row => row.id === 'manifest-d');
  expect(topLevelChild?.status).toBe('DELETING');
  expect(manifest?.children?.[0].status).toBe('DELETING');
});

test('filtered does not match a manifest through its children', async () => {
  const actual = await vi.importActual('./search-util');
  vi.mocked(findMatchInLeaves).mockImplementation(
    (actual as { findMatchInLeaves: typeof findMatchInLeaves }).findMatchInLeaves,
  );

  const childRow = {
    id: 'child-e',
    engineId: 'engine1',
    base64RepoTag: 'Y2hpbGQ=',
    name: 'child-only-name',
    status: 'UNUSED',
    selected: false,
    badges: [],
  } as unknown as ImageInfoUI;
  const manifestRow = {
    id: 'manifest-e',
    engineId: 'engine1',
    base64RepoTag: 'bWFuaWZlc3Q=',
    name: 'manifest-name',
    status: 'UNUSED',
    selected: false,
    badges: [],
    children: [childRow],
  } as unknown as ImageInfoUI;
  imagesInfos.set([manifestRow, childRow]);

  searchPattern.set('child-only-name');

  await vi.waitFor(() => {
    const rows = get(filtered);
    expect(rows.map(row => row.id)).toContain('child-e');
    expect(rows.map(row => row.id)).not.toContain('manifest-e');
  });

  searchPattern.set('');
});
