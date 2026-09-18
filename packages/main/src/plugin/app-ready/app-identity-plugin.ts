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

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join, resolve } from 'node:path';

import type { App as ElectronApp } from 'electron';
import { nativeImage } from 'electron';

import type { AppPlugin } from '/@/plugin/app-ready/app-plugin.js';
import { buildDevIcon } from '/@/plugin/app-ready/dev-icon-builder.js';
import { isMac } from '/@/util.js';
import product from '/@product.json' with { type: 'json' };

const BASE_ICON_RELATIVE_PATH = 'buildResources/icon.png';
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
  #hash = '';
  #branch: string | undefined;

  constructor(private readonly app: ElectronApp) {}

  onBeforeReady(): void {
    if (!import.meta.env.DEV) return;

    const appPath = this.app.getAppPath();
    this.#hash = createHash('sha1').update(appPath).digest('hex').slice(0, 8);
    const devUserData = join(this.app.getPath('appData'), `${product.paths.config}-dev-${this.#hash}`);
    this.app.setPath('userData', devUserData);

    this.#branch = getGitBranch(appPath);
    this.app.setName(this.#branch ? `${product.name} Dev (${this.#branch})` : `${product.name} Dev`);
  }

  async onReady(): Promise<void> {
    if (!import.meta.env.DEV) return;
    if (!isMac()) return;

    const label = toBannerLabel(this.#branch);
    const baseIconPath = resolve(this.app.getAppPath(), BASE_ICON_RELATIVE_PATH);
    const baseIcon = nativeImage.createFromPath(baseIconPath);
    this.app.dock?.setIcon(buildDevIcon(baseIcon, label, this.#hash));
  }

  dispose(): void {}
}

export function toBannerLabel(branch: string | undefined): string {
  if (!branch) return 'DEV';
  const issueMatch = /(?:GH|PR)-?(\d+)/i.exec(branch);
  if (issueMatch) return `${issueMatch[0]!.slice(0, 2).toUpperCase()} ${issueMatch[1]}`;
  const lastSegment = branch.split('/').pop() ?? branch;
  return lastSegment.slice(0, 8);
}

function getGitBranch(cwd: string): string | undefined {
  try {
    // eslint-disable-next-line sonarjs/no-os-command-from-path
    return execSync('git rev-parse --abbrev-ref HEAD', { cwd, encoding: 'utf-8' }).trim() || undefined;
  } catch {
    return undefined;
  }
}
