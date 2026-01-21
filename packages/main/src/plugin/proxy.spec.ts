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

import EventEmitter from 'node:events';
import * as fs from 'node:fs';
import * as http from 'node:http';
import type { AddressInfo } from 'node:net';

import { createProxy, type ProxyServer } from 'proxy';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import type { Certificates } from '/@/plugin/certificates.js';
import { ConfigurationRegistry } from '/@/plugin/configuration-registry.js';
import { ensureURL, Proxy } from '/@/plugin/proxy.js';
import type { ApiSenderType } from '/@api/api-sender/api-sender-type.js';
import type { IDisposable } from '/@api/disposable.js';
import { ProxyState } from '/@api/proxy.js';

import type { DefaultConfiguration } from './default-configuration.js';
import type { Directories } from './directories.js';
import type { LockedConfiguration } from './locked-configuration.js';
import { getProxySettingsFromSystem } from './proxy-system.js';

const URL = 'https://podman-desktop.io';

vi.mock('./proxy-system.js', () => {
  return {
    getProxySettingsFromSystem: vi.fn(),
  };
});

// Mock the fs module
vi.mock('node:fs');
const readFileSync = vi.spyOn(fs, 'readFileSync');
const writeFileSync = vi.spyOn(fs, 'writeFileSync');
const existsSync = vi.spyOn(fs, 'existsSync');
const mkdirSync = vi.spyOn(fs, 'mkdirSync');

const certificates: Certificates = {
  getAllCertificates: vi.fn(),
} as unknown as Certificates;

const apiEmitter = new EventEmitter();

const apiSender: ApiSenderType = {
  send: function (channel: string, data?: unknown): void {
    apiEmitter.emit(channel, data);
  },
  receive: function (channel: string, func: (...args: unknown[]) => void): IDisposable {
    apiEmitter.on(channel, func);
    return {
      dispose: function (): void {
        apiEmitter.removeAllListeners();
      },
    };
  },
};

const directories = {
  getConfigurationDirectory: () => '/fake-config-directory',
  getPluginsDirectory: () => '/fake-plugins-directory',
  getPluginsScanDirectory: () => '/fake-plugins-scanning-directory',
  getExtensionsStorageDirectory: () => '/fake-extensions-storage-directory',
  getContributionStorageDir: () => '/fake-contribution-storage-directory',
  getSafeStorageDirectory: () => '/fake-safe-storage-directory',
  getDataDirectory: () => '/fake-data-directory',
  getManagedDefaultsDirectory: () => '/fake-managed-defaults-directory',
} as unknown as Directories;

const defaultConfiguration = {
  getContent: vi.fn().mockResolvedValue({}),
} as unknown as DefaultConfiguration;

const lockedConfiguration = {
  getContent: vi.fn().mockResolvedValue({}),
} as unknown as LockedConfiguration;

function getConfigurationRegistry(): ConfigurationRegistry {
  return new ConfigurationRegistry(apiSender, directories, defaultConfiguration, lockedConfiguration);
}

async function buildProxy(): Promise<ProxyServer> {
  return new Promise(resolve => {
    const server = createProxy(http.createServer());
    server.listen(0, () => resolve(server));
  });
}

let proxy: Proxy | undefined;
let configurationRegistry: ConfigurationRegistry;

beforeAll(async () => {
  // Set up filesystem mocks
  readFileSync.mockReturnValue(JSON.stringify({}));
  writeFileSync.mockReturnValue(undefined);
  existsSync.mockReturnValue(true);
  mkdirSync.mockReturnValue('');

  configurationRegistry = getConfigurationRegistry();
  proxy = new Proxy(configurationRegistry, certificates);
  await proxy.init();
});

test('fetch without proxy', async () => {
  await proxy?.setState(ProxyState.PROXY_DISABLED);
  await fetch(URL);
});

test('fetch with http proxy', async () => {
  const proxyServer = await buildProxy();
  const address = proxyServer.address() as AddressInfo;
  await proxy?.setState(ProxyState.PROXY_MANUAL);
  await proxy?.setProxy({
    httpsProxy: `127.0.0.1:${address.port}`,
    httpProxy: undefined,
    noProxy: undefined,
  });

  let connectDone = false;
  proxyServer.on('connect', () => (connectDone = true));
  await fetch(URL);
  expect(connectDone).toBeTruthy();
});

