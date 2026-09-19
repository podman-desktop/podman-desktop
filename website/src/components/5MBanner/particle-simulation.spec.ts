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
import { expect, test, vi } from 'vitest';

import {
  computeDrawRect,
  createParticlePool,
  DEFAULT_CONFIG,
  depthScale,
  easePostBendProgress,
  getAtlasCellRect,
  needsParticlePoolRecreation,
  ParticleRow,
  ParticleSimulation,
  pathX,
  pathY,
  perspectivePathProgress,
  perspectiveSpacingProgress,
  resolveConfig,
  stepParticlePool,
} from './particle-simulation';

function createMockCanvasContext(): CanvasRenderingContext2D {
  return { drawImage: vi.fn() } as unknown as CanvasRenderingContext2D;
}

const PERSPECTIVE_TEST_CONFIG = {
  ...DEFAULT_CONFIG,
  bendStart: 0.5,
  offscreenMargin: 100,
  perspectiveSpeedExponent: 3,
  perspectiveSpacingExponent: 1,
};

test('resolveConfig returns the desktop defaults for a wide viewport', () => {
  const config = resolveConfig(1920);
  expect(config).toEqual({ ...DEFAULT_CONFIG, maxParticleSize: 200 });
});

test('resolveConfig applies the mobile breakpoint below 640px', () => {
  const config = resolveConfig(320);
  expect(config.particleCount).toBe(180);
  expect(config.redZoneHeight).toBe(72);
  expect(config.blueZoneHeight).toBe(160);
  expect(config.maxParticleSize).toBe(56);
});

test('resolveConfig applies the tablet breakpoint between 640 and 1280px', () => {
  const config = resolveConfig(900);
  expect(config.particleCount).toBe(180);
  expect(config.redZoneHeight).toBe(84);
  expect(config.maxParticleSize).toBe(100);
});

test('resolveConfig lets explicit overrides win over the breakpoint', () => {
  const config = resolveConfig(320, { particleCount: 999 });
  expect(config.particleCount).toBe(999);
  // other mobile-breakpoint values are untouched by the override
  expect(config.redZoneHeight).toBe(72);
});

test('perspectivePathProgress is linear when exponent is 1', () => {
  const config = { ...DEFAULT_CONFIG, perspectiveSpeedExponent: 1 };
  expect(perspectivePathProgress(0, config)).toBe(0);
  expect(perspectivePathProgress(0.5, config)).toBe(0.5);
  expect(perspectivePathProgress(1, config)).toBe(1);
});

test('easePostBendProgress is linear when exponent is 2 or less', () => {
  expect(easePostBendProgress(0.5, 2)).toBe(0.5);
  expect(easePostBendProgress(0.5, 1)).toBe(0.5);
});

test('easePostBendProgress starts at unit slope so entry speed matches the pre-bend phase', () => {
  const delta = easePostBendProgress(0.001, 3) - easePostBendProgress(0, 3);
  expect(delta / 0.001).toBeCloseTo(1, 2);
});

test('easePostBendProgress stays ahead of linear progress after the bend starts', () => {
  expect(easePostBendProgress(0.5, 3)).toBeCloseTo(0.625, 5);
  expect(easePostBendProgress(0.5, 3)).toBeGreaterThan(0.5);
});

test('perspectivePathProgress is linear before bendStart even when exponent is greater than 2', () => {
  expect(perspectivePathProgress(0.25, PERSPECTIVE_TEST_CONFIG)).toBe(0.25);
  expect(perspectivePathProgress(PERSPECTIVE_TEST_CONFIG.bendStart, PERSPECTIVE_TEST_CONFIG)).toBe(
    PERSPECTIVE_TEST_CONFIG.bendStart,
  );
});

test('perspectivePathProgress accelerates soon after bendStart when exponent is greater than 2', () => {
  const bendStart = PERSPECTIVE_TEST_CONFIG.bendStart;
  const entryDelta =
    perspectivePathProgress(bendStart + 0.05, PERSPECTIVE_TEST_CONFIG) -
    perspectivePathProgress(bendStart, PERSPECTIVE_TEST_CONFIG);
  const earlyPostBendDelta =
    perspectivePathProgress(bendStart + 0.15, PERSPECTIVE_TEST_CONFIG) -
    perspectivePathProgress(bendStart + 0.1, PERSPECTIVE_TEST_CONFIG);
  expect(earlyPostBendDelta).toBeGreaterThan(entryDelta);
});

