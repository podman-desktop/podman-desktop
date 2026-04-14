/**********************************************************************
 * Copyright (C) 2022-2025 Red Hat, Inc.
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

import http from 'node:http';
import * as os from 'node:os';

const DEFAULT_TIMEOUT = 5000;

// Default socket paths
const windowsSocketPath = '//./pipe/docker_engine';
const defaultSocketPath = '/var/run/docker.sock';

// Async function that checks to see if the current Docker socket is a disguised Podman socket
export async function isDisguisedPodman(): Promise<boolean> {
  const socketPath = getSocketPath();
  return isDisguisedPodmanPath(socketPath, DEFAULT_TIMEOUT);
}

export async function isDisguisedPodmanPath(socketPath: string, timeout?: number): Promise<boolean> {
  const options: http.RequestOptions = {
    path: '/libpod/_ping',
    socketPath,
    method: 'GET',
  };
  // add timeout if provided
  if (timeout) {
    options.timeout = timeout;
  }

  return new Promise<boolean>((resolve, reject) => {
    const req = http.request(options, res => {
      res.on('data', () => {
        // do nothing
      });

      res.on('end', () => {
        // true if status code is OK
        resolve(res.statusCode === 200);
      });
    });

    // in case of error, it's not reachable
    req.once('error', err => {
      console.debug('Error while pinging docker as podman', err);
      reject(new Error(`Socket unreachable due to error: ${err.message}`));
    });

    // in case of timeout, it's not reachable
    req.on('timeout', () => {
      reject(new Error('Socket unreachable due to timeout.'));
    });

    req.end();
  });
}

// Function that checks whether you are running windows, mac or linux and returns back
// the correct Docker socket location
function getSocketPath(): string {
  let socketPath: string = defaultSocketPath;
  if (os.platform() === 'win32') {
    socketPath = windowsSocketPath;
  }
  return socketPath;
}
