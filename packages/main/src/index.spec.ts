/**********************************************************************
 * Copyright (C) 2023-2025 Red Hat, Inc.
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

import type { App } from 'electron';
import { app, BrowserWindow, Menu, Tray } from 'electron';
import { aboutMenuItem } from 'electron-util/main';
import { afterEach, assert, beforeEach, expect, test, vi } from 'vitest';

import type { IConfigurationChangeEvent, IConfigurationRegistry } from '/@api/configuration/models.js';

import { mainWindowDeferred } from './index.js';
import { Emitter } from './plugin/events/emitter.js';
import { PluginSystem } from './plugin/index.js';
import * as util from './util.js';

const consoleLogMock = vi.fn();
const originalConsoleLog = console.log;

const constants = vi.hoisted(() => {
  let resolveFn: ((value: void | PromiseLike<void>) => void) | undefined = undefined;
  return {
    appReadyDeferredPromise: new Promise<void>(resolve => {
      resolveFn = resolve;
    }),
    resolveFn,
  };
});

/* eslint-disable @typescript-eslint/no-empty-function */
vi.mock('electron-is-dev', async () => {
  return {};
});
vi.mock('electron-context-menu', async () => {
  return {
    default: vi.fn(),
  };
});
vi.mock('electron-util/main', async () => {
  return {
    aboutMenuItem: vi.fn().mockReturnValue({ label: 'foo' }),
  };
});

const _onDidChangeConfiguration = new Emitter<IConfigurationChangeEvent>();
const configurationRegistryMock = {
  onDidChangeConfiguration: _onDidChangeConfiguration.event,
  registerConfigurations: vi.fn(),
  getConfigurationProperties: vi.fn().mockReturnValue({}),
  getConfiguration: vi.fn().mockReturnValue({
    get: vi.fn(),
  }),
} as unknown as IConfigurationRegistry;

const fakeWindow = {
  isDestroyed: vi.fn(),
  webContents: {
    send: vi.fn(),
  },
} as unknown as BrowserWindow;

const initMock = vi.fn();
const extensionLoader = {
  getConfigurationRegistry: vi.fn(),
};

vi.mock('./plugin', async () => {
  return {
    PluginSystem: vi.fn(),
  };
});

vi.mock('./util', async () => {
  return {
    isWindows: vi.fn().mockReturnValue(false),
    isMac: vi.fn().mockReturnValue(false),
    isLinux: vi.fn().mockReturnValue(false),
  };
});

vi.mock('electron', async () => {
  class MyCustomWindow {
    static readonly singleton = new MyCustomWindow();

    loadURL(): void {}
    setBounds(): void {}

    on(): void {}

    show(): void {}
    focus(): void {}
    isMinimized(): boolean {
      return false;
    }
    isDestroyed(): boolean {
      return false;
    }

    static getAllWindows(): unknown[] {
      return [MyCustomWindow.singleton];
    }
  }

  return {
    autoUpdater: {
      on: vi.fn(),
    },

    screen: {
      getCursorScreenPoint: vi.fn(),
      getDisplayNearestPoint: vi.fn().mockImplementation(() => {
        const workArea = { x: 0, y: 0, width: 0, height: 0 };
        return { workArea };
      }),
    },
    app: {
      getAppPath: (): string => 'a-custom-appPath',
      getPath: (): string => 'a-custom-path',
      disableHardwareAcceleration: vi.fn(),
      requestSingleInstanceLock: vi.fn().mockReturnValue(true),
      quit: vi.fn(),
      on: vi.fn(),
      once: vi.fn(),
      whenReady: vi.fn().mockReturnValue(constants.appReadyDeferredPromise),
      setAppUserModelId: vi.fn(),
    },
    ipcMain: {
      on: vi.fn(),
      emit: vi.fn(),
      handle: vi.fn(),
    },
    nativeTheme: {
      on: vi.fn(),
    },
    Menu: {
      buildFromTemplate: vi.fn(),
      getApplicationMenu: vi.fn(),
      setApplicationMenu: vi.fn(),
    },
    BrowserWindow: MyCustomWindow /*{
      getAllWindows: vi.fn().mockReturnValue([]),
    },*/,
    Tray: vi.fn(),
  };
});

