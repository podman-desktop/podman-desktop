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
 * Flag to track if we've already warned about conflicting props.
 * Prevents excessive console output by ensuring the warning only shows once per session.
 */
let hasWarnedAboutConflictingProps = false;

/**
 * Reset the warning flag - used for testing purposes.
 * Allows test isolation by resetting warning state between tests.
 */
export function resetWarningFlag(): void {
  hasWarnedAboutConflictingProps = false;
}

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
  // Combined optimization criteria check.
  // Returns true only if ALL conditions are met:
  // - Image source exists and is non-empty
  // - Not an external URL (http/https)
  // - Not a data URL (already embedded)
  // - Not a protocol-relative URL (//)
  // - Has a supported format extension (PNG, JPG, JPEG, WebP)

  // Strip query strings and URL fragments before checking format.
  const cleanPath = imageSrc.split('?')[0].split('#')[0];
  const supportedFormats: RegExp = /\.(?:png|jpg|jpeg|webp)$/i;

  return Boolean(
    imageSrc &&
      !imageSrc.startsWith('http') &&
      !imageSrc.startsWith('data:') &&
      !imageSrc.startsWith('//') &&
      supportedFormats.test(cleanPath),
  );
}

/**
 * Generates the optimized image base path.
 *
 * Transforms the original image path to point to the optimized images directory
 * while preserving the directory structure and removing the file extension.
 * Properly handles query strings and URL fragments by stripping them before processing.
 *
 * @param imageSrc - The original image source
 * @returns The base path for optimized images
 */
function getOptimizedImageBase(imageSrc: string): string {
  // Remove leading slash if present for consistent path handling.
  const imagePath = imageSrc.startsWith('/') ? imageSrc.slice(1) : imageSrc;

  // Strip query strings and URL fragments to get clean path.
  // Example: "image.png?v=123#section" becomes "image.png"
  const cleanPath = imagePath.split('?')[0].split('#')[0];

  // Remove file extension as we'll add format-specific extensions.
  return `optimized-images/${cleanPath}`.replace(/\.(?:png|jpg|jpeg|webp)$/i, '');
}

/**
 * Helper function to check if alt text is valid.
 * @param alt - The alt text to validate (may be any type at runtime)
 * @returns True if alt text is valid
 */
function isValidAltText(alt: unknown): alt is string {
  return Boolean(alt && typeof alt === 'string' && alt.trim().length > 0);
}

/**
 * Helper function to check if any image source is provided.
 * @param src - The src prop
 * @param darkSrc - The darkSrc prop
 * @param sources - The sources prop
 * @returns True if at least one image source is provided
 */
function hasImageSource(src?: string, darkSrc?: string, sources?: ImageSources): boolean {
  return Boolean(src ?? darkSrc ?? (sources && isValidSourcesObject(sources)));
}

/**
 * Helper function to check if sources object is complete.
 * @param sources - The sources object to validate
 * @returns True if sources has valid light and dark properties
 */
function isValidSourcesObject(sources: ImageSources): boolean {
  return Boolean(sources.light && sources.dark && sources.light.trim().length > 0 && sources.dark.trim().length > 0);
}

/**
 * Helper function to check if props are conflicting.
 * @param sources - The sources prop
 * @param src - The src prop
 * @param darkSrc - The darkSrc prop
 * @returns True if there are conflicting props
 */
