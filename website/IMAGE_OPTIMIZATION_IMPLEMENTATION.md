# Image Optimization Implementation for Podman Desktop Website

## Summary

This implementation provides automatic image optimization for the Podman Desktop website, converting large images to modern formats with responsive sizes at build time. The system includes automatic optimization for both React components and markdown blog posts.

## What was implemented

### 1. Build-time image optimization script

- **File**: `website/scripts/optimize-images.js`
- **Purpose**: Automatically converts images to modern formats during build
- **Features**:
  - Converts to WebP (85% quality), AVIF (80% quality), and PNG (for compatibility)
  - Generates responsive sizes (`640w`, `768w`, `1024w`, `1280w`, `1536w`) – matching Tailwind breakpoints
  - Processes existing WebP files for responsive sizes
  - Outputs to `static/optimized-images` (accessible as `/optimized-images` in browser)
  - Only processes new/updated images (incremental optimization)
  - Shows progress and savings statistics
  - Intelligent filtering of already optimized images

### 2. `OptimizedImage` React component

- **File**: `website/src/components/OptimizedImage.tsx`
- **Purpose**: Renders optimized images with automatic format fallback
- **Features**:
  - Generates `<picture>` element with AVIF, WebP, and PNG sources
  - Supports light/dark theme variants (compatible with ThemedImage)
  - Provides responsive `srcset` with proper breakpoints
  - Falls back to original image if optimized versions don't exist
  - TypeScript support with proper types
  - Special handling for small images (banners, icons) without responsive sizes
  - Graceful error handling and fallback mechanisms

### 3. Remark plugin for automatic blog post optimization

- **File**: `website/plugins/remark-optimize-images.js`
- **Purpose**: Automatically transforms markdown images to use optimized versions
- **Features**:
  - Converts `![alt](image.png)` to `<picture>` elements with AVIF/WebP/PNG sources
  - Generates responsive srcsets for all breakpoints
  - Skips external URLs and already optimized images
  - Works automatically with all blog posts and markdown content
  - No manual intervention required for blog authors

### 4. Docusaurus plugin for optimized images

- **File**: `website/plugins/docusaurus-plugin-optimized-images.js`
- **Purpose**: Configures Docusaurus to properly serve optimized images
- **Features**:
  - Ensures optimized images are accessible at `/optimized-images` URL path
  - Handles both development and production builds
  - Automatic integration with Docusaurus static file serving

### 5. Integration with build process

- **Modified**: `website/package.json` and main `package.json`
- **Website build script**: `"build": "NODE_ENV=production node scripts/optimize-images.js --production && docusaurus build"`
- **Main project script**: `"website:build": "pnpm run storybook:build && cd website && pnpm run docusaurus clear && pnpm run optimize-images && pnpm run docusaurus build --no-minify"`
- **Also added**: Standalone script: `"optimize-images": "node scripts/optimize-images.js"`

### 6. Docusaurus configuration integration

- **Modified**: `website/docusaurus.config.js`
- **Added**: Remark plugin integration for automatic blog post optimization
- **Configuration**: Blog preset includes `remarkPlugins: [require('./plugins/remark-optimize-images')]`

## Results achieved

Testing on the largest images showed impressive results:

- **5.6MB PNG → 0.24MB WebP** (95.7% reduction)
- **1.6MB PNG → 0.25MB WebP** (84.6% reduction)
- **1.3MB PNG → 0.24MB WebP** (81.6% reduction)

## How to use

### For developers

1. **No manual steps required** – optimization runs automatically during build
2. To optimize images manually: `pnpm run optimize-images` (from website directory)
3. To use optimized images in React components:

   ```tsx
   import OptimizedImage from '../components/OptimizedImage';

   // Single image
   <OptimizedImage
     src="img/features/containers.png"
     alt="Description"
     className="w-full"
   />

   // Light/dark theme variants
   <OptimizedImage
     sources={{
       light: "img/logo-light.png",
       dark: "img/logo-dark.png"
     }}
     alt="Logo"
     className="w-full"
   />

   // Small images (banners, icons) - automatically detected
   <OptimizedImage
     src="img/banner/icon.png"
     alt="Icon"
     className="h-8"
   />
   ```

### For blog posts

**Completely automatic** – no manual steps required:

- Write normal markdown: `![Screenshot](../img/blog/screenshot.png)`
- The remark plugin automatically converts to optimized `<picture>` elements
- All responsive sizes and formats are generated automatically
- External URLs and non-optimizable images are left unchanged

### For existing content

- **React components**: Replace `<img>` or `<ThemedImage>` with `<OptimizedImage>`
- **Blog posts**: No changes needed – optimization is automatic for new builds
- **Static images**: Continue using normal paths – optimized versions are served when available

## Technical notes

- The solution is **build-time only** – no runtime overhead
- WebP and AVIF images are created **alongside** originals, not replacing them
- The optimization is **incremental** – only new/changed images are processed
- All optimized images maintain the same directory structure as originals
- Optimized images are placed in `static/optimized-images` and are **excluded from git** (configured in `.gitignore`)
- Small images (banners, icons) get optimized formats but not responsive sizes
- The system gracefully handles missing optimized images by falling back to originals
- External URLs and SVG images are automatically skipped by all optimization components

## File structure

```
website/
├── scripts/
│   └── optimize-images.js          # Build-time optimization script
├── src/
│   └── components/
│       └── OptimizedImage.tsx      # React component for optimized images
├── plugins/
│   ├── remark-optimize-images.js   # Markdown transformation plugin
│   └── docusaurus-plugin-optimized-images.js  # Docusaurus integration
├── static/
│   ├── img/                        # Original images
│   └── optimized-images/           # Generated optimized images (gitignored)
├── docusaurus.config.js            # Includes remark plugin configuration
├── package.json                    # Build scripts
└── .gitignore                      # Excludes generated images
```