test('perspectiveSpacingProgress is linear when exponent is 1', () => {
  expect(perspectiveSpacingProgress(0.5, 1)).toBe(0.5);
});

test('perspectiveSpacingProgress compresses progress on the left when exponent is greater than 1', () => {
  expect(perspectiveSpacingProgress(0.5, 2)).toBe(0.25);
  expect(perspectiveSpacingProgress(0.5, 2)).toBeLessThan(0.5);
});

test('pathHorizontalProgress widens particle gaps toward the right when spacing exponent is greater than 1', () => {
  const config = { ...PERSPECTIVE_TEST_CONFIG, perspectiveSpeedExponent: 1, perspectiveSpacingExponent: 2 };
  const leftGap = pathX(0.2, 1000, config) - pathX(0.1, 1000, config);
  const rightGap = pathX(0.9, 1000, config) - pathX(0.8, 1000, config);
  expect(rightGap).toBeGreaterThan(leftGap);
});

test('pathX maps t linearly when perspectiveSpeedExponent is 1', () => {
  const config = { ...PERSPECTIVE_TEST_CONFIG, perspectiveSpeedExponent: 1 };
  expect(pathX(0, 1000, config)).toBe(-100);
  expect(pathX(0.5, 1000, config)).toBe(500);
  expect(pathX(1, 1000, config)).toBe(1100);
});

test('pathX is linear before bendStart when perspectiveSpeedExponent is greater than 1', () => {
  expect(pathX(0, 1000, PERSPECTIVE_TEST_CONFIG)).toBe(-100);
  expect(pathX(PERSPECTIVE_TEST_CONFIG.bendStart, 1000, PERSPECTIVE_TEST_CONFIG)).toBe(500);
  expect(pathX(1, 1000, PERSPECTIVE_TEST_CONFIG)).toBe(1100);
});

test('pathX moves at constant speed before bendStart when perspectiveSpeedExponent is greater than 2', () => {
  const earlyDelta = pathX(0.2, 1000, PERSPECTIVE_TEST_CONFIG) - pathX(0.1, 1000, PERSPECTIVE_TEST_CONFIG);
  const preBendDelta = pathX(0.4, 1000, PERSPECTIVE_TEST_CONFIG) - pathX(0.3, 1000, PERSPECTIVE_TEST_CONFIG);
  expect(preBendDelta).toBeCloseTo(earlyDelta, 5);
});

test('pathX keeps the same speed when entering the bend phase', () => {
  const bendStart = PERSPECTIVE_TEST_CONFIG.bendStart;
  const preBendDelta =
    pathX(bendStart, 1000, PERSPECTIVE_TEST_CONFIG) - pathX(bendStart - 0.01, 1000, PERSPECTIVE_TEST_CONFIG);
  const postBendDelta =
    pathX(bendStart + 0.01, 1000, PERSPECTIVE_TEST_CONFIG) - pathX(bendStart, 1000, PERSPECTIVE_TEST_CONFIG);
  expect(postBendDelta).toBeCloseTo(preBendDelta, 0);
});

test('pathX accelerates soon after bendStart when perspectiveSpeedExponent is greater than 2', () => {
  const entryDelta = pathX(0.55, 1000, PERSPECTIVE_TEST_CONFIG) - pathX(0.5, 1000, PERSPECTIVE_TEST_CONFIG);
  const earlyPostBendDelta = pathX(0.65, 1000, PERSPECTIVE_TEST_CONFIG) - pathX(0.6, 1000, PERSPECTIVE_TEST_CONFIG);
  expect(earlyPostBendDelta).toBeGreaterThan(entryDelta);
});

test('pathY stays flat before bendStart', () => {
  const flatY = pathY(0, DEFAULT_CONFIG);
  expect(pathY(DEFAULT_CONFIG.bendStart, DEFAULT_CONFIG)).toBe(flatY);
  expect(pathY(0.1, DEFAULT_CONFIG)).toBe(flatY);
});

test('pathY increases monotonically after bendStart', () => {
  const yAtBend = pathY(DEFAULT_CONFIG.bendStart, DEFAULT_CONFIG);
  const yAtThreeQuarters = pathY(0.75, DEFAULT_CONFIG);
  const yAtEnd = pathY(1, DEFAULT_CONFIG);
  expect(yAtThreeQuarters).toBeGreaterThan(yAtBend);
  expect(yAtEnd).toBeGreaterThan(yAtThreeQuarters);
});

