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

const BREAKPOINT_SIZES = [640, 768, 1024, 1280, 1536] as const;
const SIZES_ATTR =
  '(max-width: 640px) 100vw, (max-width: 768px) 100vw, ' +
  '(max-width: 1024px) 100vw, (max-width: 1280px) 100vw, 1536px';

const MODERN_FORMATS = ['avif', 'webp'] as const;
const FALLBACK_FORMAT = 'png';

const SKIP_IMAGE_RX = /-\d{2,5}w\.(?:png|jpe?g|webp|avif)$/i;
const SUPPORTED_IMAGE_RX = /\.(?:png|jpe?g)$/i;

// Replace every .replace(/\\/g, '/') + normalize chain.
function toPosix(p: string): string {
  return path.posix.normalize(p.replace(/\\/g, '/'));
}

// Builds the "-640w.avif 640w, -768w.avif 768w" string.
function makeSrcSet(base: string, fmt: string): string {
  return BREAKPOINT_SIZES.map(w => `${base}-${w}w.${fmt} ${w}w`).join(', ');
}

function computeAbsoluteOriginalUrl(filePath: string | undefined, url: string): string {
  if (!filePath) return url;

  const dirPath = path.dirname(filePath);
  const websiteIndex = dirPath.lastIndexOf('/website/');
  const relativePath = websiteIndex >= 0 ? dirPath.substring(websiteIndex + 9) : dirPath;
  return `/${toPosix(path.posix.join(relativePath, url))}`;
}

/**
 * Interface for image nodes in the markdown AST.
 */
