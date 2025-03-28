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

import { configuration, context } from '@podman-desktop/api';

import type { DockerContextHandler } from './docker-context-handler';

// setup the management of the docker contexts
// registering the DockerCompatibility configuration
export class DockerCompatibilitySetup {
  #dockerContextHandler: DockerContextHandler;

  constructor(dockerContextHandler: DockerContextHandler) {
    this.#dockerContextHandler = dockerContextHandler;
  }

  protected async refreshContextList(): Promise<void> {
    // get the current contexts
    const currentContexts = await this.#dockerContextHandler.listContexts();

    // define the enum list
    const contextEnumItems = currentContexts.map(context => {
      return {
        label: `${context.name} (${context.endpoints.docker.host})`,
        value: context.name,
        selected: context.isCurrentContext,
      };
    });
    context.setValue('docker.cli.context', contextEnumItems, 'DockerCompatibility');
  }

  async init(): Promise<void> {
    await this.refreshContextList();

    // track the changes operated by the user
    configuration.onDidChangeConfiguration(async event => {
      if (event.affectsConfiguration('docker.cli.context')) {
        // get the value
        const value = configuration.getConfiguration('docker.cli', 'DockerCompatibility');
        const contextName = value.get<string>('context');
        if (contextName) {
          try {
            await this.#dockerContextHandler.switchContext(contextName);
            await this.refreshContextList();
          } catch (error: unknown) {
            console.error('error while switching the context', error);
          }
        }
      }
    });
  }
}
