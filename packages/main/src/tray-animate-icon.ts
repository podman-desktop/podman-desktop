/**********************************************************************
 * Copyright (C) 2022-2023 Red Hat, Inc.
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

import * as path from 'node:path';

import type { Tray } from 'electron';
import { app, nativeImage, nativeTheme } from 'electron';

import { isLinux, isMac } from './util.js';

export type TrayIconStatus = 'initialized' | 'updating' | 'error' | 'ready';

export class AnimatedTray {
  private status: TrayIconStatus;
  private trayIconLoopId = 0;
  private animatedInterval: NodeJS.Timeout | undefined = undefined;
  private tray: Tray | undefined = undefined;
  private color: 'default' | 'light' | 'dark' = 'default';
  private imageCache = new Map<string, Electron.NativeImage>();

  static readonly MAIN_ASSETS_FOLDER = 'packages/main/src/assets';
  static readonly TRAY_ICON_STEP_COUNT = 4;

  constructor() {
    this.status = 'initialized';
    this.updateIcon();

    // refresh icon when theme is being updated (especially for Windows as for macOS we always use template icon and on linux the menu bar is not related to the theme)
    nativeTheme.on('updated', () => {
      this.updateIcon();
    });
  }

  protected isProd(): boolean {
    return app.isPackaged;
  }

  /**
   * Retrieves the path to the assets folder based on the current environment.
   * In production, the assets folder is located within the app bundle, while in development, it is located in the project root directory.
   *
   * @return {string} The absolute path to the assets folder.
   */
  protected getAssetsFolder(): string {
    if (this.isProd()) {
      return path.resolve(app.getAppPath(), AnimatedTray.MAIN_ASSETS_FOLDER);
    } else {
      // Use __dirname-relative path for more reliable development asset resolution
      return path.resolve(__dirname, '..', '..', '..', AnimatedTray.MAIN_ASSETS_FOLDER);
    }
  }

  /**
   * Animates the tray icon by cycling through predefined steps and updating the image displayed in the tray.
   * If an error occurs during the animation, the animation loop will be stopped to prevent continuous failures.
   * If the `tray` instance is not set, the method will log a warning and exit without performing any animation.
   *
   * @return {void} No return value.
   */
  protected animateTrayIcon(): void {
    if (!this.tray) {
      console.warn('Cannot animate tray icon: tray is not set');
      return;
    }

    if (this.trayIconLoopId === AnimatedTray.TRAY_ICON_STEP_COUNT) {
      this.trayIconLoopId = 0;
    }

    try {
      const image = this.createTrayImage(`step${this.trayIconLoopId}`);
      this.tray.setImage(image);
      this.trayIconLoopId++;
    } catch (error) {
      console.error(`Failed to animate tray icon at step ${this.trayIconLoopId}:`, error);

      // Stop animation on error to prevent continuous failures.
      if (this.animatedInterval) {
        clearInterval(this.animatedInterval);
        this.animatedInterval = undefined;
      }
    }
  }

  public setTray(tray: Tray): void {
    this.tray = tray;
    this.updateIcon();
  }

  // set the color of the icon if we're manually overriding the theme
  // and then update the current icon
  public setColor(color: 'default' | 'light' | 'dark'): void {
    this.color = color;
    // Clear cache when color changes as icon paths will be different
    this.imageCache.clear();
    this.updateIcon();
  }

  /**
   * Determines the file path for an icon based on its name and user/system preferences.
   *
   * @param {string} iconName - The name of the icon to retrieve the path for.
   *                            Use 'default' to indicate the base icon.
   * @return {{ path: string; isTemplate: boolean }} The fully resolved file path and template flag.
   */
  protected getIconPath(iconName: string): { path: string; isTemplate: boolean } {
    let name: string;
    if (iconName === 'default') {
      name = '';
    } else {
      name = `-${iconName}`;
    }

    // Determine suffix and template flag based on user preference first, then platform defaults.
    let useTemplate: boolean;

    // User preference takes precedence.
    if (this.color === 'light') {
      useTemplate = true;
    } else if (this.color === 'dark') {
      useTemplate = false;
    } else if (isLinux()) {
      // Linux typically uses dark menu bars, so use light icons
      useTemplate = false;
    } else if (isMac()) {
      // macOS uses template images that adapt to the menu bar
      useTemplate = true;
    } else {
      // Windows: check system theme
      useTemplate = !nativeTheme.shouldUseDarkColors;
    }

    const suffix = useTemplate ? 'Template' : 'Dark';
    const isTemplate = useTemplate;

    const iconPath = path.resolve(this.getAssetsFolder(), `tray-icon${name}${suffix}.png`);
    return { path: iconPath, isTemplate };
  }

  /**
   * Creates a cache key that includes both the icon name and current color/theme settings.
   * This prevents cache collisions when the same icon name is used with different themes.
   *
   * @param {string} iconName - The name of the icon file (without the path).
   * @return {string} A composite cache key including theme information.
   */
  protected createCacheKey(iconName: string): string {
    return `${iconName}-${this.color}`;
  }

  /**
   * Creates a tray image by loading the specified icon in normal and high resolution.
   * Falls back to a default empty icon if the specified files are not found or an error occurs.
   * Uses an in-memory cache to avoid repeated file system operations.
   *
   * @param {string} iconName - The name of the icon file (without the path).
   * @return {Electron.NativeImage} The created tray image, including representations for normal and high resolutions.
   */
  protected createTrayImage(iconName: string): Electron.NativeImage {
    // Create a composite cache key that includes theme information
    const cacheKey = this.createCacheKey(iconName);

    // Check cache first to avoid repeated file I/O
    const cached = this.imageCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const { path: iconPath, isTemplate } = this.getIconPath(iconName);

    // Let Electron load both 1x and @2x images automatically
    let image = nativeImage.createFromPath(iconPath);

    // If nothing was loaded, fall back to the empty icon
    if (image.isEmpty() && iconName !== 'empty') {
      const { path: emptyPath } = this.getIconPath('empty');
      image = nativeImage.createFromPath(emptyPath);

      if (image.isEmpty()) {
        // If even the fallback doesn't exist, create a minimal transparent image
        console.error('Created minimal transparent fallback icon');
        const buffer = Buffer.alloc(16 * 16 * 4, 0); // 16x16 RGBA transparent
        image = nativeImage.createFromBuffer(buffer, { width: 16, height: 16 });
      } else {
        console.warn(`Using fallback empty icon for: ${iconName}`);
      }
    }

    // On macOS, mark template images so they adapt to menu bar coloring
    if (isMac() && isTemplate) {
      image.setTemplateImage(true);
    }

    // Cache the image for future use with the composite key
    this.imageCache.set(cacheKey, image);
    return image;
  }

  /**
   * Updates the tray icon and tooltip based on the current status of the application.
   * The method handles different statuses such as 'initialized', 'error', 'ready', and 'updating'.
   * It also manages any necessary icon animation intervals.
   *
   * @return {void} Does not return a value.
   */
  protected updateIcon(): void {
    // do nothing until we have a tray
    if (!this.tray) {
      return;
    }

    // stop any existing interval
    if (this.animatedInterval) {
      clearInterval(this.animatedInterval);
      this.animatedInterval = undefined;
    }

    try {
      switch (this.status) {
        case 'initialized':
          this.tray.setImage(this.createTrayImage('empty'));
          this.tray.setToolTip('Podman Desktop is initialized');
          break;
        case 'error':
          this.tray.setImage(this.createTrayImage('error'));
          this.tray.setToolTip('Podman Desktop has an error');
          break;
        case 'ready':
          this.tray.setImage(this.createTrayImage('default'));
          this.tray.setToolTip('Podman Desktop is ready');
          break;
        case 'updating':
          this.animateTrayIcon(); // Show first frame immediately
          this.animatedInterval = setInterval(this.animateTrayIcon.bind(this), 1000);
          this.tray.setToolTip('Podman Desktop: resources are being updated');
          break;
      }
    } catch (error) {
      console.error(`Failed to update tray icon for status '${this.status}':`, error);

      // Set a safe fallback image if updating fails to prevent blank tray icon
      try {
        this.tray.setImage(this.createTrayImage('empty'));
      } catch (fallbackError) {
        console.error('Failed to set fallback tray icon:', fallbackError);
      }
    }
  }

  getDefaultImage(): Electron.NativeImage {
    // Return a properly configured image for all platforms.
    return this.createTrayImage('empty');
  }

  setStatus(status: TrayIconStatus): void {
    this.status = status;
    this.updateIcon();
  }
}
