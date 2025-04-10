/**********************************************************************
 * Copyright (C) 2024-2025 Red Hat, Inc.
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

import { createHash } from 'node:crypto';
import { existsSync, promises } from 'node:fs';
import { join } from 'node:path';

import { env } from '@podman-desktop/api';
import type { DockerContextInfo, DockerContextParsingInfo } from '@podman-desktop/docker-extension-api';

import { UNIX_SOCKET_PATH, WINDOWS_NPIPE } from './docker-api.js';
import type { DockerConfig } from './docker-config.js';

/**
 * Handle the `docker context`, allowing to list them and switch between them.
 */
export class DockerContextHandler {
  #dockerConfig: DockerConfig;

  constructor(dockerConfig: DockerConfig) {
    this.#dockerConfig = dockerConfig;
  }

  protected getDockerConfigPath(): string {
    return join(this.#dockerConfig.getPath(), 'config.json');
  }

  protected async getCurrentContext(): Promise<string> {
    let currentContext = 'default';

    // if $HOME/.docker/config.json exists, read it and get the current context
    const dockerConfigExists = existsSync(this.getDockerConfigPath());
    if (dockerConfigExists) {
      // read the file and get the current context
      // if there is a current context, add it to the list
      const content = await promises.readFile(this.getDockerConfigPath(), 'utf-8');
      try {
        const config = JSON.parse(content);
        // only set the name if it is not empty
        if (config.currentContext) {
          currentContext = config.currentContext;
        }
      } catch (error) {
        console.error('Error parsing docker config file', error);
      }
    }

    return currentContext;
  }

  protected async getContexts(): Promise<DockerContextParsingInfo[]> {
    const contexts: DockerContextParsingInfo[] = [];

    const defaultHostForWindows = `npipe://${WINDOWS_NPIPE}`;
    const defaultHostForMacOrLinux = `unix://${UNIX_SOCKET_PATH}`;

    // adds the default context
    contexts.push({
      name: 'default',
      metadata: {
        description: 'Default context',
      },
      endpoints: {
        docker: {
          host: env.isWindows ? defaultHostForWindows : defaultHostForMacOrLinux,
        },
      },
    });

    // now, read the ~/.docker/contexts/meta directory if it exists
    const dockerContextsMetaPath = join(this.#dockerConfig.getPath(), 'contexts', 'meta');
    const dockerContextsMetaExists = existsSync(dockerContextsMetaPath);
    // no directories, no contexts !
    if (!dockerContextsMetaExists) {
      return contexts;
    }
    const filesAndDirectories = await promises.readdir(dockerContextsMetaPath, { withFileTypes: true });

    // keep only directories
    const directories = filesAndDirectories.filter(dirent => dirent.isDirectory());

    // for each directory, read the content of the meta.json file
    // the directory name is the context name encoded with sha256
    for (const directory of directories) {
      const contextSha256Name = directory.name;
      const metaFilePath = join(dockerContextsMetaPath, contextSha256Name, 'meta.json');
      const metaFileExists = existsSync(metaFilePath);
      if (metaFileExists) {
        const metaContent = await promises.readFile(metaFilePath, 'utf-8');
        try {
          const meta = JSON.parse(metaContent);
          const context: DockerContextParsingInfo = {
            name: meta.Name,
            metadata: {
              description: meta.Description,
            },
            endpoints: {
              docker: {
                host: meta?.Endpoints?.docker?.Host,
              },
            },
          };

          // check the context.name being the same as the directory name encoded
          // using sha256 from the context.name
          const readContextSha256Name = createHash('sha256').update(context.name).digest('hex');
          if (readContextSha256Name !== contextSha256Name) {
            console.error(
              `Context name ${context.name} does not match the directory name ${contextSha256Name}. Found ${readContextSha256Name}`,
            );
            continue;
          }
          contexts.push(context);
        } catch (error) {
          console.error('Error parsing docker context meta file', error);
        }
      }
    }

    return contexts;
  }

  async listContexts(): Promise<DockerContextInfo[]> {
    const currentContext = await this.getCurrentContext();

    const readContexts = await this.getContexts();
    // update the isCurrentContext field
    return readContexts.map(context => {
      return {
        ...context,
        isCurrentContext: context.name === currentContext,
      };
    });
  }

  async switchContext(contextName: string): Promise<void> {
    const dockerConfigExists = existsSync(this.getDockerConfigPath());
    if (!dockerConfigExists) {
      // write an empty file using tabs for indentation
      await promises.writeFile(this.getDockerConfigPath(), JSON.stringify({}, null, '\t'));
    }

    // check if the context exists
    const allContexts = await this.getContexts();

    const foundContext = allContexts.find(context => context.name === contextName);

    if (!foundContext) {
      throw new Error(`Context ${contextName} not found`);
    }

    // now, write the context name to the ~/.docker/config.json file
    // read current content
    const content = await promises.readFile(this.getDockerConfigPath(), 'utf-8');
    let config: { currentContext?: string };
    try {
      config = JSON.parse(content);
    } catch (error: unknown) {
      throw new Error(`Error parsing docker config file: ${String(error)}`);
    }
    // update the current context or drop the field if it is the default context
    if (contextName === 'default') {
      config.currentContext = undefined;
    } else {
      config.currentContext = contextName;
    }

    // write back the file with the current context and using tabs for indentation
    await promises.writeFile(this.getDockerConfigPath(), JSON.stringify(config, null, '\t'));
  }

  async createContext(context: DockerContextParsingInfo): Promise<void> {
    if (context.name === 'default') {
      throw new Error('Cannot create a context with the name default');
    }
    // create the context directory
    const dockerContextsMetaPath = join(this.#dockerConfig.getPath(), 'contexts', 'meta');
    const sha256ContextName = createHash('sha256').update(context.name).digest('hex');
    const dockerContextDirectory = join(dockerContextsMetaPath, sha256ContextName);
    await promises.mkdir(dockerContextDirectory, { recursive: true });

    // write the meta.json file
    const metaFilePath = join(dockerContextDirectory, 'meta.json');
    const meta = {
      Name: context.name,
      Metadata: {
        Description: context.metadata.description,
      },
      Endpoints: {
        docker: {
          Host: context.endpoints.docker.host,
        },
      },
    };
    await promises.writeFile(metaFilePath, JSON.stringify(meta));
  }

  async removeContext(name: string): Promise<void> {
    if (name !== 'default') {
      // remove the context directory
      const dockerContextsMetaPath = join(this.#dockerConfig.getPath(), 'contexts', 'meta');
      const sha256ContextName = createHash('sha256').update(name).digest('hex');
      const dockerContextDirectory = join(dockerContextsMetaPath, sha256ContextName);
      await promises.rm(dockerContextDirectory, { recursive: true, force: true });
    }
  }
}