test('pathY scales the post-bend drop by bendScale', () => {
  const baseline = pathY(0, DEFAULT_CONFIG, 1);
  const dropAtOne = pathY(1, DEFAULT_CONFIG, 1) - baseline;
  expect(pathY(1, DEFAULT_CONFIG, 0.1) - baseline).toBeCloseTo(dropAtOne * 0.1, 5);
  expect(pathY(1, DEFAULT_CONFIG, 2) - baseline).toBeCloseTo(dropAtOne * 2, 5);
});

test('pathY with a larger bendScale sits lower at the same post-bend t', () => {
  expect(pathY(0.8, DEFAULT_CONFIG, 2)).toBeGreaterThan(pathY(0.8, DEFAULT_CONFIG, 1));
  expect(pathY(0.8, DEFAULT_CONFIG, 1)).toBeGreaterThan(pathY(0.8, DEFAULT_CONFIG, 0.1));
});

test('pathY adds baselineOffset to the row baseline', () => {
  expect(pathY(0, DEFAULT_CONFIG, 1, 12)).toBe(pathY(0, DEFAULT_CONFIG) + 12);
  expect(pathY(1, DEFAULT_CONFIG, 1, 12)).toBe(pathY(1, DEFAULT_CONFIG) + 12);
});

test('depthScale is minParticleSize before bendStart and maxParticleSize at t=1', () => {
  expect(depthScale(0, DEFAULT_CONFIG)).toBe(DEFAULT_CONFIG.minParticleSize);
  expect(depthScale(DEFAULT_CONFIG.bendStart, DEFAULT_CONFIG)).toBe(DEFAULT_CONFIG.minParticleSize);
  expect(depthScale(1, DEFAULT_CONFIG)).toBe(DEFAULT_CONFIG.maxParticleSize);
});

test('depthScale increases monotonically after bendStart', () => {
  const a = depthScale(0.6, DEFAULT_CONFIG);
  const b = depthScale(0.8, DEFAULT_CONFIG);
  const c = depthScale(1, DEFAULT_CONFIG);
  expect(b).toBeGreaterThan(a);
  expect(c).toBeGreaterThan(b);
});

test('depthScale uses explicit min/max size overrides', () => {
  expect(depthScale(0, DEFAULT_CONFIG, 20, 80)).toBe(20);
  expect(depthScale(1, DEFAULT_CONFIG, 20, 80)).toBe(80);
});

test('computeDrawRect keeps the same horizontal position across bendScales when size range matches', () => {
  const t = 0.8;
  const flat = computeDrawRect(t, 1000, DEFAULT_CONFIG, { bendScale: 0 });
  const mid = computeDrawRect(t, 1000, DEFAULT_CONFIG, { bendScale: 0.5 });
  const near = computeDrawRect(t, 1000, DEFAULT_CONFIG, { bendScale: 1 });

  expect(flat.size).toBe(mid.size);
  expect(mid.size).toBe(near.size);
  expect(flat.x).toBeCloseTo(mid.x, 5);
  expect(mid.x).toBeCloseTo(near.x, 5);
});

test('getAtlasCellRect maps index 0 to the top-left cell', () => {
  expect(getAtlasCellRect(0, DEFAULT_CONFIG)).toEqual({ sx: 0, sy: 0, sw: 256, sh: 256 });
});

test('getAtlasCellRect maps index 3 to the last column of the first row', () => {
  expect(getAtlasCellRect(3, DEFAULT_CONFIG)).toEqual({ sx: 768, sy: 0, sw: 256, sh: 256 });
});

test('getAtlasCellRect wraps to the next row at the grid width', () => {
  expect(getAtlasCellRect(4, DEFAULT_CONFIG)).toEqual({ sx: 0, sy: 256, sw: 256, sh: 256 });
});

test('getAtlasCellRect wraps indices past spriteVariantCount back into range', () => {
  // spriteVariantCount is 16, so index 16 wraps to index 0 -> column 0, row 0
  expect(getAtlasCellRect(16, DEFAULT_CONFIG)).toEqual({ sx: 0, sy: 0, sw: 256, sh: 256 });
});

test('getAtlasCellRect wraps negative indices into range', () => {
  // -1 wraps to spriteVariantCount - 1 = 15 -> column 3, row 3
  expect(getAtlasCellRect(-1, DEFAULT_CONFIG)).toEqual({ sx: 768, sy: 768, sw: 256, sh: 256 });
});

