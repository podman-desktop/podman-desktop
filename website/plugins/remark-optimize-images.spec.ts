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
 * @fileoverview Tests for the remark plugin that automatically optimizes images in markdown content.
 *
 * This test suite validates the core functionality of the remark-optimize-images plugin,
 * which transforms markdown images into optimized HTML picture elements with multiple formats
 * and responsive srcsets. The plugin is crucial for website performance as it:
 *
 * - Automatically converts images to modern formats (AVIF, WebP).
 * - Generates responsive srcsets for different viewport sizes.
 * - Preserves accessibility features like alt text.
 * - Skips external URLs and already optimized images.
 *
 * Testing strategy:
 * - Validate image format support and exclusions.
 * - Test URL filtering logic for security and performance.
 * - Verify HTML output structure and attributes.
 * - Check edge cases and error handling.
 */

import remarkParse from 'remark-parse';
import { unified } from 'unified';
import type { Node, Parent } from 'unist';
import type { VFile } from 'vfile';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { remarkOptimizeImages } from './remark-optimize-images';

interface ParagraphNode extends Parent {
  type: 'paragraph';
  children: Node[];
}

interface MdxJsxAttribute {
  type: 'mdxJsxAttribute';
  name: string;
  value: string;
}

interface MdxJsxElement extends Node {
  type: 'mdxJsxFlowElement';
  name: string;
  attributes: MdxJsxAttribute[];
  children: MdxJsxElement[];
  data: { _mdxExplicitJsx: true };
}

interface ImageNode extends Node {
  type: 'image';
  url: string;
  alt?: string;
}

// Mock VFile for testing.
const mockVFile = {} as VFile;

/**
 * Test data representing various markdown image scenarios.
 * Each test case targets specific plugin behavior and edge cases.
 */
