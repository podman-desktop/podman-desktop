/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

export interface FiveMillionBannerConfig {
  /** Atlas grid columns/rows (square grid – 4 means a 4x4, 16-cell atlas). */
  atlasGridSize: number;

  /** Pixel size of one atlas cell in the source image. */
  atlasCellSize: number;

  /** How many atlas cells (starting at index 0) are valid sprite variants. */
  spriteVariantCount: number;

  /** Number of particles in the pool. */
  particleCount: number;

  /** Height, in CSS px, of the opaque top ("red") zone. */
  redZoneHeight: number;

  /** Height, in CSS px, of the transparent bottom ("blue") zone. */
  blueZoneHeight: number;

  /** Rendered size, in CSS px, of the smallest/farthest particles. */
  minParticleSize: number;

  /** Rendered size, in CSS px, of the largest/nearest particles, at t = 1. */
  maxParticleSize: number;

  /** Progress (0-1) at which the path starts bending toward the viewer. */
  bendStart: number;

  /** How far, in CSS px, the largest particles may intrude into the blue zone. */
  maxBlueZoneIntrusion: number;

  /** Seconds for a particle to travel the full path before wrapping (t: 0 -> 1). */
  travelDurationSeconds: number;

  /** Extra horizontal distance, in CSS px, beyond each viewport edge before a particle wraps or enters. */
  offscreenMargin: number;

  /**
   * Controls post-bend horizontal acceleration. 2 = same speed throughout the bend; higher
   * values increase the final speed while keeping entry speed matched to the pre-bend phase.
   */
  perspectiveSpeedExponent: number;

  /**
   * Expands horizontal gaps between particles toward the right. 1 = even spacing; higher
   * values pack particles tighter on the left and spread them farther apart on the right.
   */
  perspectiveSpacingExponent: number;

  /**
   * Per-row vertical bend multipliers (far, mid, near). 1 = today's pathY drop; lower stays
   * flatter, higher drops farther into the blue zone.
   */
  rowBendScales: readonly [number, number, number];

  /**
   * Per-row baseline Y offsets in CSS px (far, mid, near), added to the red-zone midline so
   * each nearer row sits slightly lower than the one above.
   */
  rowBaselineOffsets: readonly [number, number, number];
}

/** Baseline config, for viewports >= 1280px. BREAKPOINTS below override a subset of these fields for narrower widths. */
export const DEFAULT_CONFIG: FiveMillionBannerConfig = {
  atlasGridSize: 4,
  atlasCellSize: 256,
  spriteVariantCount: 16,
  particleCount: 130,
  redZoneHeight: 160,
  blueZoneHeight: 260,
  minParticleSize: 12,
  maxParticleSize: 250,
  bendStart: 0.6,
  maxBlueZoneIntrusion: 100,
  travelDurationSeconds: 40,
  offscreenMargin: 300,
  perspectiveSpeedExponent: 2.5,
  perspectiveSpacingExponent: 2.0,
  rowBendScales: [0.4, 1.4, 2.45],
  rowBaselineOffsets: [-45, 0, 45],
};

/** Represents a breakpoint (min width and config overrides) for the 5M banner particle simulation. */
interface Breakpoint {
  /** Minimum viewport width (inclusive) at which this breakpoint applies. */
  minWidth: number;

  /** Config overrides for this breakpoint. */
  overrides: Partial<FiveMillionBannerConfig>;
}

// Numeric values below are a visual-tuning starting point, not final –
// see the design spec's "Responsive behavior" section.
//
// particleCount is raised above DEFAULT_CONFIG's 130 at the two narrower breakpoints on
// purpose: maxParticleSize shrinks much more sharply there (56/100 vs. 250), so the extra
// count keeps the band looking as dense as it does on desktop instead of going sparse.
const BREAKPOINTS: Breakpoint[] = [
  {
    minWidth: 0,
    overrides: {
      redZoneHeight: 72,
      blueZoneHeight: 160,
      maxParticleSize: 56,
      rowBaselineOffsets: [-22, 0, 22],
      particleCount: 180,
    },
  },
  {
    minWidth: 640,
    overrides: {
      redZoneHeight: 84,
      blueZoneHeight: 210,
      maxParticleSize: 100,
      rowBaselineOffsets: [-25, 0, 25],
      particleCount: 180,
    },
  },
  { minWidth: 1280, overrides: { maxParticleSize: 200 } },
];

