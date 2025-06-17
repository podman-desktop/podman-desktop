/**
 * OptimizedImage component.
 *
 * Automatically serves optimized images (WebP, AVIF) with responsive sizes.
 * Provides graceful fallback to original images and supports light/dark theme variants.
 *
 * Features:
 * - Automatic format selection: AVIF → WebP → PNG.
 * - Responsive images with srcset for different viewport sizes.
 * - Theme-aware image switching (light/dark variants).
 * - Graceful fallback to original images if optimized versions fail.
 * - Smart detection of images that don't need optimization.
 * - Enhanced accessibility and performance optimizations.
 *
 * Performance optimizations:
 * - Uses React.useMemo for expensive calculations.
 * - Uses React.useCallback for event handlers.
 * - Lazy loading by default.
 * - Minimal re-renders through proper dependency arrays.
 *
 * Accessibility features:
 * - Mandatory alt text with validation.
 * - Proper ARIA attributes.
 * - Screen reader friendly error handling.
 */

import { useColorMode } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import React, { useCallback, useMemo } from 'react';

/** Loading strategy for images. */
type ImageLoading = 'lazy' | 'eager';

/** Theme-specific image sources. */
interface ImageSources {
  /** Image source for light theme. */
  readonly light: string;

  /** Image source for dark theme. */
  readonly dark: string;
}

/** Props for the OptimizedImage component. */
interface OptimizedImageProps {
  /** Single image source (use this OR sources/darkSrc, not both). */
  readonly src?: string;

  /** Dark theme image source (alternative to sources prop). */
  readonly darkSrc?: string;

  /** Theme-specific image sources for light/dark mode support. */
  readonly sources?: ImageSources;

  /** Alt text for accessibility (required). */
  readonly alt: string;

  /** CSS classes to apply to the picture element. */
  readonly className?: string;

  /** Loading behavior: 'lazy' for performance, 'eager' for above-the-fold images. */
  readonly loading?: ImageLoading;

  /** Responsive sizes attribute for srcset (defaults to responsive layout). */
  readonly sizes?: string;

  /** Optional title attribute for additional context. */
  readonly title?: string;

  /** Optional style object for inline styles. */
  readonly style?: React.CSSProperties;
}

/**
 * Responsive breakpoints matching Tailwind CSS.
 * These breakpoints ensure consistency with the design system
 * and provide optimal image sizes for common viewport widths.
 */
const RESPONSIVE_WIDTHS: readonly number[] = [640, 768, 1024, 1280, 1536] as const;

/**
 * Default sizes attribute for responsive images.
 * Optimized for typical content layouts where images scale with viewport
 * but have maximum widths on larger screens.
 */
const DEFAULT_SIZES =
  '(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, (max-width: 1280px) 60vw, 50vw';

/**
 * Checks if an image should be optimized based on its format and URL.
 *
 * Optimization criteria:
 * - Must be a supported format (PNG, JPG, JPEG, WebP).
 * - Must be a local/relative URL (not external).
 * - Must not be a data URL (already embedded).
 *
 * @param imageSrc - The image source URL
 * @returns Whether the image should be optimized
 */
function shouldOptimizeImage(imageSrc: string): boolean {
  if (!imageSrc || typeof imageSrc !== 'string') {
    return false;
  }

  /**
   * Skip external URLs, data URLs, and protocol-relative URLs.
   * - External: Can't optimize images we don't control.
   * - Data URLs: Already embedded, no optimization benefit.
   * - Protocol-relative: External URLs that inherit current protocol.
   */
  if (imageSrc.startsWith('http') || imageSrc.startsWith('data:') || imageSrc.startsWith('//')) {
    return false;
  }

  /**
   * Only optimize supported formats.
   * These raster formats benefit most from modern format conversion
   * and responsive sizing.
   */
  const supportedFormats: RegExp = /\.(png|jpg|jpeg|webp)$/i;
  return supportedFormats.test(imageSrc);
}

/**
 * Generates the optimized image base path.
 *
 * Transforms the original image path to point to the optimized images directory
 * while preserving the directory structure and removing the file extension.
 *
 * @param imageSrc - The original image source
 * @returns The base path for optimized images
 */
function getOptimizedImageBase(imageSrc: string): string {
  // Remove leading slash if present for consistent path handling.
  const imagePath = imageSrc.startsWith('/') ? imageSrc.slice(1) : imageSrc;

  // Remove file extension as we'll add format-specific extensions.
  return `optimized-images/${imagePath}`.replace(/\.(png|jpg|jpeg|webp)$/i, '');
}

/**
 * Validates props and throws descriptive errors for invalid configurations.
 *
 * This validation runs early to provide clear error messages to developers
 * and prevent accessibility issues in production.
 *
 * @param props - The component props to validate
 */
function validateProps(props: Pick<OptimizedImageProps, 'src' | 'darkSrc' | 'sources' | 'alt'>): void {
  const { src, darkSrc, sources, alt } = props;

  /**
   * Alt text is mandatory for accessibility compliance.
   * - Required by WCAG guidelines.
   * - Essential for screen readers.
   * - Important for SEO.
   */
  if (!alt || typeof alt !== 'string' || alt.trim() === '') {
    throw new Error('OptimizedImage: alt prop is required and must be a non-empty string for accessibility');
  }

  /**
   * At least one image source must be provided.
   * Prevents rendering empty images.
   */
  if (!src && !darkSrc && !sources) {
    throw new Error('OptimizedImage: requires either src, darkSrc, or sources prop');
  }

  /**
   * Warn about conflicting props.
   * Sources prop takes precedence over src/darkSrc.
   */
  if (sources && (src || darkSrc)) {
    console.warn('OptimizedImage: when sources prop is provided, src and darkSrc props are ignored');
  }

  /**
   * Validate sources object completeness.
   * Theme switching requires both light and dark variants.
   */
  if (sources && (!sources.light || !sources.dark || sources.light.trim() === '' || sources.dark.trim() === '')) {
    throw new Error('OptimizedImage: sources prop must contain both light and dark properties with valid image paths');
  }
}

