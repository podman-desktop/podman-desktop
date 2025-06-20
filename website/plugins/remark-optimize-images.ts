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
    const websiteIndex = sourceDir.indexOf(path.sep + 'website' + path.sep);
    if (websiteIndex === -1) {
      // Fallback for relative paths.
      relativePath = sourceDir.replace(/\\/g, '/');
    } else {
      // Extract path after '/website/'.
      relativePath = sourceDir.substring(websiteIndex + '/website/'.length).replace(/\\/g, '/');
    }

    // For docs images: resolve relative to the docs structure.
    if (relativePath.startsWith('docs/')) {
      // Convert relative path to docs context using path joining.
      const resolvedPath = path.posix.join(relativePath, imageDir);

      // Extract the path relative to docs directory for optimization structure.
      if (resolvedPath.startsWith('docs/')) {
        optimizedDir = resolvedPath.substring('docs/'.length);
      } else {
        // Handle cases where image path goes outside docs (e.g., ../img).
        optimizedDir = imageDir;
      }
    }
    // For blog (and fallback) images: keep existing behavior.
    else {
      optimizedDir = imageDir;
    }
  }

  // Normalize the directory path for web URLs (always use forward slashes).
  const normalizedOptimizedDir = optimizedDir.replace(/\\/g, '/');
  const normalizedDir =
    normalizedOptimizedDir === ''
      ? ''
      : normalizedOptimizedDir.startsWith('/')
        ? normalizedOptimizedDir
        : `/${normalizedOptimizedDir}`;

  return `/optimized-images${normalizedDir}/${imageName}`;
}

/**
 * Checks if an image URL should be skipped from optimization.
 *
 * @param url - The image URL to check
 * @returns True if the image should be skipped, false otherwise
 */
function shouldSkipImage(url: string): boolean {
  // Skip external URLs, pathname:// protocol, or already optimized images.
  return (
    // External URLs for security and performance reasons.
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('//') ||
    // Images that use pathname:// protocol (already bypassing Docusaurus processing).
    url.startsWith('pathname://') ||
    // Already optimized images to prevent double-processing.
    // Pattern specifically matches responsive width suffixes at the end of filenames.
    /-\d{2,4}w\.(?:png|jpe?g|webp)$/i.test(url)
  );
}

/**
 * Checks if an image format is supported for optimization.
 *
 * @param url - The image URL to check
 * @returns True if the format is supported, false otherwise
 */
function isSupportedImageFormat(url: string): boolean {
  return /\.(?:png|jpe?g)$/i.test(url);
}

/**
 * Creates responsive image source elements for different formats.
 *
 * @param optimizedBasePath - Base path for optimized images
 * @param sizes - Array of responsive breakpoint sizes
 * @param formats - Array of image formats (excluding the fallback format)
 * @returns Array of MDX JSX source elements
 */
function createSourceElements(optimizedBasePath: string, sizes: number[], formats: string[]): MdxJsxElement[] {
  return formats.map(
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
}

/**
 * Creates the fallback img element with responsive attributes.
 *
 * @param optimizedBasePath - Base path for optimized images
 * @param sizes - Array of responsive breakpoint sizes
 * @param alt - Alt text for the image
 * @param title - Optional title attribute
 * @returns MDX JSX img element
 */
function createImgElement(optimizedBasePath: string, sizes: number[], alt?: string, title?: string): MdxJsxElement {
  const fallbackImagePath = `${optimizedBasePath}-1536w.png`;

  const attributes: MdxJsxAttribute[] = [
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
  ];

  if (title) {
    attributes.push({
      type: 'mdxJsxAttribute',
      name: 'title',
      value: title,
    });
  }

  return {
    type: 'mdxJsxFlowElement',
    name: 'img',
    attributes,
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
  return function transformer(tree: Node, file: VFile): void {
    // Visit all image nodes in the AST.
    visit(tree, 'image', (node: ImageNode, index: number | undefined, parent: Parent | undefined) => {
      const { url, alt, title } = node;

      // Only process images that meet all optimization criteria.
      if (!shouldSkipImage(url) && typeof index === 'number' && parent && isSupportedImageFormat(url)) {
        // Responsive breakpoints matching Tailwind CSS.
        // These sizes cover the most common viewport widths:
        // - 640w: Mobile phones
        // - 768w: Small tablets
        // - 1024w: Large tablets
        // - 1280w: Small laptops
        // - 1536w: Large screens
        const sizes = [640, 768, 1024, 1280, 1536];

        // Image formats in order of preference:
        // 1. AVIF: Best compression, newest format.
        // 2. WebP: Good compression, wide browser support.
        // 3. PNG: Universal fallback.
        // Browsers will use the first supported format.
        const formats = ['avif', 'webp'];

        // Construct the optimized image base path using context-aware mapping.
        const optimizedBasePath = getOptimizedImagePath(url, file.path);

        // Create source elements for modern formats (AVIF and WebP).
        const sourceElements = createSourceElements(optimizedBasePath, sizes, formats);

        // Create the fallback img element with optional title.
        const imgElement = createImgElement(optimizedBasePath, sizes, alt, title);

        // Replace the markdown image node with the MDX JSX picture element.
        // This transforms the AST from a simple image to a complex JSX structure.
        // The JSX will be properly handled by MDX during compilation.
        parent.children[index] = createPictureElement(sourceElements, imgElement);
      }
    });
  };
}

export default remarkOptimizeImages;
