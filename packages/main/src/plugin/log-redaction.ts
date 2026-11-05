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

export function redactLogArguments(args: unknown[]): unknown[] {
  const seen = new WeakMap<object, object>();

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

    const result: object = Array.isArray(value) ? [] : Object.create(prototype);
    seen.set(value, result);
    // Preserve Error messages/stacks and avoid invoking getters while copying logs.
    const descriptors = Object.getOwnPropertyDescriptors(value);
    if (value instanceof Error) {
      // V8's lazy stack accessor requires the original Error's internal slots.
      descriptors['stack'] = { value: redact(value.stack), configurable: true, writable: true };
    }
    for (const [key, descriptor] of Object.entries(descriptors)) {
      if (SSH_SECRET_FIELD.test(key)) {
        descriptors[key] = { value: REDACTED, enumerable: descriptor.enumerable, configurable: true };
      } else if ('value' in descriptor) {
        descriptor.value = redact(descriptor.value);
      }
    }
    Object.defineProperties(result, descriptors);
    return result;
  }

  return args.map(redact);
}
