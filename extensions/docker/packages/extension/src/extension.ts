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

import * as os from 'node:os';

import type { ExtensionContext } from '@podman-desktop/api';
import type { DockerExtensionApi } from '@podman-desktop/docker-extension-api';

import { UNIX_SOCKET_PATH, WINDOWS_NPIPE } from './docker-api';
import { DockerCompatibilitySetup } from './docker-compatibility-setup';
import { DockerConfig } from './docker-config';
import { DockerContextHandler } from './docker-context-handler';
import { DockerDaemonMonitor } from './docker-daemon-monitor';

let daemonMonitor: DockerDaemonMonitor | undefined;

export async function activate(extensionContext: ExtensionContext): Promise<DockerExtensionApi> {
  const socketPath = os.platform() === 'win32' ? WINDOWS_NPIPE : UNIX_SOCKET_PATH;

  const dockerConfig = new DockerConfig();
  const dockerContextHandler = new DockerContextHandler(dockerConfig);
  const dockerCompatibilitySetup = new DockerCompatibilitySetup(dockerContextHandler);
  dockerCompatibilitySetup.init().catch((err: unknown) => {
    console.error('Error while initializing docker compatibility setup', err);
  });

  daemonMonitor = new DockerDaemonMonitor(extensionContext, socketPath);
  daemonMonitor.start();

  return {
    createContext: dockerContextHandler.createContext.bind(dockerContextHandler),
    removeContext: dockerContextHandler.removeContext.bind(dockerContextHandler),
  };
}

export function deactivate(): void {
  daemonMonitor?.stop();
  console.log('stopping docker extension');
}
