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
import { window } from '@podman-desktop/api';
import type { ConnectConfig, HostVerifier } from 'ssh2';
import { Client } from 'ssh2';

import { SshHostKeyStore, withHostVerificationTimeout } from '/@/utils/ssh-host-key-store';

export class PodmanRemoteSshTunnel {
  #sshConfig: ConnectConfig;

  #client: Client | undefined;
  #hostVerifier: HostVerifier;
  #transportReady = false;

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
    private username: string,
    private privateKey: string | undefined,
    private remotePath: string,
    private localPath: string,
    storagePath: string,
  ) {
    this.#hostVerifier = new SshHostKeyStore(storagePath).createVerifier(this.host, this.port, error => {
      this.#reconnect = false;
      if (this.#reconnectTimeout) {
        clearTimeout(this.#reconnectTimeout);
        this.#reconnectTimeout = undefined;
      }
      this.#resolveConnected(false);
      this.closeListener();
      console.error('SSH host key verification failed:', error);
      window.showErrorMessage(error.message).catch((notificationError: unknown) => {
        console.error('Unable to display SSH host key verification error:', notificationError);
      });
    });
    this.#sshConfig = {
      host: this.host,
      port: this.port,
      username: this.username,
      // Allow extensions like direct-streamlocal@openssh.com to be attempted on non-OpenSSH-identifying servers
      strictVendor: false,
      hostVerifier: this.#hostVerifier,
    };
    if (this.privateKey) {
      this.#sshConfig.privateKey = this.privateKey;
    } else {
      // No identity/private key for this connection. Mirror the podman CLI,
      // which falls back to the ssh-agent when no identity is set: see
      // containers/common pkg/ssh/connection_golang.go ValidateAndConfigure
      // https://github.com/containers/common/blob/main/pkg/ssh/connection_golang.go#L249-L300
      const sshAuthSock = process.env['SSH_AUTH_SOCK'];
      if (sshAuthSock) {
        this.#sshConfig.agent = sshAuthSock;
      }
    }
    this.#connected = new Promise<boolean>((resolve, _reject) => {
      this.#resolveConnected = resolve;
    });
  }

  protected getSshConfig(): ConnectConfig {
    return this.#sshConfig;
  }

  dispose(): void {
    this.disconnect();
  }

  status(): ProviderConnectionStatus {
    return this.#status;
  }

  connect(): void {
    this.#reconnect = true;
    this.closeListener();
    const previousClient = this.#client;
    this.#client = new Client();
    const client = this.#client;
    previousClient?.destroy();
    this.#connected = new Promise<boolean>((resolve, _reject) => {
      this.#resolveConnected = resolve;
    });

    this.#client.on('error', err => {
      if (this.#client !== client) {
        return;
      }
      console.error('SSH connection error:', err);
      this.#status = 'unknown';
      this.closeListener();
      this.#resolveConnected(false);
      this.handleReconnect();
    });

    this.#client.on('end', () => {
      if (this.#client !== client) {
        return;
      }
      this.#status = 'stopped';
      this.closeListener();
      this.handleReconnect();
    });

    this.#client.on('close', () => {
      if (this.#client !== client) {
        return;
      }
      this.#status = 'stopped';
      this.closeListener();
      this.handleReconnect();
    });
    this.#client
      .on('ready', () => {
        if (this.#client !== client) {
          return;
        }
        this.#status = 'started';
        this.#transportReady = true;

        this.#resolveConnected(true);

        // Create a local server to listen on the local file socket
        this.#server = net.createServer(localSocket => {
          localSocket.on('error', err => {
            console.error('Podman ssh tunnel local socket error:', err);
          });
          if (!this.#transportReady || this.#client !== client) {
            localSocket.end();
            return;
          }
          // Create a connection to the remote socket via SSH
          try {
            client.openssh_forwardOutStreamLocal(this.remotePath, (err, remoteSocket) => {
              if (err) {
                console.error('Unable to forward Podman SSH socket:', err);
                localSocket.end();
                return;
              }

              // Forward data from local to remote
              localSocket.on('data', data => {
                remoteSocket.write(data);
              });

              // Forward data from remote to local
              remoteSocket.on('data', (data: string | Uint8Array) => {
                localSocket.write(data);
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
                console.error('Podman ssh tunnel local socket error using configuration', this.#sshConfig, err);
                remoteSocket.end();
              });

              // Handle remote socket error
              remoteSocket.on('error', (err: unknown) => {
                console.error('Podman ssh tunnel remote socket error using configuration', this.#sshConfig, err);
                localSocket.end();
              });
            });
          } catch (error) {
            console.error('Unable to forward Podman SSH socket:', error);
            localSocket.end();
          }
        });

        // Listen on the local file socket
        this.#server.listen(this.localPath, () => {
          this.#listening = true;
        });

        // Handle server error
        this.#server.on('error', err => {
          console.error('Server error:', err);
        });
      })
      .connect({ ...this.#sshConfig, ...withHostVerificationTimeout(client, this.#hostVerifier) });
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
    if (this.#reconnectTimeout) {
      clearTimeout(this.#reconnectTimeout);
      this.#reconnectTimeout = undefined;
    }
    this.#client?.end();
    this.closeListener();
  }

  private closeListener(): void {
    this.#transportReady = false;
    this.#listening = false;
    this.#server?.close();
    this.#server = undefined;
  }

  isConnected(): Promise<boolean> {
    return this.#connected;
  }

  protected isListening(): boolean {
    return this.#listening;
  }
}
