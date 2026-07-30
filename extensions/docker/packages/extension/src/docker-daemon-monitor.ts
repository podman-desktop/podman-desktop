/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import { getDockerInstallation } from './docker-cli';

/**
 * Monitors the default Docker socket and registers a single ContainerProviderConnection
 * while the daemon is reachable (and not a disguised Podman socket).
 */
export class DockerDaemonMonitor {
  #extensionContext: extensionApi.ExtensionContext;
  #socketPath: string;
  #stopLoop = false;
  #provider: extensionApi.Provider | undefined;
  #providerState: extensionApi.ProviderConnectionStatus = 'stopped';
  #containerProviderConnection: extensionApi.ContainerProviderConnection | undefined;
  #containerProviderConnectionDisposable: extensionApi.Disposable | undefined;

  constructor(extensionContext: extensionApi.ExtensionContext, socketPath: string) {
    this.#extensionContext = extensionContext;
    this.#socketPath = socketPath;
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

    // check if the daemon is alive
    const isAlive = await this.isDockerDaemonAlive(this.#socketPath);

    // alive
    if (isAlive) {
      // but was stopped before, needs to update the provider state
      if (this.#providerState === 'stopped') {
        // first we check that it's not podman behind
        const isPodman = await this.isDisguisedPodman(this.#socketPath);
        if (!isPodman) {
          // if no provider, create one
          if (!this.#provider) {
            this.initProvider();
          }
          this.#providerState = 'started';
          // register again the connection
          if (this.#provider && this.#containerProviderConnection) {
            this.#containerProviderConnectionDisposable = this.#provider.registerContainerProviderConnection(
              this.#containerProviderConnection,
            );
            this.#extensionContext.subscriptions.push(this.#containerProviderConnectionDisposable);
            this.#provider.updateStatus('started');
          }
        }
      }
    } else if (this.#providerState === 'started') {
      // no longer alive but it was running before so we need to update status
      // dispose the current connection
      this.#containerProviderConnectionDisposable?.dispose();
      this.#providerState = 'stopped';
      this.#provider?.updateStatus('stopped');
    }
  }

  protected initProvider(): void {
    this.#provider = extensionApi.provider.createProvider({
      name: 'Docker',
      id: 'docker',
      status: 'ready',
      images: {
        icon: './icon.png',
        logo: './logo.png',
      },
    });

    this.#containerProviderConnection = {
      name: 'Docker',
      type: 'docker',
      status: (): extensionApi.ProviderConnectionStatus => this.#providerState,
      endpoint: {
        socketPath: this.#socketPath,
      },
    };

    // provider is started
    this.#providerState = 'started';
    this.#extensionContext.subscriptions.push(this.#provider);
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
        // ignore the update of machines
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