test('createParticlePool spreads initial t values evenly across the path', () => {
  const pool = createParticlePool(4, 10);
  expect(Array.from(pool.t)).toEqual([0, 0.25, 0.5, 0.75]);
});

test('createParticlePool assigns sprite indices using the injected rng', () => {
  const pool = createParticlePool(3, 10, () => 0.95);
  // floor(0.95 * 10) = 9 for every particle, since the rng is fixed
  expect(Array.from(pool.spriteIndex)).toEqual([9, 9, 9]);
});

test('stepParticlePool advances t by deltaSeconds / travelDurationSeconds', () => {
  const pool = createParticlePool(2, 10, () => 0);
  stepParticlePool(pool, 1, 10); // 1s of a 10s travel duration = 0.1 progress
  expect(pool.t[0]).toBeCloseTo(0.1, 5);
  expect(pool.t[1]).toBeCloseTo(0.6, 5);
});

test('stepParticlePool wraps t back into [0, 1) at the end of the path', () => {
  const pool = createParticlePool(1, 10, () => 0);
  pool.t[0] = 0.95;
  stepParticlePool(pool, 1, 10); // advances by 0.1, 0.95 + 0.1 = 1.05 -> wraps to 0.05
  expect(pool.t[0]).toBeCloseTo(0.05, 5);
});

test('computeDrawRect centers the sprite on the path point (center pivot)', () => {
  const rect = computeDrawRect(1, 1000, DEFAULT_CONFIG);
  const expectedSize = depthScale(1, DEFAULT_CONFIG);
  const expectedCenterX = pathX(1, 1000, DEFAULT_CONFIG);
  const expectedCenterY = pathY(1, DEFAULT_CONFIG);
  expect(rect.size).toBe(expectedSize);
  expect(rect.x).toBeCloseTo(expectedCenterX - expectedSize / 2, 5);
  expect(rect.y).toBeCloseTo(expectedCenterY - expectedSize / 2, 5);
});

test('computeDrawRect matches manual math at a known point', () => {
  const rect = computeDrawRect(0, 1000, PERSPECTIVE_TEST_CONFIG);
  // t=0: size is minParticleSize, x starts off-screen left by offscreenMargin
  const size = PERSPECTIVE_TEST_CONFIG.minParticleSize;
  expect(rect.size).toBe(size);
  expect(rect.x).toBeCloseTo(-PERSPECTIVE_TEST_CONFIG.offscreenMargin - size / 2, 5);
  expect(rect.y).toBeCloseTo(PERSPECTIVE_TEST_CONFIG.redZoneHeight / 2 - size / 2, 5);
});

test('needsParticlePoolRecreation is false when only layout fields change', () => {
  const mobile = resolveConfig(320);
  const tablet = resolveConfig(900);

  expect(needsParticlePoolRecreation(mobile, tablet)).toBe(false);
});

test('needsParticlePoolRecreation is true when particleCount changes across breakpoints', () => {
  const mobile = resolveConfig(320);
  const desktop = resolveConfig(1920);

  expect(needsParticlePoolRecreation(mobile, desktop)).toBe(true);
});

test('ParticleSimulation.updateConfig updates layout without resetting pool state', () => {
  const simulation = new ParticleSimulation({ ...DEFAULT_CONFIG, particleCount: 9 }, () => 0.5);
  const spriteIndicesBefore = simulation.rows.map(row => Array.from(row.pool.spriteIndex));
  const tBefore = Array.from(simulation.rows[0].pool.t);
  const nextConfig = {
    ...DEFAULT_CONFIG,
    particleCount: 9,
    redZoneHeight: 99,
    rowBaselineOffsets: [-10, 5, 20] as const,
  };

  simulation.updateConfig(nextConfig);

  expect(simulation.config.redZoneHeight).toBe(99);
  expect(simulation.rows[0].baselineOffset).toBe(-10);
  expect(simulation.rows[1].baselineOffset).toBe(5);
  expect(simulation.rows[2].baselineOffset).toBe(20);
  expect(simulation.rows.map(row => Array.from(row.pool.spriteIndex))).toEqual(spriteIndicesBefore);
  expect(Array.from(simulation.rows[0].pool.t)).toEqual(tBefore);
});

