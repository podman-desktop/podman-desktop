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
import type { DockerExtensionApi } from '@podman-desktop/docker-extension-api';

export function toDockerContextName(name: string): string {
  return env.isWindows ? (name.startsWith('podman-') ? name : `podman-${name}`) : 'podman';
}

export function toDescription(name: string): string {
  return env.isWindows ? `Podman machine ${name}` : 'Podman';
}

export function toEndpoint(socketPath: string): string {
  return env.isWindows ? `npipe://${socketPath.replace(/\\/g, '/')}` : `unix://${socketPath}`;
}

export class DockerContextSynchronizer implements Disposable {
  #disposable: Disposable[] = [];

  constructor(private dockerExtensionAPI: DockerExtensionApi) {
    this.#disposable.push(
      provider.onDidUpdateContainerConnection(event => this.processUpdatedConnection(event.connection)),
    );
    this.#disposable.push(
      provider.onDidRegisterContainerConnection(event => this.processUpdatedConnection(event.connection)),
    );
  }

  async init(): Promise<void> {
    const connections = provider
      .getContainerConnections()
      .filter(connection => connection.connection.status() === 'started');
    for (const connection of connections) {
      await this.processUpdatedConnection(connection.connection);
    }
  }

  protected async processUpdatedConnection(connection: ContainerProviderConnection): Promise<void> {
    if (connection.type === 'podman') {
      if (connection.status() === 'started') {
        try {
          await this.dockerExtensionAPI.createContext({
            name: toDockerContextName(connection.name),
            metadata: { description: toDescription(connection.name) },
            endpoints: { docker: { host: toEndpoint(connection.endpoint.socketPath) } },
          });
        } catch (error: unknown) {
          console.warn(`Error creating Docker context for Podman machine ${connection.name}`, error);
        }
      } else if (connection.status() === 'stopped') {
        const dockerContextName = toDockerContextName(connection.name);
        try {
          await this.dockerExtensionAPI.removeContext(dockerContextName);
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
