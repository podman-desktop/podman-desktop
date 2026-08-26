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

import { useColorMode } from '@docusaurus/theme-common';
import ThemedImage from '@theme/ThemedImage';
import { useEffect, useRef } from 'react';

import { needsParticlePoolRecreation, ParticleSimulation, resolveConfig } from './particle-simulation';
import { atlasSrcForColorMode, TITLE_DARK_SRC, TITLE_LIGHT_SRC } from './theme-assets';

const BLOG_POST_URL = '/blog/5-million-lessons-learned';

/**
 * Canvas-based animated banner celebrating 5 million downloads: a pool of particles streams
 * left-to-right and grows as it approaches the viewer, under a static title image and a
 * full-width link to the announcement post. Falls back to a static first frame when the user
 * prefers reduced motion.
 */
function Banner(): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const atlasRef = useRef<HTMLImageElement | null>(null);
  const atlasReadyRef = useRef(false);
  const drawRef = useRef<(() => void) | null>(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    // Check the refs (and the 2D context below) before binding them to their own
    // consts, rather than binding then checking. TypeScript's narrowing from an
    // early-return guard doesn't carry into the nested function declarations
    // below (resize, draw, tick, handleResize) – only the type each const has
    // at its own declaration does, so the guard must run first.
    if (!containerRef.current || !anchorRef.current || !canvasRef.current) {
      return;
    }

    const container = containerRef.current;
    const anchor = anchorRef.current;
    const canvas = canvasRef.current;

    // Get the 2D canvas context and return early if it's not available.
    const canvasContext = canvas.getContext('2d');
    if (!canvasContext) {
      return; // 2D context not available
    }

    const ctx = canvasContext;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Rebuilt only when particleCount or spriteVariantCount changes at a breakpoint;
    // otherwise updateConfig keeps sprite choices and path progress across resizes.
    function createSimulation(width: number): ParticleSimulation {
      return new ParticleSimulation(resolveConfig(width));
    }

    let simulation = createSimulation(container.clientWidth);
    let config = simulation.config;

    let animationFrameId = 0;
    let resizeAnimationFrameId = 0;
    let lastTimestamp = 0;

    // Resize the canvas to match the container's width and height.
    function resize(): void {
      const width = container.clientWidth;
      const height = config.redZoneHeight + config.blueZoneHeight;

      // Set the container's own height explicitly rather than letting it be
      // derived from the canvas (its only normal-flow child) – keeps the
      // box the ResizeObserver below watches from moving as a side effect
      // of this same function resizing that canvas.
      container.style.height = `${height}px`;

      // Set the anchor's height to match the red zone height.
      anchor.style.height = `${config.redZoneHeight}px`;

      // Set the canvas's size and style to match the container.
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Set the canvas's transform to scale by the device pixel ratio.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Draw the canvas.
    function draw(): void {
      const width = container.clientWidth;
      const height = config.redZoneHeight + config.blueZoneHeight;
      const atlasImage = atlasRef.current;

      // Clear the canvas, in CSS px – ctx's transform is already scaled by dpr, so
      // clearing canvas.width/height (device px) here would double-apply that scale.
      ctx.clearRect(0, 0, width, height);

      // Return early if the atlas is not yet ready.
      if (!atlasReadyRef.current || !atlasImage) {
        return;
      }

      simulation.draw(ctx, atlasImage, width);
    }

    // Exposed so the theme-change effect below can trigger a redraw once a new atlas
    // image finishes loading, without this effect depending on colorMode.
    drawRef.current = draw;

    // Update the simulation state and redraw on each animation frame.
    function tick(timestamp: number): void {
      const rawDeltaSeconds = lastTimestamp === 0 ? 0 : (timestamp - lastTimestamp) / 1000;

      // Clamp so a long frame gap (e.g. the tab was backgrounded) advances particles by at
      // most 0.1s of simulated time instead of jumping them across most of the path at once.
      const deltaSeconds = Math.min(rawDeltaSeconds, 0.1);

      lastTimestamp = timestamp;

      simulation.step(deltaSeconds);
      draw();

      animationFrameId = window.requestAnimationFrame(tick);
    }

    // Handle resize by updating layout config in place; rebuild pools only when the
    // breakpoint changes particle count or sprite variant count.
    function handleResize(): void {
      const width = container.clientWidth;
      const nextConfig = resolveConfig(width);

      if (needsParticlePoolRecreation(config, nextConfig)) {
        simulation = createSimulation(width);
        config = simulation.config;
      } else {
        simulation.updateConfig(nextConfig);
        config = nextConfig;
      }

      resize();
      draw();
    }

    resize();
    draw();

    // Crossing a breakpoint changes redZoneHeight/blueZoneHeight, so handleResize
    // legitimately resizes the container that this observer watches. Doing that
    // synchronously inside the observer's own callback re-queues a notification
    // for the same element within the same delivery cycle, which the browser
    // reports as "ResizeObserver loop completed with undelivered notifications".
    // Deferring the actual work to the next animation frame breaks that loop.
    const resizeObserver = new ResizeObserver(() => {
      if (resizeAnimationFrameId) {
        // Cancel the existing animation frame if it's still running.
        window.cancelAnimationFrame(resizeAnimationFrameId);
      }

      // Request an animation frame to handle the resize.
      resizeAnimationFrameId = window.requestAnimationFrame(() => {
        resizeAnimationFrameId = 0;
        handleResize();
      });
    });

    // Observe the container for resize events.
    resizeObserver.observe(container);

    if (!prefersReducedMotion) {
      // Request an animation frame to start the simulation.
      animationFrameId = window.requestAnimationFrame(tick);
    }

    return (): void => {
      resizeObserver.disconnect();
      atlasRef.current = null;
      atlasReadyRef.current = false;
      drawRef.current = null;

      if (animationFrameId) {
        // Cancel the animation frame if it's still running.
        window.cancelAnimationFrame(animationFrameId);
      }

      if (resizeAnimationFrameId) {
        // Cancel the resize animation frame if it's still running.
        window.cancelAnimationFrame(resizeAnimationFrameId);
      }
    };
  }, []);

  // Loads the atlas for the active color mode on mount and on every theme change, without
  // rebuilding the particle pool. Loads into a fresh Image rather than reusing atlasRef's
  // current one, so the currently drawn atlas stays active (no blank/flicker frame) until
  // the replacement has fully loaded, at which point atlasRef and atlasReadyRef are swapped
  // together.
  useEffect(() => {
    const src = atlasSrcForColorMode(colorMode);
    const image = new Image();

    image.onload = (): void => {
      atlasRef.current = image;
      atlasReadyRef.current = true;
      drawRef.current?.();
    };

    image.onerror = (): void => {
      console.error(`5MBanner: failed to load atlas image at ${src}`);
    };

    image.src = src;

    return (): void => {
      // Drop the handlers so a load that finishes after a rapid theme toggle (or after
      // unmount) can't overwrite atlasRef with a now-stale image.
      image.onload = null;
      image.onerror = null;
    };
  }, [colorMode]);

  return (
    <div ref={containerRef} className="relative w-full h-18 sm:h-21 xl:h-40">
      <a
        ref={anchorRef}
        href={BLOG_POST_URL}
        className="absolute inset-x-0 top-0 block bg-linear-to-r from-purple-300 to-purple-700 dark:from-purple-800 dark:to-purple-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500">
        <span className="sr-only">Read about Podman Desktop reaching 5 million downloads</span>
      </a>
      <canvas ref={canvasRef} className="pointer-events-none relative block w-full" />

      <ThemedImage
        sources={{ light: TITLE_LIGHT_SRC, dark: TITLE_DARK_SRC }}
        alt="5 million downloads"
        className="pointer-events-none absolute left-1/2 top-0 h-18 sm:h-21 xl:h-40 -translate-x-1/2"
      />
    </div>
  );
}

export default Banner;
