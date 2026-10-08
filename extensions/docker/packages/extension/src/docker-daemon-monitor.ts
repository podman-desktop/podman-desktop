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

import * as http from 'node:http';

import * as extensionApi from '@podman-desktop/api';
import type { DockerContextInfo } from '@podman-desktop/docker-extension-api';

import { getDockerInstallation } from './docker-cli';
import type { DockerContextHandler } from './docker-context-handler';

/**
 * Monitors Docker CLI contexts and registers one ContainerProviderConnection per local
 * context. A connection's engine going unreachable only flips its status (kept registered,
 * mirrors Podman's machine model) so it doesn't disappear just because the engine is
 * temporarily off. It's only disposed once the context itself is gone from `docker context ls`.
 */
export class DockerDaemonMonitor {
  #extensionContext: extensionApi.ExtensionContext;
  #dockerContextHandler: DockerContextHandler;
  #stopLoop = false;
  #provider: extensionApi.Provider | undefined;
  #lastProviderStatus: extensionApi.ProviderStatus | undefined;
  // one connection per Docker CLI context, keyed by context name
  #connectionDisposables = new Map<string, extensionApi.Disposable>();
  #connectionStatuses = new Map<string, extensionApi.ProviderConnectionStatus>();

  constructor(extensionContext: extensionApi.ExtensionContext, dockerContextHandler: DockerContextHandler) {
    this.#extensionContext = extensionContext;
    this.#dockerContextHandler = dockerContextHandler;
  }

  start(): void {
    this.monitorDaemon().catch((err: unknown) => {
      console.error('Error while monitoring docker daemon', err);
      if (err instanceof Error) {
        extensionApi.env.createTelemetryLogger().logError(err);
      } else {
        extensionApi.env.createTelemetryLogger().logError(String(err));
      }
    });
  }

  stop(): void {
    this.#stopLoop = true;
  }

  async updateProvider(): Promise<void> {
    try {
      const installedDocker = await getDockerInstallation();
      if (!installedDocker) {
        this.#provider?.updateStatus('not-installed');
      } else if (installedDocker.version) {
        this.#provider?.updateVersion(installedDocker.version);
        // update provider status if someone has installed docker externally
        if (this.#provider?.status === 'not-installed') {
          this.#provider.updateStatus('installed');
        }
      }
    } catch (error) {
      // ignore the update
    }

    const contexts = await this.#dockerContextHandler.listContexts();
    const contextNames = new Set(contexts.map(contextInfo => contextInfo.name));

    for (const contextInfo of contexts) {
      const contextSocketPath = this.#dockerContextHandler.parseEndpoint(contextInfo.endpoints.docker.host);
      if (!contextSocketPath) {
        console.debug(
          `Skipping docker context '${contextInfo.name}': unsupported endpoint '${contextInfo.endpoints.docker.host}'`,
        );
        continue;
      }

      const isAlive = await this.isDockerDaemonAlive(contextSocketPath);
      // a context created by the podman-docker-context extension points at a Podman socket, not a Docker one
      const isPodman = isAlive && (await this.isDisguisedPodman(contextSocketPath));
      const isRegistered = this.#connectionDisposables.has(contextInfo.name);

      if (isPodman) {
        // no longer (or never was) a genuine Docker engine behind this context
        if (isRegistered) {
          this.disposeConnectionForContext(contextInfo.name);
        }
        continue;
      }

      if (isRegistered) {
        // keep the connection registered; just reflect whether its engine currently answers
        this.#connectionStatuses.set(contextInfo.name, isAlive ? 'started' : 'stopped');
        continue;
      }

      if (isAlive) {
        if (!this.#provider) {
          this.#provider = this.initProvider();
          this.#extensionContext.subscriptions.push(this.#provider);
        }
        const disposable = this.registerConnectionForContext(this.#provider, contextInfo, contextSocketPath);
        this.#extensionContext.subscriptions.push(disposable);
        this.#connectionDisposables.set(contextInfo.name, disposable);
      }
    }

    // the context itself is gone (e.g. `docker context rm`, or colima removing its own context on stop)
    for (const name of this.#connectionDisposables.keys()) {
      if (!contextNames.has(name)) {
        this.disposeConnectionForContext(name);
      }
    }

    if (this.#provider) {
      const anyStarted = [...this.#connectionStatuses.values()].some(status => status === 'started');
      const nextStatus: extensionApi.ProviderStatus = anyStarted ? 'started' : 'stopped';
      if (nextStatus !== this.#lastProviderStatus) {
        this.#provider.updateStatus(nextStatus);
        this.#lastProviderStatus = nextStatus;
      }
    }
  }

  protected registerConnectionForContext(
    dockerProvider: extensionApi.Provider,
    contextInfo: DockerContextInfo,
    contextSocketPath: string,
  ): extensionApi.Disposable {
    this.#connectionStatuses.set(contextInfo.name, 'started');

    const containerProviderConnection: extensionApi.ContainerProviderConnection = {
      name: contextInfo.name,
      displayName: contextInfo.name === 'default' ? 'Docker' : contextInfo.name,
      type: 'docker',
      status: (): extensionApi.ProviderConnectionStatus => this.#connectionStatuses.get(contextInfo.name) ?? 'stopped',
      endpoint: {
        socketPath: contextSocketPath,
      },
    };

    return dockerProvider.registerContainerProviderConnection(containerProviderConnection);
  }

  protected disposeConnectionForContext(name: string): void {
    this.#connectionDisposables.get(name)?.dispose();
    this.#connectionDisposables.delete(name);
    this.#connectionStatuses.delete(name);
  }

  protected initProvider(): extensionApi.Provider {
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

  protected async isDockerDaemonAlive(socketPath: string): Promise<boolean> {
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

  protected async isDisguisedPodman(socketPath: string): Promise<boolean> {
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

  protected async timeout(time: number): Promise<void> {
    return new Promise<void>(resolve => {
      setTimeout(resolve, time);
    });
  }

  protected async monitorDaemon(): Promise<void> {
    if (!this.#stopLoop) {
      try {
        await this.updateProvider();
      } catch (error) {
        // ignore the update of contexts
      }
      await this.timeout(5000);
      this.monitorDaemon().catch((err: unknown) => {
        console.error('Error while monitoring docker daemon', err);
        if (err instanceof Error) {
          extensionApi.env.createTelemetryLogger().logError(err);
        } else {
          extensionApi.env.createTelemetryLogger().logError(String(err));
        }
      });
    }
  }
}