/**
 * Determines the appropriate image source based on theme and props.
 *
 * Priority order:
 * 1. sources prop (theme-specific),
 * 2. darkSrc prop (dark mode fallback),
 * 3. src prop (universal fallback).
 *
 * @param colorMode - Current theme mode
 * @param props - Component props
 * @returns The resolved image source
 */
function resolveImageSource(
  colorMode: string,
  props: Pick<OptimizedImageProps, 'src' | 'darkSrc' | 'sources'>,
): string {
  const { src, darkSrc, sources } = props;

  // Sources prop takes highest priority (explicit theme mapping).
  if (sources) {
    return sources[colorMode === 'dark' ? 'dark' : 'light'];
  }

  // darkSrc prop for simple theme switching.
  if (colorMode === 'dark' && darkSrc) {
    return darkSrc;
  }

  // Fallback to src prop.
  return src ?? '';
}

/**
 * OptimizedImage Component.
 *
 * Renders an optimized image with automatic format detection, responsive sizing,
 * and theme-aware source selection.
 *
 * The component implements a progressive enhancement strategy:
 * 1. Validate props for developer experience.
 * 2. Resolve the appropriate image source based on theme.
 * 3. Determine if optimization is beneficial.
 * 4. Generate optimized HTML structure or fallback to simple img.
 */
export default function OptimizedImage({
  src,
  darkSrc,
  sources,
  alt,
  className,
  loading = 'lazy', // Default to lazy loading for performance
  sizes = DEFAULT_SIZES, // Default responsive sizes
  title,
  style,
}: Readonly<OptimizedImageProps>): JSX.Element {
  // Get current theme mode for theme-aware image selection.
  const { colorMode } = useColorMode();

  // Validate props early to provide clear error messages.
  validateProps({ src, darkSrc, sources, alt });

  /**
   * Resolve the image source based on theme.
   * Memoized to prevent unnecessary recalculations when other props change.
   */
  const imageSrc = useMemo(
    () => resolveImageSource(colorMode, { src, darkSrc, sources }),
    [colorMode, src, darkSrc, sources],
  );

  // Get the final URL using Docusaurus' base URL resolution.
  const originalUrl = useBaseUrl(imageSrc);

  /**
   * Error handler with retry logic.
   * Provides graceful fallback when optimized images fail to load.
   * Memoized to prevent re-creating the function on every render.
   */
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>): void => {
      const img = e.target as HTMLImageElement;

      // If we're already showing the original, log the error.
      if (img.src !== originalUrl) {
        console.warn(`OptimizedImage: Failed to load optimized image ${img.src}, falling back to original`);
        img.src = originalUrl; // Fallback to original image
      } else {
        console.error(`OptimizedImage: Failed to load image ${originalUrl}`);
      }
    },
    [originalUrl],
  );

  /**
   * Skip optimization for unsuitable images.
   * Renders a simple img element for:
   * - External URLs.
   * - Data URLs.
   * - Unsupported formats.
   * - SVG/GIF images.
   */
  if (!shouldOptimizeImage(imageSrc)) {
    return (
      <img
        src={originalUrl}
        alt={alt}
        title={title}
        loading={loading}
        className={className}
        style={style}
        onError={handleImageError}
      />
    );
  }

  /**
   * Generate optimized image paths.
   * Memoized to avoid recalculating expensive path operations.
   */
  const optimizedBase = useMemo(() => getOptimizedImageBase(imageSrc), [imageSrc]);
  const optimizedBaseUrl = useBaseUrl(optimizedBase);

  /**
   * Generate srcsets for different formats.
   * Creates responsive srcsets for AVIF, WebP, and PNG formats.
   * Memoized as this is an expensive string generation operation.
   */
  const srcSets = useMemo(() => {
    const generateSrcSet = (format: string): string =>
      RESPONSIVE_WIDTHS.map(w => `${optimizedBaseUrl}-${w}w.${format} ${w}w`).join(', ');

    return {
      avif: generateSrcSet('avif'), // Best compression
      webp: generateSrcSet('webp'), // Good compression, wide support
      png: generateSrcSet('png'), // Universal fallback
    };
  }, [optimizedBaseUrl]);

  /**
   * Render the optimized picture element.
   *
   * Structure:
   * 1. AVIF sources (best compression).
   * 2. WebP sources (good compression, wide support).
   * 3. PNG sources (universal fallback).
   * 4. img element (final fallback with original image).
   */
  return (
    <picture className={className} style={style}>
      {/* AVIF sources - next-generation format with excellent compression. */}
      <source type="image/avif" srcSet={srcSets.avif} sizes={sizes} />

      {/* WebP sources - modern format with good browser support. */}
      <source type="image/webp" srcSet={srcSets.webp} sizes={sizes} />

      {/* PNG sources - traditional format for wide compatibility. */}
      <source type="image/png" srcSet={srcSets.png} sizes={sizes} />

      {/* Fallback img element - works in all browsers. */}
      <img
        src={originalUrl}
        alt={alt}
        title={title}
        loading={loading}
        sizes={sizes}
        onError={handleImageError}
        className="inline-block"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </picture>
  );
}
