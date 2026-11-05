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

const REDACTED = '[REDACTED]';
const SSH_SECRET_FIELD = /^(privateKey|passphrase|password)$/i;
const PRIVATE_KEY_BLOCK = /-----BEGIN ([A-Z ]*PRIVATE KEY)-----[\s\S]*?-----END \1-----/g;

/** Copies log data without credentials or getters, failing closed if inspection throws. */
export function redactLogArguments(args: unknown[]): unknown[] {
  const seen = new WeakMap<object, object>();

  /** Recursively snapshots supported log values without modifying the originals. */
  function redact(value: unknown): unknown {
    if (typeof value === 'string') {
      return value.replace(PRIVATE_KEY_BLOCK, REDACTED);
    }
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    const prototype: object | null = Object.getPrototypeOf(value);
    if (!Array.isArray(value) && prototype !== Object.prototype && prototype !== null && !(value instanceof Error)) {
      return value;
    }

    const existing = seen.get(value);
    if (existing) {
      return existing;
    }

    // Use a trusted prototype for readable stacks without inheriting custom inspection hooks.
    const result: object = Array.isArray(value)
      ? []
      : Object.create(value instanceof Error ? Error.prototype : prototype);
    seen.set(value, result);
    for (const key of Reflect.ownKeys(value)) {
      if (value instanceof Error && (key === 'name' || key === 'message' || key === 'stack')) {
        continue;
      }
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor) {
        continue;
      }
      if ((typeof key === 'string' && SSH_SECRET_FIELD.test(key)) || !('value' in descriptor)) {
        Object.defineProperty(result, key, {
          value: REDACTED,
          enumerable: descriptor.enumerable,
          configurable: true,
        });
      } else {
        descriptor.value = redact(descriptor.value);
        Object.defineProperty(result, key, descriptor);
      }
    }
    if (value instanceof Error) {
      // Enumerable diagnostics survive the structured clone used by renderer IPC.
      for (const key of ['name', 'message', 'stack'] as const) {
        Object.defineProperty(result, key, {
          value: redact(value[key]),
          enumerable: true,
          configurable: true,
        });
      }
    }
    return result;
  }

  try {
    return args.map(redact);
  } catch {
    // Never log the original arguments or inspection error: either can contain credentials.
    return ['[Log arguments could not be redacted]'];
  }
}
