/**********************************************************************
 * Copyright (C) 2025 Red Hat, Inc.
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

import { beforeEach, describe, expect, test } from 'vitest';

import {
  CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE,
  CONFIGURATION_SYSTEM_MANAGED_LOCKED_SCOPE,
} from '/@api/configuration/constants.js';

import { LockConfiguration } from './lock-configuration.js';

describe('Simple tests convering .get for LockConfiguration', () => {
  let configurationValues: Map<string, { [key: string]: unknown }>;
  let lockConfiguration: LockConfiguration;

  beforeEach(() => {
    configurationValues = new Map();
    lockConfiguration = new LockConfiguration(configurationValues);
  });

  test('should return undefined when no locked configuration exists', () => {
    const result = lockConfiguration.get('some.key');
    expect(result).toBeUndefined();
  });

  test('should return undefined when locked configuration has no "locked" property', () => {
    configurationValues.set(CONFIGURATION_SYSTEM_MANAGED_LOCKED_SCOPE, {});
    const result = lockConfiguration.get('some.key');
    expect(result).toBeUndefined();
  });

  test('should return undefined when key is not in locked list', () => {
    configurationValues.set(CONFIGURATION_SYSTEM_MANAGED_LOCKED_SCOPE, {
      locked: ['other.key', 'another.key'],
    });
    const result = lockConfiguration.get('some.key');
    expect(result).toBeUndefined();
  });

  test('should return managed default value when key is locked', () => {
    configurationValues.set(CONFIGURATION_SYSTEM_MANAGED_LOCKED_SCOPE, {
      locked: ['some.key'],
    });
    configurationValues.set(CONFIGURATION_SYSTEM_MANAGED_DEFAULTS_SCOPE, {
      'some.key': 'managed-value',
    });
    const result = lockConfiguration.get('some.key');
    expect(result).toBe('managed-value');
  });
});