beforeEach(() => {
  console.log = consoleLogMock;
  vi.clearAllMocks();
  vi.mocked(Tray).mockImplementation(() => {
    return {
      tray: vi.fn(),
      setImage: vi.fn(),
      setToolTip: vi.fn(),
      setContextMenu: vi.fn(),
    } as unknown as Tray;
  });
  vi.mocked(PluginSystem).mockImplementation(() => {
    return {
      initExtensions: initMock.mockImplementation(() => extensionLoader),
    } as unknown as PluginSystem;
  });

  vi.mocked(app.whenReady).mockReturnValue(constants.appReadyDeferredPromise);
  const newDefer = Promise.withResolvers<BrowserWindow>();
  if (mainWindowDeferred.promise !== undefined) {
    mainWindowDeferred.resolve = newDefer.resolve;
    mainWindowDeferred.promise = newDefer.promise;
    mainWindowDeferred.reject = newDefer.reject;
  }
  mainWindowDeferred.resolve(fakeWindow);
});

afterEach(() => {
  console.log = originalConsoleLog;
});

test('app-ready event with activate event', async () => {
  vi.mocked(util.isMac).mockReset();
  vi.mocked(util.isMac).mockReturnValue(true);

  // grab all windows
  const windows = BrowserWindow.getAllWindows();
  expect(windows).toHaveLength(1);

  const window = windows[0];
  if (!window) {
    assert.fail('window is undefined');
  }
  const spyShow = vi.spyOn(window, 'show');
  const spyFocus = vi.spyOn(window, 'focus');

  let activateCallback: ((event: unknown) => void) | undefined = undefined;

  // capture activate event
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  vi.mocked(app.on).mockImplementation((event: string, callback: Function): App => {
    if (event === 'activate') {
      activateCallback = callback as (event: unknown) => void;
    }
    return app;
  });

  if (constants.resolveFn) {
    const appReady: (value: void | Promise<void>) => void = constants.resolveFn;
    if (constants.resolveFn) {
      appReady();
    }
  } else {
    assert.fail('constants.resolveFn is undefined');
  }
  // wait activateCallback being set
  await vi.waitUntil(() => activateCallback !== undefined);
  // now, check that we called
  activateCallback!({});

  // expect show and focus have been called
  expect(spyShow).toHaveBeenCalled();
  expect(spyFocus).toHaveBeenCalled();

  // capture the pluginSystem.initExtensions call
  const initExtensionsCalls = vi.mocked(initMock).mock.calls;
  expect(initExtensionsCalls).toHaveLength(1);

  // grab onDidConfigurationRegistry parameter
  const _onDidConfigurationRegistry = initExtensionsCalls?.[0]?.[0];
  // call the onDidConfigurationRegistry
  expect(_onDidConfigurationRegistry).toBeDefined();

  // cast as Emitter
  const onDidConfigurationRegistry = _onDidConfigurationRegistry as Emitter<IConfigurationRegistry>;

  // create a Menu
  vi.mocked(Menu.getApplicationMenu).mockReturnValue({
    items: [
      {
        role: 'help',
        submenu: {
          items: [],
        },
      },
    ],
  } as unknown as Menu);
  vi.mocked(aboutMenuItem).mockReturnValue({
    label: 'About',
  });
  vi.mocked(Menu.buildFromTemplate).mockReturnValue({} as unknown as Menu);

  onDidConfigurationRegistry.fire(configurationRegistryMock);

  // check we've called Menu.getApplicationMenu
  await vi.waitFor(() => expect(vi.mocked(Menu.getApplicationMenu)).toHaveBeenCalled());

  // and Menu.buildFromTemplate
  expect(vi.mocked(Menu.buildFromTemplate)).toHaveBeenCalled();

  // and Menu.setApplicationMenu
  expect(vi.mocked(Menu.setApplicationMenu)).toHaveBeenCalled();
});
