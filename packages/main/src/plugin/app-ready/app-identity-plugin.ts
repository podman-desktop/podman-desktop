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

import { join, resolve } from 'node:path';

import type { App as ElectronApp } from 'electron';
import { nativeImage } from 'electron';

import type { AppPlugin } from '/@/plugin/app-ready/app-plugin.js';
import { isMac } from '/@/util.js';
import product from '/@product.json' with { type: 'json' };

const DEV_ICON_RELATIVE_PATH = 'buildResources/icon-dev.png';

/**
 * Returns the path to the dev icon for use as a window icon (Linux/Windows),
 * or undefined in production.
 */
export function getDevWindowIconPath(app: ElectronApp): string | undefined {
  if (!import.meta.env.DEV) return undefined;
  return resolve(app.getAppPath(), DEV_ICON_RELATIVE_PATH);
}

/**
 * Configures a separate identity for dev instances so they can run
 * alongside the packaged application without conflicts.
 *
 * - {@link configure} must be called before
 *   {@link ElectronApp.requestSingleInstanceLock} so that the lock
 *   is scoped to the dev-specific userData directory.
 * - {@link onReady} applies the macOS Dock icon once the app is ready.
 */
export class AppIdentityPlugin implements AppPlugin {
  constructor(private readonly app: ElectronApp) {}

  onBeforeReady(): void {
    if (!import.meta.env.DEV) return;

    const devUserData = join(this.app.getPath('appData'), `${product.paths.config}-dev`);
    this.app.setPath('userData', devUserData);
    this.app.setName(`${product.name} Dev`);
  }

  async onReady(): Promise<void> {
    if (!import.meta.env.DEV) return;
    if (!isMac()) return;

    const iconPath = resolve(this.app.getAppPath(), DEV_ICON_RELATIVE_PATH);
    this.app.dock?.setIcon(nativeImage.createFromPath(iconPath));
  }

  dispose(): void {}
}
