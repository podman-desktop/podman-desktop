/**********************************************************************
 * Copyright (C) 2022-2026 Red Hat, Inc.
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
// (delete-me) cold-start trace — write to file since Playwright consumes both stdout and stderr
import { appendFileSync } from 'node:fs';

import type { IDisposable } from '@podman-desktop/core-api';
import type { App as ElectronApp, BrowserWindow } from 'electron';

import type { AppPlugin } from '/@/plugin/app-ready/app-plugin.js';
import { DefaultProtocolClient } from '/@/plugin/app-ready/default-protocol-client.js';
import { WindowPlugin } from '/@/plugin/app-ready/window-plugin.js';
import { SecurityRestrictions } from '/@/security-restrictions.js';
import { isLinux, isMac, isWindows } from '/@/util.js';
import product from '/@product.json' with { type: 'json' };

import { ProtocolLauncher } from './protocol-launcher.js';

const T0 = Date.now();
const traceFile = process.env['PD_COLD_TRACE_FILE'];
const trace = (msg: string): void => {
  const line = `[TRACE] +${Date.now() - T0}ms ${msg}\n`;
  if (traceFile)
    try {
      appendFileSync(traceFile, line);
    } catch (_e) {
      /* ignore */
    }
  process.stderr.write(line);
};
trace('main.ts module loaded');

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
    trace('Main constructor start');
    this.app = app;
    this.app.name = product.name;
    this.mainWindowDeferred = Promise.withResolvers<BrowserWindow>();
    this.protocolLauncher = new ProtocolLauncher(this.mainWindowDeferred);
    this.#plugins = [new DefaultProtocolClient(this.app), new WindowPlugin(this.app, this.mainWindowDeferred.resolve)];
    trace('Main constructor done');
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
    trace('init() start');
    /**
     * Prevent multiple instances
     */
    const isSingleInstance = this.app.requestSingleInstanceLock(additionalData);
    trace('requestSingleInstanceLock done');
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
    trace('SecurityRestrictions.init done');

    /**
     * Disable Hardware Acceleration for more power-save
     */
    this.app.disableHardwareAcceleration();
    trace('disableHardwareAcceleration done');

    /**
     *  @see https://www.electronjs.org/docs/latest/api/app#appsetappusermodelidid-windows
     */
    if (isWindows()) {
      this.app.setAppUserModelId(product.appId);
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
    trace('registering app.whenReady()');
    this.app.whenReady().then(this.whenReady.bind(this)).catch(console.error);
    trace('init() done');
  }

  /**
   * Waits for all plugins to complete their initialization and become ready.
   *
   * This method calls for each plugin their corresponding {@link AppPlugin#onReady} method.
   *
   * @return {Promise<Array<void>>}
   */
  protected async whenReady(): Promise<Array<void>> {
    trace('whenReady() fired — calling plugin.onReady()');
    const result = await Promise.all(this.#plugins.map(plugin => plugin.onReady()));
    trace('whenReady() plugins done');
    return result;
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
