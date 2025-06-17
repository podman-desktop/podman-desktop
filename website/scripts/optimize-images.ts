/**
 * Image optimization script.
 *
 * Automatically converts images to modern formats (WebP, AVIF) with responsive sizes.
 * Runs during the build process to optimize images without requiring manual intervention.
 *
 * Features:
 * - Converts PNG/JPEG to WebP (85% quality) and AVIF (80% quality).
 * - Generates responsive sizes matching Tailwind CSS breakpoints.
 * - Outputs to static/optimized-images for both production and development.
 * - Only processes new/changed images (incremental optimization).
 * - Intelligent filtering of already optimized images.
 */

import type { Stats } from 'node:fs';
import * as fs from 'node:fs';
import path from 'node:path';

import sharp from 'sharp';

const inputFormats = ['png', 'jpg', 'jpeg', 'webp'];
const outputFormats = ['webp', 'avif', 'png'];
const sizes = [640, 768, 1024, 1280, 1536];
const largestResponsiveSize = Math.max(...sizes);
const quality = {
  webp: 85,
  avif: 80,
  png: 95,
};

const compressors: Record<string, (i: sharp.Sharp) => sharp.Sharp> = {
  png: i => i.png({ compressionLevel: 9 }),
  avif: i => i.avif({ quality: quality.avif }),
  webp: i => i.webp({ quality: quality.webp }),
};

/**
 * Compress an image using the appropriate format.
 *
 * @param sharpInstance - The Sharp instance to compress
 * @param format - The format to compress to
 * @returns The compressed Sharp instance
 */
export function compressImage(sharpInstance: sharp.Sharp, format: string): sharp.Sharp {
  if (!compressors[format]) {
    throw new Error(`Unsupported image format: ${format}`);
  }

  return compressors[format](sharpInstance);
}

/**
 * Get the relative output directory for an image.
 *
 * @param dir - The directory of the image
 * @returns The relative output directory
 */
export function getRelativeOutputDir(dir: string): string {
  if (dir.startsWith('static')) {
    return path.relative('static', dir);
  }

  if (dir.startsWith('blog/img')) {
    // Images from `blog/img/...` should be mapped to `img/blog/...` to match `static/img/blog/...`
    return path.join('img/blog', path.relative('blog/img', dir));
  }

  if (dir.startsWith('blog')) {
    return path.relative('blog', dir);
  }
  return dir;
}

/**
 * Generate an optimized image.
 *
 * @param imagePath - The path to the image to optimize
 * @param outputPath - The path to the output image
 * @param format - The format to compress to
 * @param originalFileStats - The stats of the original file
 * @param resizeOptions - The options to resize the image
 * @returns A promise that resolves to an object with the processed flag and the saved bytes
 */
export async function generateOptimizedImage(
  imagePath: string,
  outputPath: string,
  format: string,
  originalFileStats: Stats,
  resizeOptions?: { width: number },
): Promise<{ processed: boolean; savedBytes: number }> {
  try {
    const outputStats = await fs.promises.stat(outputPath);
    if (outputStats.mtime > originalFileStats.mtime) {
      console.log(`  Skipping ${path.basename(outputPath)} (already up to date)`);
      return { processed: false, savedBytes: 0 };
    }
  } catch (e) {
    // File doesn't exist, proceed with optimization.
  }

  let sharpInstance = sharp(imagePath);

  if (resizeOptions) {
    sharpInstance = sharpInstance.resize(resizeOptions.width, null, {
      withoutEnlargement: true,
      fit: 'inside',
    });
  }

  sharpInstance = compressImage(sharpInstance, format);

  const outputBuffer = await sharpInstance.toBuffer();

  await fs.promises.writeFile(outputPath, outputBuffer);
  const outputSize = outputBuffer.length;
  const savedBytes = originalFileStats.size - outputSize;
  const savedPercent = ((savedBytes / originalFileStats.size) * 100).toFixed(1);

  console.log(`  Created ${path.basename(outputPath)} (${(outputSize / 1024).toFixed(0)} KB, saved ${savedPercent}%)`);

  return { processed: true, savedBytes };
}

