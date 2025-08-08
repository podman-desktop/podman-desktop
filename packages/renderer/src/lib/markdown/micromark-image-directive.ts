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

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import type { Directive } from 'micromark-extension-directive';

/**
 * Allow to generate an image markdown directive
 * syntax is the following:
 * :image[Alt text]{src=path/to/image.png title="Image title" width="300" height="200"}
 * or
 * :image[Alt text]{src=path/to/image.gif title="GIF title" width="300"}
 *
 * Supported attributes:
 * - src: (required) path to the image/GIF
 * - title: tooltip text when hovering over the image
 * - width: image width (optional)
 * - height: image height (optional)
 * - class: additional CSS classes (optional)
 */
/**
 * @this {import('micromark-util-types').CompileContext}
 * @type {import('micromark-extension-directive').Handle}
 */
export function image(d: Directive): void {
  // Make sure it's not part of a text directive
  if (d.type !== 'textDirective') {
    return false;
  }

  // Make sure src attribute is provided
  if (!d.attributes || !('src' in d.attributes)) {
    return false;
  }

  // Start the img tag
  this.tag('<img');

  // Add the src attribute (required)
  this.tag(' src="' + this.encode(d.attributes.src) + '"');

  // Add alt text from the label
  this.tag(' alt="' + this.encode(d.label ?? '') + '"');

  // Add optional attributes
  if (d.attributes.title) {
    this.tag(' title="' + this.encode(d.attributes.title) + '"');
  }

  if (d.attributes.width) {
    this.tag(' width="' + this.encode(d.attributes.width) + '"');
  }

  if (d.attributes.height) {
    this.tag(' height="' + this.encode(d.attributes.height) + '"');
  }

  // Add default styling class and any additional classes
  let cssClasses = 'max-w-full h-auto rounded-md shadow-md block transition-shadow duration-300';
  if (d.attributes.class) {
    cssClasses += ' ' + this.encode(d.attributes.class);
  }
  this.tag(' class="' + cssClasses + '"');

  // Add loading="lazy" for better performance
  this.tag(' loading="lazy"');

  // Close the self-closing img tag
  this.tag(' />');
}