test('check change from manual to system without proxy send event', async () => {
  await proxy?.setState(ProxyState.PROXY_MANUAL);
  await proxy?.setProxy({
    httpProxy: `127.0.0.1:8080`,
    httpsProxy: undefined,
    noProxy: undefined,
  });
  const stateListener = vi.fn();
  const settingsListener = vi.fn();
  proxy?.onDidStateChange(stateListener);
  proxy?.onDidUpdateProxy(settingsListener);
  await proxy?.setState(ProxyState.PROXY_SYSTEM);
  expect(stateListener).toHaveBeenCalledWith(false);
  expect(settingsListener).not.toHaveBeenCalled();
});

test('check change from manual to system with proxy send event', async () => {
  await proxy?.setState(ProxyState.PROXY_MANUAL);
  await proxy?.setProxy({
    httpProxy: `127.0.0.1:8080`,
    httpsProxy: undefined,
    noProxy: undefined,
  });
  const stateListener = vi.fn();
  const settingsListener = vi.fn();
  proxy?.onDidStateChange(stateListener);
  proxy?.onDidUpdateProxy(settingsListener);
  vi.mocked(getProxySettingsFromSystem).mockResolvedValue({
    httpProxy: 'https://127.0.0.1:8081',
    httpsProxy: undefined,
    noProxy: undefined,
  });
  await proxy?.setState(ProxyState.PROXY_SYSTEM);
  expect(stateListener).toHaveBeenCalledWith(true);
  expect(settingsListener).toHaveBeenCalledWith({ httpProxy: 'https://127.0.0.1:8081' });
});

describe.each([
  { original: '127.0.0.1', converted: 'http://127.0.0.1' },
  { original: '127.0.0.1:8080', converted: 'http://127.0.0.1:8080' },
  { original: '192.168.1.1', converted: 'http://192.168.1.1' },
  { original: '192.168.1.1:8080', converted: 'http://192.168.1.1:8080' },
  { original: 'myhostname', converted: 'http://myhostname' },
  { original: 'myhostname:8080', converted: 'http://myhostname:8080' },
  { original: 'myhostname.domain.com', converted: 'http://myhostname.domain.com' },
  { original: 'myhostname.domain.com:8080', converted: 'http://myhostname.domain.com:8080' },
  { original: 'http://127.0.0.1', converted: 'http://127.0.0.1' },
  { original: 'http://127.0.0.1:8080', converted: 'http://127.0.0.1:8080' },
  { original: 'http://192.168.1.1', converted: 'http://192.168.1.1' },
  { original: 'http://192.168.1.1:8080', converted: 'http://192.168.1.1:8080' },
  { original: 'http://myhostname', converted: 'http://myhostname' },
  { original: 'http://myhostname:8080', converted: 'http://myhostname:8080' },
  { original: 'http://myhostname.domain.com', converted: 'http://myhostname.domain.com' },
  { original: 'http://myhostname.domain.com:8080', converted: 'http://myhostname.domain.com:8080' },
])('Ensure URL returns corrected value', ({ original, converted }) => {
  test(`Ensure ${original} is converted to ${converted}`, () => {
    expect(ensureURL(original)).toBe(converted);
  });
});

test('check isEnabled returns false when proxy is system but noProxy is not empty', async () => {
  vi.mocked(getProxySettingsFromSystem).mockResolvedValue({
    httpProxy: undefined,
    httpsProxy: undefined,
    noProxy: 'localhost,127.0.0.1',
  });
  await proxy?.setState(ProxyState.PROXY_SYSTEM);
  await proxy?.setProxy(undefined);
  expect(proxy?.isEnabled()).toBe(false);
});

test('check isEnabled returns true when proxy is system and some proxy is enabled', async () => {
  vi.mocked(getProxySettingsFromSystem).mockResolvedValue({
    httpProxy: 'http://127.0.0.1:8080',
    httpsProxy: undefined,
    noProxy: 'localhost,127.0.0.1',
  });
  await proxy?.setState(ProxyState.PROXY_SYSTEM);
  await proxy?.setProxy(undefined);
  expect(proxy?.isEnabled()).toBe(true);
});
