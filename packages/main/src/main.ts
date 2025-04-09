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
import type { App as ElectronApp, BrowserWindow, Net as ElectronNet, Protocol as ElectronProtocol } from 'electron';

import { ProtocolMedia } from '/@/protocol-media.js';
import { SecurityRestrictions } from '/@/security-restrictions.js';
import { isMac, isWindows } from '/@/util.js';

import { Deferred } from './plugin/util/deferred.js';
import { ProtocolLauncher } from './protocol-launcher.js';

export type AdditionalData = {
  argv: string[];
};

/**
 * The main Podman Desktop entry point
 */
export class Main {
  // TODO: should be renamed to #app
  public app: ElectronApp;
  // TODO: should be renamed to #mainWindowDeferred
  public mainWindowDeferred: Deferred<BrowserWindow>;
  // TODO: should be renamed to #protocolLauncher
  public protocolLauncher: ProtocolLauncher;

  #net: ElectronNet;
  #protocol: ElectronProtocol;

  constructor(app: ElectronApp, net: ElectronNet, protocol: ElectronProtocol) {
    this.app = app;
    this.mainWindowDeferred = new Deferred<BrowserWindow>();
    this.protocolLauncher = new ProtocolLauncher(this.mainWindowDeferred);

    this.#net = net;
    this.#protocol = protocol;
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
      console.error('failed to init Podman Desktop', err);
    }
  }

  protected init(additionalData: AdditionalData): void {
    /**
     * Prevent multiple instances
     */
    const isSingleInstance = this.app.requestSingleInstanceLock(additionalData);
    if (!isSingleInstance) {
      console.warn('An instance of Podman Desktop is already running. Stopping');
      this.app.quit();
      process.exit(0);
    }

    /**
     * Enable security restrictions according to Electron guidelines
     */
    const security = new SecurityRestrictions(this.app);
    security.init();

    /**
     * Media protocol
     */
    const media = new ProtocolMedia(this.app, this.#net, this.#protocol);
    media.init();

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
     * Setup {@link ElectronApp.on} listeners
     */
    this.app.on('window-all-closed', this.onWindowAllClosed.bind(this));
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
}
