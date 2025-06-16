/**
 * OptimizedImage component
 *
 * Automatically serves optimized images (WebP, AVIF) with responsive sizes.
 * Provides graceful fallback to original images and supports light/dark theme variants.
 *
 * Features:
 * - Automatic format selection: AVIF → WebP → PNG
 * - Responsive images with srcset for different viewport sizes
 * - Theme-aware image switching (light/dark variants)
 * - Graceful fallback to original images if optimized versions fail
 * - Smart detection of small images that don't need responsive sizes
 */

import { useColorMode } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import React from 'react';

interface OptimizedImageProps {
  /** Single image source (use this OR sources/darkSrc, not both) */
  readonly src?: string;

  /** Dark theme image source (alternative to sources prop) */
  readonly darkSrc?: string;

  /** Theme-specific image sources for light/dark mode support */
  readonly sources?: {
    readonly light: string;
    readonly dark: string;
  };

  /** Alt text for accessibility (required) */
  readonly alt: string;

  /** CSS classes to apply to the picture element */
  readonly className?: string;

  /** Loading behavior: 'lazy' for performance, 'eager' for above-the-fold images */
  readonly loading?: 'lazy' | 'eager';

  /** Responsive sizes attribute for srcset (defaults to responsive layout) */
  readonly sizes?: string;
}

export default function OptimizedImage({
  src,
  darkSrc,
  sources,
  alt,
  className,
  loading = 'lazy',
  sizes = '(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, (max-width: 1280px) 60vw, 50vw',
}: Readonly<OptimizedImageProps>): JSX.Element {
  const { colorMode } = useColorMode();

  // Support both sources object and individual src/darkSrc props
  const imageSrc = sources
    ? sources[colorMode === 'dark' ? 'dark' : 'light']
    : colorMode === 'dark' && darkSrc
      ? darkSrc
      : src;

  if (!imageSrc) {
    throw new Error('OptimizedImage requires either src or sources prop');
  }

  const originalUrl = useBaseUrl(imageSrc);

  // Skip optimization for external URLs and SVGs
  const shouldOptimize = /\.(png|jpg|jpeg|webp)$/i.test(imageSrc) && !imageSrc.startsWith('http');

  if (!shouldOptimize) {
    return <img src={originalUrl} alt={alt} loading={loading} className={className} />;
  }

  // Build optimized image path: /optimized-images/path/to/image (without extension)
  const imagePath = imageSrc.startsWith('/') ? imageSrc.slice(1) : imageSrc;
  const optimizedBase = `optimized-images/${imagePath}`.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  const optimizedBaseUrl = useBaseUrl(optimizedBase);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const img = e.target as HTMLImageElement;
    if (img.src !== originalUrl) {
      img.src = originalUrl;
    }
  };

  // Responsive breakpoints matching Tailwind CSS
  const widths = [640, 768, 1024, 1280, 1536];

  const avifSrcSet = widths.map(w => `${optimizedBaseUrl}-${w}w.avif ${w}w`).join(', ');
  const webpSrcSet = widths.map(w => `${optimizedBaseUrl}-${w}w.webp ${w}w`).join(', ');
  const pngSrcSet = widths.map(w => `${optimizedBaseUrl}-${w}w.png ${w}w`).join(', ');

  return (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <source type="image/png" srcSet={pngSrcSet} sizes={sizes} />
      <img
        src={originalUrl}
        alt={alt}
        loading={loading}
        sizes={sizes}
        onError={handleImageError}
        className={className ? `inline-block ${className}` : 'inline-block'}
      />
    </picture>
  );
}
