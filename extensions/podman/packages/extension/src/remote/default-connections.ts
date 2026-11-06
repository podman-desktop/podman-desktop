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

import { homedir } from 'node:os';
import { join } from 'node:path';

import { configuration } from '@podman-desktop/api';

import { execPodman } from '/@/utils/util';

const DEFAULT_CONNECTIONS_KEY = 'system.connections.defaults';
const REQUIRED_FIELDS = ['name', 'identity', 'user', 'host', 'socket'] as const;

type DefaultConnection = Record<(typeof REQUIRED_FIELDS)[number], string>;

function isDefaultConnection(value: unknown): value is DefaultConnection {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const connection = value as Record<string, unknown>;
  return (
    REQUIRED_FIELDS.every(field => {
      const entry = connection[field];
      return typeof entry === 'string' && entry.trim().length > 0;
    }) &&
    typeof connection.socket === 'string' &&
    connection.socket.startsWith('/')
  );
}

export async function setupDefaultConnections(): Promise<void> {
  // Read the startup presets. Existing connection names take precedence over these defaults.
  const defaults = configuration.getConfiguration('podman').get<unknown>(DEFAULT_CONNECTIONS_KEY);
  if (defaults === undefined) {
    return;
  }
  if (!Array.isArray(defaults)) {
    console.warn('Invalid podman.system.connections.defaults. Expected an array.');
    return;
  }
  if (defaults.length === 0) {
    return;
  }

  // Preserve all existing names, including local Podman machines.
  let names: Set<string>;
  try {
    const result = await execPodman(['system', 'connection', 'list', '--format', 'json']);
    const connections: { Name: string }[] = JSON.parse(result.stdout);
    names = new Set(connections.map(connection => connection.Name));
  } catch (error: unknown) {
    console.warn('Failed to list Podman connections for defaults:', error);
    return;
  }

  for (const connection of defaults) {
    if (!isDefaultConnection(connection)) {
      console.warn('Invalid default Podman connection. Set name, identity, user, host, and an absolute socket path.');
      continue;
    }
    if (names.has(connection.name)) {
      console.warn(
        `Skipping default Podman connection ${connection.name}: a connection with this name already exists. Existing connections are not modified.`,
      );
      continue;
    }

    try {
      const uri = new URL(`ssh://${connection.host}`);
      uri.username = connection.user;
      uri.pathname = connection.socket;

      // Expand ~/ and ~\ because no shell processes these arguments.
      // Absolute Windows and POSIX paths remain unchanged.
      const identity = connection.identity;
      const resolvedIdentity =
        identity.startsWith('~/') || identity.startsWith('~\\') ? join(homedir(), identity.slice(2)) : identity;
      await execPodman([
        'system',
        'connection',
        'add',
        '--identity',
        resolvedIdentity,
        '--',
        connection.name,
        uri.toString(),
      ]);
      names.add(connection.name);
    } catch (error: unknown) {
      console.warn(`Failed to add default Podman connection ${connection.name}`, error);
    }
  }
}
