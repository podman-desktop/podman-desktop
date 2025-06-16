/**
 * Docusaurus plugin: Optimized images
 *
 * Configures Docusaurus to serve optimized images from the correct directory.
 * Essential for making build-time generated images accessible in both development and production.
 *
 * Features:
 * - Uses static/optimized-images for both development and production
 * - Ensures optimized images are accessible at /optimized-images URL path
 * - Automatic integration with Docusaurus static file serving
 * - Configures webpack aliases and dev server for proper image serving
 */

import path from 'node:path';

import type { ConfigureWebpackUtils, LoadContext, Plugin, PluginOptions, Props } from '@docusaurus/types';
import type { ConfigureWebpackResult } from '@docusaurus/types/src/plugin';
import type { Configuration } from 'webpack';

interface CustomConfifureWebpackResult extends ConfigureWebpackResult {
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

export default function (context: LoadContext, _options: PluginOptions): Plugin<void> {
  return {
    name: 'docusaurus-plugin-optimized-images',

    configureWebpack(
      config: Configuration,
      _isServer: boolean,
      _utils: ConfigureWebpackUtils,
    ): CustomConfifureWebpackResult {
      return {
        resolve: {
          alias: {
            ...config.resolve?.alias,
            '/optimized-images': path.join(context.siteDir, 'static/optimized-images'),
          },
        },
        devServer: {
          static: [
            {
              directory: path.join(context.siteDir, 'static/optimized-images'),
              publicPath: '/optimized-images',
              serveIndex: false,
            },
          ],
        },
      };
    },

    async postBuild(_props: Props): Promise<void> {
      // Optimized images are automatically copied by Docusaurus
      console.log('Optimized images ready for production build');
    },
  };
}