function hasConflictingProps(sources?: ImageSources, src?: string, darkSrc?: string): boolean {
  return Boolean(sources && (src ?? darkSrc));
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

  // Alt text validation - mandatory for accessibility compliance.
  if (isValidAltText(alt) === false) {
    throw new Error('OptimizedImage: alt prop is required and must be a non-empty string for accessibility');
  }

  // Image source validation - at least one source must be provided.
  if (!src && !darkSrc && !sources) {
    throw new Error('OptimizedImage: requires either src, darkSrc, or sources prop');
  }

  // Sources object validation - theme switching requires both light and dark variants.
  if (sources && !isValidSourcesObject(sources)) {
    throw new Error('OptimizedImage: sources prop must contain both light and dark properties with valid image paths');
  }

  // Final validation - ensure we have at least one valid image source.
  if (!hasImageSource(src, darkSrc, sources)) {
    throw new Error('OptimizedImage: requires either src, darkSrc, or sources prop');
  }

  // Conflicting props warning - sources prop takes precedence over src/darkSrc.
  if (hasConflictingProps(sources, src, darkSrc) && !hasWarnedAboutConflictingProps) {
    console.warn('OptimizedImage: when sources prop is provided, src and darkSrc props are ignored');
    hasWarnedAboutConflictingProps = true;
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
  const isDarkMode = colorMode === 'dark';

  // Determine the image source based on priority order.
  return sources
    ? sources[isDarkMode ? 'dark' : 'light']
    : // Highest priority: sources prop
      isDarkMode && darkSrc
      ? darkSrc
      : // Second priority: darkSrc in dark mode
        (src ?? ''); // Fallback: src prop or empty string
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
  // Validate props early to provide clear error messages.
  // IMPORTANT: This must be called before any hooks to prevent "fewer hooks than expected" error.
  validateProps({ src, darkSrc, sources, alt });

  // Get current theme mode for theme-aware image selection.
  const { colorMode } = useColorMode();

  // Resolve the image source based on theme.
  // Memoized to prevent unnecessary recalculations when other props change.
  const imageSrc = useMemo(
    () => resolveImageSource(colorMode, { src, darkSrc, sources }),
    [colorMode, src, darkSrc, sources],
  );

  // Get the final URL using Docusaurus' base URL resolution.
  const originalUrl = useBaseUrl(imageSrc);

  // Error handler with retry logic and infinite loop prevention.
  // Provides graceful fallback when optimized images fail to load.
  // Includes guard to prevent repeated error handling if original image also fails.
  // Memoized to prevent re-creating the function on every render.
  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>): void => {
      const img = e.target as HTMLImageElement;

      // Check if we're already showing the original image.
      if (img.src === originalUrl) {
        // Original image failed - prevent infinite loop by removing error handler.
        console.error(`OptimizedImage: Failed to load original image ${originalUrl}. No further fallbacks available.`);
        img.onerror = null; // Remove error handler to prevent infinite loop

        // Optional: Set a transparent 1x1 pixel data URL as ultimate fallback.
        img.src =
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+';
      } else {
        // Optimized image failed - fallback to original.
        console.warn(`OptimizedImage: Failed to load optimized image ${img.src}, falling back to original`);
        img.src = originalUrl;
      }
    },
    [originalUrl],
  );

  // Determine if image should be optimized.
  const shouldOptimize = shouldOptimizeImage(imageSrc);

  // Get optimized base path and URL if needed.
  // Must call useBaseUrl unconditionally to satisfy React's rules of hooks.
  const optimizedBase = shouldOptimize ? getOptimizedImageBase(imageSrc) : '';
  const optimizedBaseUrl = useBaseUrl(optimizedBase);

  // Generate optimized image data only if needed.
  // Memoized to avoid expensive calculations for non-optimizable images.
  const optimizedImageData = useMemo(() => {
    if (!shouldOptimize) return null;

    const generateSrcSet = (format: string): string =>
      RESPONSIVE_WIDTHS.map(w => `${optimizedBaseUrl}-${w}w.${format} ${w}w`).join(', ');

    return {
      baseUrl: optimizedBaseUrl,
      srcSets: {
        avif: generateSrcSet('avif'), // Best compression
        webp: generateSrcSet('webp'), // Good compression, wide support
        png: generateSrcSet('png'), // Universal fallback
      },
    };
  }, [shouldOptimize, optimizedBaseUrl]);

  /**
   * Render appropriate image element based on optimization suitability.
   * Single return point that handles both optimized and non-optimized cases.
   */
  return shouldOptimize && optimizedImageData ? (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={optimizedImageData.srcSets.avif} sizes={sizes} />
      <source type="image/webp" srcSet={optimizedImageData.srcSets.webp} sizes={sizes} />
      <source type="image/png" srcSet={optimizedImageData.srcSets.png} sizes={sizes} />
      <img
        src={originalUrl}
        alt={alt}
        title={title}
        loading={loading}
        sizes={sizes}
        onError={handleImageError}
        className="inline-block max-w-full h-auto"
      />
    </picture>
  ) : (
    <img src={originalUrl} alt={alt} title={title} loading={loading} onError={handleImageError} />
  );
}
