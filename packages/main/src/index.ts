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
import { app, ipcMain, Menu, Tray } from 'electron';

import { restoreWindow } from '/@/mainWindow.js';
import type { ExtensionLoader } from '/@/plugin/extension/extension-loader.js';
import type { Event } from '/@api/event.js';

import { ApplicationMenuBuilder } from './application-menu-builder.js';
import { type AdditionalData, Main } from './main.js';
import type { ConfigurationRegistry } from './plugin/configuration-registry.js';
import { Emitter } from './plugin/events/emitter.js';
import { PluginSystem } from './plugin/index.js';
import { ZoomLevelHandler } from './plugin/zoom-level-handler.js';
import { StartupInstall } from './system/startup-install.js';
import { WindowHandler } from './system/window/window-handler.js';
import { AnimatedTray } from './tray-animate-icon.js';
import { TrayMenu } from './tray-menu.js';
import { isMac, isWindows, stoppedExtensions } from './util.js';

let extensionLoader: ExtensionLoader | undefined;
// Track the initialization promise to handle race conditions during startup
let extensionInitializationPromise: Promise<ExtensionLoader> | undefined;

// Main startup
const podmanDesktopMain = new Main(app);
podmanDesktopMain.main(process.argv);

// TODO: remove when index.spec.ts tests are migrated in podmanDesktopMain-main.spec
export const mainWindowDeferred = podmanDesktopMain.mainWindowDeferred;

// do not use _args as it may contain additional arguments
app.on('second-instance', (_event, _args, _workingDirectory, additionalData: unknown) => {
  // if we are on Windows, we need to handle the protocol
  if (isWindows() && additionalData && (additionalData as AdditionalData).argv) {
    podmanDesktopMain.protocolLauncher.handleAdditionalProtocolLauncherArgs((additionalData as AdditionalData).argv);
  }

  restoreWindow().catch((error: unknown) => {
    console.error('Error restoring window', error);
  });
});

app.once('before-quit', event => {
  // Prevent quit to handle cleanup properly
  event.preventDefault();

  // If initialization is still in progress, wait for it to complete first
  const handleQuit = async (): Promise<void> => {
    if (extensionInitializationPromise) {
      let timeoutId: NodeJS.Timeout | undefined;
      try {
        // Wait for initialization to complete, but don't wait forever
        const timeout = new Promise<ExtensionLoader>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Initialization timeout')), 5000);
        });
        // If initialization completes during quit, capture the result
        const loader = await Promise.race([extensionInitializationPromise, timeout]);
        // Clear the timeout since initialization completed
        clearTimeout(timeoutId);
        // Update extensionLoader if it was resolved but not yet assigned
        extensionLoader ??= loader;
      } catch (error: unknown) {
        // Clear the timeout if it was set (in case initialization promise rejected before timeout)
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        console.log('Initialization did not complete, proceeding with quit', error);
      }
    }

    // Now check if extensionLoader is available
    if (extensionLoader) {
      try {
        await extensionLoader.asyncDispose();
        console.log('Stopped all extensions');
      } catch (error: unknown) {
        console.log('Error stopping extensions', error);
      }
    }

    // Mark extensions as stopped and quit
    stoppedExtensions.val = true;
    app.quit();
  };

  handleQuit().catch((error: unknown) => {
    console.error('Error during quit handling', error);
    stoppedExtensions.val = true;
    app.quit();
  });
});

let tray: Tray;

// Handle the open-url event (macOS/Linux). For Windows, it needs to be handle in the second-instance event
app.on('will-finish-launching', () => {
  app.on('open-url', (event, url) => {
    event.preventDefault();
    // delegate to the handler
    podmanDesktopMain.protocolLauncher.handleOpenUrl(url);
  });
});

app.whenReady().then(
  async () => {
    // Setup the default tray icon + menu items
    const animatedTray = new AnimatedTray();
    tray = new Tray(animatedTray.getDefaultImage());
    animatedTray.setTray(tray);
    const trayMenu = new TrayMenu(tray, animatedTray);

    const _onDidCreatedConfigurationRegistry = new Emitter<ConfigurationRegistry>();
    const onDidCreatedConfigurationRegistry: Event<ConfigurationRegistry> = _onDidCreatedConfigurationRegistry.event;

    // Start extensions
    const pluginSystem = new PluginSystem(trayMenu, podmanDesktopMain.mainWindowDeferred);

    // Track the initialization promise
    extensionInitializationPromise = pluginSystem.initExtensions(_onDidCreatedConfigurationRegistry);

    onDidCreatedConfigurationRegistry(async (configurationRegistry: ConfigurationRegistry) => {
      // If we've manually set the tray icon color, update the tray icon. This can only be done
      // after configurationRegistry is loaded. Windows or Linux support only for icon color change.
      if (!isMac()) {
        const color = configurationRegistry.getConfiguration('preferences').get('TrayIconColor');
        if (typeof color === 'string') {
          animatedTray.setColor(color);
        }
      }

      // Share configuration registry with renderer process
      ipcMain.emit('configuration-registry', '', configurationRegistry);

      // Register the window configuration
      // This is used to save/restore the window size and position
      podmanDesktopMain.mainWindowDeferred.promise
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

    extensionLoader = await extensionInitializationPromise;
  },
  (e: unknown) => console.error('Failed to start app:', e),
);
