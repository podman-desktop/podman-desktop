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

import { createHash } from 'node:crypto';
import { link, mkdir, mkdtemp, open, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

import { window } from '@podman-desktop/api';
import type { Client, HostVerifier } from 'ssh2';

const pending = new Map<string, { fingerprint: string; result: Promise<boolean> }>();
const TRUST = 'Trust and Save';

export function withHostVerificationTimeout(
  client: Client,
  verifier: HostVerifier,
): { readyTimeout: number; hostVerifier: HostVerifier } {
  let finished = false;
  let ready = false;
  let timeout: NodeJS.Timeout | undefined;
  const clear = (): void => {
    clearTimeout(timeout);
    timeout = undefined;
  };
  const start = (): void => {
    clear();
    timeout = setTimeout(() => {
      client.emit('error', new Error('Timed out while waiting for SSH handshake or authentication.'));
      client.destroy();
    }, 20000);
    timeout.unref();
  };
  const finish = (): void => {
    finished = true;
    clear();
  };
  client
    .once('ready', () => {
      ready = true;
      clear();
    })
    .once('error', finish)
    .once('close', finish)
    .once('end', finish);
  start();
  return {
    // ssh2's built-in timeout cannot be paused while the user verifies a fingerprint.
    readyTimeout: 0,
    hostVerifier: (key, callback): void => {
      clear();
      verifier(key, trusted => {
        if (finished) {
          callback(false);
          return;
        }
        if (trusted && !ready) {
          start();
        }
        callback(trusted);
      });
    },
  };
}

export class SshHostKeyStore {
  constructor(private readonly storagePath: string | undefined) {}

  createVerifier(host: string, port: number, onRejected: (error: Error) => void): HostVerifier {
    return (key, callback): void => {
      this.verify(host, port, key).then(
        trusted => {
          if (!trusted) {
            onRejected(new Error(`SSH host key approval declined for [${host}]:${port}.`));
          }
          callback(trusted);
        },
        (error: unknown) => {
          onRejected(error instanceof Error ? error : new Error(String(error)));
          callback(false);
        },
      );
    };
  }

  async verify(host: string, port: number, key: Buffer): Promise<boolean> {
    if (!this.storagePath) {
      throw new Error('Cannot verify SSH host key: Podman extension storage is unavailable.');
    }
    const endpoint = `[${host.toLowerCase()}]:${port}`;
    const directory = join(this.storagePath, 'ssh-host-keys');
    const file = join(directory, createHash('sha256').update(endpoint).digest('hex'));
    const fingerprint = `SHA256:${createHash('sha256').update(key).digest('base64').replace(/=+$/, '')}`;
    const existing = pending.get(file);
    if (existing) {
      if (existing.fingerprint === fingerprint) {
        return existing.result;
      }
      await Promise.allSettled([existing.result]);
      return this.verify(host, port, key);
    }
    const result = this.verifyAndSave(endpoint, directory, file, fingerprint);
    pending.set(file, { fingerprint, result });
    try {
      return await result;
    } finally {
      pending.delete(file);
    }
  }

  private async verifyAndSave(
    endpoint: string,
    directory: string,
    file: string,
    fingerprint: string,
  ): Promise<boolean> {
    let saved: string | undefined;
    try {
      saved = await readFile(file, 'utf8');
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
        throw error;
      }
    }
    if (saved !== undefined) {
      this.assertFingerprint(endpoint, file, saved, fingerprint);
      return true;
    }
    const approval = await window.showWarningMessage(
      `The SSH server ${endpoint} is not yet trusted by Podman Desktop. Host key fingerprint: ${fingerprint}. ` +
        'Verify this fingerprint with the server administrator through a trusted channel before approving.',
      'Cancel',
      TRUST,
    );
    if (approval !== TRUST) {
      return false;
    }
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const temporaryDirectory = await mkdtemp(join(directory, '.pending-'));
    const temporaryFile = join(temporaryDirectory, 'pin');
    try {
      const handle = await open(temporaryFile, 'wx', 0o600);
      try {
        await handle.writeFile(fingerprint);
        await handle.sync();
      } finally {
        await handle.close();
      }
      // Publish a complete pin atomically, without replacing an existing one.
      try {
        await link(temporaryFile, file);
      } catch (error) {
        if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) {
          throw error;
        }
        this.assertFingerprint(endpoint, file, await readFile(file, 'utf8'), fingerprint);
      }
    } finally {
      await rm(temporaryDirectory, { recursive: true, force: true });
    }
    return true;
  }

  private assertFingerprint(endpoint: string, file: string, saved: string, fingerprint: string): void {
    if (saved !== fingerprint) {
      throw new Error(
        `SSH host key changed for ${endpoint}. Connection refused. Expected ${saved}, received ${fingerprint}. ` +
          `Verify the server key with its administrator before removing the saved pin at ${file}.`,
      );
    }
  }
}
