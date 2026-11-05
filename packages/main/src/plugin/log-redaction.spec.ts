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
import { expect, test } from 'vitest';

import { redactLogArguments } from './log-redaction.js';

test('redacts nested SSH credentials without changing authentication configuration', () => {
  const config = {
    host: 'localhost',
    port: 22,
    username: 'foo',
    privateKey: Buffer.from('test-key'),
    passphrase: 'test-passphrase',
    password: 'test-password',
  };
  expect(redactLogArguments(['socket error', { connections: [config] }])).toEqual([
    'socket error',
    {
      connections: [
        {
          host: 'localhost',
          port: 22,
          username: 'foo',
          privateKey: '[REDACTED]',
          passphrase: '[REDACTED]',
          password: '[REDACTED]',
        },
      ],
    },
  ]);
  expect(config.privateKey.toString()).toBe('test-key');
  expect(config.passphrase).toBe('test-passphrase');
  expect(config.password).toBe('test-password');
});

test.each(['OPENSSH PRIVATE KEY', 'RSA PRIVATE KEY', 'EC PRIVATE KEY', 'PRIVATE KEY', 'ENCRYPTED PRIVATE KEY'])(
  'redacts %s blocks embedded in strings',
  label => {
    const key = `-----BEGIN ${label}-----\nsynthetic-key-material\n-----END ${label}-----`;
    expect(redactLogArguments([`Failed: ${key}; ${key}`])).toEqual(['Failed: [REDACTED]; [REDACTED]']);
  },
);

test('preserves error diagnostics while redacting credential properties and key blocks', () => {
  const error = new Error('Failed: -----BEGIN PRIVATE KEY-----\nsynthetic-key\n-----END PRIVATE KEY-----');
  Object.assign(error, { privateKey: 'test-key', code: 'ECONNRESET' });
  const [redacted] = redactLogArguments([error]);
  expect(redacted).toBeInstanceOf(Error);
  expect(redacted).toMatchObject({ message: 'Failed: [REDACTED]', privateKey: '[REDACTED]', code: 'ECONNRESET' });
  expect(redacted).toHaveProperty('stack', expect.stringContaining('Failed: [REDACTED]'));
});

test('handles circular arguments and repeated references', () => {
  const config: Record<string, unknown> = { privateKey: 'test-key' };
  config['self'] = config;
  const [first, second] = redactLogArguments([config, config]);
  expect(first).toBe(second);
  expect(first).toHaveProperty('self', first);
  expect(first).toHaveProperty('privateKey', '[REDACTED]');
});

test('does not evaluate secret getters', () => {
  const config = Object.defineProperty({}, 'privateKey', {
    enumerable: true,
    get: () => {
      throw new Error('Must not read credentials');
    },
  });
  expect(redactLogArguments([config])).toEqual([{ privateKey: '[REDACTED]' }]);
});

test('redacts case-insensitive and non-enumerable credential fields', () => {
  const config = Object.defineProperty({ Password: 'test-password' }, 'PrivateKey', { value: 'test-key' });
  const [redacted] = redactLogArguments([config]);
  expect(redacted).toHaveProperty('Password', '[REDACTED]');
  expect(redacted).toHaveProperty('PrivateKey', '[REDACTED]');
});

test('preserves non-secret values and binary arguments', () => {
  const data = Buffer.from('socket data');
  expect(redactLogArguments([undefined, null, 22, true, data, { host: 'localhost' }])).toEqual([
    undefined,
    null,
    22,
    true,
    data,
    { host: 'localhost' },
  ]);
});
