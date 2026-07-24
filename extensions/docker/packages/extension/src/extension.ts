/**********************************************************************
 * Copyright (C) 2022-2024 Red Hat, Inc.
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

import * as http from 'node:http';

import * as extensionApi from '@podman-desktop/api';
import type { DockerContextInfo, DockerExtensionApi } from '@podman-desktop/docker-extension-api';

import { getDockerInstallation } from './docker-cli';
import { DockerCompatibilitySetup } from './docker-compatibility-setup';
import { DockerConfig } from './docker-config';
import { DockerContextHandler, parseContextEndpoint } from './docker-context-handler';

let stopLoop = false;
let provider: extensionApi.Provider | undefined;
let lastProviderStatus: extensionApi.ProviderStatus | undefined;
// one connection per Docker CLI context, keyed by context name. A connection's engine going
// unreachable only flips its status (kept registered, mirrors Podman's machine model) so it
// doesn't disappear just because the engine is temporarily off. It's only disposed once the
// context itself is gone from `docker context ls`, so Resources tracks the context list exactly.
const connectionDisposables = new Map<string, extensionApi.Disposable>();
const connectionStatuses = new Map<string, extensionApi.ProviderConnectionStatus>();

async function timeout(time: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time);
  });
}
async function isDockerDaemonAlive(socketPath: string): Promise<boolean> {
  const pingUrl = {
    path: '/_ping',
    socketPath,
  };

  return new Promise<boolean>(resolve => {
    const req = http.get(pingUrl, res => {
      res.on('data', () => {
        // do nothing
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    req.once('error', () => {
      resolve(false);
    });
  });
}

async function isDisguisedPodman(socketPath: string): Promise<boolean> {
  const podmanPingUrl = {
    path: '/libpod/_ping',
    socketPath,
  };
  return new Promise<boolean>(resolve => {
    const req = http.get(podmanPingUrl, res => {
      res.on('data', () => {
        // do nothing
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });

    req.once('error', err => {
      console.debug('Error while pinging docker as podman', err);
      resolve(false);
    });
  });
}

async function monitorDaemon(
  extensionContext: extensionApi.ExtensionContext,
  dockerContextHandler: DockerContextHandler,
): Promise<void> {
  // call us again
  if (!stopLoop) {
    try {
      await updateProvider(extensionContext, dockerContextHandler);
    } catch (error) {
      // ignore the update of contexts
    }
    await timeout(5000);
    monitorDaemon(extensionContext, dockerContextHandler).catch((err: unknown) => {
      console.error('Error while monitoring docker daemon', err);
      if (err instanceof Error) {
        extensionApi.env.createTelemetryLogger().logError(err);
      } else {
        extensionApi.env.createTelemetryLogger().logError(String(err));
      }
    });
  }
}

export function registerConnectionForContext(
  dockerProvider: extensionApi.Provider,
  contextInfo: DockerContextInfo,
  contextSocketPath: string,
): extensionApi.Disposable {
  connectionStatuses.set(contextInfo.name, 'started');

  const containerProviderConnection: extensionApi.ContainerProviderConnection = {
    name: contextInfo.name,
    displayName: contextInfo.name === 'default' ? 'Docker' : contextInfo.name,
    type: 'docker',
    status: (): extensionApi.ProviderConnectionStatus => connectionStatuses.get(contextInfo.name) ?? 'stopped',
    endpoint: {
      socketPath: contextSocketPath,
    },
  };

  return dockerProvider.registerContainerProviderConnection(containerProviderConnection);
}

function disposeConnectionForContext(name: string): void {
  connectionDisposables.get(name)?.dispose();
  connectionDisposables.delete(name);
  connectionStatuses.delete(name);
}

export async function updateProvider(
  extensionContext: extensionApi.ExtensionContext,
  dockerContextHandler: DockerContextHandler,
): Promise<void> {
  try {
    const installedDocker = await getDockerInstallation();
    if (!installedDocker) {
      provider?.updateStatus('not-installed');
    } else if (installedDocker.version) {
      provider?.updateVersion(installedDocker.version);
      // update provider status if someone has installed docker externally
      if (provider?.status === 'not-installed') {
        provider.updateStatus('installed');
      }
    }
  } catch (error) {
    // ignore the update
  }

  const contexts = await dockerContextHandler.listContexts();
  const contextNames = new Set(contexts.map(contextInfo => contextInfo.name));

  for (const contextInfo of contexts) {
    const contextSocketPath = parseContextEndpoint(contextInfo.endpoints.docker.host);
    if (!contextSocketPath) {
      console.debug(
        `Skipping docker context '${contextInfo.name}': unsupported endpoint '${contextInfo.endpoints.docker.host}'`,
      );
      continue;
    }

    const isAlive = await isDockerDaemonAlive(contextSocketPath);
    // a context created by the podman-docker-context extension points at a Podman socket, not a Docker one
    const isPodman = isAlive && (await isDisguisedPodman(contextSocketPath));
    const isRegistered = connectionDisposables.has(contextInfo.name);

    if (isPodman) {
      // no longer (or never was) a genuine Docker engine behind this context
      if (isRegistered) {
        disposeConnectionForContext(contextInfo.name);
      }
      continue;
    }

    if (isRegistered) {
      // keep the connection registered; just reflect whether its engine currently answers
      connectionStatuses.set(contextInfo.name, isAlive ? 'started' : 'stopped');
      continue;
    }

    if (isAlive) {
      if (!provider) {
        provider = initProvider();
        extensionContext.subscriptions.push(provider);
      }
      const disposable = registerConnectionForContext(provider, contextInfo, contextSocketPath);
      extensionContext.subscriptions.push(disposable);
      connectionDisposables.set(contextInfo.name, disposable);
    }
  }

  // the context itself is gone (e.g. `docker context rm`, or colima removing its own context on stop)
  for (const name of connectionDisposables.keys()) {
    if (!contextNames.has(name)) {
      disposeConnectionForContext(name);
    }
  }

  if (provider) {
    const anyStarted = [...connectionStatuses.values()].some(status => status === 'started');
    const nextStatus: extensionApi.ProviderStatus = anyStarted ? 'started' : 'stopped';
    if (nextStatus !== lastProviderStatus) {
      provider.updateStatus(nextStatus);
      lastProviderStatus = nextStatus;
    }
  }
}

export async function activate(extensionContext: extensionApi.ExtensionContext): Promise<DockerExtensionApi> {
  const dockerConfig = new DockerConfig();
  const dockerContextHandler = new DockerContextHandler(dockerConfig);
  const dockerCompatibilitySetup = new DockerCompatibilitySetup(dockerContextHandler);
  dockerCompatibilitySetup.init().catch((err: unknown) => {
    console.error('Error while initializing docker compatibility setup', err);
  });

  // monitor daemon
  monitorDaemon(extensionContext, dockerContextHandler).catch((err: unknown) => {
    console.error('Error while monitoring docker daemon', err);
    if (err instanceof Error) {
      extensionApi.env.createTelemetryLogger().logError(err);
    } else {
      extensionApi.env.createTelemetryLogger().logError(String(err));
    }
  });
  return {
    createContext: dockerContextHandler.createContext.bind(dockerContextHandler),
    removeContext: dockerContextHandler.removeContext.bind(dockerContextHandler),
  };
}

function initProvider(): extensionApi.Provider {
  return extensionApi.provider.createProvider({
    name: 'Docker',
    id: 'docker',
    status: 'ready',
    images: {
      icon: './icon.png',
      logo: './logo.png',
    },
  });
}

export function deactivate(): void {
  stopLoop = true;
  console.log('stopping docker extension');
}

// exposed so tests can isolate each other from the module-level provider/connections state
export function resetProviderState(): void {
  provider = undefined;
  lastProviderStatus = undefined;
  connectionDisposables.clear();
  connectionStatuses.clear();
}
