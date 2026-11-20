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
import type { Event, IDisposable } from '@desktop-framework/api';
import type { App as ElectronApp, BrowserWindow } from 'electron';
import { ipcMain, Menu, Tray } from 'electron';

import { restoreWindow } from '/@/mainWindow.js';
import { AppIdentityDevPlugin } from '/@/plugin/app-ready/app-identity-plugin.js';
import type { AppPlugin } from '/@/plugin/app-ready/app-plugin.js';
import { DefaultProtocolClient } from '/@/plugin/app-ready/default-protocol-client.js';
import { DevIconBuilder } from '/@/plugin/app-ready/dev-icon-builder.js';
import { WindowPlugin } from '/@/plugin/app-ready/window-plugin.js';
import type { ExtensionLoader } from '/@/plugin/extension/extension-loader.js';
import { SecurityRestrictions } from '/@/security-restrictions.js';
import { isLinux, isMac, isWindows, stoppedExtensions } from '/@/util.js';
import product from '/@product.json' with { type: 'json' };

import { ApplicationMenuBuilder } from './application-menu-builder.js';
import type { ConfigurationRegistry } from './plugin/configuration-registry.js';
import { Emitter } from './plugin/events/emitter.js';
import { PluginSystem } from './plugin/index.js';
import { readShowTrayIconSetting } from './plugin/util/read-tray-setting.js';
import { ZoomLevelHandler } from './plugin/zoom-level-handler.js';
import { ProtocolLauncher } from './protocol-launcher.js';
import { StartupInstall } from './system/startup-install.js';
import { WindowHandler } from './system/window/window-handler.js';
import { AnimatedDevTray } from './tray-animate-dev-icon.js';
import { AnimatedTray } from './tray-animate-icon.js';
import { TrayMenu } from './tray-menu.js';

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
  readonly #protocolLauncher: ProtocolLauncher;

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

  #extensionLoader: ExtensionLoader | undefined;
  #animatedTray: AnimatedTray | undefined;
  #tray: Tray | undefined;

  constructor(app: ElectronApp) {
    this.app = app;
    this.app.name = product.name;
    this.mainWindowDeferred = Promise.withResolvers<BrowserWindow>();
    this.#protocolLauncher = new ProtocolLauncher(this.mainWindowDeferred);
    const identity = import.meta.env.DEV
      ? new AppIdentityDevPlugin(this.app, new DevIconBuilder(this.app.getAppPath()))
      : undefined;
    this.#plugins = [
      ...(identity ? [identity] : []),
      new DefaultProtocolClient(this.app),
      new WindowPlugin(this.app, this.mainWindowDeferred.resolve, { icon: identity?.getWindowIcon() }),
    ];
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
    this.#plugins.forEach(plugin => {
      plugin.onBeforeReady?.();
    });

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
    this.app.on('second-instance', this.onSecondInstance.bind(this));
    this.app.on('will-finish-launching', this.onWillFinishLaunching.bind(this));
    this.app.on('window-all-closed', this.onWindowAllClosed.bind(this));
    this.app.on('before-quit', this.onBeforeQuit.bind(this));
    this.app.on('will-quit', this.onWillQuit.bind(this));
    this.app.once('before-quit', this.onBeforeQuitStopExtensions.bind(this));

    /**
     * Register {@link Main#whenReady} for ready event
     */
    this.app.whenReady().then(this.whenReady.bind(this)).catch(console.error);
    this.app
      .whenReady()
      .then(this.startPluginSystem.bind(this), (e: unknown) => console.error('Failed to start app:', e));
  }

  /**
   * Starts the plugin system, once {@link ElectronApp#whenReady} resolved and the plugins started
   */
  protected async startPluginSystem(): Promise<void> {
    // Setup the default tray icon + menu items (skip if user disabled tray)
    const showTrayIcon = readShowTrayIconSetting();
    if (showTrayIcon) {
      this.#animatedTray = import.meta.env.DEV ? new AnimatedDevTray() : new AnimatedTray();
      this.#tray = new Tray(this.#animatedTray.getDefaultImage());
      this.#animatedTray.setTray(this.#tray);
    }
    const trayMenu = new TrayMenu(this.#tray, this.#animatedTray);

    const _onDidCreatedConfigurationRegistry = new Emitter<ConfigurationRegistry>();
    const onDidCreatedConfigurationRegistry: Event<ConfigurationRegistry> = _onDidCreatedConfigurationRegistry.event;

    // Start extensions
    const pluginSystem = new PluginSystem(trayMenu, this.mainWindowDeferred);

    onDidCreatedConfigurationRegistry(async (configurationRegistry: ConfigurationRegistry) => {
      // If we've manually set the tray icon color, update the tray icon. This can only be done
      // after configurationRegistry is loaded. Windows or Linux support only for icon color change.
      if (!isMac()) {
        const color = configurationRegistry.getConfiguration('preferences').get('TrayIconColor');
        if (typeof color === 'string') {
          this.#animatedTray?.setColor(color);
        }
      }

      // Share configuration registry with renderer process
      ipcMain.emit('configuration-registry', '', configurationRegistry);

      // Register the window configuration
      // This is used to save/restore the window size and position
      this.mainWindowDeferred.promise
        .then(browserWindow => {
          const windowHandler = new WindowHandler(configurationRegistry, browserWindow);
          windowHandler.init();

          // Configure the zoom level handler
          // handle zoom level
          const zoomLevelHandler = new ZoomLevelHandler(browserWindow, configurationRegistry);
          zoomLevelHandler.init();

          // sets the menu
          const applicationMenuBuilder = new ApplicationMenuBuilder(zoomLevelHandler);
          const menu = applicationMenuBuilder.build();

          if (menu) {
            Menu.setApplicationMenu(menu);
          }

          // send window Handler
          ipcMain.emit('window-handler', '', windowHandler);
        })
        .catch((error: unknown) => {
          console.error('Error initializing window handler', error);
        });

      // Configure automatic startup
      const automaticStartup = new StartupInstall(configurationRegistry);
      await automaticStartup.configure();
    });

    this.#extensionLoader = await pluginSystem.initExtensions(_onDidCreatedConfigurationRegistry);
  }

  /**
   * Listener for {@link ElectronApp.on('will-quit')} event
   * Clean up tray resources
   */
  protected onWillQuit(): void {
    this.#animatedTray?.dispose();
    this.#tray?.destroy();
  }

  /**
   * Listener for the first {@link ElectronApp.on('before-quit')} event
   * Stops the extensions before quitting again
   */
  protected onBeforeQuitStopExtensions(event: { preventDefault: () => void }): void {
    if (!this.#extensionLoader) {
      stoppedExtensions.val = true;
      return;
    }
    event.preventDefault();
    this.#extensionLoader
      .asyncDispose()
      .then(() => {
        console.log('Stopped all extensions');
      })
      .catch((error: unknown) => {
        console.log('Error stopping extensions', error);
      })
      .finally(() => {
        stoppedExtensions.val = true;
        this.app.quit();
      });
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
   * Listener for {@link ElectronApp.on('second-instance')} event
   * do not use _args as it may contain additional arguments
   */
  protected onSecondInstance(
    _event: unknown,
    _args: string[],
    _workingDirectory: string,
    additionalData: unknown,
  ): void {
    // if we are on Windows, we need to handle the protocol
    if (isWindows() && additionalData && (additionalData as AdditionalData).argv) {
      this.#protocolLauncher.handleAdditionalProtocolLauncherArgs((additionalData as AdditionalData).argv);
    }

    restoreWindow().catch((error: unknown) => {
      console.error('Error restoring window', error);
    });
  }

  /**
   * Listener for {@link ElectronApp.on('will-finish-launching')} event
   * Handle the open-url event (macOS/Linux). For Windows, it needs to be handled in the second-instance event
   */
  protected onWillFinishLaunching(): void {
    this.app.on('open-url', (event, url) => {
      event.preventDefault();
      // delegate to the handler
      this.#protocolLauncher.handleOpenUrl(url);
    });
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
