/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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
import type { ContainerProviderConnection, Disposable } from '@podman-desktop/api';
import { env, provider } from '@podman-desktop/api';

import type { DockerContextHandler } from './docker-context-handler';

export function toDockerContextName(name: string): string {
  return name.startsWith('podman-') ? name : `podman-${name}`;
}

export function toEndpoint(socketPath: string): string {
  return env.isWindows ? `npipe://${socketPath.replace(/\\/g, '/')}` : `unix://${socketPath}`;
}

export class DockerContextSynchronizer implements Disposable {
  #disposable: Disposable[] = [];
  #podmanConnections: string[] = [];

  constructor(private dockerContextHandler: DockerContextHandler) {
    this.#disposable.push(
      provider.onDidRegisterContainerConnection(event => this.processAddedConnection(event.connection)),
    );
    this.#disposable.push(
      provider.onDidUnregisterContainerConnection(event => this.processRemovedConnection(event.providerId)),
    );
  }

  async init(): Promise<void> {
    const podmanConnections = provider
      .getContainerConnections()
      .filter(connection => connection.connection.type === 'podman');
    for (const connection of podmanConnections) {
      await this.processAddedConnection(connection.connection);
    }
  }

  private async processAddedConnection(connection: ContainerProviderConnection): Promise<void> {
    if (connection.type === 'podman') {
      try {
        await this.dockerContextHandler.createContext({
          name: toDockerContextName(connection.name),
          metadata: { description: `Podman machine ${connection.name}` },
          endpoints: { docker: { host: toEndpoint(connection.endpoint.socketPath) } },
        });
        this.#podmanConnections.push(connection.name);
      } catch (error: unknown) {
        console.warn(`Error creating Docker context for Podman machine ${connection.name}`, error);
      }
    }
  }

  protected async processRemovedConnection(providerId: string): Promise<void> {
    if (providerId === 'podman') {
      const podmanConnections = provider
        .getContainerConnections()
        .filter(connection => connection.providerId === 'podman')
        .map(connection => connection.connection.name);
      const podmanConnectionsSet = new Set(podmanConnections);
      const removedConnections = this.#podmanConnections.filter(name => !podmanConnectionsSet.has(name));
      for (const name of removedConnections) {
        const dockerContextName = toDockerContextName(name);
        try {
          await this.dockerContextHandler.removeContext(dockerContextName);
        } catch (error: unknown) {
          console.warn(`Error removing Docker context ${dockerContextName}`, error);
        }
      }
    }
  }

  dispose(): void {
    this.#disposable.forEach(disposable => disposable.dispose());
  }
}
