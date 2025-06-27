# Image optimization implementation

This implementation provides automatic image optimization, converting images to modern formats with responsive sizes at build time.

## Overview

- **Build script**: `website/scripts/optimize-images.ts`
- **React component**: `website/src/components/OptimizedImage.tsx`
- **Markdown plugin**: `website/plugins/remark-optimize-images.ts`
- **Docusaurus plugin**: `website/plugins/docusaurus-plugin-optimized-images.ts`

## Features

### Image processing

- Converts to WebP (85%), AVIF (80%), and PNG (fallback).
- Generates responsive sizes: `640w`, `768w`, `1024w`, `1280w`, `1536w`.
- Processes existing WebP files for responsive sizes.
- Outputs to `static/optimized-images/`.
- Incremental optimization (only processes new/changed images).
- Batch processing with configurable concurrency (default: 10).
- Validates output to prevent 0-byte files.
- GIF images are skipped to preserve animations.

### Progress tracking

Real-time progress bar with ETA:

```text
* Images  █████░░░░░░░░░░░░░░░░░░░░░░░░░ optimizing (18%) 60/335 images 1017/5620 operations ETA: 2m 56s
```

### Features

- Adaptive ETA based on actual processing speed.
- Dual tracking (operations and completed images).
- Performance statistics on completion.
- Human-readable duration formatting.

### Error handling

- ❌ Error: Processing failures with details.
- ⚠️ Warning: Images that failed to generate variants.
- Silent: Successfully cached/skipped images.

---

## Usage

### In React components

```tsx
import OptimizedImage from '../components/OptimizedImage';

// Basic usage
<OptimizedImage
  src="img/features/containers.png"
  alt="Description"  // Required for accessibility
  className="w-full"
/>

// Theme variants (two options)
<OptimizedImage
  sources={{
    light: "img/logo-light.png",
    dark: "img/logo-dark.png"
  }}
  alt="Logo"
/>

// Or using darkSrc
<OptimizedImage
  src="img/logo-light.png"
  darkSrc="img/logo-dark.png"
  alt="Logo"
/>

// Custom responsive sizes
<OptimizedImage
  src="img/hero.png"
  alt="Hero image"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Component features

- Mandatory alt text for accessibility.
- Smart detection skips optimization for external URLs, SVGs, and data URLs.
- Prop validation with developer-friendly error messages.
- Performance optimized with React hooks (useMemo, useCallback).
- Automatic fallback to original image on error.

### In markdown/blog posts

Write normal markdown:

```markdown
![Screenshot](../img/blog/screenshot.png)
```

The remark plugin automatically:

- Converts to optimized `<picture>` elements.
- Only processes PNG/JPG/JPEG files (not WebP).
- Skips already optimized images (with `-640w` style suffixes).
- Preserves external URLs unchanged.
- GIF images are skipped to preserve animations.

### Build Integration

```json
{
  "build": "tsx ./scripts/optimize-images.ts && docusaurus build",
  "optimize-images": "tsx ./scripts/optimize-images.ts"
}
```

- **Docusaurus integration:** Ensure the plugin is added to your `docusaurus.config.js`:
  ```js
  plugins: [
    require.resolve('./plugins/docusaurus-plugin-optimized-images.ts'),
    // ...other plugins
  ];
  ```

---

## Testing

150+ tests across 6 test files covering:

- Component behavior and accessibility.
- Plugin integration.
- Progress tracking and ETA calculation.
- Cross-platform compatibility.
- Error scenarios.

Run tests:

```bash
pnpm test          # Run all tests
pnpm test --watch  # Watch mode
```

---

## Results

Example size reductions:

- 5.6MB PNG → 0.24MB WebP (95.7% reduction).
- 1.6MB PNG → 0.25MB WebP (84.6% reduction).

---

## File structure

```
website/
├── scripts/
│   └── optimize-images.ts                     # Build optimization
├── src/components/
│   └── OptimizedImage.tsx                     # React component
├── plugins/
│   ├── remark-optimize-images.ts              # Markdown plugin
│   └── docusaurus-plugin-optimized-images.ts  # Docusaurus integration
├── static/
│   ├── img/                                   # Original images
│   └── optimized-images/                      # Generated (gitignored)
└── docusaurus.config.js                       # Plugin configuration
```

---

## Technical Notes

- Build-time only (no runtime overhead).
- Incremental optimization **detects changes using file modification time (mtime)** to process only new or changed images.
- Graceful fallback to original images.
- External URLs and SVGs automatically skipped.
- Small images (banners/icons) get format conversion only, no responsive sizes.
- Cross-platform compatible (Windows/Unix) with normalized path handling.
- **Enhanced path normalization using `path.posix.normalize` for consistent cross-platform behavior.**
- **Concurrency for batch processing can be configured by setting the `OPTIMIZE_IMAGES_CONCURRENCY` environment variable (default: 10).**