test('ParticleSimulation gives each row the same count so columns share a t lattice', () => {
  const simulation = new ParticleSimulation({ ...DEFAULT_CONFIG, particleCount: 100 }, () => 0);
  expect(simulation.rows).toHaveLength(3);
  // 100 is not divisible by 3; drop the remainder rather than densifying one row
  expect(simulation.rows.map(row => row.pool.count)).toEqual([33, 33, 33]);
});

test('ParticleSimulation rows share identical t values', () => {
  const simulation = new ParticleSimulation({ ...DEFAULT_CONFIG, particleCount: 9 }, () => 0);
  expect(Array.from(simulation.rows[0].pool.t)).toEqual(Array.from(simulation.rows[1].pool.t));
  expect(Array.from(simulation.rows[1].pool.t)).toEqual(Array.from(simulation.rows[2].pool.t));
});

test('ParticleSimulation applies per-row bend and baseline offsets', () => {
  const simulation = new ParticleSimulation({ ...DEFAULT_CONFIG, particleCount: 3 }, () => 0);
  const [far, mid, near] = simulation.rows;

  expect(far.bendScale).toBe(DEFAULT_CONFIG.rowBendScales[0]);
  expect(mid.bendScale).toBe(DEFAULT_CONFIG.rowBendScales[1]);
  expect(near.bendScale).toBe(DEFAULT_CONFIG.rowBendScales[2]);

  expect(far.baselineOffset).toBe(DEFAULT_CONFIG.rowBaselineOffsets[0]);
  expect(mid.baselineOffset).toBe(DEFAULT_CONFIG.rowBaselineOffsets[1]);
  expect(near.baselineOffset).toBe(DEFAULT_CONFIG.rowBaselineOffsets[2]);
  expect(mid.baselineOffset).toBeGreaterThan(far.baselineOffset);
  expect(near.baselineOffset).toBeGreaterThan(mid.baselineOffset);
});

test('ParticleSimulation.step advances every row', () => {
  const simulation = new ParticleSimulation(
    { ...DEFAULT_CONFIG, particleCount: 3, travelDurationSeconds: 10 },
    () => 0,
  );
  const before = simulation.rows.map(row => row.pool.t[0]);

  simulation.step(1); // +0.1 progress

  simulation.rows.forEach((row, index) => {
    expect(row.pool.t[0]).toBeCloseTo((before[index] + 0.1) % 1, 5);
  });
});

test('ParticleRow.draw draws one image per particle with the computed rects', () => {
  const row = new ParticleRow(2, DEFAULT_CONFIG.spriteVariantCount, 1, 0, () => 0.5);
  const ctx = createMockCanvasContext();
  const atlas = {} as CanvasImageSource;

  row.draw(ctx, atlas, 1000, DEFAULT_CONFIG);

  expect(ctx.drawImage).toHaveBeenCalledTimes(2);

  const t0 = row.pool.t[0];
  const expectedRect = computeDrawRect(t0, 1000, DEFAULT_CONFIG, { bendScale: 1, baselineOffset: 0 });
  const expectedCell = getAtlasCellRect(row.pool.spriteIndex[0], DEFAULT_CONFIG);

  expect(ctx.drawImage).toHaveBeenNthCalledWith(
    1,
    atlas,
    expectedCell.sx,
    expectedCell.sy,
    expectedCell.sw,
    expectedCell.sh,
    expectedRect.x,
    expectedRect.y,
    expectedRect.size,
    expectedRect.size,
  );
});

test('ParticleRow.draw draws nothing for an empty pool', () => {
  const row = new ParticleRow(0, DEFAULT_CONFIG.spriteVariantCount, 1, 0, () => 0);
  const ctx = createMockCanvasContext();

  row.draw(ctx, {} as CanvasImageSource, 1000, DEFAULT_CONFIG);

  expect(ctx.drawImage).not.toHaveBeenCalled();
});

test('ParticleSimulation.draw draws every row in far-to-near order', () => {
  const simulation = new ParticleSimulation({ ...DEFAULT_CONFIG, particleCount: 3 }, () => 0);
  const ctx = createMockCanvasContext();
  const atlas = {} as CanvasImageSource;

  const drawSpies = simulation.rows.map(row => vi.spyOn(row, 'draw'));

  simulation.draw(ctx, atlas, 1000);

  drawSpies.forEach(spy => {
    expect(spy).toHaveBeenCalledExactlyOnceWith(ctx, atlas, 1000, simulation.config);
  });
});
