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
 * Docusaurus plugin: Optimized images.
 *
 * Configures Docusaurus to serve optimized images from the correct directory.
 * Essential for making build-time generated images accessible in both development and production.
 *
 * Features:
 * - Uses static/optimized-images for both development and production.
 * - Ensures optimized images are accessible at /optimized-images URL path.
 * - Automatic integration with Docusaurus static file serving.
 * - Configures webpack aliases and dev server for proper image serving.
 *
 * Integration points:
 * - Webpack alias configuration for build-time resolution.
 * - Dev server static file serving for development.
 * - PostBuild hook for production deployment feedback.
 * - Cross-platform path handling for Windows/Unix compatibility.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

import type { LoadContext, Plugin, PluginOptions } from '@docusaurus/types';

/**
 * Plugin options for the optimized images plugin.
 */
interface OptimizedImagesPluginOptions extends PluginOptions {
  /**
   * The alias path for optimized images.
   * Defaults to '/optimized-images'.
   * This path should not conflict with existing static paths.
   */
  optimizedImagesAlias?: string;
}

/**
 * Gets the optimized images directory path.
 *
 * @param siteDir - The Docusaurus site directory
 * @returns The absolute path to the optimized images directory
 */
function getOptimizedImagesPath(siteDir: string): string {
  return path.join(siteDir, 'static/optimized-images');
}

/**
 * Validates the optimized images alias to prevent conflicts.
 *
 * @param alias - The alias to validate
 * @throws Error if the alias is invalid or may cause conflicts
 */
function validateOptimizedImagesAlias(alias: string): void {
  if (!alias.startsWith('/')) {
    throw new Error(
      `The alias "${alias}" for optimized images must start with '/'. ` +
        'Please choose a different alias by setting the "optimizedImagesAlias" option.',
    );
  }

  // Check for common conflicting paths
  const conflictingPaths = ['/img', '/assets', '/static'];
  if (conflictingPaths.some(path => alias === path || alias.startsWith(`${path}/`))) {
    throw new Error(
      `The alias "${alias}" for optimized images conflicts with a common static path. ` +
        'Please choose a different alias by setting the "optimizedImagesAlias" option.',
    );
  }
}

/**
 * Verifies the optimized images directory and logs status.
 *
 * @param optimizedImagesDir - Path to the optimized images directory
 */
function verifyOptimizedImages(optimizedImagesDir: string): void {
  try {
    const dirExists = fs.existsSync(optimizedImagesDir);

    if (dirExists) {
      const files = fs.readdirSync(optimizedImagesDir);
      const imageFiles = files.filter(file => /\.(?:jpg|jpeg|png|webp|avif|gif|svg)$/i.test(file));

      if (imageFiles.length === 0) {
        console.log('Optimized images directory exists but contains no image files');
      } else {
        console.log(`Optimized images ready for production build (${imageFiles.length} files processed)`);
      }
    } else {
      console.log('No optimized images directory found - images may not have been processed');
    }
  } catch (error) {
    console.warn('Unable to verify optimized images status:', error);
  }
}

/**
 * Docusaurus plugin factory function.
 *
 * Creates a plugin that integrates the image optimization system with Docusaurus.
 * The plugin configures both build-time and development-time serving of optimized images.
 *
 * @param context - Docusaurus load context containing site configuration
 * @param options - Plugin options including configurable alias
 * @returns A Docusaurus plugin object with webpack and build hooks
 */
export default function docusaurusPluginOptimizedImages(
  context: LoadContext,
  options: OptimizedImagesPluginOptions = {},
): Plugin {
  const optimizedImagesAlias = options.optimizedImagesAlias ?? '/optimized-images';

  // Validate the alias to prevent conflicts
  validateOptimizedImagesAlias(optimizedImagesAlias);

  return {
    // Plugin identifier for Docusaurus.
    name: 'docusaurus-plugin-optimized-images',

    /**
     * Configure webpack for optimized image serving.
     *
     * This hook modifies the webpack configuration to:
     * 1. Add an alias for /optimized-images path resolution.
     * 2. Configure dev server to serve optimized images during development.
     * 3. Preserve existing webpack configuration.
     *
     * @param config - Existing webpack configuration
     * @param _isServer - Whether this is a server-side build
     * @param _utils - Webpack configuration utilities (unused)
     * @returns Modified webpack configuration
     */
    configureWebpack(config, _isServer, _utils): object {
      return {
        resolve: {
          alias: {
            // Preserve any existing aliases from the base configuration.
            ...(config.resolve?.alias ?? {}),

            // Configurable alias for optimized images directory.
            // Maps requests to the static/optimized-images directory.
            // This enables import/require statements to resolve optimized images correctly.
            [optimizedImagesAlias]: getOptimizedImagesPath(context.siteDir),
          },
        },
        devServer: {
          static: [
            {
              // Static file serving configuration for development.
              // Serves optimized images from the static directory during `docusaurus start`.
              // This ensures the same URL structure works in both development and production.
              directory: getOptimizedImagesPath(context.siteDir),

              publicPath: optimizedImagesAlias,
              serveIndex: false, // Disable directory indexing for security
            },
          ],
        },
      };
    },

    /**
     * Post-build hook for production feedback.
     *
     * Executed after the Docusaurus build completes successfully.
     * Verifies the optimized images directory exists and contains files,
     * then provides feedback about the optimization system status.
     *
     * @param _props - Build completion properties (unused)
     */
    async postBuild(_props): Promise<void> {
      const optimizedImagesDir = getOptimizedImagesPath(context.siteDir);
      verifyOptimizedImages(optimizedImagesDir);
    },
  };
}
