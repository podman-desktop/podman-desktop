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
import { format, inspect } from 'node:util';

import { expect, test, vi } from 'vitest';

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
  expect(redacted).toHaveProperty('name', 'Error');
  expect(redacted).toMatchObject({ message: 'Failed: [REDACTED]', privateKey: '[REDACTED]', code: 'ECONNRESET' });
  expect(redacted).toHaveProperty('stack', expect.stringContaining('Failed: [REDACTED]'));
});

test('preserves redacted error diagnostics through structured cloning', () => {
  const error = Object.assign(new TypeError('connection failed'), { privateKey: 'test-key', code: 'ECONNRESET' });
  const [redacted] = redactLogArguments([error]);
  const cloned: unknown = structuredClone(redacted);
  expect(cloned).toMatchObject({
    name: 'TypeError',
    message: 'connection failed',
    stack: expect.stringContaining('TypeError: connection failed'),
    privateKey: '[REDACTED]',
    code: 'ECONNRESET',
  });
});

test('formats multiline error stacks without inheriting untrusted inspection hooks', () => {
  const inspectHook = vi.fn(() => 'test-key');
  class DiagnosticError extends Error {}
  Object.defineProperty(DiagnosticError.prototype, inspect.custom, { value: inspectHook });
  const error = Object.assign(new DiagnosticError('connection failed'), { privateKey: 'test-key' });
  error.stack = 'Error: connection failed\n    at connect (tunnel.ts:1:1)';
  const [redacted] = redactLogArguments([error]);

  const output = format(redacted);
  expect(output).toContain('Error: connection failed\n    at connect (tunnel.ts:1:1)');
  expect(output).not.toContain('\\n');
  expect(output).not.toContain('test-key');
  expect(inspectHook).not.toHaveBeenCalled();
  expect(structuredClone(redacted)).toMatchObject({
    name: 'Error',
    message: 'connection failed',
    stack: error.stack,
    privateKey: '[REDACTED]',
  });
});

test('redacts credential objects stored under symbol keys', () => {
  const key = Symbol('connection');
  const config = { [key]: { privateKey: 'test-key', password: 'test-password' } };
  const [redacted] = redactLogArguments([config]);
  expect(redacted).toEqual({ [key]: { privateKey: '[REDACTED]', password: '[REDACTED]' } });
  expect(format('%o', redacted)).not.toContain('test-key');
});

test('replaces accessors without invoking them during JSON formatting', () => {
  const getter = vi.fn(() => ({ privateKey: 'test-key' }));
  const config = Object.defineProperty({}, 'connection', { enumerable: true, get: getter });
  const [redacted] = redactLogArguments([config]);
  expect(format('%j', redacted)).toBe('{"connection":"[REDACTED]"}');
  expect(getter).not.toHaveBeenCalled();
});

test('fails closed when a proxy cannot be inspected', () => {
  const { proxy, revoke } = Proxy.revocable({}, {});
  revoke();
  expect(redactLogArguments(['test-key', proxy])).toEqual(['[Log arguments could not be redacted]']);
});

test('fails closed when reading error diagnostics throws', () => {
  const error = Object.defineProperty(new Error('failure'), 'stack', {
    get: () => {
      throw new Error('test-key');
    },
  });
  expect(redactLogArguments([error])).toEqual(['[Log arguments could not be redacted]']);
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
