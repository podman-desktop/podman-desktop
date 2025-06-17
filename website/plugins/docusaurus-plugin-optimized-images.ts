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

import path from 'node:path';

import type { ConfigureWebpackUtils, LoadContext, Plugin, PluginOptions, Props } from '@docusaurus/types';
import type { ConfigureWebpackResult } from '@docusaurus/types/src/plugin';
import type { Configuration } from 'webpack';

/**
 * Custom webpack result interface.
 * Extends the base ConfigureWebpackResult to include dev server configuration.
 * This ensures proper typing for our dev server static file serving setup.
 */
interface CustomConfigureWebpackResult extends ConfigureWebpackResult {
  devServer: {
    static: [
      {
        directory: string;
        publicPath: string;
        serveIndex: boolean;
      },
    ];
  };
}

/**
 * Docusaurus plugin factory function.
 *
 * Creates a plugin that integrates the image optimization system with Docusaurus.
 * The plugin configures both build-time and development-time serving of optimized images.
 *
 * @param context - Docusaurus load context containing site configuration
 * @param _options - Plugin options (currently unused but reserved for future configuration)
 * @returns A Docusaurus plugin object with webpack and build hooks
 */
export default function (context: LoadContext, _options: PluginOptions): Plugin<void> {
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
    configureWebpack(
      config: Configuration,
      _isServer: boolean,
      _utils: ConfigureWebpackUtils,
    ): CustomConfigureWebpackResult {
      return {
        resolve: {
          alias: {
            // Preserve any existing aliases from the base configuration.
            ...config.resolve?.alias,

            /**
             * Alias for optimized images directory.
             * Maps /optimized-images requests to the static/optimized-images directory.
             * This enables import/require statements to resolve optimized images correctly.
             */
            '/optimized-images': path.join(context.siteDir, 'static/optimized-images'),
          },
        },
        devServer: {
          static: [
            {
              /**
               * Static file serving configuration for development.
               * Serves optimized images from the static directory during `docusaurus start`.
               * This ensures the same URL structure works in both development and production.
               */
              directory: path.join(context.siteDir, 'static/optimized-images'),
              publicPath: '/optimized-images',
              serveIndex: false, // Disable directory indexing for security
            },
          ],
        },
      };
    },

    /**
     * Post-build hook for production deployment.
     *
     * Called after the Docusaurus build completes successfully.
     * Provides feedback about optimized image availability and any final setup.
     *
     * In production, Docusaurus automatically copies static files to the build output,
     * so optimized images are served directly by the web server.
     *
     * @param _props - Build properties and metadata (unused)
     */
    async postBuild(_props: Props): Promise<void> {
      // Optimized images are automatically copied by Docusaurus.
      console.log('Optimized images ready for production build');
    },
  };
}
