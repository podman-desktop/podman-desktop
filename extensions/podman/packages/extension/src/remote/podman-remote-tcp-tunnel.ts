/**********************************************************************
 * Copyright (C) 2024 Red Hat, Inc.
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
import * as net from 'node:net';

import type { ProviderConnectionStatus } from '@podman-desktop/api';

export class PodmanRemoteTcpTunnel {
  // local server for listening on the local file socket
  #server: net.Server | undefined;

  #status: ProviderConnectionStatus = 'unknown';

  #reconnect: boolean = false;

  #reconnectTimeout: NodeJS.Timeout | undefined;

  #resolveConnected: (value: boolean) => void = () => {};
  #connected: Promise<boolean>;

  #listening: boolean = false;

  constructor(
    private host: string,
    private port: number,
    private localPath: string,
  ) {
    this.#connected = new Promise<boolean>((resolve, _reject) => {
      this.#resolveConnected = resolve;
    });
  }

  dispose(): void {
    this.disconnect();
  }

  status(): ProviderConnectionStatus {
    return this.#status;
  }

  connect(): void {
    this.#reconnect = true;
    this.#listening = false;
    this.#connected = new Promise<boolean>((resolve, _reject) => {
      this.#resolveConnected = resolve;
    });

    // First, verify the remote TCP server is reachable before starting the local server
    const testSocket = net.createConnection({ host: this.host, port: this.port });

    testSocket.on('connect', () => {
      // Remote is reachable, close the test connection
      testSocket.end();

      // Now create the local server to listen on the local file socket
      this.#server = net.createServer(localSocket => {
        // Create a connection to the remote socket via TCP
        const remoteSocket = net.createConnection({ host: this.host, port: this.port });

        remoteSocket.on('connect', () => {
          // Forward data from local to remote
          localSocket.on('data', data => {
            remoteSocket.write(data);
          });

          // Forward data from remote to local
          remoteSocket.on('data', (data: string | Uint8Array) => {
            localSocket.write(data);
          });
        });

        // Handle local socket close
        localSocket.on('close', () => {
          remoteSocket.end();
        });

        // Handle remote socket close
        remoteSocket.on('close', () => {
          localSocket.end();
        });

        // Handle local socket error
        localSocket.on('error', err => {
          console.error('Podman tcp tunnel local socket error', err);
          remoteSocket.end();
        });

        // Handle remote socket error
        remoteSocket.on('error', (err: unknown) => {
          console.error(`Podman tcp tunnel remote socket error ${this.host}:${this.port}`, err);
          localSocket.end();
        });
      });

      // Listen on the local file socket
      this.#server.listen(this.localPath, () => {
        this.#listening = true;
      });

      // Handle server error
      this.#server.on('error', err => {
        console.error('Server error:', err);
        this.#status = 'unknown';
        this.handleReconnect();
      });

      // when closed, reconnect
      this.#server.on('close', () => {
        this.#status = 'stopped';
        this.handleReconnect();
      });

      // Mark as connected after verifying remote is reachable
      this.#status = 'started';
      this.#resolveConnected(true);
    });

    testSocket.on('error', (err: unknown) => {
      console.error(`Podman tcp tunnel remote socket error ${this.host}:${this.port}`, err);
      this.#status = 'unknown';
      this.handleReconnect();
    });
  }

  handleReconnect(): void {
    // need to reconnect if no timeout is set for now
    if (this.#reconnect && !this.#reconnectTimeout) {
      this.#reconnectTimeout = setTimeout(() => {
        this.#reconnectTimeout = undefined;
        this.connect();
      }, 30000);
    }
  }

  disconnect(): void {
    // Set the reconnect flag to false to prevent reconnecting
    this.#reconnect = false;
    this.#server?.close();
  }

  isConnected(): Promise<boolean> {
    return this.#connected;
  }

  protected isListening(): boolean {
    return this.#listening;
  }
}
