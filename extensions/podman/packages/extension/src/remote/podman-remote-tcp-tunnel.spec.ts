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

import { rm } from 'node:fs/promises';
import type { AddressInfo } from 'node:net';
import { createConnection, createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { beforeEach, expect, test, vi } from 'vitest';

import { PodmanRemoteTcpTunnel } from './podman-remote-tcp-tunnel';

beforeEach(() => {
  vi.resetAllMocks();
});

class TestPodmanRemoteTcpTunnel extends PodmanRemoteTcpTunnel {
  isListening(): boolean {
    return super.isListening();
  }
}

test('should have unknown status initially', () => {
  const tunnel = new TestPodmanRemoteTcpTunnel('localhost', 12345, '/tmp/test.sock');
  expect(tunnel.status()).toBe('unknown');
});

test('should be able to connect to a TCP server', async () => {
  let tcpPort = 0;
  let tcpServerConnected = false;

  // create a TCP server to act as the remote
  const tcpServer = createServer(_socket => {
    tcpServerConnected = true;
  }).listen(0, '127.0.0.1', () => {
    const address: AddressInfo = tcpServer.address() as AddressInfo;
    tcpPort = address?.port;
  });

  // wait for the server to be listening
  await vi.waitFor(() => expect(tcpPort).toBeGreaterThan(0));

  // create a socket path for the local tunnel endpoint
  let socketOrNpipePath: string;
  if (process.platform === 'win32') {
    socketOrNpipePath = '\\\\.\\pipe\\test-tcp-tunnel';
  } else {
    socketOrNpipePath = join(tmpdir(), 'test-tcp-tunnel.sock');
  }

  // delete file if exists
  await rm(socketOrNpipePath, { force: true });

  const podmanRemoteTcpTunnel = new TestPodmanRemoteTcpTunnel('127.0.0.1', tcpPort, socketOrNpipePath);

  podmanRemoteTcpTunnel.connect();

  // wait for the tunnel to be connected and listening
  await vi.waitFor(() => expect(podmanRemoteTcpTunnel.status()).toBe('started'));
  await vi.waitFor(() => expect(podmanRemoteTcpTunnel.isListening()).toBeTruthy());

  // verify that isConnected resolves to true
  const isConnected = await podmanRemoteTcpTunnel.isConnected();
  expect(isConnected).toBeTruthy();

  let connectedToLocal = false;
  // send a request to the tunnel using the socket path
  const client = createConnection({ path: socketOrNpipePath }, () => {
    connectedToLocal = true;
  });

  await vi.waitFor(() => expect(connectedToLocal).toBeTruthy());

  // wait for the TCP server to receive the connection
  await vi.waitFor(() => expect(tcpServerConnected).toBeTruthy());

  client.end();
  podmanRemoteTcpTunnel.disconnect();
  tcpServer.close();
});

test('should handle unreachable remote server', async () => {
  // create a socket path for the local tunnel endpoint
  let socketOrNpipePath: string;
  if (process.platform === 'win32') {
    socketOrNpipePath = '\\\\.\\pipe\\test-tcp-tunnel-unreachable';
  } else {
    socketOrNpipePath = join(tmpdir(), 'test-tcp-tunnel-unreachable.sock');
  }

  // delete file if exists
  await rm(socketOrNpipePath, { force: true });

  // Try to connect to a port that doesn't exist
  const podmanRemoteTcpTunnel = new TestPodmanRemoteTcpTunnel('127.0.0.1', 59999, socketOrNpipePath);

  podmanRemoteTcpTunnel.connect();

  // status should remain unknown since the remote is unreachable
  await vi.waitFor(() => expect(podmanRemoteTcpTunnel.status()).toBe('unknown'), { timeout: 5000 });

  // the tunnel should not be listening since connection failed
  expect(podmanRemoteTcpTunnel.isListening()).toBeFalsy();

  podmanRemoteTcpTunnel.disconnect();
});

test('should forward data between local and remote', async () => {
  let tcpPort = 0;
  const receivedData: string[] = [];

  // create a TCP server that echoes data back
  const tcpServer = createServer(socket => {
    socket.on('data', data => {
      receivedData.push(data.toString());
      socket.write(`echo: ${data.toString()}`);
    });
  }).listen(0, '127.0.0.1', () => {
    const address: AddressInfo = tcpServer.address() as AddressInfo;
    tcpPort = address?.port;
  });

  // wait for the server to be listening
  await vi.waitFor(() => expect(tcpPort).toBeGreaterThan(0));

  // create a socket path for the local tunnel endpoint
  let socketOrNpipePath: string;
  if (process.platform === 'win32') {
    socketOrNpipePath = '\\\\.\\pipe\\test-tcp-tunnel-data';
  } else {
    socketOrNpipePath = join(tmpdir(), 'test-tcp-tunnel-data.sock');
  }

  // delete file if exists
  await rm(socketOrNpipePath, { force: true });

  const podmanRemoteTcpTunnel = new TestPodmanRemoteTcpTunnel('127.0.0.1', tcpPort, socketOrNpipePath);

  podmanRemoteTcpTunnel.connect();

  // wait for the tunnel to be connected and listening
  await vi.waitFor(() => expect(podmanRemoteTcpTunnel.status()).toBe('started'));
  await vi.waitFor(() => expect(podmanRemoteTcpTunnel.isListening()).toBeTruthy());

  const responseData: string[] = [];

  // connect to the local socket and send data
  const client = createConnection({ path: socketOrNpipePath }, () => {
    client.write('hello');
  });

  client.on('data', data => {
    responseData.push(data.toString());
  });

  // wait for the remote server to receive the data
  await vi.waitFor(() => expect(receivedData).toContain('hello'));

  // wait for the response to be received
  await vi.waitFor(() => expect(responseData).toContain('echo: hello'));

  client.end();
  podmanRemoteTcpTunnel.disconnect();
  tcpServer.close();
});

test('should disconnect properly', async () => {
  let tcpPort = 0;

  // create a TCP server
  const tcpServer = createServer(_socket => {}).listen(0, '127.0.0.1', () => {
    const address: AddressInfo = tcpServer.address() as AddressInfo;
    tcpPort = address?.port;
  });

  // wait for the server to be listening
  await vi.waitFor(() => expect(tcpPort).toBeGreaterThan(0));

  // create a socket path for the local tunnel endpoint
  let socketOrNpipePath: string;
  if (process.platform === 'win32') {
    socketOrNpipePath = '\\\\.\\pipe\\test-tcp-tunnel-disconnect';
  } else {
    socketOrNpipePath = join(tmpdir(), 'test-tcp-tunnel-disconnect.sock');
  }

  // delete file if exists
  await rm(socketOrNpipePath, { force: true });

  const podmanRemoteTcpTunnel = new TestPodmanRemoteTcpTunnel('127.0.0.1', tcpPort, socketOrNpipePath);

  podmanRemoteTcpTunnel.connect();

  // wait for the tunnel to be connected
  await vi.waitFor(() => expect(podmanRemoteTcpTunnel.status()).toBe('started'));

  // disconnect the tunnel
  podmanRemoteTcpTunnel.disconnect();

  // status should be stopped
  await vi.waitFor(() => expect(podmanRemoteTcpTunnel.status()).toBe('stopped'));

  tcpServer.close();
});
