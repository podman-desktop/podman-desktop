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

import { vi, beforeEach } from 'vitest';
import product from './product.json' with { type: 'json' };

/**
 * Mock the extension API for vitest.
 * This file is referenced from vitest.config.js file.
 */

const cli = {
  createCliTool: vi.fn(),
};

const commands = {
  registerCommand: vi.fn(),
};

const configuration = {
  onDidChangeConfiguration: vi.fn(),
  getConfiguration: vi.fn(),
};

const containerEngine = {
  info: vi.fn(),
  listContainers: vi.fn(),
  saveImage: vi.fn(),
  onEvent: vi.fn(),
};

const context = {
  setValue: vi.fn(),
};

const env = {
  createTelemetryLogger: vi.fn(),
  openExternal: vi.fn(),

  appName: product.name,

  isLinux: false,
  isWindows: false,
  isMac: false,
};

const kubernetes = {
  createResources: vi.fn(),
  getKubeconfig: vi.fn(),
  onDidUpdateKubeconfig: vi.fn(),
};

const net = {
  getFreePort: vi.fn(),
};

const process = {
  exec: vi.fn(),
};

const eventEmitterListeners = [];

const extensions = {
  getExtension: vi.fn(),
};

const proxy = {
  isEnabled: vi.fn(),
  onDidUpdateProxy: vi.fn(),
  onDidStateChange: vi.fn(),
  getProxySettings: vi.fn(),
};

const provider = {
  createProvider: vi.fn(),
  onDidRegisterContainerConnection: vi.fn(),
  onDidUnregisterContainerConnection: vi.fn(),
  onDidUpdateProvider: vi.fn(),
  onDidUpdateContainerConnection: vi.fn(),
  onDidUpdateVersion: vi.fn(),
  registerUpdate: vi.fn(),
  getContainerConnections: vi.fn(),
};

const registry = {
  registerRegistryProvider: vi.fn(),
  registerRegistry: vi.fn(),
  unregisterRegistry: vi.fn(),
  onDidRegisterRegistry: vi.fn(),
  onDidUnregisterRegistry: vi.fn(),
  onDidUpdateRegistry: vi.fn(),
  suggestRegistry: vi.fn(),
};

const window = {
  showInformationMessage: vi.fn(),
  showErrorMessage: vi.fn(),
  withProgress: vi.fn(),
  showNotification: vi.fn(),
  showWarningMessage: vi.fn(),

  showQuickPick: vi.fn(),
  showInputBox: vi.fn(),
  createStatusBarItem: vi.fn(),
};

const Disposable = { from: vi.fn(), dispose: vi.fn() };

class EventEmitter {
  event(callback) {
    eventEmitterListeners.push(callback);
  }

  fire(data) {
    eventEmitterListeners.forEach(listener => listener(data));
  }

  dispose() {}
}

const ProgressLocation = {
  APP_ICON: 1,
  TASK_WIDGET: 2,
};

const Uri = {
  parse: vi.fn(),
};

const plugin = {
  cli,
  commands,
  configuration,
  containerEngine,
  context,
  env,
  extensions,
  kubernetes,
  net,
  process,
  provider,
  proxy,
  registry,
  window,
  Disposable,
  EventEmitter,
  ProgressLocation,
  Uri,
};

beforeEach(() => {
  eventEmitterListeners.length = 0;
});

module.exports = plugin;
