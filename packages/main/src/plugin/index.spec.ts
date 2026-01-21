/**********************************************************************
 * Copyright (C) 2023 Red Hat, Inc.
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'node:events';
import { tmpdir } from 'node:os';

import type { PullEvent } from '@podman-desktop/api';
import type { IpcMainInvokeEvent, WebContents } from 'electron';
import { app, BrowserWindow, clipboard, ipcMain, shell } from 'electron';
import { Container as InversifyContainer } from 'inversify';
import type { Mock } from 'vitest';
import { afterEach, assert, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';

import { ExtensionLoader } from '/@/plugin/extension/extension-loader.js';
import { Updater } from '/@/plugin/updater.js';
import { ApiSenderType } from '/@api/api-sender/api-sender-type.js';
import type { PlayKubeInfo } from '/@api/libpod/libpod.js';
import type { NotificationCardOptions } from '/@api/notification.js';
import type { ProviderContainerConnectionInfo, ProviderInfo } from '/@api/provider-info.js';

import { securityRestrictionCurrentHandler } from '../security-restrictions-handler.js';
import type { TrayMenu } from '../tray-menu.js';
import { CancellationTokenRegistry } from './cancellation-token-registry.js';
import { ConfigurationRegistry } from './configuration-registry.js';
import { ContainerProviderRegistry, LatestImageError } from './container-registry.js';
import { DefaultConfiguration } from './default-configuration.js';
import { Directories } from './directories.js';
import { Emitter } from './events/emitter.js';
import type { LoggerWithEnd } from './index.js';
import { PluginSystem } from './index.js';
import { LockedConfiguration } from './locked-configuration.js';
import type { MessageBox } from './message-box.js';
import { NavigationManager } from './navigation/navigation-manager.js';
import { ProviderRegistry } from './provider-registry.js';
import { TaskImpl } from './tasks/task-impl.js';
import { TaskManager } from './tasks/task-manager.js';
import type { Task, TaskAction } from './tasks/tasks.js';
import { Disposable } from './types/disposable.js';
import { HttpServer } from './webview/webview-registry.js';

vi.mock(import('./extension/extension-api-version.js'));

let pluginSystem: TestPluginSystem;

class TestPluginSystem extends PluginSystem {
  override async initConfigurationRegistry(
    container: InversifyContainer,
    notifications: NotificationCardOptions[],
    configurationRegistryEmitter: Emitter<ConfigurationRegistry>,
  ): Promise<ConfigurationRegistry> {
    if (!container.isBound(ConfigurationRegistry)) {
      container.bind<ConfigurationRegistry>(ConfigurationRegistry).toSelf().inSingletonScope();
    }
    if (!container.isBound(DefaultConfiguration)) {
      const defaultConfigurationMock = {
        getContent: vi.fn().mockResolvedValue({}),
      } as unknown as DefaultConfiguration;
      container.bind<DefaultConfiguration>(DefaultConfiguration).toConstantValue(defaultConfigurationMock);
    }
    if (!container.isBound(LockedConfiguration)) {
      const lockedConfigurationMock = {
        getContent: vi.fn().mockResolvedValue({}),
      } as unknown as LockedConfiguration;
      container.bind<LockedConfiguration>(LockedConfiguration).toConstantValue(lockedConfigurationMock);
    }
    return super.initConfigurationRegistry(container, notifications, configurationRegistryEmitter);
  }
}

let inversifyContainer: InversifyContainer;
const emitter = new EventEmitter();
const webContents = emitter as unknown as WebContents;
webContents.isDestroyed = vi.fn();

// add send method
webContents.send = vi.fn();

const mainWindowDeferred = Promise.withResolvers<BrowserWindow>();
const handlers = new Map<string, any>();

beforeAll(async () => {
  vi.mock('electron', () => {
    return {
      shell: {
        openExternal: vi.fn(),
      },
      app: {
        on: vi.fn(),
        getVersion: vi.fn(),
        getAppPath: vi.fn().mockReturnValue('a-custom-appPath'),
      },
      clipboard: {
        writeText: vi.fn(),
      },
      ipcMain: {
        handle: vi.fn(),
        emit: vi.fn().mockReturnValue(true),
        on: vi.fn(),
      },
      BrowserWindow: {
        getAllWindows: vi.fn(),
      },
    };
  });
  const trayMenuMock = {} as unknown as TrayMenu;
  pluginSystem = new TestPluginSystem(trayMenuMock, mainWindowDeferred);

  vi.mocked(ipcMain.handle).mockImplementation((channel: string, listener: any) => {
    handlers.set(channel, listener);
  });
  vi.mocked(BrowserWindow.getAllWindows).mockImplementation(() => {
    return [
      {
        isDestroyed: () => false,
        webContents,
      } as unknown as BrowserWindow,
    ];
  });
  vi.mocked(app.getVersion).mockReturnValue('100.0.0');
  vi.spyOn(Updater.prototype, 'init').mockReturnValue(new Disposable(vi.fn()));
  vi.spyOn(ExtensionLoader.prototype, 'readDevelopmentFolders').mockResolvedValue([]);
  await pluginSystem.initExtensions(new Emitter<ConfigurationRegistry>());
  // to avoid port conflict when tests are running on windows host
  vi.spyOn(HttpServer.prototype, 'start').mockImplementation(vi.fn());

  inversifyContainer = new InversifyContainer();
});

afterEach(async () => {
  await inversifyContainer.unbindAll();
});

beforeEach(() => {
  vi.clearAllMocks();
});

test('Should queue events until we are ready', async () => {
  const apiSender = pluginSystem.getApiSender(webContents);
  expect(apiSender).toBeDefined();

  // try to send data
  apiSender.send('foo', 'hello-world');

  // data should not be sent because it is not yet ready
  expect(webContents.send).not.toBeCalled();

  // ready on server side
  pluginSystem.markAsReady();

  // notify the app is loaded on client side
  emitter.emit('dom-ready');

  // data should be sent when flushing queue
  expect(webContents.send).toBeCalledWith('api-sender', 'foo', 'hello-world');
});

test('Check SecurityRestrictions on Links and user accept', async () => {
  const showMessageBoxMock = vi.fn();
  const messageBox = {
    showMessageBox: showMessageBoxMock,
  } as unknown as MessageBox;

  // configure
  await pluginSystem.setupSecurityRestrictionsOnLinks(messageBox);

  // expect user click on Yes
  showMessageBoxMock.mockResolvedValue({ response: 0 });

  // call with a link
  const value = await securityRestrictionCurrentHandler.handler?.('https://www.my-custom-domain.io');

  expect(showMessageBoxMock).toBeCalledWith({
    buttons: ['Yes', 'Copy link', 'Cancel'],
    message: 'Are you sure you want to open the external website?',
    detail: 'https://www.my-custom-domain.io',
    cancelId: 2,
    title: 'Open External Website',
    type: 'question',
  });
  expect(value).toBeTruthy();
});

test('Check SecurityRestrictions on Links and user copy link', async () => {
  const showMessageBoxMock = vi.fn();

  const messageBox = {
    showMessageBox: showMessageBoxMock,
  } as unknown as MessageBox;

  // configure
  await pluginSystem.setupSecurityRestrictionsOnLinks(messageBox);

  // expect user click on Yes
  showMessageBoxMock.mockResolvedValue({ response: 1 });

  // call with a link
  const value = await securityRestrictionCurrentHandler.handler?.('https://www.my-custom-domain.io');

  expect(showMessageBoxMock).toBeCalledWith({
    buttons: ['Yes', 'Copy link', 'Cancel'],
    message: 'Are you sure you want to open the external website?',
    detail: 'https://www.my-custom-domain.io',
    title: 'Open External Website',
    cancelId: 2,
    type: 'question',
  });
  expect(value).toBeFalsy();

  // expect clipboard has been called
  expect(clipboard.writeText).toBeCalledWith('https://www.my-custom-domain.io');
});

test('Check SecurityRestrictions on Links and user refuses', async () => {
  const showMessageBoxMock = vi.fn();
  const messageBox = {
    showMessageBox: showMessageBoxMock,
  } as unknown as MessageBox;

  // configure
  await pluginSystem.setupSecurityRestrictionsOnLinks(messageBox);

  // expect user click on Yes
  showMessageBoxMock.mockResolvedValue({ response: 2 });

  // call with a link
  const value = await securityRestrictionCurrentHandler.handler?.('https://www.my-custom-domain.io');

  expect(showMessageBoxMock).toBeCalledWith({
    cancelId: 2,
    buttons: ['Yes', 'Copy link', 'Cancel'],
    message: 'Are you sure you want to open the external website?',
    detail: 'https://www.my-custom-domain.io',
    title: 'Open External Website',
    type: 'question',
  });
  expect(value).toBeFalsy();
});

test('Check SecurityRestrictions on known domains', async () => {
  const showMessageBoxMock = vi.fn();
  const messageBox = {
    showMessageBox: showMessageBoxMock,
  } as unknown as MessageBox;

  // configure
  await pluginSystem.setupSecurityRestrictionsOnLinks(messageBox);

  // call with a link
  const value = await securityRestrictionCurrentHandler.handler?.('https://www.podman-desktop.io');
  expect(value).toBeTruthy();

  expect(showMessageBoxMock).not.toBeCalled();

  // expect openExternal has been called
  expect(shell.openExternal).toBeCalledWith('https://www.podman-desktop.io');
});

test('Check no securityRestrictions on open external files', async () => {
  const showMessageBoxMock = vi.fn();
  const messageBox = {
    showMessageBox: showMessageBoxMock,
  } as unknown as MessageBox;

  // configure
  await pluginSystem.setupSecurityRestrictionsOnLinks(messageBox);

  // call with a file link
  const value = await securityRestrictionCurrentHandler.handler?.('file:///foobar');
  expect(value).toBeTruthy();

  expect(showMessageBoxMock).not.toBeCalled();

  // expect openExternal has been called
  expect(shell.openExternal).toBeCalledWith(expect.stringContaining('file://'));
  expect(shell.openExternal).toBeCalledWith(expect.stringContaining('foobar'));
});

test('Should apiSender handle local receive events', async () => {
  const apiSender = pluginSystem.getApiSender(webContents);
  expect(apiSender).toBeDefined();

  let fooReceived = '';
  apiSender.receive('foo', (data: any) => {
    fooReceived = String(data);
  });

  // try to send data
  apiSender.send('foo', 'hello-world');

  // data should have been received
  expect(fooReceived).toBe('hello-world');
});

test('Should return no AbortController if the token is undefined', async () => {
  const cancellationTokenRegistry = new CancellationTokenRegistry();
  const abortController = pluginSystem.createAbortControllerOnCancellationToken(cancellationTokenRegistry);
  expect(abortController).toBeUndefined();
});

test('Should return AbortController that should be aborted if token is cancelled', async () => {
  const abortMock = vi.spyOn(AbortController.prototype, 'abort');
  const cancellationTokenRegistry = new CancellationTokenRegistry();
  const tokenId = cancellationTokenRegistry.createCancellationTokenSource();
  const abortController = pluginSystem.createAbortControllerOnCancellationToken(cancellationTokenRegistry, tokenId);

  expect(abortController).toBeDefined();

  const token = cancellationTokenRegistry.getCancellationTokenSource(tokenId);
  token?.cancel();

  expect(abortMock).toBeCalled();
});

test('configurationRegistry propagated', async () => {
  const configurationRegistryEmitter = new Emitter<ConfigurationRegistry>();
  const onDidCallConfigurationRegistry = configurationRegistryEmitter.event;

  const spyFire = vi.spyOn(configurationRegistryEmitter, 'fire');

  let receivedConfig: ConfigurationRegistry | undefined;
  onDidCallConfigurationRegistry(config => (receivedConfig = config));

  const apiSenderMock = {} as unknown as ApiSenderType;
  const directoriesMock = {
    getConfigurationDirectory: vi.fn().mockReturnValue(tmpdir()),
  } as unknown as Directories;
  const defaultConfigurationMock = {
    getContent: vi.fn().mockResolvedValue({}),
  } as unknown as DefaultConfiguration;
  const lockedConfigurationMock = {
    getContent: vi.fn().mockResolvedValue({}),
  } as unknown as LockedConfiguration;
  const notifications: NotificationCardOptions[] = [];

  inversifyContainer.bind<ApiSenderType>(ApiSenderType).toConstantValue(apiSenderMock);
  inversifyContainer.bind<Directories>(Directories).toConstantValue(directoriesMock);
  inversifyContainer.bind<DefaultConfiguration>(DefaultConfiguration).toConstantValue(defaultConfigurationMock);
  inversifyContainer.bind<LockedConfiguration>(LockedConfiguration).toConstantValue(lockedConfigurationMock);

  const configurationRegistry = await pluginSystem.initConfigurationRegistry(
    inversifyContainer,
    notifications,
    configurationRegistryEmitter,
  );

  expect(spyFire).toHaveBeenCalled();
  expect(receivedConfig).toBeDefined();
  expect(receivedConfig).toBe(configurationRegistry);
  expect(notifications.length).toBe(0);
});

const pushImageHandlerId = 'container-provider-registry:pushImage';
const pushImageHandlerOnDataEvent = `${pushImageHandlerId}-onData`;

test('push image command sends onData message with callbackId, event name and data, mark task as success on end event', async () => {
  const createTaskSpy = vi.spyOn(TaskManager.prototype, 'createTask');
  const handle = handlers.get(pushImageHandlerId);
  expect(handle).not.equal(undefined);
  const defaultCallback = vi.fn();
  let registeredCallback: (name: string, data: string) => void = defaultCallback;
  vi.spyOn(ContainerProviderRegistry.prototype, 'pushImage').mockImplementation(
    (_engine, _imageId, callback: (name: string, data: string) => void) => {
      registeredCallback = callback;
      return Promise.resolve();
    },
  );
  await handle(undefined, 'podman', 'registry.com/repo/image:latest', 1);
  expect(registeredCallback).not.equal(defaultCallback);
  registeredCallback('data', 'push image output');
  expect(createTaskSpy).toHaveBeenCalledOnce();
  expect(createTaskSpy).toHaveBeenCalledWith({ title: `Push image '${'registry.com/repo/image:latest'}'` });
  expect(webContents.send).toBeCalledWith(pushImageHandlerOnDataEvent, 1, 'data', 'push image output');
  registeredCallback('end', '');
  expect(createTaskSpy.mock.results[0]?.value.status).toBe('success');
});

test('push image sends data event with error, "end" event when fails and set task error value', async () => {
  const createTaskSpy = vi.spyOn(TaskManager.prototype, 'createTask');
  const pushError = new Error('push error');
  const handle = handlers.get('container-provider-registry:pushImage');
  expect(handle).not.equal(undefined);
  vi.spyOn(ContainerProviderRegistry.prototype, 'pushImage').mockImplementation(
    (_engine, _imageId, _callback: (name: string, data: string) => void) => {
      return Promise.reject(pushError);
    },
  );
  vi.mocked(webContents.send).mockReset();
  await handle(undefined, 'podman', 'registry.com/repo/image:latest', 1);
  expect(webContents.send).toBeCalledWith(pushImageHandlerOnDataEvent, 1, 'error', String(pushError));
  expect(webContents.send).toBeCalledWith(pushImageHandlerOnDataEvent, 1, 'end');
  expect(createTaskSpy.mock.results[0]?.value.error).toBe(String(pushError));
});

test('Pull image creates a task', async () => {
  const createTaskSpy = vi.spyOn(TaskManager.prototype, 'createTask');
  const handle = handlers.get('container-provider-registry:pullImage');
  expect(handle).not.equal(undefined);
  const defaultCallback = vi.fn();
  let registeredCallback: (event: PullEvent) => void = defaultCallback;
  vi.spyOn(ContainerProviderRegistry.prototype, 'pullImage').mockImplementation(
    (_engine, _imageName, callback: (event: PullEvent) => void) => {
      registeredCallback = callback;
      return Promise.resolve();
    },
  );
  await handle(undefined, 'podman', 'registry.com/repo/image:latest', 1);
  expect(registeredCallback).not.equal(defaultCallback);
  registeredCallback({ id: 'pullEvent1' } as PullEvent);
  expect(createTaskSpy).toHaveBeenCalledOnce();
  expect(createTaskSpy).toHaveBeenCalledWith({ title: `Pulling registry.com/repo/image:latest`, action: undefined });
  expect(webContents.send).toBeCalledWith('container-provider-registry:pullImage-onData', 1, {
    id: 'pullEvent1',
  } as PullEvent);
  expect(createTaskSpy.mock.results[0]?.value.status).toBe('success');
});

test('ipcMain.handle returns caught error as is if it is instance of Error', async () => {
  const createTaskSpy = vi.spyOn(TaskManager.prototype, 'execute');
  const handle = handlers.get('tasks:execute');
  const errorInstance = new Error('error');
  createTaskSpy.mockImplementation(() => {
    throw errorInstance;
  });

  const handleReturn = await handle(undefined, '1');
  expect(handleReturn.error).toEqual(errorInstance);
});

test('ipcMain.handle returns caught error as objects message property if it is not instance of error', async () => {
  const createTaskSpy = vi.spyOn(TaskManager.prototype, 'execute');
  const handle = handlers.get('tasks:execute');
  const nonErrorInstance = 'error';
  createTaskSpy.mockImplementation(() => {
    throw nonErrorInstance;
  });

  const handleReturn = await handle(undefined, '1');
  expect(handleReturn.error).toEqual({ message: nonErrorInstance });
});

test('container-provider-registry:logsContainer calls logsContainer without abortController if no tokenId is passed', async () => {
  const handle = handlers.get('container-provider-registry:logsContainer');
  expect(handle).not.equal(undefined);

  const logsContainerSpy = vi.spyOn(ContainerProviderRegistry.prototype, 'logsContainer');

  await handle(undefined, {
    engineId: 'engine1',
    containerId: 'container1',
    onDataId: 1,
  });

  expect(logsContainerSpy).toHaveBeenCalled();
  const params = vi.mocked(logsContainerSpy).mock.calls[0]?.[0];
  const abortController = params?.abortController;
  expect(abortController).toBeUndefined();
});

test('container-provider-registry:logsContainer calls logsContainer with abortController if tokenId is passed', async () => {
  const cancellationTokenRegistry = new CancellationTokenRegistry();
  const tokenId = cancellationTokenRegistry.createCancellationTokenSource();

  const handle = handlers.get('container-provider-registry:logsContainer');
  expect(handle).not.equal(undefined);

  const logsContainerSpy = vi.spyOn(ContainerProviderRegistry.prototype, 'logsContainer');

  await handle(undefined, {
    engineId: 'engine1',
    containerId: 'container1',
    onDataId: 1,
    cancellableTokenId: tokenId,
  });

  expect(logsContainerSpy).toHaveBeenCalled();
  const params = vi.mocked(logsContainerSpy).mock.calls[0]?.[0];
  const abortController = params?.abortController;
  expect(abortController).toBeDefined();
});

describe.each<{
  handler: string;
  methodName: 'createContainerProviderConnection' | 'createKubernetesProviderConnection' | 'createVmProviderConnection';
}>([
  {
    handler: 'provider-registry:createContainerProviderConnection',
    methodName: 'createContainerProviderConnection',
  },
  {
    handler: 'provider-registry:createKubernetesProviderConnection',
    methodName: 'createKubernetesProviderConnection',
  },
  {
    handler: 'provider-registry:createVmProviderConnection',
    methodName: 'createVmProviderConnection',
  },
])('$handler', async ({ handler, methodName }) => {
  let originalTask: Task;

  beforeEach(() => {
    originalTask = {
      status: 'in-progress',
      error: '',
    } as unknown as Task;
    vi.spyOn(TaskManager.prototype, 'createTask').mockReturnValue(originalTask);
    vi.spyOn(NavigationManager.prototype, 'navigateToProviderTask');
    vi.spyOn(ProviderRegistry.prototype, 'getProviderInfo').mockReturnValue({
      name: 'provider1',
    } as ProviderInfo);
  });

  test('createTask is called', async () => {
    const handle = handlers.get(handler);
    expect(handle).not.equal(undefined);
    await handle(undefined, 'internal1', { key1: 'value1', key2: 42 }, 'logger1', 'token1', 'task1');
    expect(TaskManager.prototype.createTask).toHaveBeenCalledOnce();
    const params = vi.mocked(TaskManager.prototype.createTask).mock.calls[0]?.[0];
    if (!params) {
      // this is already expected
      throw new Error('param should be defined');
    }
    expect(params.title).toEqual(`Creating provider1 provider`);
    expect(params.action?.name).toEqual(`Open task`);

    // check that action.execute passed to createTask is calling navigateToProviderTask
    const execute = params.action?.execute;
    expect(execute).toBeDefined();
    if (!execute) {
      throw new Error('execute should be defined');
    }
    execute(new TaskImpl('task1id', 'task1name'));
    expect(NavigationManager.prototype.navigateToProviderTask).toHaveBeenCalledOnce();
    expect(NavigationManager.prototype.navigateToProviderTask).toHaveBeenCalledWith('internal1', 'task1');
  });

  test(`${methodName} is called and is resolved`, async () => {
    vi.spyOn(ProviderRegistry.prototype, methodName).mockResolvedValue();
    const onEndMock = vi.fn();
    const errorMock = vi.fn();
    vi.spyOn(pluginSystem, 'getLogHandler').mockReturnValue({
      onEnd: onEndMock,
      error: errorMock,
    } as unknown as LoggerWithEnd);
    await pluginSystem.initExtensions(new Emitter<ConfigurationRegistry>());
    const handle = handlers.get(handler);
    expect(handle).not.equal(undefined);
    const result = await handle(undefined, 'internal1', { key1: 'value1', key2: 42 }, 'logger1', 'token1', 'task1');
    expect(result).toEqual({ result: undefined });
    expect(onEndMock).toHaveBeenCalled();
    expect(errorMock).not.toHaveBeenCalled();
    expect(originalTask.status).toEqual('success');
    expect(originalTask.error).toEqual('');
  });

  test(`${methodName} is called and is rejected`, async () => {
    const rejectError = new Error('an error');
    vi.spyOn(ProviderRegistry.prototype, methodName).mockRejectedValue(rejectError);
    const onEndMock = vi.fn();
    const errorMock = vi.fn();
    vi.spyOn(pluginSystem, 'getLogHandler').mockReturnValue({
      onEnd: onEndMock,
      error: errorMock,
    } as unknown as LoggerWithEnd);
    await pluginSystem.initExtensions(new Emitter<ConfigurationRegistry>());
    const handle = handlers.get(handler);
    expect(handle).not.equal(undefined);
    const result = await handle(undefined, 'internal1', { key1: 'value1', key2: 42 }, 'logger1', 'token1', 'task1');
    expect(result).toEqual({
      error: rejectError,
    });
    expect(onEndMock).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalledWith(rejectError);
    expect(originalTask.status).toEqual('in-progress');
    expect(originalTask.error).toEqual('Something went wrong while trying to create provider: Error: an error');
  });
});

describe.each<{
  handler: string;
  methodName: 'startProviderConnection' | 'stopProviderConnection' | 'deleteProviderConnection';
  expectedTitle: string;
  expectedActionName: string;
  expectedError: string;
}>([
  {
    handler: 'provider-registry:startProviderConnectionLifecycle',
    methodName: 'startProviderConnection',
    expectedTitle: 'Starting name1',
    expectedActionName: 'Go to task >',
    expectedError: 'Something went wrong while starting container provider: Error: an error',
  },
  {
    handler: 'provider-registry:stopProviderConnectionLifecycle',
    methodName: 'stopProviderConnection',
    expectedTitle: 'Stopping name1',
    expectedActionName: 'Go to task >',
    expectedError: 'Something went wrong while stopping container provider: Error: an error',
  },
  {
    handler: 'provider-registry:deleteProviderConnectionLifecycle',
    methodName: 'deleteProviderConnection',
    expectedTitle: 'Deleting name1',
    expectedActionName: 'Go to resources',
    expectedError: 'Something went wrong while trying to delete name1',
  },
])('$handler', async ({ handler, methodName, expectedTitle, expectedActionName, expectedError }) => {
  let originalTask: Task;

  beforeEach(() => {
    originalTask = {
      status: 'in-progress',
      error: '',
    } as unknown as Task;
    vi.spyOn(TaskManager.prototype, 'createTask').mockReturnValue(originalTask);
    vi.spyOn(NavigationManager.prototype, 'navigateToResources');
  });

  test('createTask is called', async () => {
    const handle = handlers.get(handler);
    expect(handle).not.equal(undefined);
    await handle(undefined, 'internal1', { name: 'name1' }, 'logger');
    expect(TaskManager.prototype.createTask).toHaveBeenCalledOnce();
    const params = vi.mocked(TaskManager.prototype.createTask).mock.calls[0]?.[0];
    if (!params) {
      // this is already expected
      throw new Error('param should be defined');
    }
    expect(params.title).toEqual(expectedTitle);
    expect(params.action?.name).toEqual(expectedActionName);

    // check that action.execute passed to createTask is calling navigateToProviderTask
    const execute = params.action?.execute;
    expect(execute).toBeDefined();
    if (!execute) {
      throw new Error('execute should be defined');
    }
    execute(new TaskImpl('task1id', 'task1name'));
    expect(NavigationManager.prototype.navigateToResources).toHaveBeenCalledOnce();
  });

  test(`${methodName} is called and is resolved`, async () => {
    vi.spyOn(ProviderRegistry.prototype, methodName).mockResolvedValue();
    const onEndMock = vi.fn();
    const errorMock = vi.fn();
    vi.spyOn(pluginSystem, 'getLogHandler').mockReturnValue({
      onEnd: onEndMock,
      error: errorMock,
    } as unknown as LoggerWithEnd);
    const handle = handlers.get(handler);
    expect(handle).not.equal(undefined);
    const result = await handle(undefined, 'internal1', { name: 'name1' }, 'logger');
    expect(result).toEqual({ result: undefined });
    expect(onEndMock).toHaveBeenCalled();
    expect(errorMock).not.toHaveBeenCalled();
    expect(originalTask.status).toEqual('success');
    expect(originalTask.error).toEqual('');
  });

  test(`${methodName} is called and is rejected`, async () => {
    const rejectError = new Error('an error');
    vi.spyOn(ProviderRegistry.prototype, methodName).mockRejectedValue(rejectError);
    const onEndMock = vi.fn();
    const errorMock = vi.fn();
    vi.spyOn(pluginSystem, 'getLogHandler').mockReturnValue({
      onEnd: onEndMock,
      error: errorMock,
    } as unknown as LoggerWithEnd);
    const handle = handlers.get(handler);
    expect(handle).not.equal(undefined);
    const result = await handle(undefined, 'internal1', { name: 'name1' }, 'logger');
    expect(result).toEqual({
      error: rejectError,
    });
    expect(onEndMock).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalledWith(rejectError);
    expect(originalTask.status).toEqual('in-progress');
    expect(originalTask.error).toEqual(expectedError);
  });
});

describe.each<{
  handler: string;
  methodName: 'editProviderConnection';
}>([
  {
    handler: 'provider-registry:editProviderConnectionLifecycle',
    methodName: 'editProviderConnection',
  },
])('$handler', async ({ handler, methodName }) => {
  let originalTask: Task;

  beforeEach(() => {
    originalTask = {
      status: 'in-progress',
      error: '',
    } as unknown as Task;
    vi.spyOn(TaskManager.prototype, 'createTask').mockReturnValue(originalTask);
    vi.spyOn(NavigationManager.prototype, 'navigateToProviderTask');
  });

  test('createTask is called', async () => {
    const handle = handlers.get(handler);
    expect(handle).not.equal(undefined);
    await handle(undefined, 'internal1', { name: 'name1' }, { key1: 'value1', key2: 42 }, 'logger1', 'token1', 'task1');
    expect(TaskManager.prototype.createTask).toHaveBeenCalledOnce();
    const params = vi.mocked(TaskManager.prototype.createTask).mock.calls[0]?.[0];
    if (!params) {
      // this is already expected
      throw new Error('param should be defined');
    }
    expect(params.title).toEqual('Creating name1 provider');
    expect(params.action?.name).toEqual(`Open task`);

    // check that action.execute passed to createTask is calling navigateToProviderTask
    const execute = params.action?.execute;
    expect(execute).toBeDefined();
    if (!execute) {
      throw new Error('execute should be defined');
    }
    execute(new TaskImpl('task1id', 'task1name'));
    expect(NavigationManager.prototype.navigateToProviderTask).toHaveBeenCalledOnce();
    expect(NavigationManager.prototype.navigateToProviderTask).toHaveBeenCalledWith('internal1', 'task1');
  });

  test(`${methodName} is called and is resolved`, async () => {
    vi.spyOn(ProviderRegistry.prototype, methodName).mockResolvedValue();
    const onEndMock = vi.fn();
    const errorMock = vi.fn();
    vi.spyOn(pluginSystem, 'getLogHandler').mockReturnValue({
      onEnd: onEndMock,
      error: errorMock,
    } as unknown as LoggerWithEnd);
    const handle = handlers.get(handler);
    expect(handle).not.equal(undefined);
    const result = await handle(
      undefined,
      'internal1',
      { name: 'name1' },
      { key1: 'value1', key2: 42 },
      'logger1',
      'token1',
      'task1',
    );
    expect(result).toEqual({ result: undefined });
    expect(onEndMock).toHaveBeenCalled();
    expect(errorMock).not.toHaveBeenCalled();
    expect(originalTask.status).toEqual('success');
    expect(originalTask.error).toEqual('');
  });

  test(`${methodName} is called and is rejected`, async () => {
    const rejectError = new Error('an error');
    vi.spyOn(ProviderRegistry.prototype, methodName).mockRejectedValue(rejectError);
    const onEndMock = vi.fn();
    const errorMock = vi.fn();
    vi.spyOn(pluginSystem, 'getLogHandler').mockReturnValue({
      onEnd: onEndMock,
      error: errorMock,
    } as unknown as LoggerWithEnd);
    const handle = handlers.get(handler);
    expect(handle).not.equal(undefined);
    const result = await handle(
      undefined,
      'internal1',
      { name: 'name1' },
      { key1: 'value1', key2: 42 },
      'logger1',
      'token1',
      'task1',
    );
    expect(result).toEqual({
      error: rejectError,
    });
    expect(onEndMock).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalledWith(rejectError);
    expect(originalTask.status).toEqual('in-progress');
    expect(originalTask.error).toEqual('Something went wrong while creating container provider: Error: an error');
  });
});

describe('Log race condition fix', () => {
  let pluginSystem: PluginSystem;

  beforeEach(() => {
    const trayMenu = {} as TrayMenu;
    const mainWindowDeferred = Promise.withResolvers<BrowserWindow>();
    pluginSystem = new PluginSystem(trayMenu, mainWindowDeferred);
  });

  test('should not throw error when window is destroyed during shutdown', () => {
    vi.spyOn(pluginSystem, 'getWebContentsSender').mockImplementation(() => {
      throw new Error('Unable to find the main window');
    });
    (pluginSystem as any).isQuitting = false;

    const logger = pluginSystem.getLogHandler('test-channel', 'test-logger');
    expect(() => {
      logger.log('test');
      logger.warn('test');
      logger.error('test');
      logger.onEnd();
    }).not.toThrow();
  });
});

describe('container-provider-registry:buildImage', () => {
  type BuildImageHandler = (
    _listener: IpcMainInvokeEvent,
    containerBuildContextDirectory: string,
    relativeContainerfilePath: string,
    imageName: string | undefined,
    platform: string,
    selectedProvider: ProviderContainerConnectionInfo,
    onDataCallbacksBuildImageId: number,
    cancellableTokenId?: number,
    buildargs?: { [key: string]: string },
    taskId?: number,
    target?: string,
  ) => Promise<unknown>;

  let handle: BuildImageHandler;
  let createTaskSpy: Mock;

  beforeEach(() => {
    handle = handlers.get('container-provider-registry:buildImage');
    expect(handle).not.equal(undefined);

    createTaskSpy = vi.spyOn(TaskManager.prototype, 'createTask');
  });

  test('handler should create a task', async () => {
    expect(createTaskSpy).not.toHaveBeenCalled();

    await handle(
      {} as unknown as IpcMainInvokeEvent,
      'containerBuildContextDirectory',
      'relativeContainerfilePath',
      'imageName',
      'platform',
      {} as ProviderContainerConnectionInfo,
      1,
    );

    expect(createTaskSpy).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        title: expect.any(String),
        action: {
          name: 'Go to task >',
          execute: expect.any(Function),
        },
      }),
    );
  });

  test('task created should have appropriate title', async () => {
    await handle(
      {} as unknown as IpcMainInvokeEvent,
      'containerBuildContextDirectory',
      'relativeContainerfilePath',
      'imageName',
      'platform',
      {} as ProviderContainerConnectionInfo,
      1,
    );

    expect(createTaskSpy).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        title: 'Building image imageName',
      }),
    );
  });

  test('build image with target options should specify it in the task title', async () => {
    await handle(
      {} as unknown as IpcMainInvokeEvent,
      'containerBuildContextDirectory',
      'relativeContainerfilePath',
      'imageName',
      'platform',
      {} as ProviderContainerConnectionInfo,
      1,
      undefined,
      undefined,
      undefined,
      'dummy-target',
    );

    expect(createTaskSpy).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        title: 'Building image imageName (dummy-target)',
      }),
    );
  });

  test('task created should have correct action', async () => {
    const navigateToImageBuildMock = vi.spyOn(NavigationManager.prototype, 'navigateToImageBuild');

    await handle(
      {} as unknown as IpcMainInvokeEvent,
      'containerBuildContextDirectory',
      'relativeContainerfilePath',
      'imageName',
      'platform',
      {} as ProviderContainerConnectionInfo,
      1,
      undefined,
      undefined,
      55, // taskId
    );

    expect(navigateToImageBuildMock).not.toHaveBeenCalled();

    const action: TaskAction | undefined = createTaskSpy.mock.calls[0]?.[0]?.action;
    assert(action, 'task action should be defined');

    action.execute({} as Task);

    await vi.waitFor(() => {
      expect(navigateToImageBuildMock).toHaveBeenCalledExactlyOnceWith(55);
    });
  });
});

describe('updateImage handler', () => {
  test('should update image and set task status to success', async () => {
    const handle = handlers.get('container-provider-registry:updateImage');
    expect(handle).not.equal(undefined);

    const engineId = 'engine1';
    const imageId = 'sha256:abc123';
    const tag = 'alpine:latest';

    vi.spyOn(ContainerProviderRegistry.prototype, 'updateImage').mockResolvedValue(undefined);

    const createTaskSpy = vi.spyOn(TaskManager.prototype, 'createTask');

    await handle(undefined, engineId, imageId, tag);

    expect(ContainerProviderRegistry.prototype.updateImage).toHaveBeenCalledWith(engineId, imageId, tag);
    expect(createTaskSpy).toHaveBeenCalledWith({
      title: `Updating image '${tag}'`,
    });
  });

  test('should handle update errors and set task error', async () => {
    const handle = handlers.get('container-provider-registry:updateImage');
    expect(handle).not.equal(undefined);

    const engineId = 'engine1';
    const imageId = 'sha256:abc123';
    const tag = 'invalid:image';

    vi.spyOn(ContainerProviderRegistry.prototype, 'updateImage').mockRejectedValue(new Error('Network error'));

    const createTaskSpy = vi.spyOn(TaskManager.prototype, 'createTask');

    const result = await handle(undefined, engineId, imageId, tag);
    expect(result).toHaveProperty('error');
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('Network error');

    expect(createTaskSpy).toHaveBeenCalledWith({
      title: `Updating image '${tag}'`,
    });
  });

  test('should treat "Image is already the latest version" as success', async () => {
    const handle = handlers.get('container-provider-registry:updateImage');
    expect(handle).not.equal(undefined);

    const engineId = 'engine1';
    const imageId = 'sha256:abc123';
    const tag = 'alpine:latest';

    vi.spyOn(ContainerProviderRegistry.prototype, 'updateImage').mockRejectedValue(
      new LatestImageError('Image is already the latest version'),
    );

    const createTaskSpy = vi.spyOn(TaskManager.prototype, 'createTask');

    const result = await handle(undefined, engineId, imageId, tag);
    // Should not return an error since this is treated as success
    expect(result).not.toHaveProperty('error');

    expect(createTaskSpy).toHaveBeenCalledWith({
      title: `Updating image '${tag}'`,
    });

    // Verify the task was marked as success and name was updated
    const createdTask = createTaskSpy.mock.results[0]?.value;
    expect(createdTask.status).toBe('success');
    expect(createdTask.name).toBe(`Image '${tag}' is already up to date`);
  });
});

describe('container-provider-registry:playKube', () => {
  type PlayKubeHandler = (
    _listener: undefined,
    kubernetesYamlFilePath: string,
    selectedProvider: ProviderContainerConnectionInfo,
    options?: {
      build?: boolean;
      replace?: boolean;
      cancellableTokenId?: number;
    },
  ) => Promise<{ result: PlayKubeInfo | { error: Error } }>;

  const PLAY_KUBE_INFO_MOCK: PlayKubeInfo = {
    Pods: [],
    RmReport: [],
    Secrets: [],
    StopReport: [],
    Volumes: [],
  };

  const PROVIDER_CONTAINER_CONNECTION_INFO_MOCK: ProviderContainerConnectionInfo = {
    name: 'Dummy',
    type: 'podman',
    connectionType: 'container',
    displayName: 'Podman',
    status: 'started',
    endpoint: {
      socketPath: '.sock',
    },
  };

  test('should call ContainerProviderRegistry#playKube', async () => {
    const handle: PlayKubeHandler = handlers.get('container-provider-registry:playKube');
    expect(handle).not.equal(undefined);

    const playKubeSpy = vi.spyOn(ContainerProviderRegistry.prototype, 'playKube');
    playKubeSpy.mockResolvedValue(PLAY_KUBE_INFO_MOCK);

    // Call the handler
    const result = await handle(undefined, '/foo/bar.yaml', PROVIDER_CONTAINER_CONNECTION_INFO_MOCK, {
      replace: true,
    });
    assert(!('error' in result));

    // validate call
    expect(result.result).toEqual(PLAY_KUBE_INFO_MOCK);
    expect(playKubeSpy).toHaveBeenCalledExactlyOnceWith('/foo/bar.yaml', PROVIDER_CONTAINER_CONNECTION_INFO_MOCK, {
      replace: true,
    });
  });

  test('should create a task', async () => {
    const handle: PlayKubeHandler = handlers.get('container-provider-registry:playKube');
    expect(handle).not.equal(undefined);

    vi.spyOn(ContainerProviderRegistry.prototype, 'playKube').mockResolvedValue(PLAY_KUBE_INFO_MOCK);

    const createTaskSpy = vi.spyOn(TaskManager.prototype, 'createTask');

    await handle(undefined, '/foo/bar.yaml', PROVIDER_CONTAINER_CONNECTION_INFO_MOCK);

    expect(createTaskSpy).toHaveBeenCalledExactlyOnceWith({
      title: 'Podman Play Kube',
      cancellable: false,
      cancellationTokenSourceId: undefined,
    });

    // Verify the task was marked as success and name was updated
    const createdTask = createTaskSpy.mock.results[0]?.value;
    expect(createdTask.status).toBe('success');
  });

  test('should create a cancellable task if cancellableTokenId is provided', async () => {
    // let's create a cancellation token
    const createTokenHandler: () => Promise<{ result: number }> = handlers.get('cancellableTokenSource:create');
    expect(createTokenHandler).not.equal(undefined);
    const { result: cancellationTokenId } = await createTokenHandler();

    // Let's run the platKube logic
    const playKubeHandler: PlayKubeHandler = handlers.get('container-provider-registry:playKube');
    expect(playKubeHandler).not.equal(undefined);

    const playKubeSpy = vi.spyOn(ContainerProviderRegistry.prototype, 'playKube');
    playKubeSpy.mockResolvedValue(PLAY_KUBE_INFO_MOCK);

    const createTaskSpy = vi.spyOn(TaskManager.prototype, 'createTask');

    await playKubeHandler(undefined, '/foo/bar.yaml', PROVIDER_CONTAINER_CONNECTION_INFO_MOCK, {
      cancellableTokenId: cancellationTokenId,
    });

    expect(createTaskSpy).toHaveBeenCalledExactlyOnceWith({
      title: 'Podman Play Kube',
      cancellable: true,
      cancellationTokenSourceId: cancellationTokenId,
    });

    // Verify the task was marked as success and name was updated
    const createdTask = createTaskSpy.mock.results[0]?.value;
    expect(createdTask.status).toBe('success');

    // ensure the internal logic nicely created an AbortSignal
    const kubePlayOptions = playKubeSpy.mock.calls[0]?.[2];
    expect(kubePlayOptions?.abortSignal).toBeDefined();
    expect(kubePlayOptions?.abortSignal).toBeInstanceOf(AbortSignal);
  });

  test('task should be failed if ContainerProviderRegistry#kubePlay throw an error', async () => {
    const handle: PlayKubeHandler = handlers.get('container-provider-registry:playKube');
    expect(handle).not.equal(undefined);

    vi.spyOn(ContainerProviderRegistry.prototype, 'playKube').mockRejectedValue(new Error('Dummy Foo'));

    const createTaskSpy = vi.spyOn(TaskManager.prototype, 'createTask');

    const result = await handle(undefined, '/foo/bar.yaml', PROVIDER_CONTAINER_CONNECTION_INFO_MOCK);
    assert('error' in result);
    assert(result.error instanceof Error);
    expect(result?.error?.message).toBe('Dummy Foo');

    expect(createTaskSpy).toHaveBeenCalledExactlyOnceWith({
      title: 'Podman Play Kube',
      cancellable: false,
      cancellationTokenSourceId: undefined,
    });

    // Verify the task was marked as success and name was updated
    const createdTask = createTaskSpy.mock.results[0]?.value;
    expect(createdTask.status).toBe('failure');
    expect(createdTask.error).toBe('Error: Dummy Foo');
  });
});
