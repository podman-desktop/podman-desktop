/**********************************************************************
 * Copyright (C) 2026 Red Hat, Inc.
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

import * as http from 'node:http';
import type { AddressInfo } from 'node:net';

export interface ProxyHit {
  type: 'connect' | 'request';
  host: string;
  timestamp: number;
}

/**
 * A local HTTP(S) proxy that only records requests/CONNECT tunnels it receives.
 * It never forwards traffic to the real target - it exists purely to prove that
 * the application actually routed a given request through the configured proxy.
 */
export class LoggingProxyServer {
  readonly #server: http.Server;
  readonly #hits: ProxyHit[] = [];

  constructor() {
    this.#server = http.createServer((req, res) => {
      this.#hits.push({ type: 'request', host: req.headers.host ?? req.url ?? '', timestamp: Date.now() });
      res.writeHead(502);
      res.end();
    });
    this.#server.on('connect', (req, clientSocket) => {
      this.#hits.push({ type: 'connect', host: req.url ?? '', timestamp: Date.now() });
      // Deliberately do not establish the tunnel: this proxy only observes traffic. Respond with
      // an explicit HTTP-level rejection rather than an abrupt socket reset - some HTTP clients
      // treat a bare connection reset as a transient blip and retry in a tight loop with no
      // backoff, which was observed to flood this proxy with thousands of CONNECT attempts.
      clientSocket.end('HTTP/1.1 502 Bad Gateway\r\n\r\n');
    });
  }

  async start(): Promise<number> {
    return new Promise(resolve => {
      this.#server.listen(0, '127.0.0.1', () => {
        resolve((this.#server.address() as AddressInfo).port);
      });
    });
  }

  getHits(): ProxyHit[] {
    return [...this.#hits];
  }

  clearHits(): void {
    this.#hits.length = 0;
  }

  async waitForHost(hostSubstring: string, timeoutMs = 15_000): Promise<void> {
    const start = Date.now();
    let matchingHit = this.#hits.find(hit => hit.host.includes(hostSubstring));
    while (!matchingHit) {
      if (Date.now() - start > timeoutMs) {
        throw new Error(
          `Timed out waiting for a proxy hit matching "${hostSubstring}". Hits so far: ${JSON.stringify(this.#hits)}`,
        );
      }
      await new Promise(resolve => setTimeout(resolve, 250));
      matchingHit = this.#hits.find(hit => hit.host.includes(hostSubstring));
    }
    console.log(`[LoggingProxyServer] matched hit for "${hostSubstring}": ${JSON.stringify(matchingHit)}`);
  }

  async stop(): Promise<void> {
    return new Promise(resolve => this.#server.close(() => resolve()));
  }
}
