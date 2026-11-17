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

import { createHmac } from 'node:crypto';
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { isIP } from 'node:net';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

import { injectable } from 'inversify';
import { type ConnectConfig, type HostVerifier, type ServerHostKeyAlgorithm, utils } from 'ssh2';

interface KnownHost {
  hosts: string;
  type: string;
  key: Buffer;
  marker?: string;
}

@injectable()
export class SshHostKeyStore {
  #pending: Promise<void> = Promise.resolve();

  protected getKnownHostsPath(): string {
    return join(homedir(), '.ssh', 'known_hosts');
  }

  protected isLocalhost(host: string): boolean {
    const hostname = host.toLowerCase().replace(/^\[|\]$/g, '');
    return (
      hostname === 'localhost' ||
      hostname === 'localhost.' ||
      (isIP(hostname) === 6 && new URL(`http://[${hostname}]`).hostname === '[::1]') ||
      (isIP(hostname) === 4 && hostname.startsWith('127.'))
    );
  }

  async getConnectionConfig(
    host: string,
    port: number,
    onRejected: (error: Error) => void,
  ): Promise<Pick<ConnectConfig, 'algorithms'> & { hostVerifier?: HostVerifier }> {
    if (this.isLocalhost(host)) {
      return {};
    }
    const endpoint = this.getEndpoint(host, port);
    const known = await this.readKnownHosts();
    const types = known
      .filter(entry => !entry.marker && this.matchesHost(entry.hosts, endpoint))
      .flatMap((entry): ServerHostKeyAlgorithm[] => {
        switch (entry.type) {
          case 'ssh-rsa':
            return ['rsa-sha2-512', 'rsa-sha2-256', 'ssh-rsa'];
          case 'ssh-ed25519':
          case 'ecdsa-sha2-nistp256':
          case 'ecdsa-sha2-nistp384':
          case 'ecdsa-sha2-nistp521':
          case 'ssh-dss':
            return [entry.type];
          default:
            return [];
        }
      });
    return {
      // Prefer keys already recorded for servers offering several host-key algorithms, like the Podman CLI.
      algorithms: types.length ? { serverHostKey: [...new Set(types)] } : undefined,
      hostVerifier: (key, callback): void => {
        this.verify(host, port, key).then(
          trusted => callback(trusted),
          (error: unknown) => {
            onRejected(error instanceof Error ? error : new Error(String(error)));
            callback(false);
          },
        );
      },
    };
  }

  async verify(host: string, port: number, key: Buffer): Promise<boolean> {
    if (this.isLocalhost(host)) {
      return true;
    }
    // Serialize read/append operations so simultaneous first connections cannot save conflicting keys.
    const result = this.#pending.then(() => this.verifyAndSave(this.getEndpoint(host, port), key));
    this.#pending = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  private getEndpoint(host: string, port: number): string {
    const hostname = host.toLowerCase().replace(/^\[|\]$/g, '');
    return port === 22 ? hostname : `[${hostname}]:${port}`;
  }

  private async readKnownHosts(): Promise<KnownHost[]> {
    let content: string;
    const file = this.getKnownHostsPath();
    try {
      content = await readFile(file, 'utf8');
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
    return content.split(/\r?\n/).flatMap((line, index) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        return [];
      }
      const fields = trimmed.split(/\s+/);
      const marker = fields[0]?.startsWith('@') ? fields.shift() : undefined;
      const [hosts, type, encoded] = fields;
      if (!hosts || !type || !encoded || (marker && !['@revoked', '@cert-authority'].includes(marker))) {
        throw new Error(`Invalid SSH known_hosts entry at ${file}:${index + 1}`);
      }
      const parsed = utils.parseKey(`${type} ${encoded}`);
      if (parsed instanceof Error || parsed.type !== type) {
        throw new Error(`Invalid SSH host key at ${file}:${index + 1}`);
      }
      return [{ hosts, type, key: parsed.getPublicSSH(), marker }];
    });
  }

  private matchesHost(hosts: string, endpoint: string): boolean {
    if (hosts.startsWith('|1|')) {
      const [, , salt, hash] = hosts.split('|');
      return (
        !!salt && !!hash && createHmac('sha1', Buffer.from(salt, 'base64')).update(endpoint).digest('base64') === hash
      );
    }
    let matched = false;
    for (const host of hosts.split(',')) {
      const negated = host.startsWith('!');
      const pattern = (negated ? host.slice(1) : host)
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
      if (new RegExp(`^${pattern}$`, 'i').test(endpoint)) {
        if (negated) {
          return false;
        }
        matched = true;
      }
    }
    return matched;
  }

  private async verifyAndSave(endpoint: string, key: Buffer): Promise<boolean> {
    const known = await this.readKnownHosts();
    const matches = known.filter(entry => this.matchesHost(entry.hosts, endpoint));
    if (known.some(entry => entry.marker === '@revoked' && entry.key.equals(key))) {
      throw new Error(`SSH host key revoked for \`${endpoint}\`. Connection refused.`);
    }
    const keys = matches.filter(entry => !entry.marker);
    if (keys.some(entry => entry.key.equals(key))) {
      return true;
    }
    if (keys.length || matches.some(entry => entry.marker === '@cert-authority')) {
      throw new Error(
        `SSH host key changed for \`${endpoint}\`. Connection refused. ` +
          `Verify the server key with its administrator before updating \`${this.getKnownHostsPath()}\`.`,
      );
    }
    if (key.length < 4 || key.readUInt32BE(0) > key.length - 4) {
      throw new Error('Invalid SSH server host key.');
    }
    const type = key.subarray(4, 4 + key.readUInt32BE(0)).toString();
    const parsed = utils.parseKey(`${type} ${key.toString('base64')}`);
    if (parsed instanceof Error) {
      throw parsed;
    }
    const file = this.getKnownHostsPath();
    await mkdir(dirname(file), { recursive: true, mode: 0o700 });
    await appendFile(file, `\n${endpoint} ${parsed.type} ${key.toString('base64')}\n`, { mode: 0o600 });
    return true;
  }
}
