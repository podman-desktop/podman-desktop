/**********************************************************************
 * Copyright (C) 2022-2025 Red Hat, Inc.
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
import type { App as ElectronApp, BrowserWindow } from 'electron';

import type { AppPlugin } from '/@/plugin/app-ready/app-plugin.js';
import { DefaultProtocolClient } from '/@/plugin/app-ready/default-protocol-client.js';
import { WindowPlugin } from '/@/plugin/app-ready/window-plugin.js';
import { product } from '/@/product.js';
import { SecurityRestrictions } from '/@/security-restrictions.js';
import { isLinux, isMac, isWindows } from '/@/util.js';
import type { IDisposable } from '/@api/disposable.js';

import { ProtocolLauncher } from './protocol-launcher.js';

export type AdditionalData = {
  argv: string[];
};

/**
 * The main Podman Desktop entry point
 */
export class Main implements IDisposable {
  // TODO: should be renamed to #app
  public app: ElectronApp;
  // TODO: should be renamed to #mainWindowDeferred
  public mainWindowDeferred: PromiseWithResolvers<BrowserWindow>;
  // TODO: should be renamed to #protocolLauncher
  public protocolLauncher: ProtocolLauncher;

  /**
   * Represents a collection of application plugins.
   *
   * Each plugin exposes a {@link AppPlugin#onReady} method called when {@link ElectronApp#whenReady} resolved.
   *
   * Plugins are {@link IDisposable} and are disposed when {@link ElectronApp#on('before-quit')} is emitted
   *
   * @type {Array<AppPlugin>}
   */
  readonly #plugins: Array<AppPlugin>;

  constructor(app: ElectronApp) {
    this.app = app;
    this.mainWindowDeferred = Promise.withResolvers<BrowserWindow>();
    this.protocolLauncher = new ProtocolLauncher(this.mainWindowDeferred);
    this.#plugins = [new DefaultProtocolClient(this.app), new WindowPlugin(this.app, this.mainWindowDeferred.resolve)];
  }

  main(args: string[]): void {
    // parse argv
    const argv = args.slice(2);
    const additionalData: AdditionalData = {
      argv: argv,
    };

    try {
      this.init(additionalData);
    } catch (err: unknown) {
      console.error(`failed to init ${product.name}`, err);
    }
  }

  protected init(additionalData: AdditionalData): void {
    /**
     * Prevent multiple instances
     */
    const isSingleInstance = this.app.requestSingleInstanceLock(additionalData);
    if (!isSingleInstance) {
      console.warn(`An instance of ${product.name} is already running. Stopping`);
      this.app.quit();
      process.exit(0);
    }

    /**
     * Enable security restrictions according to Electron guidelines
     */
    const security = new SecurityRestrictions(this.app);
    security.init();

    /**
     * Disable Hardware Acceleration for more power-save
     */
    this.app.disableHardwareAcceleration();

    /**
     *  @see https://www.electronjs.org/docs/latest/api/app#appsetappusermodelidid-windows
     */
    if (isWindows()) {
      this.app.setAppUserModelId(this.app.name);
    }

    /**
     * Since electron v36
     * references
     * - https://github.com/electron/electron/issues/46538
     * - https://chromium-review.googlesource.com/c/chromium/src/+/6310469
     */
    if (isLinux()) {
      this.app.commandLine.appendSwitch('gtk-version', '3');
    }

    /**
     * Setup {@link ElectronApp.on} listeners
     */
    this.app.on('window-all-closed', this.onWindowAllClosed.bind(this));
    this.app.on('before-quit', this.onBeforeQuit.bind(this));

    /**
     * Register {@link Main#whenReady} for ready event
     */
    this.app.whenReady().then(this.whenReady.bind(this)).catch(console.error);
  }

  /**
   * Waits for all plugins to complete their initialization and become ready.
   *
   * This method calls for each plugin their corresponding {@link AppPlugin#onReady} method.
   *
   * @return {Promise<Array<void>>}
   */
  protected async whenReady(): Promise<Array<void>> {
    return Promise.all(this.#plugins.map(plugin => plugin.onReady()));
  }

  /**
   * Listener for {@link ElectronApp.on('window-all-closed')} event
   * Shout down background process if all windows was closed
   */
  protected onWindowAllClosed(): void {
    if (!isMac()) {
      this.app.quit();
    }
  }

  /**
   * Listener for {@link ElectronApp.on('before-quit')} event
   */
  protected onBeforeQuit(): void {
    this.dispose();
  }

  dispose(): void {
    this.#plugins.forEach(plugin => plugin.dispose());
  }
}