/**
 * Resolves the config for a given viewport width: starts from DEFAULT_CONFIG, applies the
 * widest matching breakpoint's overrides, then applies the caller-supplied overrides on top.
 */
export function resolveConfig(
  viewportWidth: number,
  overrides: Partial<FiveMillionBannerConfig> = {},
): FiveMillionBannerConfig {
  const breakpoint = [...BREAKPOINTS].reverse().find(bp => viewportWidth >= bp.minWidth) ?? BREAKPOINTS[0];
  return { ...DEFAULT_CONFIG, ...breakpoint.overrides, ...overrides };
}

/** Cubic ease-in: maps 0-1 to 0-1, starting slow and accelerating toward the end. */
function easeInCubic(x: number): number {
  return x * x * x;
}

/**
 * Maps post-bend progress (0-1) to eased progress (0-1). Keeps unit slope at t = 0 so
 * horizontal speed matches the pre-bend phase, then adds an x^2 - x^3 bump for acceleration.
 */
export function easePostBendProgress(postBendProgress: number, exponent: number): number {
  if (exponent <= 2) {
    return postBendProgress;
  }

  const strength = exponent - 2;
  const x = postBendProgress;

  return x + strength * (x * x - x * x * x);
}

/** Maps uniform path progress to horizontal progress; linear before bendStart, then ease-in for perspective. */
export function perspectivePathProgress(t: number, config: FiveMillionBannerConfig): number {
  if (t <= config.bendStart || config.perspectiveSpeedExponent <= 1) {
    return t;
  }

  const easedPostBend = easePostBendProgress(bendProgress(t, config), config.perspectiveSpeedExponent);

  return config.bendStart + easedPostBend * (1 - config.bendStart);
}

/** Warps horizontal progress so adjacent particles sit closer on the left and farther apart on the right. */
export function perspectiveSpacingProgress(progress: number, exponent: number): number {
  if (exponent <= 1) {
    return progress;
  }

  return progress ** exponent;
}

/** Composes speed and spacing perspective into the final horizontal progress (0-1). */
export function pathHorizontalProgress(t: number, config: FiveMillionBannerConfig): number {
  const speedProgress = perspectivePathProgress(t, config);

  return perspectiveSpacingProgress(speedProgress, config.perspectiveSpacingExponent);
}

// Progress (0-1) through the post-bend portion of the path, used to ease
// both the vertical drop (pathY) and the size ramp (depthScale) in lockstep.
function bendProgress(t: number, config: FiveMillionBannerConfig): number {
  return (t - config.bendStart) / (1 - config.bendStart);
}

/** Total horizontal travel, in CSS px, from the off-screen entry point through the off-screen exit point. */
export function pathTravelWidth(viewportWidth: number, config: FiveMillionBannerConfig): number {
  return viewportWidth + 2 * config.offscreenMargin;
}

/** Horizontal position, in CSS px, of a particle at path progress t (0-1): a straight left-to-right sweep. */
export function pathX(t: number, viewportWidth: number, config: FiveMillionBannerConfig): number {
  const horizontalProgress = pathHorizontalProgress(t, config);

  return -config.offscreenMargin + horizontalProgress * pathTravelWidth(viewportWidth, config);
}

/**
 * Vertical position, in CSS px, of a particle at path progress t. Flat at the red zone's
 * midline (+ baselineOffset) until config.bendStart, then eases downward. `bendScale`
 * multiplies the full drop (red-zone half-height + maxBlueZoneIntrusion); 1 matches the
 * historical mid-row path.
 */
export function pathY(t: number, config: FiveMillionBannerConfig, bendScale = 1, baselineOffset = 0): number {
  const baseline = config.redZoneHeight / 2 + baselineOffset;

  if (t <= config.bendStart) {
    return baseline; // particles stay flat until the bend starts
  }

  // particles bend downwards, intruding into the blue zone as they approach the viewer
  const maxDrop = (config.redZoneHeight / 2 + config.maxBlueZoneIntrusion) * bendScale;
  return baseline + easeInCubic(bendProgress(t, config)) * maxDrop;
}

