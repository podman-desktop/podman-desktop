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

/* eslint-disable no-null/no-null */
import '@testing-library/jest-dom/vitest';

import { AppearanceSettings } from '@podman-desktop/core-api/appearance';
import { render, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeAll, beforeEach, expect, test, vi } from 'vitest';

import IconImage from './IconImage.svelte';

const getConfigurationValueMock = vi.fn();
const getImageMock = vi.fn();

vi.mock('./appearance-util', () => {
  return {
    AppearanceUtil: class {
      getImage = getImageMock;
    },
  };
});

beforeAll(() => {
  Object.defineProperty(window, 'getConfigurationValue', { value: getConfigurationValueMock });
});

beforeEach(() => {
  vi.resetAllMocks();
});

test('Expect valid source and alt text with dark mode', async () => {
  getImageMock.mockResolvedValue('dark.png');

  const image = render(IconImage, { image: { light: 'light.png', dark: 'dark.png' }, alt: 'this is alt text' });

  await waitFor(() => {
    // grab image element
    const imageElement = image.getByRole('img');

    expect(imageElement).toHaveAttribute('src', 'dark.png');
    expect(imageElement).toHaveAttribute('alt', 'this is alt text');
  });

  vi.clearAllMocks();
  await image.rerender({ image: { light: 'light2.png', dark: 'dark2.png' }, alt: 'this is another alt text' });
  expect(getImageMock).toHaveBeenCalledWith({ light: 'light2.png', dark: 'dark2.png' });
});

test('Expect valid source and alt text with light mode', async () => {
  getImageMock.mockResolvedValue('light.png');

  const image = render(IconImage, { image: { light: 'light.png', dark: 'dark.png' }, alt: 'this is alt text' });

  // wait for image to be loaded
  await tick();

  // grab image element
  const imageElement = image.getByRole('img');

  // expect to have valid source
  await vi.waitFor(async () => expect(imageElement).toHaveAttribute('src', 'light.png'));
  expect(imageElement).toHaveAttribute('alt', 'this is alt text');

  vi.clearAllMocks();
  await image.rerender({ image: { light: 'light2.png', dark: 'dark2.png' }, alt: 'this is another alt text' });
  expect(getImageMock).toHaveBeenCalledWith({ light: 'light2.png', dark: 'dark2.png' });
});

test('Expect no alt attribute if missing and default image', async () => {
  getConfigurationValueMock.mockResolvedValue(AppearanceSettings.LightEnumValue);
  getImageMock.mockResolvedValue('image.png');

  const image = render(IconImage, { image: 'image.png' });

  // wait for image to be loaded
  await tick();

  // grab image element
  const imageElement = image.getByRole('img');

  // expect to have valid source
  expect(imageElement).toHaveAttribute('src', 'image.png');

  // alt should be missing
  expect(imageElement).not.toHaveAttribute('alt');
});

test('Expect string as image', async () => {
  getImageMock.mockResolvedValue('image1');
  const image = render(IconImage, { image: 'image1', alt: 'this is alt text' });

  // wait for image to be loaded
  await tick();

  // grab image element
  const imageElement = image.getByRole('img');

  // expect to have valid source
  expect(imageElement).toHaveAttribute('src', 'image1');
  expect(imageElement).toHaveAttribute('alt', 'this is alt text');

  vi.clearAllMocks();
  await image.rerender({ image: 'image2', alt: 'this is another alt text' });
  expect(getImageMock).toHaveBeenCalledWith('image2');
});
