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
 * Image node interface.
 */
interface ImageNode extends Node {
  type: 'image';
  url: string;
  alt?: string;
}

/**
 * HTML node interface.
 */
interface HtmlNode extends Node {
  type: 'html';
  value: string;
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
  return (tree: Node, _file: VFile): void => {
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
        const pictureHtml = `
<picture>
  ${formats
    .slice(0, -1) // All formats except the last (which goes in the img element)
    .map(
      format => `
  <source
    type="image/${format}"
    srcset="${sizes.map(size => `/optimized-images${imageDir}/${imageName}-${size}w.${format} ${size}w`).join(', ')}"
    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, 1536px"
  />`,
    )
    .join('')}
  <img
    src="${url}"
    srcset="${sizes.map(size => `/optimized-images${imageDir}/${imageName}-${size}w.png ${size}w`).join(', ')}"
    sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, 1536px"
    alt="${alt ?? ''}"
    loading="lazy"
  />
</picture>`;

        /**
         * Replace the markdown image node with an HTML node.
         * This transforms the AST from a simple image to a complex HTML structure.
         * The HTML will be preserved in the final output.
         */
        const htmlNode: HtmlNode = {
          type: 'html',
          value: pictureHtml.trim(),
        };
        parent.children[index] = htmlNode;
      }
    });
  };
}

// CommonJS export for compatibility with Docusaurus.
module.exports = remarkOptimizeImages;
