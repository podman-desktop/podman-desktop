/**********************************************************************
 * Copyright (C) 2023-2024 Red Hat, Inc.
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

import '@testing-library/jest-dom/vitest';

import { fireEvent } from '@testing-library/dom';
import { render, screen } from '@testing-library/svelte';
import { router } from 'tinro';
import { expect, test, vi } from 'vitest';

import ImageIcon from '/@/lib/images/ImageIcon.svelte';

import ImageColumnName from './ImageColumnName.svelte';
import type { ImageInfoUI } from './ImageInfoUI';

const image: ImageInfoUI = {
  id: 'my-image',
  shortId: 'short-id',
  name: 'my-image-name',
  engineId: 'podman',
  engineName: '',
  tag: 'latest',
  createdAt: 0,
  age: '',
  arch: '',
  size: 0,
  humanSize: '',
  base64RepoTag: 'bXktaW1hZ2UtbmFtZTpsYXRlc3Q=',
  selected: false,
  status: 'UNUSED',
  icon: ImageIcon,
  badges: [],
  digest: 'sha256:1234567890',
};
const getImageMock = vi.fn();

vi.mock('/@/lib/appearance/appearance-util', () => {
  return {
    AppearanceUtil: class {
      getImage = getImageMock;
    },
  };
});

test('Expect simple column styling', async () => {
  render(ImageColumnName, { object: image });

  const text = screen.getByText(image.name);
  expect(text).toBeInTheDocument();
  expect(text).toHaveClass('text-[var(--pd-table-body-text-highlight)]');

  const id = screen.getByText(image.shortId);
  expect(id).toBeInTheDocument();
  expect(id).toHaveClass('text-[var(--pd-table-body-text-sub-secondary)]');

  const tag = screen.getByText(image.tag);
  expect(tag).toBeInTheDocument();
  expect(tag).toHaveClass('text-[var(--pd-table-body-text)]');
  expect(tag).toHaveClass('font-extra-light');
});

test('Expect clicking works', async () => {
  render(ImageColumnName, { object: image });

  const text = screen.getByText(image.name);
  expect(text).toBeInTheDocument();

  // test click
  const routerGotoSpy = vi.spyOn(router, 'goto');

  fireEvent.click(text);

  expect(routerGotoSpy).toBeCalledWith('/images/my-image/podman/bXktaW1hZ2UtbmFtZTpsYXRlc3Q=/summary');
});

test('Expect badge with simple color', async () => {
  const imageWithBadges: ImageInfoUI = {
    ...image,
    badges: [
      {
        label: 'my-badge',
        color: '#ff0000',
      },
    ],
  };
  getImageMock.mockReturnValue('#ff0000');
  render(ImageColumnName, { object: imageWithBadges });

  // wait for image to be rendered using timeout
  await new Promise(resolve => setTimeout(resolve, 100));

  const text = screen.getByText(image.name);
  expect(text).toBeInTheDocument();

  // get label 'my-badge'
  const badge = screen.getByText('my-badge');
  expect(badge).toBeInTheDocument();

  // check background color
  await vi.waitFor(async () => expect(badge).toHaveStyle('background-color: #ff0000'));
});

test('Expect badge with dark color', async () => {
  const imageWithBadges: ImageInfoUI = {
    ...image,
    badges: [
      {
        label: 'my-dark-badge',
        color: {
          dark: '#0000ff',
          light: '#00ff00',
        },
      },
    ],
  };
  getImageMock.mockReturnValue('#0000ff');
  render(ImageColumnName, { object: imageWithBadges });

  // wait for image to be rendered using timeout
  await new Promise(resolve => setTimeout(resolve, 100));

  const text = screen.getByText(image.name);
  expect(text).toBeInTheDocument();

  // get label 'my-badge'
  const badge = screen.getByText('my-dark-badge');
  expect(badge).toBeInTheDocument();

  // check background color
  await vi.waitFor(async () => expect(badge).toHaveStyle('background-color: #0000ff'));
});

test('Expect badge with light color', async () => {
  const imageWithBadges: ImageInfoUI = {
    ...image,
    badges: [
      {
        label: 'my-light-badge',
        color: {
          dark: '#0000ff',
          light: '#00ff00',
        },
      },
    ],
  };
  getImageMock.mockReturnValue('#00ff00');
  render(ImageColumnName, { object: imageWithBadges });

  // wait for image to be rendered using timeout
  await new Promise(resolve => setTimeout(resolve, 100));

  const text = screen.getByText(image.name);
  expect(text).toBeInTheDocument();

  // get label 'my-badge'
  const badge = screen.getByText('my-light-badge');
  expect(badge).toBeInTheDocument();

  // check background color
  await vi.waitFor(async () => expect(badge).toHaveStyle('background-color: #00ff00'));
});

test('Expect clicking works for manifests', async () => {
  const manifestImage: ImageInfoUI = {
    ...image,
    isManifest: true,
  };
  render(ImageColumnName, { object: manifestImage });

  // Make sure text shows image name then (manifest)
  const text = screen.getByText(`${image.name} (manifest)`);
  expect(text).toBeInTheDocument();

  // test click
  const routerGotoSpy = vi.spyOn(router, 'goto');
  fireEvent.click(text);
  expect(routerGotoSpy).toBeCalledWith('/manifests/my-image/podman/bXktaW1hZ2UtbmFtZTpsYXRlc3Q=/summary');
});

test('Expect clicking works for images without tag (empty tag)', async () => {
  const imageWithoutTag: ImageInfoUI = {
    ...image,
    name: 'my-untagged-image',
    tag: '',
    base64RepoTag: 'bXktdW50YWdnZWQtaW1hZ2U=', // base64 of 'my-untagged-image'
  };
  render(ImageColumnName, { object: imageWithoutTag });

  const text = screen.getByText('my-untagged-image');
  expect(text).toBeInTheDocument();

  // test click - should use only the name when tag is empty
  const routerGotoSpy = vi.spyOn(router, 'goto');
  fireEvent.click(text);

  // Should navigate with just the name, when tag is empty
  expect(routerGotoSpy).toBeCalledWith('/images/my-image/podman/bXktdW50YWdnZWQtaW1hZ2U=/summary');
});