/**
 * Optimize all images in the static and blog directories.
 *
 * @returns A promise that resolves when the optimization is complete
 */
export async function optimizeImages(): Promise<void> {
  const startTime = Date.now();

  console.log('Starting image optimization...');

  const { glob } = await import('glob');

  const rootSearchDirs = ['static', 'blog'];
  const patterns = rootSearchDirs.map(dir => `${dir}/**/*.{${inputFormats.join(',')}}`);
  const allImages = await glob(patterns, { nodir: true });
  const unwantedPatternRegex = /(?:optimized-images)|(?:-\d+w\.(png|jpg|jpeg|webp)$)/i;

  const images = allImages.filter(imagePath => {
    return !unwantedPatternRegex.exec(imagePath);
  });

  const buildDir = path.join(__dirname, '..', 'static', 'optimized-images');

  console.log(`Output directory: ${buildDir}`);

  const processingPromises = images.map(imagePath => {
    return optimizeImage(imagePath, buildDir);
  });

  const results = await Promise.all(processingPromises);
  const processedCount = results.reduce((total, result) => total + result.processedCount, 0);
  const savedBytes = results.reduce((total, result) => total + result.savedBytes, 0);
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  const savedMB = (savedBytes / 1024 / 1024).toFixed(1);

  console.log('\nImage optimization complete!');
  console.log(`Processed: ${processedCount} images`);
  console.log(`Total saved: ${savedMB} MB`);
  console.log(`Duration: ${duration} seconds`);
}

/**
 * Optimize an image.
 *
 * @param imagePath - The path to the image to optimize
 * @param buildDir - The directory to build the optimized image
 * @returns A promise that resolves to an object with the processed count and the saved bytes
 */
export async function optimizeImage(
  imagePath: string,
  buildDir: string,
): Promise<{ processedCount: number; savedBytes: number }> {
  try {
    const stats = await fs.promises.stat(imagePath);

    console.log(`Processing: ${imagePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

    const parsedPath = path.parse(imagePath);
    const relativeDir = getRelativeOutputDir(parsedPath.dir);
    const outputDir = path.join(buildDir, relativeDir);

    await fs.promises.mkdir(outputDir, { recursive: true });

    const metadata = await sharp(imagePath).metadata();

    return await processImageFormats(imagePath, outputDir, parsedPath, stats, metadata);
  } catch (error: unknown) {
    console.error(`  Error processing ${imagePath}:`, error);

    return { processedCount: 0, savedBytes: 0 };
  }
}

/**
 * Process an image into different formats and sizes.
 *
 * @param imagePath - The path to the image to optimize
 * @param outputDir - The directory to output the optimized images
 * @param parsedPath - The parsed path of the original image
 * @param stats - The stats of the original file
 * @param metadata - The metadata of the original image
 * @returns A promise that resolves to an object with the processed count and the saved bytes
 */
export async function processImageFormats(
  imagePath: string,
  outputDir: string,
  parsedPath: path.ParsedPath,
  stats: Stats,
  metadata: sharp.Metadata,
): Promise<{ processedCount: number; savedBytes: number }> {
  const widths = [
    ...sizes,
    metadata.width && !sizes.includes(metadata.width) && metadata.width <= largestResponsiveSize
      ? metadata.width
      : null,
  ].filter(Boolean) as number[];

  const tasks = outputFormats
    .filter(fmt => !(fmt === 'webp' && imagePath.endsWith('.webp')))
    .flatMap(fmt =>
      widths.map(width => {
        const name = `${parsedPath.name}-${width}w.${fmt}`;
        const out = path.join(outputDir, name);
        return generateOptimizedImage(imagePath, out, fmt, stats, { width });
      }),
    );

  const results = await Promise.all(tasks);
  return results.reduce(
    (acc, { processed, savedBytes }) => ({
      processedCount: acc.processedCount + (processed ? 1 : 0),
      savedBytes: acc.savedBytes + savedBytes,
    }),
    { processedCount: 0, savedBytes: 0 },
  );
}

if (require.main === module) {
  optimizeImages().catch(console.error);
}

module.exports = optimizeImages;
