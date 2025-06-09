/**
 * Image optimization script
 *
 * Automatically converts images to modern formats (WebP, AVIF) with responsive sizes.
 * Runs during the build process to optimize images without requiring manual intervention.
 *
 * Features:
 * - Converts PNG/JPEG to WebP (85% quality) and AVIF (80% quality)
 * - Generates responsive sizes matching Tailwind CSS breakpoints
 * - Outputs to static/optimized-images for both production and development
 * - Only processes new/changed images (incremental optimization)
 * - Intelligent filtering of already optimized images
 */

import * as fs from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const inputFormats = ['png', 'jpg', 'jpeg', 'webp'];
const outputFormats = ['webp', 'avif', 'png'];
const sizes = [640, 768, 1024, 1280, 1536];
const quality = {
  webp: 85,
  avif: 80,
  png: 95,
};

function compreseImage(sharpInstance: sharp.Sharp, format: string): sharp.Sharp {
  switch (format) {
    case 'png':
      sharpInstance = sharpInstance.png({ compressionLevel: 9 });
      break;
    case 'avif':
      sharpInstance = sharpInstance.avif({ quality: quality['avif'] });
      break;
    case 'webp':
      sharpInstance = sharpInstance.webp({ quality: quality['webp'] });
      break;
  }

  return sharpInstance;
}

// Source: https://cheatcode.co/blog/how-to-read-and-filter-a-directory-recursively-in-node-js
async function walk(dir: string, allowedExts: string[]): Promise<(string | undefined)[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async entry => {
      const res: string = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(res, allowedExts);
      } else if (entry.isFile()) {
        const fileExt = path.extname(res).toLowerCase();
        if (allowedExts.includes(fileExt.substring(1))) {
          return res;
        }
      }
    }),
  );

  return files.flat();
}

async function optimizeImages(): Promise<void> {
  const startTime = Date.now();
  console.log('Starting image optimization...');

  // Find all images in static and blog directories
  const rootSearchDirs = ['static', 'blog'].map(dir => path.resolve(dir));

  const allImages = (await Promise.all(rootSearchDirs.map(dir => walk(dir, inputFormats)))).flat();

  // Filter out already optimized images
  const unwantedPatternRegex = /(?:optimized-images)|(?:-\d+w\.(png|jpg|jpeg|webp)$)/i;
  const images = allImages.filter(imagePath => {
    if (!imagePath) {
      return false;
    }
    return !unwantedPatternRegex.exec(imagePath);
  });

  const buildDir = path.join(__dirname, '..', 'static', 'optimized-images');
  console.log(`Output directory: ${buildDir}`);

  let processedCount = 0;
  let savedBytes = 0;

  for (const imagePath of images) {
    if (!imagePath) return;
    const stats = await fs.stat(imagePath);

    console.log(`Processing: ${imagePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

    const parsedPath = path.parse(imagePath);
    let relativeDir = parsedPath.dir;
    if (relativeDir.startsWith('static/')) {
      relativeDir = relativeDir.slice(7);
    }
    const outputDir = path.join(buildDir, relativeDir);

    await fs.mkdir(outputDir, { recursive: true });

    try {
      const metadata = await sharp(imagePath).metadata();

      for (const format of outputFormats) {
        // Skip WebP generation if input is already WebP (but still process AVIF and PNG)
        if (imagePath.endsWith(`.${format}`) && format === 'webp') {
          continue;
        }

        // Generate responsive sizes
        for (const width of sizes) {
          if (metadata.width && metadata.width < width) {
            continue;
          }

          const outputName = `${parsedPath.name}-${width}w.${format}`;
          const outputPath = path.join(outputDir, outputName);

          // Skip if already exists and is newer
          try {
            const outputStats = await fs.stat(outputPath);
            if (outputStats.mtime > stats.mtime) {
              console.log(`  Skipping ${outputName} (already up to date)`);
              continue;
            }
          } catch (e) {
            // File doesn't exist, proceed with optimization
          }

          let sharpInstance = sharp(imagePath).resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside',
          });

          sharpInstance = compreseImage(sharpInstance, format);

          const outputBuffer = await sharpInstance.toBuffer();
          await fs.writeFile(outputPath, outputBuffer);

          const outputSize = outputBuffer.length;
          const savedPercent = (((stats.size - outputSize) / stats.size) * 100).toFixed(1);
          savedBytes += stats.size - outputSize;

          console.log(`  Created ${outputName} (${(outputSize / 1024).toFixed(0)} KB, saved ${savedPercent}%)`);
          processedCount++;
        }

        // Generate full-size optimized version
        const fullSizeName = `${parsedPath.name}.${format}`;
        const fullSizePath = path.join(outputDir, fullSizeName);

        try {
          const fullSizeStats = await fs.stat(fullSizePath);
          if (fullSizeStats.mtime > stats.mtime) {
            console.log(`  Skipping ${fullSizeName} (already up to date)`);
            continue;
          }
        } catch (e: unknown) {
          let sharpInstance = sharp(imagePath);

          sharpInstance = compreseImage(sharpInstance, format);

          const fullSizeBuffer = await sharpInstance.toBuffer();
          await fs.writeFile(fullSizePath, fullSizeBuffer);

          const savedPercent = (((stats.size - fullSizeBuffer.length) / stats.size) * 100).toFixed(1);
          savedBytes += stats.size - fullSizeBuffer.length;

          console.log(
            `  Created ${fullSizeName} (${(fullSizeBuffer.length / 1024).toFixed(0)} KB, saved ${savedPercent}%)`,
          );
          processedCount++;
        }
      }
    } catch (error: unknown) {
      console.error(`  Error processing ${imagePath}: ${error.message}`);
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(1);
  const savedMB = (savedBytes / 1024 / 1024).toFixed(1);

  console.log('\nImage optimization complete!');
  console.log(`Processed: ${processedCount} images`);
  console.log(`Total saved: ${savedMB} MB`);
  console.log(`Duration: ${duration} seconds`);
}

if (require.main === module) {
  optimizeImages().catch(console.error);
}

module.exports = optimizeImages;