const testMarkdowns = {
  // Supported formats that should be optimized.
  png: '### Podman Desktop\nPicture of General Kenobi ![Selfie](/img/blog/hello_there.png)',
  jpg: '### Podman Desktop\nPicture of General Kenobi ![Screenshot](/docs/images/screenshot.jpg)',
  jpeg: '### Podman Desktop\nPicture of General Kenobi ![Photo](/static/photo.jpeg)',

  // Formats that should be skipped (already optimized or unsupported).
  webp: '### Podman Desktop\nPicture of General Kenobi ![WebP Image](/img/test.webp)',
  svg: '### Podman Desktop\nPicture of General Kenobi ![SVG Icon](/img/icon.svg)',
  gif: '### Podman Desktop\nPicture of General Kenobi ![GIF Animation](/img/animation.gif)',

  // External URLs that should be skipped for security and performance.
  externalHttps: '### Podman Desktop\nPicture of General Kenobi ![External](https://example.com/image.png)',
  externalHttp: '### Podman Desktop\nPicture of General Kenobi ![External](http://example.com/image.png)',
  protocolRelative: '### Podman Desktop\nPicture of General Kenobi ![External](//example.com/image.png)',

  // Already optimized images that should be skipped.
  optimized: '### Podman Desktop\nPicture of General Kenobi ![Optimized](/img/blog/hello-640w.png)',
  optimizedWebp: '### Podman Desktop\nPicture of General Kenobi ![Optimized WebP](/img/blog/hello-1280w.webp)',
  optimizedJpeg: '### Podman Desktop\nPicture of General Kenobi ![Optimized JPEG](/img/blog/hello-768w.jpeg)',

  // Images that should NOT be skipped (false positives for the old regex)
  nameContainsNumbers: '### Podman Desktop\nPicture of General Kenobi ![My 100w Image](/img/blog/my-100w-image.png)',
  nameWithW: '### Podman Desktop\nPicture of General Kenobi ![Workshop](/img/blog/workshop.png)',

  // Alt text variations for accessibility testing.
  noAlt: '### Podman Desktop\nPicture of General Kenobi ![](/img/blog/no-alt.png)',
  emptyAlt: '### Podman Desktop\nPicture of General Kenobi ![](/img/blog/empty-alt.png)',

  // Special directory structures.
  rootImage: '### Podman Desktop\nPicture of General Kenobi ![Root](image.png)',
  multipleImages:
    '### Gallery\n![First](/img/first.png) and ![Second](/img/second.jpg) and ![Third](https://external.com/third.png)',
  mixedCase: '### Podman Desktop\nPicture of General Kenobi ![Mixed Case](/IMG/Blog/Test.PNG)',
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('remarkOptimizeImages', () => {
  describe('supported image format processing', () => {
    /**
     * Test PNG image transformation - the most common format.
     * Validates complete picture element generation with all required attributes.
     */
    test('should transform PNG images to picture elements', () => {
      const tree = unified().use(remarkParse).parse(testMarkdowns.png);
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      const pictureElement = (tree.children[1] as ParagraphNode).children[1] as MdxJsxElement;

      // Verify the image was transformed to a picture element.
      expect(pictureElement.type).toBe('mdxJsxFlowElement');
      expect(pictureElement.name).toBe('picture');

      // Check for modern formats (AVIF has best compression).
      const sources = pictureElement.children.filter(child => child.name === 'source');
      expect(sources).toHaveLength(2); // AVIF and WebP sources

      const avifSource = sources.find(source =>
        source.attributes.find(attr => attr.name === 'type' && attr.value === 'image/avif'),
      );
      expect(avifSource).toBeDefined();

      const webpSource = sources.find(source =>
        source.attributes.find(attr => attr.name === 'type' && attr.value === 'image/webp'),
      );
      expect(webpSource).toBeDefined();

      // Verify responsive srcsets are generated.
      const avifSrcSet = avifSource!.attributes.find(attr => attr.name === 'srcSet')?.value;
      expect(avifSrcSet).toContain('/optimized-images/img/blog/hello_there-640w.avif');

      // Check the fallback img element
      const imgElement = pictureElement.children.find(child => child.name === 'img');
      expect(imgElement).toBeDefined();

      const imgSrc = imgElement!.attributes.find(attr => attr.name === 'src')?.value;
      expect(imgSrc).toBe('/img/blog/hello_there.png');

      // Ensure accessibility is preserved.
      const imgAlt = imgElement!.attributes.find(attr => attr.name === 'alt')?.value;
      expect(imgAlt).toBe('Selfie');

      const imgLoading = imgElement!.attributes.find(attr => attr.name === 'loading')?.value;
      expect(imgLoading).toBe('lazy');
    });

    /**
     * Test JPG image transformation - common for photos.
     * Ensures consistent behavior across different extensions.
     */
    test('should transform JPG images to picture elements', () => {
      const tree = unified().use(remarkParse).parse(testMarkdowns.jpg);
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      const pictureElement = (tree.children[1] as ParagraphNode).children[1] as MdxJsxElement;
      expect(pictureElement.type).toBe('mdxJsxFlowElement');
      expect(pictureElement.name).toBe('picture');

      const sources = pictureElement.children.filter(child => child.name === 'source');
      const avifSource = sources.find(source =>
        source.attributes.find(attr => attr.name === 'type' && attr.value === 'image/avif'),
      );
      const avifSrcSet = avifSource!.attributes.find(attr => attr.name === 'srcSet')?.value;
      expect(avifSrcSet).toContain('/optimized-images/docs/images/screenshot-640w.avif');

      const imgElement = pictureElement.children.find(child => child.name === 'img');
      const imgAlt = imgElement!.attributes.find(attr => attr.name === 'alt')?.value;
      expect(imgAlt).toBe('Screenshot');
    });

    /**
     * Test JPEG image transformation - alternative extension.
     * Validates case-insensitive extension handling.
     */
    test('should transform JPEG images to picture elements', () => {
      const tree = unified().use(remarkParse).parse(testMarkdowns.jpeg);
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      const pictureElement = (tree.children[1] as ParagraphNode).children[1] as MdxJsxElement;
      expect(pictureElement.type).toBe('mdxJsxFlowElement');
      expect(pictureElement.name).toBe('picture');

      const sources = pictureElement.children.filter(child => child.name === 'source');
      const webpSource = sources.find(source =>
        source.attributes.find(attr => attr.name === 'type' && attr.value === 'image/webp'),
      );
      const webpSrcSet = webpSource!.attributes.find(attr => attr.name === 'srcSet')?.value;
      expect(webpSrcSet).toContain('/optimized-images/static/photo-768w.webp');

      const imgElement = pictureElement.children.find(child => child.name === 'img');
      const imgAlt = imgElement!.attributes.find(attr => attr.name === 'alt')?.value;
      expect(imgAlt).toBe('Photo');
    });

    /**
     * Test mixed case extension handling.
     * Important for cross-platform compatibility (Windows vs Unix).
     */
    test('should handle mixed case extensions', () => {
      const tree = unified().use(remarkParse).parse(testMarkdowns.mixedCase);
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      const pictureElement = (tree.children[1] as ParagraphNode).children[1] as MdxJsxElement;
      expect(pictureElement.type).toBe('mdxJsxFlowElement');
      expect(pictureElement.name).toBe('picture');

      const sources = pictureElement.children.filter(child => child.name === 'source');
      const avifSource = sources.find(source =>
        source.attributes.find(attr => attr.name === 'type' && attr.value === 'image/avif'),
      );
      const avifSrcSet = avifSource!.attributes.find(attr => attr.name === 'srcSet')?.value;
      expect(avifSrcSet).toContain('/optimized-images/IMG/Blog/Test-1024w.avif');
    });
  });

  describe('unsupported formats should be skipped', () => {
    /**
     * WebP images should be skipped as they're already optimized.
     * Prevents unnecessary processing and maintains original intent.
     */
    test('should skip WebP images (already optimized format)', () => {
      const originalTree = unified().use(remarkParse).parse(testMarkdowns.webp);
      const tree = unified().use(remarkParse).parse(testMarkdowns.webp);

      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      // Tree should remain unchanged.
      expect(tree).toStrictEqual(originalTree);
    });

    /**
     * SVG images should be skipped as they're vector-based.
     * SVGs are scalable and don't benefit from raster optimization.
     */
    test('should skip SVG images', () => {
      const originalTree = unified().use(remarkParse).parse(testMarkdowns.svg);
      const tree = unified().use(remarkParse).parse(testMarkdowns.svg);

      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      expect(tree).toStrictEqual(originalTree);
    });

    /**
     * GIF images should be skipped to preserve animation.
     * Optimization would break animated GIFs.
     */
    test('should skip GIF images', () => {
      const originalTree = unified().use(remarkParse).parse(testMarkdowns.gif);
      const tree = unified().use(remarkParse).parse(testMarkdowns.gif);

      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      expect(tree).toStrictEqual(originalTree);
    });
  });

  describe('external URLs should be skipped', () => {
    /**
     * HTTPS external URLs should be skipped for security and performance.
     * We can't optimize external images and shouldn't proxy them.
     */
    test('should skip HTTPS external URLs', () => {
      const originalTree = unified().use(remarkParse).parse(testMarkdowns.externalHttps);
      const tree = unified().use(remarkParse).parse(testMarkdowns.externalHttps);

      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      expect(tree).toStrictEqual(originalTree);
    });

    /**
     * HTTP external URLs should be skipped (same reasoning as HTTPS).
     * Also prevents mixed content issues on HTTPS sites.
     */
    test('should skip HTTP external URLs', () => {
      const originalTree = unified().use(remarkParse).parse(testMarkdowns.externalHttp);
      const tree = unified().use(remarkParse).parse(testMarkdowns.externalHttp);

      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      expect(tree).toStrictEqual(originalTree);
    });

    /**
     * Protocol-relative URLs should be skipped.
     * These are external URLs that inherit the current protocol.
     */
    test('should skip protocol-relative URLs', () => {
      const originalTree = unified().use(remarkParse).parse(testMarkdowns.protocolRelative);
      const tree = unified().use(remarkParse).parse(testMarkdowns.protocolRelative);

      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      expect(tree).toStrictEqual(originalTree);
    });
  });

  describe('already optimized images should be skipped', () => {
    /**
     * Images with responsive width suffixes should be skipped.
     * Prevents double-processing and maintains manual optimizations.
     */
    test('should skip images with responsive width suffixes', () => {
      const originalTree = unified().use(remarkParse).parse(testMarkdowns.optimized);
      const tree = unified().use(remarkParse).parse(testMarkdowns.optimized);

      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      expect(tree).toStrictEqual(originalTree);
    });

    /**
     * WebP images with responsive width suffixes should be skipped.
     * Tests the improved regex pattern with different formats.
     */
    test('should skip optimized WebP images', () => {
      const originalTree = unified().use(remarkParse).parse(testMarkdowns.optimizedWebp);
      const tree = unified().use(remarkParse).parse(testMarkdowns.optimizedWebp);

      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      expect(tree).toStrictEqual(originalTree);
    });

    /**
     * JPEG images with responsive width suffixes should be skipped.
     * Tests the improved regex pattern with jpeg extension.
     */
    test('should skip optimized JPEG images', () => {
      const originalTree = unified().use(remarkParse).parse(testMarkdowns.optimizedJpeg);
      const tree = unified().use(remarkParse).parse(testMarkdowns.optimizedJpeg);

      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      expect(tree).toStrictEqual(originalTree);
    });

    /**
     * Images with numbers in the name should NOT be skipped if they don't match the suffix pattern.
     * This tests that the improved regex avoids false positives.
     */
    test('should not skip images with numbers in filename that are not width suffixes', () => {
      const tree = unified().use(remarkParse).parse(testMarkdowns.nameContainsNumbers);
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      // Should be transformed to picture element
      const pictureElement = (tree.children[1] as ParagraphNode).children[1] as MdxJsxElement;
      expect(pictureElement.type).toBe('mdxJsxFlowElement');
      expect(pictureElement.name).toBe('picture');
    });

    /**
     * Images with 'w' in the name should NOT be skipped if they don't match the suffix pattern.
     * This tests that the improved regex avoids false positives.
     */
    test('should not skip images with w in filename that are not width suffixes', () => {
      const tree = unified().use(remarkParse).parse(testMarkdowns.nameWithW);
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      // Should be transformed to picture element
      const pictureElement = (tree.children[1] as ParagraphNode).children[1] as MdxJsxElement;
      expect(pictureElement.type).toBe('mdxJsxFlowElement');
      expect(pictureElement.name).toBe('picture');
    });
  });

  describe('alt text handling', () => {
    /**
     * Alt text should be preserved for accessibility.
     * Critical for screen readers and SEO.
     */
    test('should preserve alt text when present', () => {
      const tree = unified().use(remarkParse).parse(testMarkdowns.png);
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      const pictureElement = (tree.children[1] as ParagraphNode).children[1] as MdxJsxElement;
      const imgElement = pictureElement.children.find(child => child.name === 'img');
      const imgAlt = imgElement!.attributes.find(attr => attr.name === 'alt')?.value;
      expect(imgAlt).toBe('Selfie');
    });

    /**
     * Missing alt text should be handled gracefully.
     * Empty alt="" is better than missing alt for accessibility.
     */
    test('should handle missing alt text gracefully', () => {
      const tree = unified().use(remarkParse).parse(testMarkdowns.noAlt);
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      const pictureElement = (tree.children[1] as ParagraphNode).children[1] as MdxJsxElement;
      const imgElement = pictureElement.children.find(child => child.name === 'img');
      const imgAlt = imgElement!.attributes.find(attr => attr.name === 'alt')?.value;
      expect(imgAlt).toBe('');
    });

    /**
     * Empty alt text should be preserved.
     * Some images are intentionally decorative.
     */
    test('should preserve empty alt text', () => {
      const tree = unified().use(remarkParse).parse(testMarkdowns.emptyAlt);
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      const pictureElement = (tree.children[1] as ParagraphNode).children[1] as MdxJsxElement;
      const imgElement = pictureElement.children.find(child => child.name === 'img');
      const imgAlt = imgElement!.attributes.find(attr => attr.name === 'alt')?.value;
      expect(imgAlt).toBe('');
    });
  });

  describe('directory handling', () => {
    /**
     * Root-level images should work correctly.
     * Tests the path joining logic for minimal paths.
     */
    test('should handle root-level images', () => {
      const tree = unified().use(remarkParse).parse(testMarkdowns.rootImage);
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      const pictureElement = (tree.children[1] as ParagraphNode).children[1] as MdxJsxElement;
      const sources = pictureElement.children.filter(child => child.name === 'source');
      const avifSource = sources.find(source =>
        source.attributes.find(attr => attr.name === 'type' && attr.value === 'image/avif'),
      );
      const avifSrcSet = avifSource!.attributes.find(attr => attr.name === 'srcSet')?.value;
      expect(avifSrcSet).toContain('/optimized-images/image-640w.avif');
    });

    /**
     * Test docs image path mapping.
     * Images in docs should be mapped to the correct optimized location based on source file context.
     */
    test('should handle docs images with correct path mapping', () => {
      const docsMarkdown = '![Download DMG](img/download-dmg.png)';
      const docsVFile = { path: 'docs/installation/macos-install.md' } as VFile;

      const tree = unified().use(remarkParse).parse(docsMarkdown);
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, docsVFile);

      const pictureElement = (tree.children[0] as ParagraphNode).children[0] as MdxJsxElement;
      const sources = pictureElement.children.filter(child => child.name === 'source');
      const avifSource = sources.find(source =>
        source.attributes.find(attr => attr.name === 'type' && attr.value === 'image/avif'),
      );
      const avifSrcSet = avifSource!.attributes.find(attr => attr.name === 'srcSet')?.value;

      // Should map to the docs structure: /optimized-images/docs/installation/img/download-dmg-640w.avif.
      // Use cross-platform path expectation.
      expect(avifSrcSet).toMatch(/[/\\]optimized-images[/\\]docs[/\\]installation[/\\]img[/\\]download-dmg-640w\.avif/);

      // Check the fallback img element.
      const imgElement = pictureElement.children.find(child => child.name === 'img');
      const imgSrc = imgElement!.attributes.find(attr => attr.name === 'src')?.value;
      expect(imgSrc).toBe('/docs/installation/img/download-dmg.png');
    });

    /**
     * Test docs images with nested paths.
     * Ensures complex docs directory structures are handled correctly.
     */
    test('should handle nested docs images', () => {
      const nestedDocsMarkdown = '![Nested Image](../shared/screenshot.png)';
      const nestedDocsVFile = { path: 'docs/installation/windows/windows-install.md' } as VFile;

      const tree = unified().use(remarkParse).parse(nestedDocsMarkdown);
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, nestedDocsVFile);

      const pictureElement = (tree.children[0] as ParagraphNode).children[0] as MdxJsxElement;
      const imgElement = pictureElement.children.find(child => child.name === 'img');
      const imgSrc = imgElement!.attributes.find(attr => attr.name === 'src')?.value;

      // Should resolve relative path correctly: docs/installation/shared/screenshot.
      expect(imgSrc).toBe('/docs/installation/shared/screenshot.png');
    });
  });

  describe('multiple image handling', () => {
    /**
     * Multiple images in one paragraph should be handled correctly.
     * Tests the visitor pattern with multiple matches.
     */
    test('should handle multiple images in one paragraph', () => {
      const tree = unified().use(remarkParse).parse(testMarkdowns.multipleImages);
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      // Check that supported formats were transformed.
      const firstImage = (tree.children[1] as ParagraphNode).children[0] as MdxJsxElement;
      expect(firstImage.type).toBe('mdxJsxFlowElement');
      expect(firstImage.name).toBe('picture');

      const firstSources = firstImage.children.filter(child => child.name === 'source');
      const firstAvifSource = firstSources.find(source =>
        source.attributes.find(attr => attr.name === 'type' && attr.value === 'image/avif'),
      );
      const firstAvifSrcSet = firstAvifSource!.attributes.find(attr => attr.name === 'srcSet')?.value;
      expect(firstAvifSrcSet).toContain('/optimized-images/img/first-640w.avif');

      const secondImage = (tree.children[1] as ParagraphNode).children[2] as MdxJsxElement;
      expect(secondImage.type).toBe('mdxJsxFlowElement');
      expect(secondImage.name).toBe('picture');

      const secondSources = secondImage.children.filter(child => child.name === 'source');
      const secondAvifSource = secondSources.find(source =>
        source.attributes.find(attr => attr.name === 'type' && attr.value === 'image/avif'),
      );
      const secondAvifSrcSet = secondAvifSource!.attributes.find(attr => attr.name === 'srcSet')?.value;
      expect(secondAvifSrcSet).toContain('/optimized-images/img/second-640w.avif');

      // Check that external URLs were skipped.
      const thirdImage = (tree.children[1] as ParagraphNode).children[4] as ImageNode;
      expect(thirdImage.type).toBe('image');
      expect(thirdImage.url).toBe('https://external.com/third.png');
    });
  });

  describe('edge cases', () => {
    /**
     * Empty markdown should not cause errors.
     * Tests graceful handling of minimal input.
     */
    test('should handle empty markdown gracefully', () => {
      const tree = unified().use(remarkParse).parse('');
      const imageTransformer = remarkOptimizeImages();

      expect(() => {
        imageTransformer(tree, mockVFile);
      }).not.toThrow();
    });

    /**
     * Markdown without images should be unchanged.
     * Tests the visitor pattern with no matches.
     */
    test('should handle markdown without images', () => {
      const originalTree = unified().use(remarkParse).parse('### Just a heading\n\nSome text here.');
      const tree = unified().use(remarkParse).parse('### Just a heading\n\nSome text here.');

      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      expect(tree).toStrictEqual(originalTree);
    });

    /**
     * Images at the top level should be handled correctly.
     * Tests AST structure assumptions.
     */
    test('should handle images in different AST positions', () => {
      const tree = unified().use(remarkParse).parse('![Image](image.png)');
      const imageTransformer = remarkOptimizeImages();
      imageTransformer(tree, mockVFile);

      expect((tree.children[0] as ParagraphNode).children[0].type).toBe('mdxJsxFlowElement');
    });
  });
});