interface ImageNode extends Node {
  type: 'image';
  url: string;
  alt?: string;
  title?: string;
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
 * Determines the correct optimized image path based on the source file context.
 * Maps relative image URLs to their optimized counterparts considering the source file location.
 *
 * @param imageUrl - The original image URL from the markdown
 * @param sourceFilePath - The path of the source markdown file
 * @returns The correct path for the optimized image
 */
export function getOptimizedImagePath(imageUrl: string, sourceFilePath?: string): string {
  const parsedUrl = path.parse(imageUrl);
  const imageName = parsedUrl.name;
  const imageDir = parsedUrl.dir;

  // Determine the source context from the file path.
  let optimizedDir = imageDir;

  if (sourceFilePath) {
    const sourceDir = path.dirname(sourceFilePath);

    // Convert absolute path to relative path if it contains the website directory.
    let relativePath: string;

    // Normalize source directory path across platforms using path.posix for consistent forward slash behavior.
    const normalizedSourceDir = toPosix(sourceDir);

    // Use path.posix.sep to ensure consistent separator matching across platforms.
    const websiteSegment = `${path.posix.sep}website${path.posix.sep}`;
    const websiteIndex = normalizedSourceDir.indexOf(websiteSegment);

    if (websiteIndex === -1) {
      // Fallback for relative paths - normalize using path.posix for consistent behavior.
      relativePath = toPosix(sourceDir);
    } else {
      // Extract path after '/website/' using proper path operations.
      const afterWebsite = normalizedSourceDir.substring(websiteIndex + websiteSegment.length);
      relativePath = toPosix(afterWebsite);
    }

    // For docs, tutorial, and blog images: resolve relative to their respective structures.
    if (relativePath.startsWith('docs') || relativePath.startsWith('tutorial') || relativePath.startsWith('blog')) {
      // Convert relative path to docs/tutorial/blog context using path joining.
      // Keep the full path structure for all content directories.
      optimizedDir = path.posix.join(relativePath, toPosix(imageDir));
    }

    // For other images: keep existing behavior.
    else {
      optimizedDir = imageDir;
    }
  }

  // Normalize the directory path for web URLs using path.posix.normalize.
  const normalizedOptimizedDir = toPosix(optimizedDir);
  let normalizedDir: string;

  if (normalizedOptimizedDir === '' || normalizedOptimizedDir === '.') {
    normalizedDir = '';
  } else {
    normalizedDir = normalizedOptimizedDir.startsWith('/') ? normalizedOptimizedDir : `/${normalizedOptimizedDir}`;
  }

  return `/optimized-images${normalizedDir}/${imageName}`;
}

/**
 * Checks if an image URL should be skipped from optimization.
 *
 * @param url - The image URL to check
 * @returns True if the image should be skipped, false otherwise
 */
function shouldSkipImage(url: string): boolean {
  return /^(?:https?:)?\/\//.test(url) || url.startsWith('pathname://') || SKIP_IMAGE_RX.test(url);
}

const isSupportedImageFormat = (url: string): boolean => SUPPORTED_IMAGE_RX.test(url);

function createSourceElements(base: string): MdxJsxElement[] {
  return MODERN_FORMATS.map(fmt => ({
    type: 'mdxJsxFlowElement',
    name: 'source',
    attributes: [
      { type: 'mdxJsxAttribute', name: 'type', value: `image/${fmt}` },
      { type: 'mdxJsxAttribute', name: 'srcSet', value: makeSrcSet(base, fmt) },
      { type: 'mdxJsxAttribute', name: 'sizes', value: SIZES_ATTR },
    ],
    children: [],
    data: { _mdxExplicitJsx: true },
  }));
}

function createImgElement(base: string, originalUrl: string, alt?: string, title?: string): MdxJsxElement {
  const attrs: MdxJsxAttribute[] = [
    { type: 'mdxJsxAttribute', name: 'src', value: originalUrl },
    {
      type: 'mdxJsxAttribute',
      name: 'srcSet',
      value: makeSrcSet(base, FALLBACK_FORMAT),
    },
    { type: 'mdxJsxAttribute', name: 'sizes', value: SIZES_ATTR },
    { type: 'mdxJsxAttribute', name: 'alt', value: alt ?? '' },
    { type: 'mdxJsxAttribute', name: 'loading', value: 'lazy' },
  ];

  if (title) {
    attrs.push({ type: 'mdxJsxAttribute', name: 'title', value: title });
  }

  return {
    type: 'mdxJsxFlowElement',
    name: 'img',
    attributes: attrs,
    children: [],
    data: { _mdxExplicitJsx: true },
  };
}

/**
 * Creates a picture element with source and img children.
 *
 * @param sourceElements - Array of source elements for different formats
 * @param imgElement - Fallback img element
 * @returns MDX JSX picture element
 */
function createPictureElement(sourceElements: MdxJsxElement[], imgElement: MdxJsxElement): MdxJsxElement {
  return {
    type: 'mdxJsxFlowElement',
    name: 'picture',
    attributes: [],
    children: [...sourceElements, imgElement],
    data: { _mdxExplicitJsx: true },
  };
}

/**
 * Creates a remark plugin that optimizes images in markdown content.
 *
 * This plugin uses the unified/remark AST (Abstract Syntax Tree) visitor pattern
 * to find image nodes and replace them with OptimizedImage components.
 *
 * The optimization strategy:
 * 1. Find all image nodes in the markdown AST.
 * 2. Filter out external URLs and already optimized images.
 * 3. Generate OptimizedImage component JSX.
 * 4. Replace the original image node with the component node.
 *
 * @returns A remark transformer function
 */
export function remarkOptimizeImages() {
  return function transformer(tree: Node, file: VFile): void {
    // Visit all image nodes in the AST.
    visit(tree, 'image', (node: ImageNode, index: number | undefined, parent: Parent | undefined) => {
      const { url, alt, title } = node;

      // Only process images that meet all optimization criteria.
      if (!shouldSkipImage(url) && typeof index === 'number' && parent && isSupportedImageFormat(url)) {
        const base = getOptimizedImagePath(url, file.path);
        const sources = createSourceElements(base);
        const img = createImgElement(base, computeAbsoluteOriginalUrl(file.path, url), alt, title);
        parent.children[index] = createPictureElement(sources, img);
      }
    });
  };
}

export default remarkOptimizeImages;