/**
 * Rendered particle size, in CSS px, at path progress t: constant at minSize until
 * config.bendStart, then eases up to maxSize by t = 1. Defaults to the config's global
 * min/max when overrides are omitted. Shared across rows so columns stay aligned.
 */
export function depthScale(
  t: number,
  config: FiveMillionBannerConfig,
  minSize = config.minParticleSize,
  maxSize = config.maxParticleSize,
): number {
  if (t <= config.bendStart) {
    return minSize;
  }

  return minSize + easeInCubic(bendProgress(t, config)) * (maxSize - minSize);
}

/** A source rect in the sprite atlas image, in the same sx/sy/sw/sh shape CanvasRenderingContext2D.drawImage takes. */
export interface AtlasRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

/**
 * Looks up the source rect, in atlas pixel coordinates, for a sprite variant. Wraps
 * spriteIndex into [0, config.spriteVariantCount) first, so any integer -- including
 * negative or out-of-range values -- maps to a valid cell.
 */
export function getAtlasCellRect(spriteIndex: number, config: FiveMillionBannerConfig): AtlasRect {
  const index = ((spriteIndex % config.spriteVariantCount) + config.spriteVariantCount) % config.spriteVariantCount;
  const column = index % config.atlasGridSize;
  const row = Math.floor(index / config.atlasGridSize);

  return {
    sx: column * config.atlasCellSize,
    sy: row * config.atlasCellSize,
    sw: config.atlasCellSize,
    sh: config.atlasCellSize,
  };
}

/** A fixed-size set of particles, stored as parallel arrays rather than an array of objects. */
export interface ParticlePool {
  /** Number of particles; the valid length of the t and spriteIndex arrays below. */
  readonly count: number;

  /** Per-particle progress (0-1) along the path; wraps back to 0 on reaching 1. */
  readonly t: Float32Array;

  /** Per-particle atlas sprite variant, assigned once at creation and fixed for the pool's lifetime. */
  readonly spriteIndex: Uint8Array;
}

/** Creates a pool with t values spread evenly across [0, 1) and a random sprite variant per particle. */
export function createParticlePool(
  count: number,
  spriteVariantCount: number,
  rng: () => number = Math.random,
): ParticlePool {
  const t = new Float32Array(count);
  const spriteIndex = new Uint8Array(count);

  for (let i = 0; i < count; i++) {
    // Spread evenly rather than starting all at 0, so the very first
    // rendered frame (including the reduced-motion static frame) is
    // already fully populated instead of clumped at the left edge.
    t[i] = i / count;
    spriteIndex[i] = Math.floor(rng() * spriteVariantCount);
  }

  return { count, t, spriteIndex };
}

/** Advances every particle's t in place by deltaSeconds / travelDurationSeconds, wrapping past 1 back to 0. */
export function stepParticlePool(pool: ParticlePool, deltaSeconds: number, travelDurationSeconds: number): void {
  const advance = deltaSeconds / travelDurationSeconds;

  for (let i = 0; i < pool.count; i++) {
    const next = pool.t[i] + advance;

    pool.t[i] = next - Math.floor(next);
  }
}

/** A square draw target, in CSS px, in the same x/y/width/height shape CanvasRenderingContext2D.drawImage takes. */
export interface DrawRect {
  /** Left edge, already offset so the sprite is centered on the path point rather than anchored to it. */
  x: number;

  /** Top edge, already offset so the sprite is centered on the path point rather than anchored to it. */
  y: number;

  /** Width and height (the sprite is always square). */
  size: number;
}

/** Optional per-row overrides for computeDrawRect (bend strength, baseline, and size range). */
export interface DrawRectOptions {
  bendScale?: number;
  baselineOffset?: number;
  minParticleSize?: number;
  maxParticleSize?: number;
}

/** Composes pathX/pathY/depthScale into a draw rect for a particle at path progress t. */
export function computeDrawRect(
  t: number,
  viewportWidth: number,
  config: FiveMillionBannerConfig,
  options: DrawRectOptions = {},
): DrawRect {
  const bendScale = options.bendScale ?? 1;
  const baselineOffset = options.baselineOffset ?? 0;
  const minSize = options.minParticleSize ?? config.minParticleSize;
  const maxSize = options.maxParticleSize ?? config.maxParticleSize;
  const size = depthScale(t, config, minSize, maxSize);
  const centerX = pathX(t, viewportWidth, config);
  const centerY = pathY(t, config, bendScale, baselineOffset);

  return {
    x: centerX - size / 2,
    y: centerY - size / 2,
    size,
  };
}

