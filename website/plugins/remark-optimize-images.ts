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

/**
 * Remark plugin: Optimize images.
 *
 * Automatically transforms markdown images in blog posts to use optimized versions.
 * Converts simple markdown images to HTML picture elements with responsive srcsets.
 *
 * Features:
 * - Converts ![alt](image.png) to <picture> elements with AVIF/WebP/PNG sources.
 * - Generates responsive srcsets for all breakpoints.
 * - Skips external URLs and already optimized images.
 * - Works automatically with all blog posts and markdown content.
 *
 * Example transformation:
 * Input:  ![Screenshot](/img/blog/screenshot.png)
 * Output: <picture> with AVIF, WebP, and PNG sources with full responsive srcsets.
 */

import path from 'node:path';

import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';

/**
 * Interface for image nodes in the markdown AST.
 */
interface ImageNode extends Node {
  type: 'image';
  url: string;
  alt?: string;
}

/**
 * Interface for MDX JSX attributes.
 */
interface MdxJsxAttribute {
  type: 'mdxJsxAttribute';
  name: string;
  value: string;
}

/**
 * Interface for MDX JSX elements.
 */
interface MdxJsxElement extends Node {
  type: 'mdxJsxFlowElement';
  name: string;
  attributes: MdxJsxAttribute[];
  children: MdxJsxElement[];
  data: { _mdxExplicitJsx: true };
}

/**
 * Creates a remark plugin that optimizes images in markdown content.
 *
 * This plugin uses the unified/remark AST (Abstract Syntax Tree) visitor pattern
 * to find image nodes and replace them with optimized HTML picture elements.
 *
 * The optimization strategy:
 * 1. Find all image nodes in the markdown AST.
 * 2. Filter out external URLs and already optimized images.
 * 3. Generate HTML picture elements with multiple format sources.
 * 4. Replace the original image node with the HTML node.
 *
 * @returns A remark transformer function
 */
export function remarkOptimizeImages() {
  return function transformer(tree: Node, _file: VFile): void {
    /**
     * Visit all image nodes in the AST.
     */
    visit(tree, 'image', (node: ImageNode, index: number | undefined, parent: Parent | undefined) => {
      const { url, alt } = node;

      /**
       * Skip external URLs for security and performance reasons.
       * - Can't optimize external images we don't control.
       * - Avoids potential CORS and caching issues.
       * - Prevents unnecessary network requests during build.
       */
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
        return;
      }

      /**
       * Skip images that use pathname:// protocol (already bypassing Docusaurus processing).
       */
      if (url.startsWith('pathname://')) {
        return;
      }

      /**
       * Ensure we have a valid index and parent for AST manipulation.
       * The index is needed to replace the node in the parent's children array.
       */
      if (typeof index !== 'number' || !parent) {
        return;
      }

      /**
       * Skip already optimized images to prevent double-processing.
       * Pattern matches responsive width suffixes like "-640w.png".
       * This allows manual optimization overrides and prevents infinite loops.
       */
      if (/-\d+w\./.test(url)) {
        return;
      }

      /**
       * Process only supported raster image formats.
       * These formats benefit most from optimization and responsive sizing.
       * - PNG: Common for screenshots, diagrams, images with transparency.
       * - JPG/JPEG: Common for photos and complex images.
       *
       * Excluded formats:
       * - SVG: Vector graphics don't need raster optimization.
       * - WebP: Already optimized format.
       * - GIF: Would break animations.
       */
      if (/\.(png|jpg|jpeg)$/i.exec(url)) {
        /**
         * Parse the image path to extract directory and filename.
         * This allows us to maintain the original directory structure
         * in the optimized images directory.
         */
        const parsedPath = path.parse(url);
        const imageName = parsedPath.name;
        const imageDir = parsedPath.dir;

        /**
         * Responsive breakpoints matching Tailwind CSS.
         * These sizes cover the most common viewport widths:
         * - 640w: Mobile phones
         * - 768w: Small tablets
         * - 1024w: Large tablets
         * - 1280w: Small laptops
         * - 1536w: Large screens
         */
        const sizes = [640, 768, 1024, 1280, 1536];

        /**
         * Image formats in order of preference:
         * 1. AVIF: Best compression, newest format.
         * 2. WebP: Good compression, wide browser support.
         * 3. PNG: Universal fallback.
         *
         * Browsers will use the first supported format.
         */
        const formats = ['avif', 'webp', 'png'];

        /**
         * Generate the HTML picture element with all optimized sources.
         * This creates a complete responsive image solution:
         * - Multiple format sources for browser compatibility.
         * - Responsive srcsets for different viewport sizes.
         * - Proper fallback img element.
         * - Lazy loading for performance.
         * - Preserved alt text for accessibility.
         */
        // Construct the optimized image base path
        const normalizedImageDir = imageDir === '' ? '' : imageDir.startsWith('/') ? imageDir : `/${imageDir}`;
        const optimizedBasePath = `/optimized-images${normalizedImageDir}/${imageName}`;

        // Use the largest optimized PNG as fallback (better than uncompressed original)
        const fallbackImagePath = `${optimizedBasePath}-1536w.png`;

        /**
         * Create source elements for AVIF and WebP formats
         */
        const sourceElements: MdxJsxElement[] = formats.slice(0, -1).map(
          (format): MdxJsxElement => ({
            type: 'mdxJsxFlowElement',
            name: 'source',
            attributes: [
              {
                type: 'mdxJsxAttribute',
                name: 'type',
                value: `image/${format}`,
              },
              {
                type: 'mdxJsxAttribute',
                name: 'srcSet',
                value: sizes.map(size => `${optimizedBasePath}-${size}w.${format} ${size}w`).join(', '),
              },
              {
                type: 'mdxJsxAttribute',
                name: 'sizes',
                value:
                  '(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, 1536px',
              },
            ],
            children: [],
            data: { _mdxExplicitJsx: true },
          }),
        );

        /**
         * Create the fallback img element
         */
        const imgElement: MdxJsxElement = {
          type: 'mdxJsxFlowElement',
          name: 'img',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'src',
              value: fallbackImagePath,
            },
            {
              type: 'mdxJsxAttribute',
              name: 'srcSet',
              value: sizes.map(size => `${optimizedBasePath}-${size}w.png ${size}w`).join(', '),
            },
            {
              type: 'mdxJsxAttribute',
              name: 'sizes',
              value:
                '(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, 1536px',
            },
            {
              type: 'mdxJsxAttribute',
              name: 'alt',
              value: alt ?? '',
            },
            {
              type: 'mdxJsxAttribute',
              name: 'loading',
              value: 'lazy',
            },
          ],
          children: [],
          data: { _mdxExplicitJsx: true },
        };

        /**
         * Create the picture element with source and img children
         */
        const pictureElement: MdxJsxElement = {
          type: 'mdxJsxFlowElement',
          name: 'picture',
          attributes: [],
          children: [...sourceElements, imgElement],
          data: { _mdxExplicitJsx: true },
        };

        /**
         * Replace the markdown image node with the MDX JSX picture element.
         * This transforms the AST from a simple image to a complex JSX structure.
         * The JSX will be properly handled by MDX during compilation.
         */
        parent.children[index] = pictureElement;
      }
    });
  };
}

export default remarkOptimizeImages;
