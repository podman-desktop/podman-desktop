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

import { homedir } from 'node:os';
import { join } from 'node:path';

import { configuration } from '@podman-desktop/api';

/**
 * Manages the access to the Docker configuration settings.
 */
export class DockerConfig {
  static readonly DEFAULT_CONFIG_FOLDER = join(homedir(), '.docker');

  #dockerConfigFolder: string;

  constructor() {
    // if we have a custom DOCKER_CONFIG property, use it
    this.#dockerConfigFolder = this.readConfiguration();

    // update the value if the configuration changes
    configuration.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('docker.config')) {
        // refresh the value
        this.#dockerConfigFolder = this.readConfiguration();
      }
    });
  }

  protected readConfiguration(): string {
    return configuration.getConfiguration('docker').get('config') ?? DockerConfig.DEFAULT_CONFIG_FOLDER;
  }

  // Returns the path to the Docker configuration file.
  getPath(): string {
    return this.#dockerConfigFolder;
  }
}
