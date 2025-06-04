/**
 * Remark plugin: Optimize images
 *
 * Automatically transforms markdown images in blog posts to use optimized versions.
 * Converts simple markdown images to HTML picture elements with responsive srcsets.
 *
 * Features:
 * - Converts ![alt](image.png) to <picture> elements with AVIF/WebP/PNG sources
 * - Generates responsive srcsets for all breakpoints
 * - Skips external URLs and already optimized images
 * - Works automatically with all blog posts and markdown content
 *
 * Example transformation:
 * Input:  ![Screenshot](/img/blog/screenshot.png)
 * Output: <picture> with AVIF, WebP, and PNG sources with full responsive srcsets
 */

const { visit } = require('unist-util-visit');
const path = require('path');

function remarkOptimizeImages() {
  return (tree, file) => {
    visit(tree, 'image', (node, index, parent) => {
      const { url, alt } = node;

      // Skip external URLs
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return;
      }

      // Skip already optimized images
      if (url.includes('-640w.') || url.includes('-768w.')) {
        return;
      }

      // Process PNG/JPG images only
      if (url.match(/\.(png|jpg|jpeg)$/i)) {
        const parsedPath = path.parse(url);
        const imageName = parsedPath.name;
        const imageDir = parsedPath.dir;

        const sizes = [640, 768, 1024, 1280, 1536];
        const formats = ['avif', 'webp', 'png'];

        // Generate HTML picture element with all optimized sources
        const pictureHtml = `
<picture>
  ${formats
    .slice(0, -1)
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
    alt="${alt || ''}"
    loading="lazy"
  />
</picture>`;

        // Replace markdown image with HTML picture element
        parent.children[index] = {
          type: 'html',
          value: pictureHtml.trim(),
        };
      }
    });
  };
}

module.exports = remarkOptimizeImages;
