/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { BrowserWindow, type WebContents, webContents } from 'electron';
import { injectable } from 'inversify';

/**
 * Service responsible for managing DevTools lifecycle for WebViews.
 * Handles tracking, opening, and cleanup of DevTools to prevent application crashes
 * when WebViews are destroyed while DevTools are still open.
 */
@injectable()
export class DevToolsManager {
  private webviewDevToolsMap = new Map<number, number>();

  /**
   * Register and track DevTools for a WebView.
   * Should be called when DevTools are opened for a WebView.
   */
  async registerDevTools(webcontentId: number): Promise<void> {
    try {
      const guest = webContents.fromId(webcontentId);
      if (!guest) return;

      // Access undocumented devToolsWebContents property
      const devToolsWebContents = (guest as WebContents & { devToolsWebContents?: WebContents }).devToolsWebContents;
      if (devToolsWebContents && !devToolsWebContents.isDestroyed()) {
        const devToolsId = devToolsWebContents.id;
        this.webviewDevToolsMap.set(webcontentId, devToolsId);
      }
    } catch (error) {
      console.error('DevToolsManager: error in registerDevTools:', error);
    }
  }

  /**
   * Clean up DevTools associated with a WebView.
   * Should be called when a WebView is being destroyed to prevent crashes.
   */
  async cleanupDevTools(webcontentId: number): Promise<void> {
    try {
      const devToolsId = this.webviewDevToolsMap.get(webcontentId);
      if (!devToolsId) {
        return;
      }

      try {
        const closed =
          (await this.tryCloseDevToolsViaWebContents(webcontentId)) ||
          (await this.tryCloseDevToolsDirectly(devToolsId)) ||
          (await this.tryCloseDevToolsViaWindow(devToolsId));

        if (!closed) {
          console.warn('DevToolsManager: failed to close DevTools using all available methods');
        }
      } catch (closeError) {
        console.error('DevToolsManager: error closing DevTools window:', closeError);
      } finally {
        this.webviewDevToolsMap.delete(webcontentId);
      }
    } catch (error) {
      console.error('DevToolsManager: error in cleanupDevTools:', error);
    }
  }

  /**
   * Get the number of tracked DevTools instances.
   * Useful for debugging and monitoring.
   */
  getTrackedDevToolsCount(): number {
    return this.webviewDevToolsMap.size;
  }

  /**
   * Clear all tracked DevTools mappings.
   * Useful for cleanup during application shutdown.
   */
  clearAllTracking(): void {
    this.webviewDevToolsMap.clear();
  }

  /**
   * Strategy 1: Try to close DevTools using the original WebContents API.
   * This is the preferred method when the original WebView still exists.
   */
  private async tryCloseDevToolsViaWebContents(webcontentId: number): Promise<boolean> {
    const originalWebContents = webContents.fromId(webcontentId);
    if (originalWebContents && !originalWebContents.isDestroyed() && originalWebContents.isDevToolsOpened()) {
      originalWebContents.closeDevTools();
      return true;
    }
    return false;
  }

  /**
   * Strategy 2: Try to close DevTools directly via DevTools WebContents.
   * Used when the original WebView is already destroyed.
   */
  private async tryCloseDevToolsDirectly(devToolsId: number): Promise<boolean> {
    const devToolsWebContents = webContents.fromId(devToolsId);
    if (!devToolsWebContents || devToolsWebContents.isDestroyed()) {
      return false;
    }

    // Try close() first
    if (await this.tryCloseWebContents(devToolsWebContents)) {
      return true;
    }

    // Try destroy() as fallback
    return await this.tryDestroyWebContents(devToolsWebContents);
  }

  /**
   * Strategy 3: Try to find and close the DevTools window via BrowserWindow.
   * Last resort method when other strategies fail.
   */
  private async tryCloseDevToolsViaWindow(devToolsId: number): Promise<boolean> {
    const allWindows = BrowserWindow.getAllWindows();

    for (const win of allWindows) {
      if (win.isDestroyed()) {
        continue;
      }

      const winWebContentsId = win.webContents.id;

      if (winWebContentsId === devToolsId) {
        win.close();
        return true;
      }
    }

    return false;
  }

  /**
   * Helper method to close WebContents using undocumented close() method.
   */
  private async tryCloseWebContents(webContents: WebContents & { close?: () => void }): Promise<boolean> {
    try {
      // Call undocumented close() method if available
      webContents.close?.();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Helper method to destroy WebContents using undocumented destroy() method.
   */
  private async tryDestroyWebContents(webContents: WebContents & { destroy?: () => void }): Promise<boolean> {
    try {
      // Call undocumented destroy() method if available
      webContents.destroy?.();
      return true;
    } catch (error) {
      return false;
    }
  }
}
