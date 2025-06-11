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

import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { beforeEach, expect, test, vi } from 'vitest';

import { remarkOptimizeImages } from './remark-optimize-images';

const mockedMarkdown = '### Podman Desktop\nPicture of General Kenobi ![Selfie](/img/blog/hello_there.png)';
const mockedMarkdownExternal = '### Podman Desktop\nPicture of General Kenobi ![Selfie](https://hello.there)';
const mockedMarkdownOptimized = '### Podman Desktop\nPicture of General Kenobi ![Selfie](https://hello-640w.there)';

beforeEach(() => {
  vi.resetAllMocks();
});

test('should replace original img with updated one', () => {
  const tree = unified().use(remarkParse).parse(mockedMarkdown);

  const imageTransformer = remarkOptimizeImages();
  imageTransformer(tree, undefined);
  // Tree will be updated with optimized images
  expect(tree.children[1].children[1].value).toContain('<picture>');
});

test('should skip external images', () => {
  const originalTree = unified().use(remarkParse).parse(mockedMarkdownExternal);
  const tree = unified().use(remarkParse).parse(mockedMarkdownExternal);

  const imageTransformer = remarkOptimizeImages();
  imageTransformer(tree, undefined);
  // Tree wont change
  expect(tree).toStrictEqual(originalTree);
});

test('should skip already optimized images', () => {
  const originalTree = unified().use(remarkParse).parse(mockedMarkdownOptimized);
  const tree = unified().use(remarkParse).parse(mockedMarkdownOptimized);

  const imageTransformer = remarkOptimizeImages();
  imageTransformer(tree, undefined);
  // Tree wont change
  expect(tree).toStrictEqual(originalTree);
});