/** True when a viewport-driven config change requires rebuilding particle pools (count or atlas variants). */
export function needsParticlePoolRecreation(
  previousConfig: FiveMillionBannerConfig,
  nextConfig: FiveMillionBannerConfig,
): boolean {
  return (
    previousConfig.particleCount !== nextConfig.particleCount ||
    previousConfig.spriteVariantCount !== nextConfig.spriteVariantCount
  );
}

/** One depth layer: SoA particle pool plus bend and baseline for that row. */
export class ParticleRow {
  readonly pool: ParticlePool;
  bendScale: number;
  baselineOffset: number;

  constructor(
    count: number,
    spriteVariantCount: number,
    bendScale: number,
    baselineOffset: number,
    rng: () => number = Math.random,
  ) {
    this.bendScale = bendScale;
    this.baselineOffset = baselineOffset;
    this.pool = createParticlePool(count, spriteVariantCount, rng);
  }

  /** Updates row layout from a new config without touching particle pool state. */
  updateLayout(bendScale: number, baselineOffset: number): void {
    this.bendScale = bendScale;
    this.baselineOffset = baselineOffset;
  }

  /** Advances this row's particles along the shared travel duration. */
  step(deltaSeconds: number, travelDurationSeconds: number): void {
    stepParticlePool(this.pool, deltaSeconds, travelDurationSeconds);
  }

  /** Draws this row's particles into the canvas (caller controls draw order across rows). */
  draw(
    ctx: CanvasRenderingContext2D,
    atlas: CanvasImageSource,
    viewportWidth: number,
    config: FiveMillionBannerConfig,
  ): void {
    for (let i = 0; i < this.pool.count; i++) {
      const t = this.pool.t[i];

      const rect = computeDrawRect(t, viewportWidth, config, {
        bendScale: this.bendScale,
        baselineOffset: this.baselineOffset,
      });

      const cell = getAtlasCellRect(this.pool.spriteIndex[i], config);

      ctx.drawImage(atlas, cell.sx, cell.sy, cell.sw, cell.sh, rect.x, rect.y, rect.size, rect.size);
    }
  }
}

/**
 * Three-row particle simulation (far → mid → near). Each row gets the same particle count
 * (`floor(particleCount / 3)`) so they share one t lattice and stay horizontally aligned.
 * Draw order is far first so nearer rows occlude farther ones.
 */
export class ParticleSimulation {
  private _config: FiveMillionBannerConfig;
  readonly rows: readonly ParticleRow[];

  get config(): FiveMillionBannerConfig {
    return this._config;
  }

  constructor(config: FiveMillionBannerConfig, rng: () => number = Math.random) {
    this._config = config;

    // Same count per row is required for column alignment: t is initialized as i/count, so a
    // remainder dumped onto one row would use a different spacing and shift that row horizontally.
    const countPerRow = Math.floor(config.particleCount / 3);

    this.rows = [0, 1, 2].map(
      index =>
        new ParticleRow(
          countPerRow,
          config.spriteVariantCount,
          config.rowBendScales[index],
          config.rowBaselineOffsets[index],
          rng,
        ),
    );
  }

  /** Applies a new config while keeping existing particle positions and sprite choices. */
  updateConfig(config: FiveMillionBannerConfig): void {
    this._config = config;

    for (let index = 0; index < this.rows.length; index++) {
      this.rows[index].updateLayout(config.rowBendScales[index], config.rowBaselineOffsets[index]);
    }
  }

  /** Advances every row by the same time delta. */
  step(deltaSeconds: number): void {
    for (const row of this.rows) {
      row.step(deltaSeconds, this.config.travelDurationSeconds);
    }
  }

  /** Draws all rows far → mid → near. */
  draw(ctx: CanvasRenderingContext2D, atlas: CanvasImageSource, viewportWidth: number): void {
    for (const row of this.rows) {
      row.draw(ctx, atlas, viewportWidth, this.config);
    }
  }
}
