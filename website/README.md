# Website

### Install the project dependencies

```shell-session
$ pnpm install
```

### Local Development of the website / documentation

```shell-session
$ pnpm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```shell-session
$ pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service. The build process includes automatic image optimization for better web performance.

**Note**: The build process is cross-platform compatible, using `cross-env` for Windows support.

### Testing

The test suite includes comprehensive coverage for:

- image optimization components and plugins,
- cross-platform compatibility,
- accessibility compliance,
- performance optimizations,
- error handling and edge cases.

All tests are well-documented with explanations of testing strategies and edge case coverage.

### Deployment

Using SSH:

```shell-session
$ USE_SSH=true pnpm deploy
```

Not using SSH:

```shell-session
$ GIT_USER=<Your GitHub username> pnpm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

### Image Optimization

The website includes an automatic image optimization system that runs during build:

```shell-session
$ pnpm run optimize-images
```

This converts images to modern formats (WebP, AVIF) with responsive sizes for better performance. The system is fully tested and documented. See [Image Optimization Implementation](IMAGE_OPTIMIZATION_IMPLEMENTATION.md) for details.

### Adding a Node.js module to the website

1. Add the module in the `website` context:

   ```shell-session
   $ cd website
   $ pnpm add <module>
   ```

2. Update the `pnpm-lock.yaml` file in the repository root context:

   ```shell-session
   $ cd ..
   $ git checkout HEAD -- pnpm-lock.yaml
   $ pnpm install
   ```

## Documentation

- [Image Optimization Implementation](IMAGE_OPTIMIZATION_IMPLEMENTATION.md) - Comprehensive guide to the automatic image optimization system with testing and implementation details.
