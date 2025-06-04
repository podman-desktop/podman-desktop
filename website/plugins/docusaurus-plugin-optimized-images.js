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

const path = require('path');

module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-optimized-images',

    configureWebpack(config, isServer, utils) {
      return {
        resolve: {
          alias: {
            ...config.resolve.alias,
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

    async postBuild({ siteDir, outDir }) {
      // Optimized images are automatically copied by Docusaurus
      console.log('Optimized images ready for production build');
    },
  };
};
